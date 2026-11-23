<script setup>
import { ref, computed } from 'vue'
import { getAgentList, getAgentOrderList } from '@/api/distribution.js'
import { useInitTable } from '@/composables/useCommon.js'
const props = defineProps({
    type: {
        type: String,
        default: 'user'
    }
})

const { searchForm, tableData, loading, currentPage, total, limit, getData }
    = useInitTable({
        searchForm: {
            type: null,
            starttime: null,
            endtime: null,
            level: 0,
            user_id: 0
        },
        getList: (() => {
            return props.type === 'user' ? getAgentList : getAgentOrderList
        })(),
        onGetListSuccess: (res) => {
            tableData.value = res.list
            total.value = res.totalCount
        }
    })

const dialogVisibel = ref(false)

const open = (id) => {
    dialogVisibel.value = true
    searchForm.user_id = id
    getData()
}

const resetSearchFrom = ()=>{
    searchForm.type = 'all'
    searchForm.starttime = null
    searchForm.endtime = null
    searchForm.level = 0
}

const drawerTitle = computed(() => props.type === 'user' ? '推廣人列表' : '推廣人訂單列表')

defineExpose({
    open
})
</script>

<template>
    <div class="info">
        <el-drawer :title="drawerTitle" v-model="dialogVisibel" direction="rtl" size="70%">
            <!-- 搜尋 -->
            <el-form :model="searchForm" size="small">
                <el-form-item label="時間選擇">
                    <el-radio-group v-model="searchForm.type">
                        <el-radio-button value="all">全部</el-radio-button>
                        <el-radio-button value="today">今天</el-radio-button>
                        <el-radio-button value="yesterday">昨天</el-radio-button>
                        <el-radio-button value="last7days">最近7天</el-radio-button>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="開始時間">
                    <el-date-picker v-model="searchForm.starttime" type="date" placeholder="開始時間" style="width: 90%;"
                        value-format="YYYY-MM-DD">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="結束時間">
                    <el-date-picker v-model="searchForm.endtime" type="date" placeholder="結束時間" style="width: 90%;"
                        value-format="YYYY-MM-DD">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="用戶類型">
                    <el-radio-group v-model="searchForm.level">
                        <el-radio-button value="0">全部</el-radio-button>
                        <el-radio-button value="1">一級推廣</el-radio-button>
                        <el-radio-button value="2">二級推廣</el-radio-button>
                    </el-radio-group>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="getData">搜尋</el-button>
                    <el-button @click="resetSearchFrom">重置</el-button>
                </el-form-item>
            </el-form>

            <!-- 資料 -->
            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
                <template v-if="type === 'user'">
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
                    <el-table-column label="用戶訊息" prop="username" />
                    <el-table-column label="推廣數" prop="share_num" align="center" />
                    <el-table-column label="推廣訂單數" prop="share_order_num" align="center" />
                    <el-table-column label="綁定時間" prop="create_time" align="center" />
                </template>
                <template v-else>
                    <el-table-column label="訂單號碼">
                        <template #default="{ row }">
                            {{ row.order.no }}
                        </template>
                    </el-table-column>
                    <el-table-column label="用戶名|暱稱|手機">
                        <template #default="{ row }">
                            <div v-if="!row.order.user">
                                該用戶已被刪除
                            </div>
                            <div v-else>
                                {{ row.order.user.username }} | {{ row.order.user.nickname }} | {{ row.order.user.phone }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="時間" prop="create_time" />
                    <el-table-column label="返還金額" prop="commission" />
                </template>
            </el-table>

            <!-- 頁碼 -->
            <div class="bottom">
                <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
                    :page-size="limit" @current-change="getData" />
            </div>
        </el-drawer>
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