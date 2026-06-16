<script setup>
import { ref } from 'vue'

const showDrawer = ref(false)

const loading = ref(false)
const showLoading = () => loading.value = true
const hideLoading = () => loading.value = false

const open = () => showDrawer.value = true
const close = () => showDrawer.value = false

const props = defineProps({
    title:String,
    size:{
        type:String,
        default:"45%"
    },
    destroyOnClose:{
        type:Boolean,
        default:false
    },
    confirmText:{
        type:String,
        default:"提交"
    }
})

const emit = defineEmits(["submitHandler"])

//像父組件傳遞方法
defineExpose({
    open, close, showLoading, hideLoading
})

const submitHandler = () =>{
    emit("submitHandler")
}

</script>
<template>
    <el-drawer v-model="showDrawer" :title="title" :size="size" :close-on-click-modal="false" :destroy-on-close="destroyOnClose">
        <div class="formDrawer">
            <div class="info">
                <slot></slot>
            </div>
            <div class="actions">
                <el-button type="primary" @click="submitHandler" :loading="loading">{{ confirmText }}</el-button>
                <el-button type="default" @click="close">取消</el-button>
            </div>
        </div>
    </el-drawer>
</template>
<style scoped>
    .formDrawer {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .formDrawer .info {
        flex: 1;
        overflow-y: auto;
    }

    .formDrawer .actions {
        display: flex;
        align-items: center;
        height: 50px;
        margin-top: auto;
    }
</style>