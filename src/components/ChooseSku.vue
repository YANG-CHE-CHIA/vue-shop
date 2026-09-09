<script setup>
import { reactive, ref } from 'vue'
import { getSkusList } from '@/api/skus.js'
import { useInitTable } from '@/composables/useCommon.js'

const dialogViosible = ref(false)
const activeId = ref(0)

const { loading, tableData, currentPage, total, limit, getData } = useInitTable({
    getList: getSkusList,
    onGetListSuccess: (res) => {
        tableData.value = res.list
        total.value = res.totalCount

        if(tableData.value.length > 0){
            ChangeActiveIdHandler(tableData.value[0].id)
        }
    }
})

const callbackFunction = ref(null)
const open = (callback = null) => {
    callbackFunction.value = callback
    getData(1)
    dialogViosible.value = true
}

const list = ref([])
const form = reactive({
    name:'',
    list: []
})

const SubmitHandler = () => {
    if(typeof callbackFunction.value === 'function'){
        callbackFunction.value(form)
    }
    dialogViosible.value = false
}

function ChangeActiveIdHandler (id) {
    activeId.value = id
    list.value = []
    let item = tableData.value.find(o => o.id == id)
    if (item) {
        list.value = item.default.split(",")
        form.name = item.name
    }
}

defineExpose({
    open
})

</script>

<template>
    <el-dialog title="規格選擇" v-model="dialogViosible" width="80%" top="5vh">

        <el-container style="height: 65vh;">
            <el-aside class="image-aside">
                <div class="top">
                    <div class="sku_list" :class="{ 'active': (activeId == item.id) }" v-for="(item, index) of tableData"
                        :key="index" @click="ChangeActiveIdHandler(item.id)">
                        {{ item.name }}
                    </div>
                </div>
                <div class="bottom">
                    <el-pagination background layout="prev, next" :total="total" :current-page="currentPage"
                        :page-size="limit" @current-change="getData" />
                </div>
            </el-aside>
            <el-main>
                <el-checkbox-group v-model="form.list">
                    <el-checkbox v-for="item of list" :key="item" :value="item" border>
                        {{ item }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-main>
        </el-container>

        <template #footer>
            <span>
                <el-button @click="dialogViosible = false">取消</el-button>
                <el-button type="primary" @click="SubmitHandler">確定</el-button>
            </span>
        </template>
    </el-dialog>

</template>

<style scoped>
.image-aside {
    width: 220px;
    position: relative;
    border-right: 1px solid #eeeeee;
}

.image-aside .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
}

.image-aside .bottom {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.sku_list {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px 10px;
    font-size: var(--text-sm);
    color: var(--color-gray-600);
    border-bottom: 1px solid #f4f4f4;
}

.sku_list:hover,
.sku_list.active {
    background: var(--color-blue-50);
}
</style>