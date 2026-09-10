<script setup>
import { ref } from 'vue'
import FormDrawer from '@/components/FormDrawer.vue'
import ListHeader from '@/components/ListHeader.vue'
import GoodsDrawer from './components/GoodsDrawer.vue'
import { getCategoryList, createCategory, updateCategory, updateCategoryStatus, deleteCategory } from '@/api/category.js'
import { useInitTable, useInitForm } from '@/composables/useCommon.js'

const { loading, tableData, getData, DeleteHanlder, StatusChangeHandler } = useInitTable({
    getList: getCategoryList,
    onGetListSuccess: (res) => {
        tableData.value = res.map(o=>{
            o.goodsDrawerLoading = false
            return o
        })
    },
    delete: deleteCategory,
    updateStatus: updateCategoryStatus
})

const { formDrawerRef, formRef, form, rules, drawerTitle, SubmitHandler, CreateHandler, UpdateHanlder }
    = useInitForm({
        form: {
            name: ""
        },
        getData,
        update: updateCategory,
        create: createCategory
    })

const GoodsDrawerRef = ref(null)

const openGoodsDrawer = (data) => GoodsDrawerRef.value.open(data)

</script>
<template>
    <el-card shadow="never" class="info">
        <!-- 新增和刷新 -->
        <ListHeader @create="CreateHandler" @refresh="getData" />
        <el-tree :data="tableData" :props="{ label: 'name', children: 'child' }" node-key="id" v-loading="loading">
            <template #default="{ data }">
                <div class="info_item">
                    <div class="left">
                        <span class="text">{{ data.name }}</span>
                    </div>
                    <div class="right">
                        <el-button text type="primary" size="small" @click="openGoodsDrawer(data)" :loading="data.goodsDrawerLoading">推薦商品</el-button>
                        <el-switch :modelValue="data.status" :active-value="1" :inactive-value="0"
                            @change="StatusChangeHandler($event, data)"></el-switch>
                        <el-button text type="primary" size="small" @click.stop="UpdateHanlder(data)">修改</el-button>
                        <el-popconfirm title="是否要刪除" confirmButtonText="確認" cancelButtonText="取消"
                            @confirm="DeleteHanlder(data.id)">
                            <template #reference>
                                <el-button text type="primary" size="small">刪除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </div>
            </template>
        </el-tree>

        <!-- 彈跳視窗 -->
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submitHandler="SubmitHandler">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="分類表單" prop="name">
                    <el-input v-model="form.name" placeholder="分類表單"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>

        <GoodsDrawer ref="GoodsDrawerRef" />
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

.info_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.info_item .left .icon {
    margin-left: 10px;
}

.info_item .left .text {
    margin-left: 5px;
}

:deep(.el-tree-node__content) {
    padding: 20px 0;
}
</style>