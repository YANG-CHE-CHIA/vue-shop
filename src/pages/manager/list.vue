<script setup>
import { ref } from 'vue'
import { getManagerList, updateManagerStatus, createManager, updateManager, deleteManager } from '@/api/manager.js'
import FormDrawer from '@/components/FormDrawer.vue'
import ChooseImage from '@/components/ChooseImage.vue'
import Search from '@/components/Search.vue'
import SearchItem from '@/components/SearchItem.vue'
import ListHeader from '@/components/ListHeader.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon.js'

const { searchForm, resetSearchFrom, tableData, loading, currentPage, total, limit, getData, DeleteHanlder, StatusChangeHandler }
    = useInitTable({
        searchForm: {
            keyword: ''
        },
        getList: getManagerList,
        onGetListSuccess: (res) => {
            tableData.value = res.list.map(o => {
                o.statusLoading = false
                return o
            })
            total.value = res.totalCount
            roles.value = res.roles
        },
        delete: deleteManager,
        updateStatus: updateManagerStatus
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
        update: updateManager,
        create: createManager
    })

const roles = ref([])

</script>

<template>
    <el-card shadow="never" class="info">
        <!-- 搜尋 -->
        <Search :model="searchForm" @search="getData" @reset="resetSearchFrom">
            <SearchItem label="關鍵字">
                <!-- <el-input v-model="searchForm.title" placeholder="商品名稱" clearable></el-input> -->
                <el-input v-model="searchForm.keyword" placeholder="管理員名稱" clearable></el-input>
            </SearchItem>
        </Search>


        <!-- 新增和刷新 -->
        <ListHeader @create="CreateHandler" @refresh="getData" />

        <!-- 資料 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column label="管理員" width="180">
                <template #default="{ row }">
                    <div class="info-flex">
                        <el-avatar :size="40" :src="row.avatar">
                            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                        </el-avatar>
                        <div class="r_item">
                            <h6>{{ row.username }}</h6>
                            <small>ID:{{ row.id }}</small>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="所屬角色" align="center">
                <template #default="{ row }">
                    {{ row.role ? row.role.name : "-" }}
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="狀態" width="120">
                <template #default="{ row }">
                    <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
                        @change="StatusChangeHandler($event, row)" :loading="row.statusLoading"
                        :disabled="row.super == 1">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <small v-if="scope.row.super == 1" class="">無法操作</small>
                    <div v-else>
                        <el-button text type="primary" size="small" @click="UpdateHanlder(scope.row)">修改</el-button>
                        <el-popconfirm title="是否要刪除" confirmButtonText="確認" cancelButtonText="取消"
                            @confirm="DeleteHanlder(scope.row.id)">
                            <template #reference>
                                <el-button text type="primary" size="small">刪除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
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