<script setup>
import { initSkuTable } from '@/composables/useSku.js'

const { skuLabels, tableThs, sku_list } = initSkuTable()

</script>

<template>
    <el-form-item label="規格設置">
        <table class="table">
            <thead>
                <tr>
                    <th class="table_th" v-for="(item, index) of tableThs" :key="index" :width="item.width"
                        :rowspan="item.rowspan" :colspan="item.colspan">
                        {{ item.name }}
                    </th>
                </tr>
                <tr>
                    <th class="table_th" v-for="(item, index) of skuLabels" :key="index">
                        {{ item.name }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) of sku_list" :key="index">
                    <td class="table_td" v-for="(item, index) of item.skus" :key="index" width="100">
                        {{ item.value }}
                    </td>
                    <td class="table_td">
                        <el-input v-model="item.pprice" size="small" type="number"></el-input>
                    </td>
                    <td class="table_td">
                        <el-input v-model="item.oprice" size="small" type="number"></el-input>
                    </td>
                    <td class="table_td">
                        <el-input v-model="item.cprice" size="small" type="number"></el-input>
                    </td>
                    <td class="table_td">
                        <el-input v-model="item.stock" size="small" type="number"></el-input>
                    </td>
                    <td class="table_td">
                        <el-input v-model="item.volume" size="small" type="number"></el-input>
                    </td>
                    <td class="table_td">
                        <el-input v-model="item.weight" size="small" type="number"></el-input>
                    </td>
                    <td class="table_td">
                        <el-input v-model="item.code" size="small"></el-input>
                    </td>
                </tr>
            </tbody>
        </table>
    </el-form-item>
</template>

<style scoped>
.table,
.table_th,
.table_td {
    border: 1px solid var(--color-gray-200);
}

.table_th {
    color: var(--color-gray-950);
}

.table_td{
    text-align: center;
}
</style>