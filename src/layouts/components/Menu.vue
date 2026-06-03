<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import { useAsideStore } from '@/stores/useAsideStore'

const router = useRouter()
const route = useRoute()
const UserStore = useUserStore()
const AsideStore = useAsideStore()

//當前選中的選單
const defaultActive = ref(route.path)

//選單是否摺疊
const isCollapse = computed(() => AsideStore.asideWidth === '64px')

const asideMenus = computed(() => UserStore.menus)

const SelectHandler = (e) => {
    router.push(e)
}


</script>

<template>
    <div class="f_menu" :style="{ width: AsideStore.asideWidth }">
        <el-menu :default-active="defaultActive" :unique-opened="true" :collapse="isCollapse" default-active="2" class="menu_item" @select="SelectHandler" :collapse-transition="false">
            <template v-for="(item, index) of asideMenus" :key="index">
                <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
                    <template #title>
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <span>{{ item.name }}</span>
                    </template>
                    <el-menu-item v-for="(item2, index2) of item.child" :key="index2" :index="item2.frontpath">
                        <el-icon>
                            <component :is="item2.icon"></component>
                        </el-icon>
                        <span>{{ item2.name }}</span>
                    </el-menu-item>
                </el-sub-menu>

                <el-menu-item v-else :index="item.frontpath">
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<style scoped>
.f_menu {
    position: fixed;
    top: 64px;
    left: 0;
    bottom: 0;
    box-shadow: 1px 0px 3px rgba(0, 0, 0, 0.2);
    overflow-x: hidden;
    overflow-y: auto;
    transition: all 0.3s ease;
}

.f_menu::-webkit-scrollbar {
    width: 0px;
}

.f_menu .menu_item {
    border: none;
}
</style>