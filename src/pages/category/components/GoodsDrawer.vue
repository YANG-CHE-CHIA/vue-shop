<script setup>
import { ref } from 'vue'
import { getCategoryGoods, deleteCategoryGoods, connectCategoryGoods } from '@/api/category.js'
import { toast } from '@/composables/util.js'
import FormDrawer from '@/components/FormDrawer.vue'
import ChooseGoods from '@/components/ChooseGoods.vue'

const formDrawerRef = ref(null)
const category_id = ref(0)
const tableData = ref([])
const ChooseGoodsRef = ref(null)

const open = async (item) => {
    category_id.value = item.id
    item.goodsDrawerLoading = true
    try {
        await getData()
        formDrawerRef.value.open()
    }
    catch (error) {
        console.error('失敗：', error)
    }
    finally {
        item.goodsDrawerLoading = false
    }
}

async function getData() {
    try {
        const res = await getCategoryGoods(category_id.value)
        tableData.value = res.map(o => {
            o.loading = false
            return o
        })
        return true
    }
    catch (error) {
        console.error('發生錯誤:', error);
        return false
    }
}

const DeleteHanlder = async (item) => {
    item.loading = true
    try {
        await deleteCategoryGoods(item.id)
        toast("刪除成功", "success")
        await getData()
    }
    catch (error) {
        console.error('發生錯誤:', error);
        return false
    }
}

const ConnectHandler = () => {
    ChooseGoodsRef.value.open(async (goods_ids) => {
        formDrawerRef.value.showLoading()
        try {
            await connectCategoryGoods({ 
                category_id: category_id.value, 
                goods_ids 
            })
            await getData()
            toast("關聯成功", "success")
        }
        catch (error) {
            console.error('發生錯誤:', error);
        }
        finally {
            formDrawerRef.value.hideLoading()
        }
    })
}

defineExpose({
    open
})
</script>

<template>
    <FormDrawer ref="formDrawerRef" title="推薦商品" @submitHandler="ConnectHandler" confirmText="關聯">
        <el-table :data="tableData" border stripe style="width: 100%;">
            <el-table-column prop="goods_id" label="ID" width="60" />
            <el-table-column label="商品封面" width="180">
                <template #default="{ row }">
                    <el-image :src="row.cover" fit="fill" :lazy="true" style="width: 64px; height: 64px;"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名稱" width="180" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-popconfirm title="是否要刪除" confirmButtonText="確認" cancelButtonText="取消"
                        @confirm="DeleteHanlder(row)">
                        <template #reference>
                            <el-button text type="primary" size="small" :loading="row.loading">刪除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </FormDrawer>

    <ChooseGoods ref="ChooseGoodsRef" />
</template>
