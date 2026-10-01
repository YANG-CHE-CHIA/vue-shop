<script setup>
import { ref, reactive } from 'vue'
import { exportOrder } from '@/api/order.js'
import { toast } from '@/composables/util.js'

const dialogVisible = ref(false)

const open = () => dialogVisible.value = true
const close = () => dialogVisible.value = false

const form = reactive({
    tab: null,
    time: ''
})

const loading = ref(false)

const onSubmit = async () => {
    if (!form.tab) return toast('訂單類型不可以為空', 'error')
    loading.value = true
    let starttime = null
    let endtime = null

    if (form.time && Array.isArray(form.time)) {
        starttime = form.time[0]
        endtime = form.time[1]
    }

    try {
        const res = await exportOrder({
            tab:form.tab,
            starttime,
            endtime
        })
        let url = window.URL.createObjectURL(new Blob([ res ]))
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url
        let filename = new Date().getTime() + '.xlsx'
        link.setAttribute('download',filename)
        document.body.appendChild(link)
        link.click()
        close()
    }
    catch (error) {
        console.error('失敗：', error)
    }
    finally {
        loading.value = false
    }
}

defineProps({
    tabs: Array
})

defineExpose({
    open
})
</script>


<template>
    <el-drawer title="匯出訂單" v-model="dialogVisible" size="40%">
        <el-form :model="form" label-width="80px">
            <el-form-item label="訂單類型">
                <el-select v-model="form.tab" placeholder="請選擇">
                    <el-option v-for="item in tabs" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>

            </el-form-item>
            <el-form-item label="時間區間">
                <el-date-picker v-model="form.time" type="daterange" range-separator="至" start-placeholder="開始日期"
                    end-placeholder="結束日期" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="loading">匯出</el-button>
            </el-form-item>
        </el-form>

    </el-drawer>
</template>