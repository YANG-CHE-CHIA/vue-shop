<script setup>
import { ref } from 'vue'
import { getShipInfo } from '@/api/order.js'
import { toast } from '@/composables/util.js'

const dialogVisible = ref(false)
const info = ref({})

const open = async (id) => {
    try {
        const res = await getShipInfo(id)
        if (res.status !== 0) {
            return toast(res.msg, 'error')
        }
        info.value = res.result
        console.log(res.result)
        dialogVisible.value = true
    }
    catch (error) {
        console.error('失敗：', error)
    }
}

defineExpose({
    open
})
</script>

<template>
    <el-drawer title="物流訊息" v-model="dialogVisible" size="40%">
        <div class="card_item">
            <el-card shadow="never">
                <div class="flex items-center">
                    <el-image :src="info.logo" fit="fill" :lazy="true" style="width: 60px; height: 60px;"
                        class="rounded border"></el-image>
                    <div class="pl-3">
                        <p>物流公司:{{ info.typename }}</p>
                        <p>物流單號:{{ info.number }}</p>
                    </div>
                </div>
            </el-card>
        </div>

        <div class="card_item">
            <el-card shadow="never">
                <el-timeline>
                    <el-timeline-item :timestamp="item.time" placement="top" v-for="(item, index) of info.list" :key="index" >
                        {{ item.status }}
                    </el-timeline-item>
                </el-timeline>
            </el-card>
        </div>
    </el-drawer>
</template>

<style scoped>
.card_item {
    margin-bottom: 10px;
}
</style>>