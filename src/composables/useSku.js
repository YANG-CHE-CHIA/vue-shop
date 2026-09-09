import { ref, nextTick, computed } from 'vue'
import { createGoodsSkusCard, updateGoodsSkusCard, deleteGoodsSkusCard, sortGoodsSkusCard, createGoodsSkusCardValue, updateGoodsSkusCardValue, deleteGoodsSkusCardValue, chooseAndSetGoodsSkusCard } from '@/api/goods.js'
import { useArrayMoveUp, useArrayMoveDown, cartesianProductOf } from '@/composables/util.js'

//當前商品的ID
export const goodsId = ref(0)

//規格選項列表
export const sku_card_list = ref([])

export const sku_list = ref([])

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
    sku_list.value = skuList.goodsSkus
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

        getTableData()
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
        getTableData()
    }
    catch (error) {
        console.error("失敗：", error)
    }
    finally {
        bodyLoading.value = false
    }
}

//選擇設置規格
export async function ChooseSetGoodsSkusCardHandler(id, data) {
    let item = sku_card_list.value.find(o => o.id == id)
    try {
        item.loading = true
        const res = await chooseAndSetGoodsSkusCard(id, data)
        item.name = item.text = res.goods_skus_card.name
        item.goodsSkusCardValue = res.goods_skus_card_value.map(o => {
            o.text = o.value || '屬性值'
            return o
        })
        getTableData()
    }
    catch (error) {
        console.error("失敗：", error)
    }
    finally {
        item.loading = false
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
            let i = item.goodsSkusCardValue.findIndex(o => o.id === tag.id)
            if (i != -1) {
                item.goodsSkusCardValue.splice(i, 1)
            }
            getTableData()
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

            getTableData()
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
                "goods_skus_card_id": id,
                "name": item.name,
                "order": tag.order,
                "value": value
            })

            tag.value = value
            getTableData()
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

//初始畫表格
export function initSkuTable() {
    const skuLabels = computed(() => {
        return sku_card_list.value.filter(v => v.goodsSkusCardValue.length > 0)
    })

    //獲取表頭
    const tableThs = computed(() => {
        let length = skuLabels.value.length
        return [
            {
                name: '商品規格',
                colspan: length,
                rowspan: length > 0 ? 1 : 2,
                width: ''
            },
            {
                name: '銷售價格',
                width: '100',
                rowspan: 2
            },
            {
                name: '市場價格',
                width: '100',
                rowspan: 2
            },
            {
                name: '成本價格',
                width: '100',
                rowspan: 2
            },
            {
                name: '庫存',
                width: '100',
                rowspan: 2
            },
            {
                name: '體積',
                width: '100',
                rowspan: 2
            },
            {
                name: '重量',
                width: '100',
                rowspan: 2
            },
            {
                name: '編碼',
                width: '100',
                rowspan: 2
            }
        ]
    })
    return { skuLabels, tableThs, sku_list }
}

//獲取規格表格數據
function getTableData() {
    setTimeout(() => {
        if (sku_card_list.value.length === 0) return []

        let list = []
        sku_card_list.value.forEach(o => {
            if (o.goodsSkusCardValue && o.goodsSkusCardValue.length > 0) {
                list.push(o.goodsSkusCardValue)
            }

            if (list.length == 0) {
                return []
            }

            let array = cartesianProductOf(...list)

            //讀取之前的規格列表,將規格ID排序之後轉化成字符串
            let beforeSkuList = JSON.parse(JSON.stringify(sku_list.value)).map(o=>{
                if(!Array.isArray(o.skus)){
                    o.skus = Object.keys(o.skus).map(k=>o.skus[k])
                }
                o.skusId = o.skus.sort((a,b)=>a.id - b.id).map(s=>s.id).join(",")
                return o
            })

            sku_list.value = []
            sku_list.value = array.map(skus => {
                let o = getBeforeSkuItem(JSON.parse(JSON.stringify(skus)),beforeSkuList)
                return {
                    code: o?.code || "",
                    cprice: o?.cprice || "0.00",
                    goods_id: goodsId.value,
                    image: o?.image || "",
                    oprice:o?.oprice || "0.00",
                    pprice:o?.pprice || "0.00",
                    skus,
                    stock: o?.stock || 0, 
                    volume:o?.volume || 0,
                    weight: o?.weight || 0,
                }
            }) 
        })
    },200)

    function getBeforeSkuItem(skus,beforeSkuList){
        let skusId = skus.sort((a,b)=>a.id - b.id).map(s=>s.id).join(",")
        return beforeSkuList.find(o=>{
            if(skus.length > o.skus.length){
                return skusId.indexOf(o.skusId) != -1
            }

            return o.skusId.indexOf(skusId) != -1
        })
    }
}
