<script setup>
import { ref } from 'vue'
import { getOrderList, deleteOrder, refundOrder } from '@/api/order.js'
import { useInitTable } from '@/composables/useCommon.js'
import Search from '@/components/Search.vue'
import SearchItem from '@/components/SearchItem.vue'
import ListHeader from '@/components/ListHeader.vue'
import ExportExcel from './ExportExcel.vue'
import InfoModal from './InfoModal.vue'
import { showModal, showPrompt, toast } from '@/composables/util.js'
const { searchForm, resetSearchFrom, tableData, loading, currentPage, total, limit, getData, DeleteHanlder,
    SelectionChangeHandler, multipleTableRef, MultiDeleteHandler, multiSelectionsIds }
    = useInitTable({
        searchForm: {
            no: '',
            tab: 'all',
            name: '',
            phone: ''
        },
        getList: getOrderList,
        onGetListSuccess: (res) => {
            tableData.value = res.list.map(o => {
                o.bannersLoading = false
                o.contentLoading = false
                o.skusLoading = false
                return o
            })
            total.value = res.totalCount
        },
        delete: deleteOrder
    })

//tab選單
const tabbars = [
    {
        key: "all",
        name: "全部"
    },
    {
        key: "nopay",
        name: "待付款"
    },
    {
        key: "noship",
        name: "待發貨"
    },
    {
        key: "shiped",
        name: "待收貨"
    },
    {
        key: "received",
        name: "已收貨"
    },
    {
        key: "finish",
        name: "已關閉"
    },
    {
        key: "closed",
        name: "已完成"
    },
    {
        key: "refunding",
        name: "退款中"
    }
]

const ExportExcelRef = ref(null)

const ExportExcelHandler = () => {
    ExportExcelRef.value.open()
}

const InfoModalRef = ref(null)
const info = ref(null)

const openInfoModal = (row) => {
    row.order_items = row.order_items.map(o => {
        if (o.skus_type == 1 && o.goods_skus) {
            let s = []
            for (const k in o.goods_skus.skus) {
                s.push(o.goods_skus_skus[k].value)
            }
            o.sku = s.join(',')
        }
        return o
    })
    info.value = row
    InfoModalRef.value.open()
}

//退款處理
const RefundHandler = async (id, agree) => {
    try {
        const { value } = await (agree 
            ? showModal('是否同意該訂單退款?') 
            : showPrompt('請輸入拒絕的理由'))
        let data = { agree }
        if(!agree){
            data.disagree_reason = value
        }
        await refundOrder(id,data)
        getData()
        toast('操作成功','success')
    }
    catch (error) {
        console.error('失敗：', error)
    }
}

</script>

<template>
    <div class="info">
        <el-tabs v-model="searchForm.tab" @tab-change="getData">
            <el-tab-pane :label="item.name" :name="item.key" v-for="(item, index) of tabbars" :key=index></el-tab-pane>
        </el-tabs>
        <el-card shadow="never">
            <!-- 搜尋 -->
            <Search :model="searchForm" @search="getData" @reset="resetSearchFrom">
                <SearchItem label="訂單編號">
                    <el-input v-model="searchForm.no" placeholder="訂單編號" clearable></el-input>
                </SearchItem>

                <template #show>
                    <SearchItem label="收貨人">
                        <el-input v-model="searchForm.name" placeholder="收貨人" clearable></el-input>
                    </SearchItem>
                    <SearchItem label="手機號碼">
                        <el-input v-model="searchForm.phone" placeholder="手機號碼" clearable></el-input>
                    </SearchItem>
                </template>
            </Search>

            <!-- 新增和刷新 -->
            <ListHeader layout="refresh,download" @refresh="getData" @download="ExportExcelHandler">
                <el-button type="danger" size="small" @click="MultiDeleteHandler">批量刪除</el-button>
            </ListHeader>

            <!-- 資料 -->
            <el-table ref="multipleTableRef" @selection-change="SelectionChangeHandler" :data="tableData" stripe
                style="width: 100%" v-loading="loading">
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品" width="300">
                    <template #default="{ row }">
                        <div class="d-flex text-sm">
                            <div class="flex-1">
                                <p>訂單號碼:</p>
                                <small>{{ row.no }}</small>
                            </div>
                            <div>
                                <p>下單時間:</p>
                                <small>{{ row.create_time }}</small>
                            </div>
                        </div>
                        <div class="flex items-center" v-for="(item, index) of row.order_items" :key="index">
                            <el-image :src="item.goods_item ? item.goods_item.cover : ''" fit="fill" :lazy="true"
                                style="width: 30px; height: 30px;"></el-image>
                            <p class="pl-3 text-blue-500">{{ item.goods_item ? item.goods_item.title : '商品已被刪除' }}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="實際付款" width="120" prop="total_price" align="center" />
                <el-table-column label="買家" prop="create_time" width="150" align="center">
                    <template #default="{ row }">
                        <p>{{ row.user.nickname || row.user.username }}</p>
                        <small>(用戶ID:{{ row.user.id }})</small>
                    </template>
                </el-table-column>
                <el-table-column label="交易狀態" prop="create_time" align="center">
                    <template #default="{ row }">
                        <div>
                            付款狀態:
                            <el-tag v-if="row.payment_method == 'wechat'" type="success" size="small">微信支付</el-tag>
                            <el-tag v-else-if="row.payment_method == 'alipay'" size="small">支付寶支付</el-tag>
                            <el-tag v-else type="info" size="small">未支付</el-tag>
                        </div>

                        <div>
                            發貨狀態:
                            <el-tag :type="row.ship_data ? 'success' : 'info'" size="small">
                                {{ row.ship_data ? '已發貨' : '未發貨' }}
                            </el-tag>
                        </div>
                        <div>
                            收貨狀態:
                            <el-tag :type="row.ship_status == 'received' ? 'success' : 'info'" size="small">
                                {{ row.ship_status == 'received' ? '已收貨' : '未收貨' }}
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="100">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="openInfoModal(row)">訂單詳情</el-button>
                        <el-button type="primary" size="small" v-if="searchForm.tab == 'noship'">訂單發貨</el-button>
                        <el-button type="primary" size="small" v-if="searchForm.tab == 'refunding'"
                            @click="RefundHandler(row.id, 1)">同意退款</el-button>
                        <el-button type="primary" size="small" v-if="searchForm.tab == 'refunding'"
                            @click="RefundHandler(row.id, 0)">拒絕退款</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 頁碼 -->
            <div class="bottom">
                <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
                    :page-size="limit" @current-change="getData" />
            </div>
        </el-card>

        <ExportExcel :tabs="tabbars" ref="ExportExcelRef" />
        <InfoModal ref="InfoModalRef" :info="info" />
    </div>
</template>

<style scoped>
.info {
    padding-top: 40px;
    border: none;
}

.d-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.info-flex {
    display: flex;
    align-items: center;
}

.info .bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}

.r_item {
    margin-left: 10px;
}

.search_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.img {
    width: 80px;
    height: 80px;
    margin-right: 10px;
    border-radius: 5px;
}

.price {
    color: #ff0000;
}

.oprice {
    color: #2c2b2b;
    font-size: 12px;
}

.category {
    color: #2c2b2b;
    margin-bottom: 5px;
}

.time {
    color: #2c2b2b;
}

.review {
    margin: 5px 0;
}

.el-button+.el-button {
    margin-left: 0;
}
</style>