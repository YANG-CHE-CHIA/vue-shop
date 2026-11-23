<script setup>
import { ref, reactive } from 'vue'
import { getAgentStatistics } from '@/api/distribution.js'

const loading = ref(false)
const list = ref([])

const colorMap = {
    'bg-blue-400': 'bg-blue-400',
    'bg-orange-400': 'bg-orange-400',
    'bg-green-400': 'bg-green-400',
    'bg-indigo-400': 'bg-indigo-400',
}

const getData = async () => {
    loading.value = true
    try {
        const res = await getAgentStatistics()
        list.value = res.panels ?? []
        console.log(res)
    }
    catch (error) {
        console.error('失敗：', error)
    }
    finally {
        loading.value = false
    }
}

getData()
</script>

<template>
    <el-row :gutter="20" class="pb-5">
        <template v-if="loading">
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
                        </el-card>
                    </template>
                </el-skeleton>
            </el-col>
        </template>
        <el-col v-else :span="6" :offset="0" v-for="(item, index) of list" :key="index">
            <el-card shadow="never">
                <div class="flex items-center">
                    <el-icon :size="20" :class="colorMap[item.color] || 'bg-slate-400'" class="rounded-full"
                        style="width: 40px; height: 40px;">
                        <User v-if="index == 0" />
                        <ShoppingCart v-if="index == 1" />
                        <PriceTag v-if="index == 2" />
                        <Timer v-if="index == 3" />
                    </el-icon>
                    <div class="pl-2">
                        <h2 class="text-lg font-bold">{{ item.value }}</h2>
                        <small class="text-xs text-gray-400">{{ item.label }}</small>
                    </div>
                </div>
            </el-card>

        </el-col>
    </el-row>

</template>

<style scoped>
.info {
    padding-top: 40px;
    border: none;
}
</style>