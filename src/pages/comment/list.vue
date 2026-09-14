<script setup>
import { ref } from 'vue'
import { getCommentList, updateCommentStatus, reviewComment } from '@/api/comment.js'
import { useInitTable } from '@/composables/useCommon.js'
import { toast } from '@/composables/util.js'
import Search from '@/components/Search.vue'
import SearchItem from '@/components/SearchItem.vue'

const { searchForm, resetSearchFrom, tableData, loading, currentPage, total, limit, getData, DeleteHanlder, StatusChangeHandler }
    = useInitTable({
        searchForm: {
            title: ''
        },
        getList: getCommentList,
        onGetListSuccess: (res) => {
            tableData.value = res.list.map(o => {
                o.statusLoading = false
                o.textareaEdit = false
                return o
            })
            total.value = res.totalCount
            roles.value = res.roles
        },
        updateStatus: updateCommentStatus
    })

const roles = ref([])
const textarea = ref('')

const openTextarea = (item,data = "") => {
    textarea.value = data
    item.textareaEdit = true
}

const review = async (item) => {
    if(textarea.value == ""){
        return toast('回復內容不可以是空的','error')
    }

    try {
        await reviewComment(item.id,textarea.value)
        item.textareaEdit = false
        toast('回復成功','success')
        getData()
    }
    catch (error) {
        console.error('刪除失敗：', error)
    }
}


</script>

<template>
    <el-card shadow="never" class="info">
        <!-- 搜尋 -->
        <Search :model="searchForm" @search="getData" @reset="resetSearchFrom">
            <SearchItem label="關鍵字">
                <el-input v-model="searchForm.title" placeholder="商品標題" clearable></el-input>
            </SearchItem>
        </Search>

        <!-- 資料 -->
        <el-table default-expand-all :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column type="expand">
                <template #default="{ row }">
                    <div class="flex pl-18">
                        <el-avatar :size="50" :src="row.user.avatar" fit="fill"></el-avatar>
                        <div class="flex-1 pl-5">
                            <div class="top_item flex items-center">
                                <h6>
                                    {{ row.user.nickname || row.user.username }}
                                    <small class=" text-gray-400">{{ row.review_time }}</small>
                                </h6>
                                <div class="btn_item pl-5">
                                    <el-button size="small" @click="openTextarea(row)"
                                        v-if="!row.textareaEdit && !row.extra">回復</el-button>
                                </div>
                            </div>
                            <div class="text">
                                {{ row.review.data }}
                            </div>

                            <div class="py-2">
                                <el-image v-for="(item, index) of row.review.image" :key="index" :src="item" fit="cover"
                                    :lazy="true" style="width: 100px; height: 100px;" class="rounded"></el-image>
                            </div>

                            <div class="textarea_item pt-3" v-if="row.textareaEdit">
                                <el-input text="textarea" :rows="2" v-model="textarea" placeholder="請輸入評價內容"></el-input>
                                <div class="btn_item py-2">
                                    <el-button type="primary" size="small" @click="review(row)">回復</el-button>
                                    <el-button size="small" @click="row.textareaEdit = false">取消</el-button>
                                </div>
                            </div>

                            <template v-else>
                                <div class="mt-3  bg-gray-100 p-3 rounded" v-for="(item, index) of row.extra" :key="index">
                                    <div class="flex items-center">
                                        <div class="t1">
                                            <h6 class="flex font-bold">客服</h6>
                                        </div>
                                        <div class="t2 pl-5">
                                            <el-button class="pl-5" type="info" size="small" @click="openTextarea(row,item.data)">修改</el-button>
                                        </div>
                                    </div>
                                    <div class="extra_item pt-2">
                                        <p>{{ item.data }}</p>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="id" label="ID" width="70" align="center" />
            <el-table-column label="商品" width="500">
                <template #default="{ row }">
                    <div class="info-flex">
                        <el-image :src="row.goods_item ? row.goods_item.cover : ''" fit="fill" :lazy="true"
                            style="width: 50px; height: 50px;" class="rounded"></el-image>

                        <div class="r_item">
                            <h6>{{ row.goods_item?.title ?? '商品已被刪除' }}</h6>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="評價訊息" width="200" align="center">
                <template #default="{ row }">
                    <div>
                        <p>用戶: {{ row.user.nickname || row.user.username }}</p>
                        <p><el-rate v-model="row.rating" disabled show-score text-color="#ff9900" /></p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="review_time" label="評論時間" width="180" align="center" />
            <el-table-column label="狀態" align="center">
                <template #default="{ row }">
                    <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
                        @change="StatusChangeHandler($event, row)" :loading="row.statusLoading"
                        :disabled="row.super == 1">
                    </el-switch>
                </template>
            </el-table-column>
        </el-table>

        <!-- 頁碼 -->
        <div class="bottom">
            <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>
    </el-card>
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
</style>