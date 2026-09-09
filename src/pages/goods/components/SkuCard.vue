<script setup>
import { ref } from 'vue'
import SkuCardItem from './SkuCardItem.vue'
import { sku_card_list, btnLoading, addSkuCardEvent, UpdateHandler, DeleteHandler, bodyLoading, sortCard, ChooseSetGoodsSkusCardHandler } from '@/composables/useSku.js'
import ChooseSku from '@/components/ChooseSku.vue'

const ChooseSkuRef = ref(null)

const ChooseSkuHandler = (item) =>{
    ChooseSkuRef.value.open((v)=>{
        ChooseSetGoodsSkusCardHandler(item.id,{
            name:v.name,
            value:v.list
        })
    })
}
</script>

<template>
    <el-form-item label="規格選項" v-loading="bodyLoading">
        <el-card shadow="never" class="card_item" v-for="(item,index) of sku_card_list" :key="item.id" v-loading="item.loading">
            <template #header>
                <div class="title_item">
                    <el-input v-model="item.text" placeholder="規格名稱" style="width: 200px;"
                        @change="UpdateHandler(item)">
                        <template #append>
                            <el-icon class="cursor-pointer" @click="ChooseSkuHandler(item)">
                                <more />
                            </el-icon>
                        </template>
                    </el-input>
                    <div class="btn_item">
                        <el-button size="small" @click="sortCard('up',index)" :disabled="index == 0">
                            <el-icon>
                                <Top />
                            </el-icon>
                        </el-button>
                        <el-button size="small" @click="sortCard('down',index)" :disabled="index === (sku_card_list.length - 1)">
                            <el-icon>
                                <Bottom />
                            </el-icon>
                        </el-button>
                        <el-popconfirm title="是否要刪除" confirmButtonText="確認" cancelButtonText="取消"
                            @confirm="DeleteHandler(item)">
                            <template #reference>
                                <el-button size="small">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                </el-button>
                            </template>
                        </el-popconfirm>

                    </div>
                </div>
            </template>
            <SkuCardItem :skuCardId="item.id" />
        </el-card>
        <el-button type="success" size="small" :loading="btnLoading" @click="addSkuCardEvent">新增規格</el-button>
    </el-form-item>

    <ChooseSku ref="ChooseSkuRef" />
</template>

<style scoped>
.title_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card_item {
    width: 100%;
    margin-bottom: 20px;
}

.el-card__header {
    padding: 15px;
    background: var(--color-gray-100);
}
</style>