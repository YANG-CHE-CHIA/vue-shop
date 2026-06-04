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
                <router-view v-slot="{ Component }">
                    <transition name="fade">
                        <keep-alive :max="10">
                            <component :is="Component" />
                        </keep-alive>
                    </transition>
                </router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<style scoped>
    .el-aside{
        transition: all 0.3s ease;
    }

    .fade-enter-from,
    .fade-leave-to{
        opacity: 0;
    }

    .fade-enter-to,
    .fade-leave-from{
        opacity: 1;
    }

    .fade-enter-active,
    .fade-leave-active{
        transition: all 0.3s ease;
    }

    .fade-enter-active{
        transition-delay: 0.3s;
    }
</style>