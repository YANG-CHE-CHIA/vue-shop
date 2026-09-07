<script setup>
import { ref } from 'vue'
import { toast } from '@/composables/util.js'
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

const callbackFunction = ref(null)

const openHandler = (callback = null) => {
    callbackFunction.value = callback
    dialogVisible.value = true
}

const closeHandler = () =>  dialogVisible.value = false

const props = defineProps({
    modelValue:[String,Array],
    limit:{
        type:Number,
        default:1
    },
    preview:{
        type:Boolean,
        default:true
    }
})

const emit = defineEmits(['update:modelValue'])

let urls = []
const ChooseHandler = (item) => {
    urls = item.map(o=>o.url)
}

const submitHandler = () => {
    let value = []
    if(props.limit == 1){
        value = urls[0]
    }
    else{
        value = props.preview ? [...props.modelValue,...urls] : [...urls]
        if(value.length > props.limit){
            let limit = prop.preview ? (props.limit - props.modelValue.length) : props.limit
            toast("最多還能選擇" + limit + "張" , 'error');
        }
    }

    if(value && props.preview){
        emit('update:modelValue',value)
    }

    if(!props.preview && typeof callbackFunction.value === 'function'){
        callbackFunction.value(value)
    }

    closeHandler()
}

const removeImage = (url) => {
    emit('update:modelValue',props.modelValue.filter(u => u != url))
}

defineExpose({
    openHandler
})

</script>

<template>

    <div v-if="modelValue && preview" class="d-flex">
        <el-image v-if="typeof modelValue == 'string'" :src="modelValue" fit="cover" class="img"></el-image>
        <div class="img-flex" v-else>
            <div class="img_item" v-for="(url,index) of modelValue" :key="index">
                <el-icon class="close" @click="removeImage(url)"><CircleClose /></el-icon>
                <el-image :src="url" fit="cover" class="img"></el-image>
            </div>
        </div>
    </div>

    <div v-if="preview" class="choose_btn" @click="openHandler">
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
                <ImageMain :limit="limit" openChoose ref="ImageMainRef" @choose="ChooseHandler" />
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

.img-flex{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.img_item{
    width: 100px;
    height: 100px;
    position: relative;
    margin: 0 5px;
    margin-bottom: 10px;
}

.img_item .close{
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
    z-index: 10;
    background: #ffffff;
    border-radius: 50px;
}
</style>