<script setup>
import { ref } from 'vue'
import { getGoodsList, updateGoodsStatus, createGoods, updateGoods, deleteGoods } from '@/api/goods.js'
import { getCategoryList } from '@/api/category.js'
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
import FormDrawer from '@/components/FormDrawer.vue'
import ChooseImage from '@/components/ChooseImage.vue'
import Search from '@/components/Search.vue'
import SearchItem from '@/components/SearchItem.vue'
import ListHeader from '@/components/ListHeader.vue'
import Banners from './banners.vue'
import Content from './content.vue'

const { searchForm, resetSearchFrom, tableData, loading, currentPage, total, limit, getData, DeleteHanlder, 
    SelectionChangeHandler, multipleTableRef, MultiDeleteHandler, MultiStatusChangeHandler }
    = useInitTable({
        searchForm: {
            title: '',
            tab: 'all',
            category_id: null
        },
        getList: getGoodsList,
        onGetListSuccess: (res) => {
            tableData.value = res.list.map(o => {
                o.bannersLoading = false
                o.contentLoading = false
                return o
            })
            total.value = res.totalCount
        },
        delete: deleteGoods,
        updateStatus: updateGoodsStatus
    })

const { formDrawerRef, formRef, form, rules, drawerTitle, SubmitHandler, CreateHandler, UpdateHanlder }
    = useInitForm({
        form: {
            title: null,
            category_id: null,
            cover: null,
            desc: null,
            unit: "件",
            stock: 100,
            min_stock: 10,
            status: 1,
            stock_display: 1,
            min_price: 0,
            min_oprice: 0
        },
        getData,
        update: updateGoods,
        create: createGoods
    })


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

fetchCategoryList()

//設置輪播圖
const bannersRef = ref(null)
const SetGoodsBannersHandler = (item) =>{
    bannersRef.value.open(item)
}

//商品詳情
const contentRef = ref(null)
const SetGoodsContentHandler = (item) =>{
    contentRef.value.open(item)
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
            <ListHeader layout="create,delete,refresh" @create="CreateHandler" @refresh="getData"
                @delete="MultiDeleteHandler">
                <el-button size="small" @click="MultiStatusChangeHandler(1)" v-if="searchForm.tab == 'all' || searchForm.tab == 'off'">上架</el-button>
                <el-button size="small" @click="MultiStatusChangeHandler(0)" v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'">下架</el-button>
            </ListHeader>

            <!-- 資料 -->
            <el-table ref="multipleTableRef" @selection-change="SelectionChangeHandler" :data="tableData" stripe
                style="width: 100%" v-loading="loading">
                <el-table-column type="selection" width="55" />
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
                            {{ row.status ? '上架' : '倉庫' }}
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
                            <el-button text :type="scope.row.goods_banner.length == 0 ? 'danger' : 'primary'" size="small" @click="SetGoodsBannersHandler(scope.row)" :loading="scope.row.bannersLoading">設置輪播圖 </el-button>
                            <el-button text :type="scope.row.content ? 'danger' : 'primary'" size="small" @click="SetGoodsContentHandler(scope.row)" 
                            :loading="scope.row.contentLoading">商品詳情</el-button>

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

                    <el-form-item label="商品名稱" prop="title">
                        <el-input v-model="form.title" placeholder="商品名稱"></el-input>
                    </el-form-item>

                    <el-form-item label="封面" prop="cover">
                        <ChooseImage v-model="form.cover" />
                    </el-form-item>

                    <el-form-item label="商品分類" prop="category_id">
                        <el-select v-model="form.category_id" placeholder="請選擇商品分類">
                            <el-option v-for="item of category_list" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="商品描述" prop="desc">
                        <el-input type="textarea" v-model="form.desc" placeholder="請輸入商品描述"></el-input>
                    </el-form-item>

                    <el-form-item label="單位" prop="unit">
                        <el-input v-model="form.unit" placeholder="請輸入單位"></el-input>
                    </el-form-item>

                    <el-form-item label="總庫存" prop="stock">
                        <el-input type="number" v-model="form.stock">
                            <template #append>件</template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="庫存預警" prop="min_stock">
                        <el-input type="number" v-model="form.min_stock">
                            <template #append>件</template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="最低銷售價格" prop="min_price">
                        <el-input type="number" v-model="form.min_price">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="最低價格" prop="min_oprice">
                        <el-input type="number" v-model="form.min_oprice">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="庫存顯示" prop="stock_display">
                        <el-radio-group v-model="form.stock_display">
                            <el-radio :value="0">隱藏</el-radio>
                            <el-radio :value="1">顯示</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="是否上架" prop="status">
                        <el-radio-group v-model="form.status">
                            <el-radio :value="0">放入庫存</el-radio>
                            <el-radio :value="1">立即上架</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </FormDrawer>
        </el-card>

        <!-- 設置輪播圖 -->
        <Banners ref="bannersRef" @reload-data="getData" />
        <!-- 商品詳情 -->
        <Content ref="contentRef" @reload-data="getData" />
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