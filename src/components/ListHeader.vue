<script setup>
import { computed } from 'vue'
const props = defineProps({
    layout: {
        type: String,
        default: "create,refresh"
    }
})

const btns = computed(() => props.layout.split(','))

defineEmits(['create', 'refresh', 'delete','download'])
</script>

<template>
    <div class="d-flex">
        <div>
            <el-button v-if="btns.includes('create')" type="primary" size="small"
                @click="$emit('create')">新增</el-button>
            <el-popconfirm v-if="btns.includes('delete')" title="是否要刪除" confirmButtonText="確認" cancelButtonText="取消"
                @confirm="$emit('delete')">
                <template #reference>
                    <el-button type="danger" size="small">批量刪除</el-button>
                </template>
            </el-popconfirm>
            <slot />
        </div>
        <div>
            <el-tooltip v-if="btns.includes('refresh')" effect="dark" content="刷新" placement="top">
                <el-button text @click="$emit('refresh')">
                    <el-icon :size="20">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>

            <el-tooltip v-if="btns.includes('download')" effect="dark" content="匯出" placement="top">
                <el-button text @click="$emit('download')">
                    <el-icon :size="20">
                        <Download />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>
    </div>
</template>

<style scoped></style>