<script setup>
import { ref } from 'vue'
import { getGoodsList } from '@/api/goods.js'
import { useInitTable } from '@/composables/useCommon.js'

const { searchForm, tableData, loading, currentPage, total, limit, getData, SelectionChangeHandler, multipleTableRef, multiSelectionsIds }
    = useInitTable({
        searchForm: {
            title: '',
            tab: 'all',
            category_id: null
        },
        getList: getGoodsList,
        onGetListSuccess: (res) => {
            tableData.value = res.list
            total.value = res.totalCount
        },
    })

const dialogvisible = ref(false)
const callbackFunction = ref(null)

const open = (callback = null) => {
    callbackFunction.value = callback
    dialogvisible.value = true
}

const SubmitHandler = () => {
    if(typeof callbackFunction.value === 'function'){
        callbackFunction.value(multiSelectionsIds.value)
    }

    close()
}


function close() {
    dialogvisible.value = false
}

defineExpose({
    open
})

</script>

<template>
    <div class="info">
        <el-dialog title="選擇商品" v-model="dialogvisible" width="80%" destroy-on-close>
            <el-table ref="multipleTableRef" @selection-change="SelectionChangeHandler" :data="tableData" stripe
                style="width: 100%" height="500px" v-loading="loading">
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品">
                    <template #default="{ row }">
                        <div class="d-flex">
                            <el-image class="img" :src="row.cover" fit="cover" :lazy="true"></el-image>
                            <div>
                                <p>{{ row.title }}</p>
                                <div>
                                    <p class="category">分類:{{ row.category ? row.category.name : '未分類' }}</p>
                                    <p class="time">建立時間:{{ row.create_time }}</p>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="總庫存" width="90" prop="stock" align="center" />
                <el-table-column label="價格(元)" width="150" align="center">
                    <template #default="{ row }">
                        <span class="text-rose-300">${{ row.min_price }}</span>
                        <el-divider direction="vertical"></el-divider>
                        <span class="text-gray-500 text-xs">${{ row.min_oprice }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 頁碼 -->
            <div class="bottom">
                <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
                    :page-size="limit" @current-change="getData" />
            </div>
            <template #footer>
                <span>
                    <el-button type="primary" @click="SubmitHandler">確定</el-button>
                    <el-button @click="close">取消</el-button>
                </span>
            </template>
        </el-dialog>
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
}

.img {
    width: 80px;
    height: 80px;
    margin-right: 10px;
    border-radius: 5px;
}

.info .bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}
</style>