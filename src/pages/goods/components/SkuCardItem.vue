<script setup>
import { initSkuCardItem } from '@/composables/useSku.js'

const props = defineProps({
    skuCardId: [Number, String]
})

const { item, inputValue, inputVisible, InputRef, handleClose, showInput, handleInputConfirm, loading, ChangeHandler } = initSkuCardItem(props.skuCardId)

</script>

<template>
    <div v-loading="loading">
        <el-tag v-for="(tag,index) in item.goodsSkusCardValue" :key="index" closable :disable-transitions="false" @close="handleClose(tag)" effect="plain">
            <el-input class="value_input" v-model="tag.text" placeholder="選項值" size="small" @change="ChangeHandler($event,tag)"></el-input>
        </el-tag>
        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="w-20" size="small"
            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
        <el-button v-else class="button-new-tag" size="small" @click="showInput">
            + 添加選項
        </el-button>
    </div>
</template>

<style scoped>
.el-tag.is-closable{
    margin-right: 10px;
    width: 12%;
    padding-left: 0;
}

.value_input{
    margin-left: -1px;
}

</style>