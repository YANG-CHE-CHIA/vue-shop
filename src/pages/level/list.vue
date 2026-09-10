<script setup>
import FormDrawer from '@/components/FormDrawer.vue'
import ListHeader from '@/components/ListHeader.vue'
import { getUserLevelList, createUserLevel, updateUserLevel, deleteUserLevel, updateUserLevelStatus } from '@/api/level.js'
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
const { tableData, loading, currentPage, total, limit, getData, DeleteHanlder, StatusChangeHandler }
    = useInitTable({
        getList: getUserLevelList,
        delete: deleteUserLevel,
        updateStatus: updateUserLevelStatus
    })

const { formDrawerRef, formRef, form, rules, drawerTitle, SubmitHandler, CreateHandler, UpdateHanlder }
    = useInitForm({
        form: {
            name: "",
            level: 100,
            status: 1,
            discount: 0,
            max_price: 0,
            max_times: 0
        },
        rules: {
            name: [{ required: true, message: '請輸入會員等級', trigger: 'blur' }]
        },
        getData,
        update: updateUserLevel,
        create: createUserLevel
    })

</script>

<template>
    <el-card shadow="never" class="info">
        <!-- 新增和刷新 -->
        <ListHeader @create="CreateHandler" @refresh="getData" />

        <!-- 資料 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="會員等級" />
            <el-table-column prop="discount" label="折扣率" align="center" />
            <el-table-column prop="level" label="等級序號" align="center" />
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
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submitHandler="SubmitHandler">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="等級名稱" prop="name">
                    <el-input v-model="form.name" placeholder="等級名稱"></el-input>
                </el-form-item>
                <el-form-item label="等級權重" prop="level">
                    <el-input type="number" v-model="form.level" placeholder="等級權重"></el-input>
                </el-form-item>
                <el-form-item label="狀態" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="升級條件">
                    <div>
                        <div class="dflex">
                            <small class="text-xs mr-2 w-24">累計消費滿</small>
                            <el-input type="number" v-model="form.max_price" placeholder="累計消費">
                                <template #append>元</template>
                            </el-input>
                        </div>
                        <small class="text-gray-400 flex">
                            設置會員等級所需要的累計消費必須大於等於0,單位:元
                        </small>
                    </div>
                    <div>
                        <div class="dflex">
                            <small class="text-xs mr-2 w-24">累計次數滿</small>
                            <el-input type="number" v-model="form.max_times" placeholder="累計次數">
                                <template #append>%</template>
                            </el-input>
                        </div>
                        <small class="text-gray-400 flex">
                            設置會員等級所需要的購買量必須大於等於0,單位:筆
                        </small>
                    </div>
                </el-form-item>
                <el-form-item label="折扣率(%)" prop="discount">
                    <el-input type="number" v-model="form.discount" placeholder="折扣率(%)">
                        <template #append>%</template>
                    </el-input>
                    <small class="text-gray-400 flex">
                        折扣率單位為百分比,如輸入90,表示該會員等級的用戶可以以商品原價的90%購買
                    </small>
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