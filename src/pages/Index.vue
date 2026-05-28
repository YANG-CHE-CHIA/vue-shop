<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import { toast, showModal } from '@/composables/util'

const userStore = useUserStore()
const router = useRouter()

const logoutHandler = async () => {
  try {
    // 1. 這裡會卡住，等待使用者操作
    // 如果點「確定」：Promise 成功 (resolve)，程式繼續往下走第 2 步
    await showModal('是否要登出', 'warning', '')
    
    // 2. 執行登出
    await userStore.logoutInfo()

  } catch (error) {
    return 
  }

  router.push('/login')
  toast('帳號已登出', 'success')
}
</script>

<template>
    <div>後台首頁</div>
    {{ userStore.user.username }}
    <el-button @click="logoutHandler">登出</el-button>
</template>

<style></style>
