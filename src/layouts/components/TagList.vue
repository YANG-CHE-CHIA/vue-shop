<script setup>
import { useAsideStore } from '@/stores/useAsideStore'
import { useTabList } from '@/composables/useTabList'

const AsideStore = useAsideStore()

const { activeTab, tabList, changeTabHandler, removeTab, CloseHandler } = useTabList()

</script>

<template>
    <div class="tag-list" :style="{ left: AsideStore.asideWidth }">
        <el-tabs v-model="activeTab" type="card" class="tabs_item" @tab-remove="removeTab" @tab-change="changeTabHandler">
            <el-tab-pane :closable="item.path != '/'" v-for="item of tabList" :key="item.path" :label="item.title" :name="item.path"></el-tab-pane>
        </el-tabs>

        <span class="tag-btn">
            <el-dropdown @command="CloseHandler">
                <span class="el-dropdown-link">
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="clearOther">關閉其他</el-dropdown-item>
                        <el-dropdown-item command="clearAll">全部關閉</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
    </div>
</template>

<style scoped>
.tag-list {
    display: flex;
    align-items: center;
    position: fixed;
    top: 64px;
    right: 0;
    height: 44px;
    z-index: 100;
    background: #dddddd;
    padding: 0 10px;
}

.tag-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    width: 32px;
    height: 32px;
    border-radius: 5px;
    margin-left: auto;
}

.tabs_item {
    min-width: 100px;
}

:deep(.el-tabs__header) {
    margin-bottom: 0;
}

:deep(.el-tabs--card>.el-tabs__header .el-tabs__nav),
:deep(.el-tabs__item),
:deep(.el-tabs__header) {
    border: none !important;
}

:deep(.el-tabs__item) {
    background: #ffffff;
    margin: 0 5px;
    height: 32px;
    line-height: 32px;
    border-radius: 5px;
}

:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
    height: 32px;
    line-height: 32px;
}

:deep(.is-disabled) {
    cursor: not-allowed;
}
</style>