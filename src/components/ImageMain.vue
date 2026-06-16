<script setup>
import { ref } from 'vue';
import { getImageList, updateImage, deleteImage } from '@/api/image.js'
import { toast, showPrompt } from '@/composables/util.js'

import UploadFile from '@/components/UploadFile.vue'

//分頁
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)
const list = ref([])
const loading = ref(false)

const image_class_id = ref(0)

//上傳圖片
const drawer = ref(false)

const getData = async (p = null) => {
    try {
        if (typeof p == "number") {
            currentPage.value = p
        }

        loading.value = true
        const res = await getImageList(image_class_id.value, currentPage.value);

        if (res) {
            list.value = res.list
            total.value = res.totalCount
        }

    } catch (error) {
        console.error('發生錯誤:', error);
    } finally {
        loading.value = false
    }
}

//根據分類ID重新載入圖片列表
const loadData = (id) => {
    currentPage.value = 1
    image_class_id.value = id
    getData()
}

//重新命名
const EditHandler = async (item) => {
    try {
        const { value } = await showPrompt("重命名", item.name);

        loading.value = true;

        await updateImage(item.id, value);

        toast("修改成功", 'success');
        getData();
    }
    catch (error) {
        console.error('發生錯誤:', error);
    }
    finally {
        loading.value = false;
    }
}

//刪除
const DeleteHandler = async (id) => {
    try {
        loading.value = true;
        await deleteImage([id]);

        toast("刪除成功", 'success');
        getData();
    }
    catch (error) {
        console.error('發生錯誤:', error);
    }
    finally {
        loading.value = false;
    }
}

//上傳圖片
const openUploadFile = () => drawer.value = true

//上傳成功
const UploadSuccessHandler = () => getData(1)

//像父組件傳遞方法
defineExpose({
    loadData,
    openUploadFile
})

</script>

<template>
    <el-main class="image-main" v-loading="loading">
        <div class="top">
            <el-row :gutter="10">
                <el-col :span="6" :offset="0" v-for="(item, index) of list" :key="index">
                    <el-card shadow="hover" class="card_item" :body-style="{ 'padding': 0 }">
                        <el-image :src="item.url" fit="cover" class="card_pic" :preview-src-list="[item.url]"
                            :initial-index="0"></el-image>
                        <div class="pic_title">{{ item.name }}</div>
                        <div class="d-flex btn_item">
                            <el-button text type="primary" size="small" @click="EditHandler(item)">重新命名</el-button>
                            <el-popconfirm title="是否要刪除" confirmButtonText="確認" cancelButtonText="取消"
                                @confirm="DeleteHandler(item.id)">
                                <template #reference>
                                    <el-button text type="primary" size="small">刪除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div class="bottom">
            <el-pagination background layout="prev, pager ,next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>
    </el-main>

    <el-drawer v-model="drawer" title="上傳圖片">
        <UploadFile :data="{ image_class_id }" @success="UploadSuccessHandler" />
    </el-drawer>
</template>

    <style scoped>
    .image-main {
        position: relative;
    }

    .image-main .top {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 50px;
        overflow-y: auto;
        padding: 10px;
    }

    .image-main .bottom {
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .image-main .card_item {
        position: relative;
        margin-bottom: 10px;
    }

    .image-main .card_pic {
        width: 100%;
        height: 150px;
    }

    .image-main .d-flex {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .image-main .pic_title {
        position: absolute;
        bottom: 19%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.2);
        width: 100%;
        text-align: center;
        color: #ffffff;
        padding: 3px 5px;
        font-size: 14px;
    }

    .image-main .btn_item {
        padding-bottom: 5px;
    }
</style>