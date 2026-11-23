<script setup>
import panel from './panel.vue'
import dataDrawer from './dataDrawer.vue'
import { ref } from 'vue'
import { getAgentList } from '@/api/distribution.js'
import Search from '@/components/Search.vue'
import SearchItem from '@/components/SearchItem.vue'
import { useInitTable } from '@/composables/useCommon.js'

const { searchForm, resetSearchFrom, tableData, loading, currentPage, total, limit, getData }
    = useInitTable({
        searchForm: {
            keyword: '',
            type: null,
            starttime: null,
            endtime: null
        },
        getList: getAgentList,
        onGetListSuccess: (res) => {
            tableData.value = res.list
            total.value = res.totalCount
        }
    })

const dataDrawerRef = ref(null)    
const orderDataDrawerRef = ref(null)  

const openDataDrawer = (id,type) =>{
    (type == 'user' ? dataDrawerRef : orderDataDrawerRef).value.open(id)
}

</script>

<template>
    <div class="info">
        <panel />

        <el-card shadow="never" class="info">
            <!-- 搜尋 -->
            <Search :model="searchForm" @search="getData" @reset="resetSearchFrom">
                <SearchItem label="時間選擇">
                    <el-radio-group v-model="searchForm.type">
                        <el-radio-button value="all">全部</el-radio-button>
                        <el-radio-button value="today">今天</el-radio-button>
                        <el-radio-button value="yesterday">昨天</el-radio-button>
                        <el-radio-button value="last7days">最近7天</el-radio-button>
                    </el-radio-group>

                </SearchItem>
                <template #show>
                    <SearchItem label="開始時間">
                        <el-date-picker v-model="searchForm.starttime" type="date" placeholder="開始時間"
                            style="width: 90%;" value-format="YYYY-MM-DD">
                        </el-date-picker>
                    </SearchItem>
                    <SearchItem label="結束時間">
                        <el-date-picker v-model="searchForm.endtime" type="date" placeholder="結束時間" style="width: 90%;"
                            value-format="YYYY-MM-DD">
                        </el-date-picker>
                    </SearchItem>
                    <SearchItem label="關鍵字">
                        <el-input v-model="searchForm.keyword" placeholder="關鍵字" clearable></el-input>
                    </SearchItem>
                </template>
            </Search>

            <!-- 資料 -->
            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
                <el-table-column label="ID" prop="id" align="center" />
                <el-table-column label="頭像" width="65">
                    <template #default="{ row }">
                        <div class="info-flex">
                            <el-avatar :size="40" :src="row.avatar">
                                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                            </el-avatar>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="用戶訊息" width="200">
                    <template #default="{ row }">
                        <div class="text-xs ">
                            <p>用戶:{{ row.username }}</p>
                            <p>暱稱:{{ row.nickname }}</p>
                            <p>姓名:{{ row.user_info?.name ?? '無' }}</p>
                            <p>電話:{{ row.phone }}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="推廣用戶數量" prop="share_num" align="center" />
                <el-table-column label="訂單數量" prop="share_order_num" align="center" />
                <el-table-column label="訂單金額" prop="order_price" align="center" />
                <el-table-column label="帳戶佣金" prop="commission" align="center" />
                <el-table-column label="已提領金額" prop="cash_out_price" align="center" />
                <el-table-column label="提現次數" prop="cash_out_time" align="center" />
                <el-table-column label="未提現金額" prop="no_cash_out_price" align="center" />
                <el-table-column fixed="right" label="操作" width="180" align="center">
                    <template #default="row">
                        <el-button text type="primary" size="small" @click="openDataDrawer(row.id,'user')">推廣人</el-button>
                        <el-button text type="primary" size="small" @click="openDataDrawer(row.id,'order')">推廣訂單</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 頁碼 -->
            <div class="bottom">
                <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
                    :page-size="limit" @current-change="getData" />
            </div>

        </el-card>

        <dataDrawer ref="dataDrawerRef" />
        <dataDrawer ref="orderDataDrawerRef" type="order" />
    </div>
</template>

<style scoped>
.info {
    padding-top: 40px;
    border: none;
}

.info .bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}
</style>