<script setup>
import * as echarts from 'echarts';
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getStatistics3 } from '@/api/index'
import { useResizeObserver } from '@vueuse/core'


const el = ref(null)
let myChart = null

onMounted(() => {
    var chartDom = document.getElementById('chart');
    if(chartDom){
        myChart = echarts.init(chartDom);
        GetDataHandler()
    }
})

onBeforeUnmount(()=>{
    if(myChart) echarts.dispose(myChart)
})


const options =
    [
        {
            text: "近一個月",
            value: "month"
        },
        {
            text: "近一週",
            value: "week"
        },
        {
            text: "近24小時",
            value: "hour"
        }
    ]

const current = ref("week")

const ChooseHandler = (type) => {
    current.value = type

    GetDataHandler()
}

const initData = async () => {
    try {
        const res = await getStatistics3(current.value);
        return res
    } catch (error) {
        console.error(error);
        return null;
    }
}


const GetDataHandler = async () => {
    let option = {
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value' },
        series: [{ data: [], type: 'bar' }]
    };

    myChart.showLoading()
    try {
        const res = await initData();

        if (res) {
            option.xAxis.data = res.x;
            option.series[0].data = res.y;
            myChart.setOption(option);
        }
    } catch (error) {
        console.error('處理圖表資料時發生錯誤:', error);
    } finally {
        myChart.hideLoading();
    }
}

useResizeObserver(el, (entries) => {
    if(myChart) myChart.resize()
})

</script>

<template>
    <el-card shadow="never">
        <template #header>
            <div class="d-flex">
                <span>訂單統計</span>
                <div>
                    <el-check-tag class="text" :checked="current == item.value" v-for="(item, index) of options" :key="index"
                        @click="ChooseHandler(item.value)">
                        {{ item.text }}
                    </el-check-tag>
                </div>
            </div>
        </template>

        <div ref="el" id="chart" class="chart"></div>
    </el-card>

</template>

<style scoped>
.d-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.chart {
    width: 100%;
    height: 300px;
}

.text{
    margin: 0 10px;
}
</style>