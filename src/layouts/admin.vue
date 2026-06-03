<script setup>
    import Header from './components/Header.vue'
    import Menu from './components/Menu.vue'
    import TagList from './components/TagList.vue'
    import { useAsideStore } from '@/stores/useAsideStore'

    const AsideStore = useAsideStore()

</script>>

<template>
    <el-container>
        <el-header>
            <Header/>
        </el-header>
        <el-container>
            <el-aside :width="AsideStore.asideWidth">
                <Menu/>
            </el-aside>
            <el-main>
                <TagList/>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<style scoped>
    .el-aside{
        transition: all 0.3s ease;
    }
</style>