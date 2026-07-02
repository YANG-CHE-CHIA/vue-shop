<script setup>
import { ref } from 'vue'
import * as iconList from '@element-plus/icons-vue'

const icons = ref(Object.keys(iconList))
const emit = defineEmits(['update:modelValue'])

const ChangeHandler = (icon) => {
    emit("update:modelValue", icon)
}

defineProps({
    modelValue: String
})
</script>

<template>
    <div class="d-info">
        <el-icon :size="20" v-if="modelValue" class="left_icon">
            <component :is="modelValue" />
        </el-icon>
        <el-select filterable :modelValue="modelValue" placeholder="請選擇圖標" style="width: 240px" @change="ChangeHandler">
            <el-option v-for="item of icons" :key="item" :label="item" :value="item">
                <div class="d-flex">
                    <el-icon>
                        <component :is="item" />
                    </el-icon>
                    <span>{{ item }}</span>
                </div>
            </el-option>
        </el-select>
    </div>
</template>

<style scoped>
.d-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.d-info{
    display: flex;
    align-items: center;
}

.d-info .left_icon{
    margin-right: 10px;
}
</style>