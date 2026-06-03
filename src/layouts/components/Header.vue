<script setup>
import { useFullscreen } from '@vueuse/core'
import FormDrawer from '@/components/FormDrawer.vue'
import { useRepassword, useLogout } from '@/composables/useManager'
import { useUserStore } from '@/stores/useUserStore'
import { useAsideStore } from '@/stores/useAsideStore'

const { isFullscreen, toggle } = useFullscreen()
const { formDrawerRef, formData, formRef, rules, SubmitHandler, openRepasswordFrom } = useRepassword()
const { logoutHandler } = useLogout()

const userStore = useUserStore()
const AsideStore = useAsideStore()


const CommandHandler = (c) => {
    switch (c) {
        case "logout":
            logoutHandler()
            break;
        case "rePassword":
            openRepasswordFrom()
            break;

        default:
            break;
    }
}

//頁面刷新
const RefreshHandler = () => {
    location.reload()
}

</script>>

<template>
    <div class="f-header bg-indigo-700">
        <div class="left_item">
            <div class="logo_item">
                <el-icon class="logo">
                    <ElemeFilled />
                </el-icon>
                <span class="logo_text">
                    後台管理
                </span>
            </div>
            <div class="icon_item">
                <el-icon class="icon" @click="AsideStore.AsideWidthHandler">
                    <Fold v-if="AsideStore.asideWidth === '250px'" />
                    <Expand v-else />
                </el-icon>
                <el-tooltip effect="dark" content="刷新" placement="bottom">
                    <el-icon class="icon" @click="RefreshHandler">
                        <Refresh />
                    </el-icon>
                </el-tooltip>
            </div>
        </div>
        <div class="right_item">
            <el-tooltip effect="dark" content="全屏" placement="bottom">
                <el-icon class="icon" @click="toggle">
                    <FullScreen v-if="!isFullscreen" />
                    <Aim v-else />
                </el-icon>
            </el-tooltip>
            <el-dropdown class="dropdown" @command="CommandHandler">
                <span class="el-dropdown-link d-flex">
                    <el-avatar :size="25" :src="userStore.user.avatar" />
                    <span class="name">
                        {{ userStore.user.username }}
                    </span>
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="rePassword">修改密碼</el-dropdown-item>
                        <el-dropdown-item command="logout">登出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>

    <form-drawer ref="formDrawerRef" title="修改密碼" destroyOnClose @submitHandler="SubmitHandler">
        <el-form ref="formRef" :rules="rules" :model="formData" label-width="80px">
            <el-form-item prop="oldpassword" label="舊密碼">
                <el-input v-model="formData.oldpassword" placeholder="請輸入舊密碼"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="新密碼">
                <el-input v-model="formData.password" placeholder="請輸入新密碼" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item prop="repassword" label="確認密碼">
                <el-input v-model="formData.repassword" placeholder="請確認新密碼" type="password" show-password></el-input>
            </el-form-item>
        </el-form>
    </form-drawer>
</template>

<style scoped>
.f-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ffffff;
    height: 64px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 0 15px;
}

.left_item {
    display: flex;
    align-items: center;
}

.left_item .logo_item {
    display: flex;
    align-items: center;
}

.left_item .logo_item .logo {
    font-size: 40px;
}

.left_item .logo_item .logo_text {
    font-size: 18px;
    margin-left: 10px;
}

.left_item .icon_item {
    display: flex;
    align-items: center;
    margin-left: 50px;
}

.left_item .icon_item .icon,
.right_item .icon {
    width: 42px;
    height: 64px;
    font-size: 22px;
    margin: 0 10px;
    cursor: pointer;
    transition: all 0.8s ease;
}

.left_item .icon_item .icon:hover,
.right_item .icon:hover {
    background-color: rgba(255, 255, 255, 0.1);
    ;
}

.right_item {
    display: flex;
    align-items: center;
}

.right_item .dropdown {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    height: 64px;
    margin: 0 10px;
}

.right_item .dropdown .d-flex {
    display: flex;
    align-items: center;
    flex-direction: row;
    color: #ffffff;
}

.right_item .dropdown .name {
    margin-left: 8px;
    font-size: 15px;
}
</style>