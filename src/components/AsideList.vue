<script setup>
defineProps({
    active:{
        type:Boolean,
        default:false
    }
})

defineEmits(["edit","delete"])
</script>

<template>
    <div class="aside-list" :class="{ 'active' : active }">
        <span class="text">
            <slot></slot>
        </span>
        <div class="btn_item">
            <el-button text type="primary" size="small" class="btn" @click.stop="$emit('edit')">
                <el-icon :size="12">
                    <Edit />
                </el-icon>
            </el-button>

            <el-popconfirm title="是否要刪除" confirmButtonText="確認" cancelButtonText="取消" @confirm="$emit('delete')">
                <template #reference>
                    <el-button text type="primary" size="small" class="btn">
                        <el-icon :size="12">
                            <Close />
                        </el-icon>
                    </el-button>
                </template>
            </el-popconfirm>
        </div>
    </div>
</template>

<style scoped>
.aside-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f4f4f4;
    padding: 10px;
    cursor: pointer;
    transition: background 0.8s ease;
}

.aside-list:hover,
.aside-list.active {
    background: #e2ecf5;
}

.aside-list .text {
    font-size: 16px;
    color: #000000;
}

.aside-list .btn {
    padding: 1px;
}
</style>