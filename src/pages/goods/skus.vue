<script setup>
import { ref, reactive } from 'vue'
import { readGoods, updateGoods, updateGoodsSkus } from '@/api/goods.js'
import { toast } from '@/composables/util.js'
import FormDrawer from '@/components/FormDrawer.vue'
import SkuCard from './components/SkuCard.vue'
import { goodsId, initSkuCardList } from '@/composables/useSku.js'

const formDrawerRef = ref(null)

const form = reactive({
    sku_type: 0,
    "sku_value": {
        "oprice": 0,
        "pprice": 0,
        "cprice": 0,
        "weight": 0,
        "volume": 0
    },
})

const open = async (item) => {
    try {
        goodsId.value = item.id
        item.skusLoading = true
        const res = await readGoods(goodsId.value)
        form.sku_type = res.sku_type
        form.sku_value = res.sku_value || {
            "oprice": 0,
            "pprice": 0,
            "cprice": 0,
            "weight": 0,
            "volume": 0
        }

       initSkuCardList(res)

        formDrawerRef.value.open()
    }
    catch (error) {
        console.error('發生錯誤:', error);
    }
    finally {
        item.skusLoading = false;
    }
}

const emit = defineEmits(['reloadData'])
const SubmitHandler = async () => {
    formDrawerRef.value.showLoading();
    try {
        await updateGoodsSkus(goodsId.value, form)
        toast("設置商品規格成功", 'success');
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
    <FormDrawer ref="formDrawerRef" title="設置商品規格" @submitHandler="SubmitHandler" destroy-on-close size="70%">
        <el-form :model="form">
            <el-form-item label="規格類型">
                <el-radio-group v-model="form.sku_type">
                    <el-radio :value="0">單規格</el-radio>
                    <el-radio :value="1">多規格</el-radio>
                </el-radio-group>
            </el-form-item>
            <template v-if="form.sku_type == 0">
                <el-form-item label="市場價格">
                    <el-input v-model="form.sku_value.oprice">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="銷售價格">
                    <el-input v-model="form.sku_value.pprice">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="成本價格">
                    <el-input v-model="form.sku_value.cprice">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input v-model="form.sku_value.weight">
                        <template #append>公斤</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="商品體積">
                    <el-input v-model="form.sku_value.volume">
                        <template #append>立方米</template>
                    </el-input>
                </el-form-item>
            </template>
            <template v-else>
                <SkuCard />
            </template>
        </el-form>
    </FormDrawer>
</template>