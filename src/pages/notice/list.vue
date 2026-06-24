<script setup>
import FormDrawer from '@/components/FormDrawer.vue'
import { getNoticeList, createNotice, updateNotice, deleteNotice } from '@/api/notice.js'
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
const { tableData, loading, currentPage, total, limit, getData, DeleteHanlder } 
= useInitTable({ 
    getList: getNoticeList,
    delete: deleteNotice
})

const { formDrawerRef, formRef, form, rules, drawerTitle, SubmitHandler, CreateHandler, UpdateHanlder }
    = useInitForm({
        form: {
            title: "",
            content: "",
        },
        rules: {
            title: [{ required: true, message: '請輸入標題', trigger: 'blur' }],
            content: [{ required: true, message: '請輸入內容', trigger: 'blur' }]
        },
        getData,
        update: updateNotice,
        create: createNotice
    })

</script>

<template>
    <el-card shadow="never" class="info">
        <!-- 新增 -->
        <div class="d-flex">
            <el-button type="primary" size="small" @click="CreateHandler">新增</el-button>
            <el-tooltip effect="dark" content="刷新" placement="top">
                <el-button text @click="getData">
                    <el-icon :size="20">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>

        <!-- 資料 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="title" label="公告標題" />
            <el-table-column prop="content" label="公告內容" width="380" />
            <el-table-column prop="create_time" label="發布時間" width="180" align="center" />
            <el-table-column label="操作" width="180" align="center">
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
                <el-form-item label="公告標題" prop="title">
                    <el-input v-model="form.title" placeholder="公告標題"></el-input>
                </el-form-item>
                <el-form-item label="公告內容" prop="content">
                    <el-input v-model="form.content" placeholder="公告內容" type="textarea" :rows="5"></el-input>
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
    margin-bottom: 20px;
}

.info .bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}
</style>