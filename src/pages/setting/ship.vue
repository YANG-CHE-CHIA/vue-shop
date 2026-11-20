<script setup>
import { ref, reactive } from 'vue'
import { getSysconfig, setSysconfig } from '@/api/sysconfig.js'
import { toast } from '@/composables/util.js'

const form = reactive({
    "ship": "..."
})

const loading = ref(false)

async function getData() {
    loading.value = true
    try {
        const res = await getSysconfig()
        for (const k in form) {
            form[k] = res[k]
        }
    }
    catch (error) {
        console.error('失敗：', error)
    }
    finally {
        loading.value = false
    }
}

getData()

const submit = async () => {
    loading.value = true
    try {

        await setSysconfig({
            ...form,
        })

        toast('修改成功', 'success')
        getData()
    }
    catch (error) {
        console.error('失敗：', error)
    }
    finally {
        loading.value = false
    }
}

</script>

<template>
    <div class="info  bg-gray-100  p-4 rounded" v-loading="loading">
        <el-form :model="form" label-width="160px">
            <el-tabs v-model="activeName">
                <el-form-item label="物流查詢Key">
                    <div>
                        <el-input v-model="form.ship" placeholder="物流查詢Key"></el-input>
                        <small class=" text-gray-500 flex pl-1">用於查詢物流訊息,接口申請(僅供參考)</small>
                    </div>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="default" @click="submit">保存</el-button>
                </el-form-item>
            </el-tabs>
        </el-form>
    </div>
</template>

<style scoped>
.info {
    padding-top: 20px;
    margin-top: 40px;
}
</style>