<script setup>
import { ref } from 'vue'
import ImageAside from '@/components/ImageAside.vue'
import ImageMain from '@/components/ImageMain.vue'

const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 - 44

const ImageAsideRef = ref(null)
const ImageMainRef = ref(null)

const OpenCreateHandler = () =>{
    ImageAsideRef.value.CreateHandler()
}

const AsideChangeHandler = (image_class_id) =>{
    ImageMainRef.value.loadData(image_class_id)
}

const OpenUploadHandler = () =>{
    ImageMainRef.value.openUploadFile()
}

</script>

<template>
    <el-container class="info" :style="{ height: (h + 'px') }">
        <el-header class="image-header">
            <el-button type="primary" size="small" @click="OpenCreateHandler">新增圖片分類</el-button>  
            <el-button type="warning" size="small" @click="OpenUploadHandler">上傳圖片</el-button>  
        </el-header>
        <el-container>
            <ImageAside ref="ImageAsideRef" @change="AsideChangeHandler" />
            <ImageMain ref="ImageMainRef" />
        </el-container>
    </el-container>
</template>

<style scoped>
.info {
    padding-top: 40px;
    background: #ffffff;
    border-radius: 10px;
}

.image-header {
    display: flex;
    align-items: center;
    border-bottom:1px solid #eeeeee;
}

</style>