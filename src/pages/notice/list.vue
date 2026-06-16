<script setup>
import { reactive, ref, computed } from 'vue'
import { getNoticeList, createNotice, updateNotice, deleteNotice } from '@/api/notice.js'
import { toast } from '@/composables/util.js'
import FormDrawer from '@/components/FormDrawer.vue'

const tableData = ref([])

const loading = ref(false)

//表單
const formDrawerRef = ref(null)
const formRef = ref(null)
const editId = ref(0)
const drawerTitle = computed(() => editId.value ? "修改" : "新增")
const form = reactive({
    title: "",
    content: "",
})

//規則
const rules = {
    title: [
        { required: true, message: '請輸入標題', trigger: 'blur' }
    ],
    content: [
        { required: true, message: '請輸入內容', trigger: 'blur' }
    ]
}

//分頁
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)


//讀取資料
const getData = async (p = null) => {
    try {
        if (typeof p == "number") {
            currentPage.value = p
        }

        loading.value = true
        const res = await getNoticeList(currentPage.value);

        if (res) {
            tableData.value = res.list
            total.value = res.totalCount
        }

    } catch (error) {
        console.error('讀取資料時發生錯誤:', error);
    } finally {
        loading.value = false
    }
}

//表單送出
const SubmitHandler = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            try {
                formDrawerRef.value.showLoading()
                const res = editId.value ? await updateNotice(editId.value, form) : await createNotice(form)
                if(res){
                    toast(drawerTitle.value + '成功','success')
                    getData(editId.value ? currentPage.value : 1)
                    formDrawerRef.value.close()
                }
            }
            catch (error) {
                console.error('資料發生錯誤:', error);
            }
            finally {
                formDrawerRef.value.hideLoading()
            }
        }
        else {
            return false
        }
    })
}

//新增
const CreateHandler = () => {
    editId.value = 0
    form.title = ''
    form.content = ''
    formDrawerRef.value.open()
}

//修改
const UpdateHanlder = (item) => {
    editId.value = item.id
    form.title = item.title
    form.content = item.content
    formDrawerRef.value.open()
}

//刪除
const DeleteHanlder = async (id) => {
    try {
        loading.value = true
        await deleteNotice(id)
        toast('刪除成功', 'success')
        getData()
    }
    catch (error) {
        console.error(error)
    }
    finally {
        loading.value = false
    }
}

getData()
</script>

<template>
    <el-card shadow="never" class="info">
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

        <div class="bottom">
            <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>

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