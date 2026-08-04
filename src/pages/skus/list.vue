<script setup>
import { ref } from 'vue'
import { toast } from '@/composables/util'
import FormDrawer from '@/components/FormDrawer.vue'
import TagInput from '@/components/TagInput.vue'
import ListHeader from '@/components/ListHeader.vue'
import { getSkusList, createSkus, updateSkus, deleteSkus, updateSkusStatus } from '@/api/skus.js'
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
const { tableData, loading, currentPage, total, limit, getData, DeleteHanlder, StatusChangeHandler, SelectionChangeHandler, multipleTableRef, MultiDeleteHandler }
    = useInitTable({
        getList: getSkusList,
        delete: deleteSkus,
        updateStatus: updateSkusStatus
    })

const { formDrawerRef, formRef, form, rules, drawerTitle, SubmitHandler, CreateHandler, UpdateHanlder }
    = useInitForm({
        form: {
            name: "",
            status: 1,
            default: "",
            order: 50
        },
        rules: {
            name: [{ required: true, message: '請輸入規格名稱', trigger: 'blur' }],
            default: [{ required: true, message: '請輸入規格值', trigger: 'blur' }]
        },
        getData,
        update: updateSkus,
        create: createSkus
    })

</script>

<template>
    <el-card shadow="never" class="info">
        <!-- 新增和刷新 -->
        <ListHeader layout="create,delete,refresh" @create="CreateHandler" @refresh="getData"
            @delete="MultiDeleteHandler" />

        <!-- 資料 -->
        <el-table ref="multipleTableRef" @selection-change="SelectionChangeHandler" :data="tableData" stripe style="width: 100%"
            v-loading="loading">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="規格名稱" />
            <el-table-column prop="default" label="規格值" width="380" />
            <el-table-column prop="order" label="排序" />
            <el-table-column prop="create_time" label="狀態" width="120">
                <template #default="{ row }">
                    <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
                        @change="StatusChangeHandler($event, row)" :loading="row.statusLoading"
                        :disabled="row.super == 1">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="250" align="center">
                <template #default="scope">
                    <el-button text type="primary" size="small" @click="UpdateHanlder(scope.row)">修改</el-button>
                    <el-popconfirm title="是否要刪除" confirmButtonText="確認" cancelButtonText="取消"
                        @confirm="DeleteHanlder(scope.row.id)">
                        <template #reference>
                            <el-button text type="primary" size="small">刪除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 頁碼 -->
        <div class="bottom">
            <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>

        <!-- 彈跳視窗 -->
        <FormDrawer destroyOnClose ref="formDrawerRef" :title="drawerTitle" @submitHandler="SubmitHandler">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="規格名稱" prop="name">
                    <el-input v-model="form.name" placeholder="規格名稱"></el-input>
                </el-form-item>
                <el-form-item label="規格值" prop="default">
                    <TagInput v-model="form.default" />
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="1000">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="狀態" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>

    </el-card>
</template>

<style scoped>
.info {
    padding-top: 40px;
    border: none;
}

.dflex {
    display: flex;
    align-items: center;
}

.d-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.info .bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}
</style>