<script setup>
import { ref } from 'vue'
import { getGoodsList, updateGoodsStatus, createGoods, updateGoods, deleteGoods } from '@/api/goods.js'
import { getCategoryList } from '@/api/category.js'
import FormDrawer from '@/components/FormDrawer.vue'
import ChooseImage from '@/components/ChooseImage.vue'
import Search from '@/components/Search.vue'
import SearchItem from '@/components/SearchItem.vue'
import ListHeader from '@/components/ListHeader.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon.js'

const { searchForm, resetSearchFrom, tableData, loading, currentPage, total, limit, getData, DeleteHanlder, StatusChangeHandler }
    = useInitTable({
        searchForm: {
            title: '',
            tab: 'all',
            category_id: null
        },
        getList: getGoodsList,
        onGetListSuccess: (res) => {
            tableData.value = res.list.map(o => {
                o.statusLoading = false
                return o
            })
            total.value = res.totalCount
            roles.value = res.roles
        },
        delete: deleteGoods,
        updateStatus: updateGoodsStatus
    })

const { formDrawerRef, formRef, form, rules, drawerTitle, SubmitHandler, CreateHandler, UpdateHanlder }
    = useInitForm({
        form: {
            username: "",
            password: "",
            role_id: null,
            status: 1,
            avatar: ""
        },
        getData,
        update: updateGoods,
        create: createGoods
    })

const roles = ref([])

//tab選單
const tabbars = [
    {
        key: "all",
        name: "全部"
    },
    {
        key: "checking",
        name: "審核中"
    },
    {
        key: "saling",
        name: "出售中"
    },
    {
        key: "off",
        name: "已下架"
    },
    {
        key: "min_stock",
        name: "庫存預警"
    },
    {
        key: "delete",
        name: "回收站"
    }
]

//商品分類
const category_list = ref([])

const fetchCategoryList = async () => {
    try {
        const res = await getCategoryList()
        category_list.value = res
    } catch (error) {
        console.error('取得分類列表失敗：', error)
    }
}



// 呼叫函式執行
fetchCategoryList()

</script>

<template>
    <div class="info">
        <el-tabs v-model="searchForm.tab" @tab-change="getData">
            <el-tab-pane :label="item.name" :name="item.key" v-for="(item, index) of tabbars" :key=index></el-tab-pane>
        </el-tabs>
        <el-card shadow="never">
            <!-- 搜尋 -->
            <Search :model="searchForm" @search="getData" @reset="resetSearchFrom">
                <SearchItem label="關鍵字">
                    <el-input v-model="searchForm.title" placeholder="商品名稱" clearable></el-input>
                </SearchItem>

                <template #show>
                    <SearchItem label="商品分類">
                        <el-select v-model="searchForm.category_id" placeholder="請選擇商品分類" clearable>
                            <el-option v-for="item of category_list" :key="item.id" :label="item.name"
                                :value="item.id"></el-option>
                        </el-select>
                    </SearchItem>
                </template>
            </Search>

            <!-- 新增和刷新 -->
            <ListHeader @create="CreateHandler" @refresh="getData" />

            <!-- 資料 -->
            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
                <el-table-column label="商品" width="300">
                    <template #default="{ row }">
                        <div class="d-flex">
                            <el-image class="img" :src="row.cover" fit="cover" :lazy="true"></el-image>
                            <div>
                                <p>{{ row.title }}</p>
                                <div>
                                    <span class="price">${{ row.min_price }}</span>
                                    <el-divider direction="vertical" />
                                    <span class="oprice">${{ row.min_oprice }}</span>
                                    <p class="category">分類:{{ row.category ? row.category.name : '未分類' }}</p>
                                    <p class="time">建立時間:{{ row.create_time }}</p>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="實際銷量" width="90" prop="sale_count" align="center" />
                <el-table-column prop="create_time" label="商品狀態" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.status ? 'success' : 'danger'" size="small">
                            {{ row.status ? '上架' : '下架' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="審核狀態" width="120" align="center"
                    v-if="searchForm.tab != 'delete'">
                    <template #default="{ row }">
                        <div v-if="row.ischeck == 0">
                            <el-button class="review" type="success" size="small" plain>審核通過</el-button>
                            <el-button class="review" type="danger" size="small" plain>審核拒絕</el-button>
                        </div>
                        <span v-else>{{ row.ischeck == 1 ? '通過' : '拒絕' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="總庫存" width="90" prop="stock" align="center" />
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <div v-if="searchForm.tab != 'delete'">
                            <el-button text type="primary" size="small" @click="UpdateHanlder(scope.row)">修改</el-button>
                            <el-button text type="primary" size="small">商品規格</el-button>
                            <el-button text type="primary" size="small">設置輪播圖 </el-button>
                            <el-button text type="primary" size="small">商品詳情</el-button>

                            <el-popconfirm title="是否要刪除" confirmButtonText="確認" cancelButtonText="取消"
                                @confirm="DeleteHanlder(scope.row.id)">
                                <template #reference>
                                    <el-button text type="primary" size="small">刪除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                        <span v-else>暫無操作</span>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 頁碼 -->
            <div class="bottom">
                <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
                    :page-size="limit" @current-change="getData" />
            </div>

            <!-- 彈出視窗 -->
            <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submitHandler="SubmitHandler">
                <el-form :model="form" ref="formRef" label-width="100px" :inline="false">

                    <el-form-item label="管理員名稱" prop="username">
                        <el-input v-model="form.username" placeholder="管理員名稱"></el-input>
                    </el-form-item>

                    <el-form-item label="密碼" prop="password">
                        <el-input v-model="form.password" placeholder="密碼"></el-input>
                    </el-form-item>

                    <el-form-item label="大頭貼" prop="avatar">
                        <ChooseImage v-model="form.avatar" />
                    </el-form-item>

                    <el-form-item label="所屬角色" prop="role_id">
                        <el-select v-model="form.role_id" placeholder="請選擇所屬角色">
                            <el-option v-for="item of roles" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>

                    </el-form-item>

                    <el-form-item label="狀態" prop="status">
                        <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                        </el-switch>
                    </el-form-item>
                </el-form>
            </FormDrawer>
        </el-card>
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
</style>