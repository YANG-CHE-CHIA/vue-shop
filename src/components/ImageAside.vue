<script setup>
import { computed, reactive, ref } from 'vue';
import AsideList from './AsideList.vue'
import FormDrawer from './FormDrawer.vue'
import { getImageClassList, createImageClass, updateImageClass, deleteImageClass } from '@/api/image_class.js'
import { toast } from '@/composables/util.js'

//加載動畫
const loading = ref(false)
const activeId = ref(0)
const list = ref([])

//分頁
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

const formDrawerRef = ref(null)

const formRef = ref(null)
const editId = ref(0)
const drawerTitle = computed(() => editId.value ? "修改" : "新增")
const form = reactive({
    name: "",
    order: 50
})

const rules = {
    name: [
        { required: true, message: '請輸入分類名稱', trigger: 'blur' }
    ],
}

//讀取資料
const getData = async (p = null) => {
    try {
        if (typeof p == "number") {
            currentPage.value = p
        }

        loading.value = true
        const res = await getImageClassList(currentPage.value);

        if (res) {
            list.value = res.list
            total.value = res.totalCount

            let item = list.value[0]
            if (item) {
                ChangeActiveIdHandler(item.id)
            }
        }

    } catch (error) {
        console.error('讀取資料時發生錯誤:', error);
    } finally {
        loading.value = false
    }
}

//資料送出
const SubmitHandler = () => {
    formRef.value.validate(async (valid) => {
        if (!valid) return
        try {
            formDrawerRef.value.showLoading()
            const res = editId.value ? await updateImageClass(editId.value, form) : await createImageClass(form)
            if (res) {
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
    })
}

//新增
const CreateHandler = () => {
    editId.value = 0
    form.name = ''
    form.order = 50
    formDrawerRef.value.open()
}

//修改
const EditHandler = (item) => {
    editId.value = item.id
    form.name = item.name
    form.order = item.order
    formDrawerRef.value.open()
}

//刪除
const DeleteHandler = async (id) => {
    try {
        loading.value = true
        const res = await deleteImageClass(id)
        if (res) {
            toast('刪除成功','success')
            getData()
        }
    } 
    catch (error) {
        console.error('資料發生錯誤:', error);
    } 
    finally {
        loading.value = false
    }
}

//選中圖庫的ID
const emit = defineEmits(['change'])

const ChangeActiveIdHandler = (id) =>{
    activeId.value = id
    emit('change',id)
}

//像父組件傳遞方法
defineExpose({
    CreateHandler
})


getData()

</script>

<template>
    <el-aside class="image-aside" v-loading="loading">
        <div class="top">
            <AsideList :active="activeId == item.id" v-for="(item, index) of list" :key="index"
                @edit="EditHandler(item)" @delete="DeleteHandler(item.id)" @click="ChangeActiveIdHandler(item.id)">
                {{ item.name }}
            </AsideList>
        </div>
        <div class="bottom">
            <el-pagination background layout="prev, next" :total="total" :current-page="currentPage" :page-size="limit"
                @current-change="getData" />
        </div>
    </el-aside>

    <FormDrawer :title="drawerTitle" ref="formDrawerRef" @submitHandler="SubmitHandler">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
            <el-form-item label="分類名稱" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input-number v-model="form.order" :min="0" :max="1000" />
            </el-form-item>
        </el-form>
    </FormDrawer>
</template>

<style scoped>
.image-aside {
    width: 220px;
    position: relative;
    border-right: 1px solid #eeeeee;
}

.image-aside .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
}

.image-aside .bottom {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>