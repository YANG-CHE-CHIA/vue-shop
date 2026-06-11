<script setup>
import { ref } from 'vue'
import { getStatistics1, getStatistics2 } from '@/api/index'
import CountTo from '@/components/CountTo.vue'
import IndexNavs from '@/components/IndexNavs.vue'
import IndexChart from '@/components/IndexChart.vue'
import IndexCard from '@/components/IndexCard.vue'


const panels = ref([])
const goods = ref([])
const order = ref([])

const initData = async () => {
    try {
        const [res1, res2] = await Promise.all([
            getStatistics1(),
            getStatistics2()
        ]);
        panels.value = res1.panels
        goods.value = res2.goods
        order.value = res2.order

    } catch (error) {
        console.error(error);
    }
}

initData();

</script>

<template>
    <div>
        <el-row :gutter="20" class="index_info" v-permission="['getStatistics1,GET']">
            <template v-if="panels.length == 0">
                <el-col :span="6" v-for="i of 4" :key="i">
                    <el-skeleton style="width: 100%" animated loading>
                        <template #template>
                            <el-card shadow="hover" class="card">
                                <template #header>
                                    <div class="d-flex">
                                        <el-skeleton-item variant="text" style="width: 50%" />
                                        <el-skeleton-item variant="text" style="width: 10%" />
                                    </div>
                                </template>
                                <el-skeleton-item variant="h3" style="width: 80%" />
                                <el-divider />
                                <div class="d-flex">
                                    <el-skeleton-item variant="text" style="width: 50%" />
                                    <el-skeleton-item variant="text" style="width: 10%" />
                                </div>
                            </el-card>

                        </template>
                    </el-skeleton>
                </el-col>
            </template>

            <el-col :span="6" :offset="0" v-for="(item, index) of panels" :key="index">
                <el-card shadow="hover" class="card">
                    <template #header>
                        <div class="d-flex">
                            <span>{{ item.title }}</span>
                            <el-tag :type="item.unitColor || 'info'" effect="plain">
                                {{ item.unit }}
                            </el-tag>
                        </div>
                    </template>
                    <span class="text-value">
                        <CountTo :value="item.value" />
                    </span>
                    <el-divider />
                    <div class="d-flex">
                        <span>{{ item.subTitle }}</span>
                        <span>{{ item.subValue }}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>


        <IndexNavs />

        <el-row :gutter="20">
            <el-col :span="12" :offset="0">
                <IndexChart v-permission="['getStatistics3,GET']"/>
            </el-col>
            <el-col :span="12" :offset="0" v-permission="['getStatistics2,GET']">
                <IndexCard class="card_item" title="商店及商品提示" tip="商店及商品提示" :btns="goods" />
                <IndexCard title="交易提示" tip="需要立即處理的交易訂單" :btns="order" />
            </el-col>
        </el-row>
    </div>

</template>

<style scoped>
.index_info {
    padding-top: 40px;
}

.d-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.text-value {
    font-size: 30px;
    font-weight: bold;
}

.card_item {
    margin-bottom: 20px;
}
</style>
