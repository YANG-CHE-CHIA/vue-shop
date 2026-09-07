import { ref, nextTick } from 'vue'
import { createGoodsSkusCard, updateGoodsSkusCard, deleteGoodsSkusCard, sortGoodsSkusCard, createGoodsSkusCardValue, updateGoodsSkusCardValue, deleteGoodsSkusCardValue } from '@/api/goods.js'
import { useArrayMoveUp, useArrayMoveDown } from '@/composables/util.js'

//當前商品的ID
export const goodsId = ref(0)

//規格選項列表
export const sku_card_list = ref([])

//初始化規格選項列表
export function initSkuCardList(skuList) {
    sku_card_list.value = skuList.goodsSkusCard.map(item => {
        item.text = item.name
        item.loading = false
        item.goodsSkusCardValue.map(v => {
            v.text = v.value || '屬性值'
            return v
        })
        return item
    })
}

//新增規格選項
export const btnLoading = ref(false)
export async function addSkuCardEvent() {
    btnLoading.value = true
    try {
        const res = await createGoodsSkusCard({
            goods_id: goodsId.value,
            name: "規格選項",
            order: 50,
            type: 0
        })

        sku_card_list.value.push({
            ...res,
            text: res.name,
            loading: false,
            goodsSkusCardValue: []
        })
    }
    catch (error) {
        console.error("新增失敗：", error)
    }
    finally {
        btnLoading.value = false
    }
}

//修改規格選項
export async function UpdateHandler(item) {
    item.loading = true
    try {
        const res = await updateGoodsSkusCard(item.id, {
            goods_id: item.goods_id,
            name: item.text,
            order: item.order,
            type: 0
        })
        item.name = item.text
    }
    catch (error) {
        item.text = item.name
        console.error("修改失敗：", error)
    }
    finally {
        item.loading = false
    }
}

//刪除規格選項
export async function DeleteHandler(item) {
    item.loading = true
    try {
        await deleteGoodsSkusCard(item.id)
        const i = sku_card_list.value.findIndex(o => o.id == item.id)
        if (i != -1) {
            sku_card_list.value.splice(i, 1)
        }
    }
    catch (error) {
        console.error("刪除失敗：", error)
    }
}

//排序規格選項
export const bodyLoading = ref(false)
export async function sortCard(action, index) {
    let oList = JSON.parse(JSON.stringify(sku_card_list.value))
    let func = action == 'up' ? useArrayMoveUp : useArrayMoveDown

    func(oList, index)

    let sortData = oList.map((o, i) => {
        return {
            id: o.id,
            order: i + 1
        }
    })
    bodyLoading.value = true
    try {
        await sortGoodsSkusCard({ sortdata: sortData })
        func(sku_card_list.value, index)
    }
    catch (error) {
        console.error("失敗：", error)
    }
    finally {
        bodyLoading.value = false
    }
}

//初始化規格值
export function initSkuCardItem(id) {
    const loading = ref(false)
    const inputValue = ref('')
    const inputVisible = ref(false)
    const InputRef = ref()

    const item = sku_card_list.value.find(o => o.id == id)

    const handleClose = async (tag) => {
        loading.value = true

        try {
            await deleteGoodsSkusCardValue(tag.id)
            let i = item.goodsSkusCardValue.findIndex(o=>o.id === tag.id)
            if( i != -1){
                item.goodsSkusCardValue.splice(i,1)
            }
        }
        catch (error) {
            console.error("刪除失敗：", error)
        }
        finally {
            loading.value = false
        }
    }

    const showInput = () => {
        inputVisible.value = true
        nextTick(() => {
            InputRef.value.input.focus()
        })
    }

    const handleInputConfirm = async () => {
        if (!inputVisible.value) {
            inputVisible.value = false
            return
        }

        loading.value = true

        try {
            const res = await createGoodsSkusCardValue({
                goods_skus_card_id: id,
                name: item.name,
                order: 50,
                value: inputValue.value
            })

            item.goodsSkusCardValue.push({
                ...res,
                text: res.value
            })
        }
        catch (error) {
            console.error('發生錯誤:', error);
        }
        finally {
            inputVisible.value = false
            inputValue.value = ''
            loading.value = false
        }
    }

    const ChangeHandler = async (value, tag) => {
        loading.value = true

        try {
            await updateGoodsSkusCardValue(tag.id, {
                goods_skus_card_id: id,
                name: item.name,
                order: tag.order,
                value: value
            })

            tag.value = value
        }
        catch (error) {
            tag.text = tag.value
            console.error("修改失敗：", error)
        }
        finally {
            loading.value = false
        }
    }

    return { item, inputValue, inputVisible, InputRef, handleClose, showInput, handleInputConfirm, loading, ChangeHandler }
}
