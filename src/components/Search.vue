<script setup>
import { ref, useSlots } from 'vue'
defineProps({
    model:Object
})
defineEmits(['search','reset'])

const showSearch = ref(false)

const slots = useSlots()
const HasShowSearch = ref(!!slots.show)
</script>

<template>
    <el-form :model="model" label-width="80px" class="search_item">
        <el-row :gutter="20" style="width: 100%; margin: 0;">
            <slot />
            <template v-if="showSearch">
                <slot name="show" />
            </template>

            <el-col :span="8" :offset="showSearch ? 0 : 8">
                <el-form-item>
                    <el-button type="primary" @click="$emit('search')">搜尋</el-button>
                    <el-button @click="$emit('reset')">重置</el-button>
                    <el-button type="primary" text @click="showSearch = !showSearch" v-if="HasShowSearch">
                        {{ showSearch ? '收起' : '展開' }}
                        <el-icon>
                            <ArrowUp v-if="showSearch" />
                            <ArrowDown v-else />
                        </el-icon>
                    </el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>