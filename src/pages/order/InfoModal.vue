<script setup>
import { ref, computed } from 'vue'
import { useDateFormat } from '@vueuse/core'
import ShipInfoModal from './ShipInfoModal.vue'

const props = defineProps({
    info: Object
})

const ship_time = computed(()=>{
    if(props.info.ship_data.express_time){
        const s = useDateFormat(props.info.ship_data.express_time * 1000, 'YYYY-MM-DD HH:mm:ss')
        return s
    }
    return ''
})

const refund_status = computed(()=>{
    const opt = {
        pending:'未退款',
        applied:'已申請,等待審核',
        processing:'退款中',
        success:'退款成功',
        failed:'退款失敗'
    }
    
    return props.info.refund_status ? opt[props.info.refund_status] : ''
})

const dialogVisible = ref(false)

const open = () => {
    dialogVisible.value = true
}

const ShipInfoModalRef = ref(null)
const loading = ref(false)
const openShipInfoModal = (id) =>{
    loading.value = true
    ShipInfoModalRef.value.open(id).finally(()=>loading.value = false)
}

defineExpose({
    open
})
</script>

<template>
    <el-drawer title="訂單詳情" v-model="dialogVisible" size="50%">
        <!-- 訂單詳情 -->
        <div class="card_item">
            <el-card shadow="never">
                <template #header>
                    <b class="text-sm">訂單詳情</b>
                </template>
                <el-form label-width="80px">
                    <el-form-item label="訂單編號">
                        {{ info.no }}
                    </el-form-item>
                    <el-form-item label="付款方式">
                        {{ info.payment_method }}
                    </el-form-item>
                    <el-form-item label="付款時間">
                        {{ info.paid_time }}
                    </el-form-item>
                    <el-form-item label="創建時間">
                        {{ info.create_time }}
                    </el-form-item>
                </el-form>
            </el-card>
        </div>

        <!-- 發貨訊息 -->
        <div class="card_item" v-if="info.ship_data">
            <el-card shadow="never">
                <template #header>
                    <b class="text-sm">發貨訊息</b>
                </template>
                <el-form label-width="80px">
                    <el-form-item label="物流公司">
                        {{ info.ship_data.express_company }}
                    </el-form-item>
                    <el-form-item label="託運單號">
                        {{ info.ship_data.express_no }}
                        <el-button type="primary" text size="small" @click="openShipInfoModal(info.id)" class="pl-3" :loading="loading">查看物流</el-button>
                    </el-form-item>
                    <el-form-item label="發貨時間">
                        {{ ship_time }}
                    </el-form-item>
                </el-form>
            </el-card>
        </div>

        <!-- 商品訊息 -->
        <div class="card_item">
            <el-card shadow="never">
                <template #header>
                    <b class="text-sm">商品訊息</b>
                </template>
                <div class="flex mb-2" v-for="(item, index) of info.order_items" :key="index">
                    <el-image :src="item.goods_item?.cover ?? ''" fit="fill" :lazy="true"
                        style="width: 60px; height: 60px;"></el-image>
                    <div class="text-sm pl-2">
                        <p class="pb-1">{{ item.goods_item?.title ?? '商品已被刪除' }}</p>
                        <p v-if="item.sku">
                            <el-tag type="info" size="small"></el-tag>
                            {{ item.sku }}
                        </p>
                        <p>
                            <b class=" text-rose-500">{{ item.price }}</b>
                            <span class="text-xs text-gray-500">x{{ item.num }}</span>
                        </p>
                    </div>
                </div>
                <el-form label-width="80px">
                    <el-form-item label="成交價格">
                        <span class=" text-rose-500 font-bold">{{ info.total_price }}</span>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>

        <!-- 收貨訊息 -->
        <div class="card_item">
            <el-card shadow="never" v-if="info.address">
                <template #header>
                    <b class="text-sm">收貨訊息</b>
                </template>
                <el-form label-width="80px">
                    <el-form-item label="收貨人">
                        {{ info.address.name }}
                    </el-form-item>
                    <el-form-item label="聯繫方式">
                        {{ info.address.phone }}
                    </el-form-item>
                    <el-form-item label="收件地址">
                        {{ info.address.province + info.address.city + info.address.district + info.address.address }}
                    </el-form-item>
                </el-form>
            </el-card>
        </div>

        <!-- 退款訊息 -->
        <div class="card_item" v-if="info.refund_status != 'pending'">
            <el-card shadow="never" v-if="info.address">
                <template #header>
                    <b class="text-sm">退款訊息</b>
                    <el-button text disabled style="float: right;">{{ refund_status  }}</el-button>
                </template>
                <el-form label-width="80px">
                    <el-form-item label="退款理由">
                        {{ info.extra.refund_reason }}
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </el-drawer>

    <ShipInfoModal ref="ShipInfoModalRef" />
</template>

<style scoped>
.card_item {
    margin-bottom: 10px;
}
</style>>