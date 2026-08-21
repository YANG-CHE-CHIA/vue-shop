<script setup>
import { ref, reactive } from 'vue'
import ChooseImage from '@/components/ChooseImage.vue'
import { readGoods, setGoodsBanner } from '@/api/goods.js'
import { toast } from '@/composables/util.js'

const dialogVisible = ref(false)

const form = reactive({
    banners: []
})

const goodsId = ref(0)
const open = async (item) => {
    try {
        goodsId.value = item.id
        item.bannersLoading = true
        const res = await readGoods(goodsId.value)
        form.banners = res.goodsBanner.map(o => o.url)

        dialogVisible.value = true
    }
    catch (error) {
        console.error('發生錯誤:', error);
    }
    finally {
       item.bannersLoading = false;
    }
}

const emit = defineEmits(['reloadData'])
const loading = ref(false)
const SubmitHandler = async () => {
    loading.value = true
    
    try {
        await setGoodsBanner(goodsId.value, form)
        toast("設置輪播圖成功", 'success');
        dialogVisible.value = false
        emit('reloadData')
    }
    catch (error) {
        console.error('發生錯誤:', error);
    }
    finally {
        loading.value = false;
    }
}

defineExpose({
    open
})

</script>

<template>
    <el-drawer title="設置輪播圖" v-model="dialogVisible" size="50%" destroy-on-close>
        <el-form :model="form" label-width="80px">
            <el-form-item label="輪播圖">
                <ChooseImage :limit="9" v-model="form.banners" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="loading" @click="SubmitHandler">提交</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>