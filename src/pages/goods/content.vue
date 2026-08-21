<script setup>
import { ref, reactive } from 'vue'
import FormDrawer from '@/components/FormDrawer.vue'
import Editor from '@/components/Editor.vue'
import { readGoods, updateGoods } from '@/api/goods.js'
import { toast } from '@/composables/util.js'

const formDrawerRef = ref(null)

const form = reactive({
    content:''
})

const goodsId = ref(0)
const open = async (item) => {
    try {
        goodsId.value = item.id
        item.contentLoading = true
        const res = await readGoods(goodsId.value)
        form.content = res.content
        formDrawerRef.value.open()
    }
    catch (error) {
        console.error('發生錯誤:', error);
    }
    finally {
       item.contentLoading = false;
    }
}

const emit = defineEmits(['reloadData'])
const SubmitHandler = async () => {
    formDrawerRef.value.showLoading();
    try {
        await updateGoods(goodsId.value, form)
        toast("設置商品詳情成功", 'success');
        formDrawerRef.value.close()
        emit('reloadData')
    }
    catch (error) {
        console.error('發生錯誤:', error);
    }
    finally {
        formDrawerRef.value.hideLoading();
    }
}

defineExpose({
    open
})

</script>

<template>
    <FormDrawer ref="formDrawerRef" title="設置商品詳情" @submitHandler="SubmitHandler" destroy-on-close>
        <el-form :model="form">
            <el-form-item>
                <Editor v-model="form.content" />
            </el-form-item>
        </el-form>
    </FormDrawer>
</template>