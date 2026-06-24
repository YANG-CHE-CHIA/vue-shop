<script setup>
import { ref } from 'vue'
import ImageAside from '@/components/ImageAside.vue'
import ImageMain from '@/components/ImageMain.vue'

const ImageAsideRef = ref(null)
const ImageMainRef = ref(null)

const dialogVisible = ref(false)

const OpenCreateHandler = () =>{
    ImageAsideRef.value.CreateHandler()
}

const AsideChangeHandler = (image_class_id) =>{
    ImageMainRef.value.loadData(image_class_id)
}

const OpenUploadHandler = () =>{
    ImageMainRef.value.openUploadFile()
}

const openHandler = () => dialogVisible.value = true

const closeHandler = () =>  dialogVisible.value = false

const props = defineProps({
    modelValue:[String,Array]
})

const emit = defineEmits(['update:modelValue'])

let urls = []
const ChooseHandler = (item) => {
    urls = item.map(o=>o.url)
}

const submitHandler = () => {
    if(urls.length){
        emit('update:modelValue',urls[0])
    }
    closeHandler()
}

</script>

<template>

    <div v-if="modelValue" class="d-flex">
        <el-image :src="modelValue" fit="cover" class="img"></el-image>
        
    </div>

    <div class="choose_btn" @click="openHandler">
        <el-icon :size="25">
            <Plus />
        </el-icon>
    </div>
    <el-dialog title="選擇圖片" v-model="dialogVisible" width="80%" top="5vh">
        <el-container class="info" style="height: 70vh;">
            <el-header class="image-header">
                <el-button type="primary" size="small" @click="OpenCreateHandler">新增圖片分類</el-button>
                <el-button type="warning" size="small" @click="OpenUploadHandler">上傳圖片</el-button>
            </el-header>
            <el-container>
                <ImageAside ref="ImageAsideRef" @change="AsideChangeHandler" />
                <ImageMain openChoose ref="ImageMainRef" @choose="ChooseHandler" />
            </el-container>
        </el-container>
        <template #footer>
            <span>
                <el-button @click="closeHandler">取消</el-button>
                <el-button type="primary" @click="submitHandler">確定</el-button>
            </span>
        </template>
    </el-dialog>

</template>

<style scoped>
.d-flex{
    display: flex;
    align-items: center;
    justify-content: center;
}

.choose_btn {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    border: 1px solid #dddddd;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.8s ease;
}

.choose_btn:hover {
    background: #eeeeee;
}

.image-header {
    display: flex;
    align-items: center;
    border-bottom:1px solid #eeeeee;
}

.img{
    width: 100px;
    height: 100px;
    border-radius: 10px;
    border: 1px solid #dddddd;
    margin-right: 10px;
}
</style>