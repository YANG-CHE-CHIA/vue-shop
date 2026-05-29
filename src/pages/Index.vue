<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import { toast, showModal } from '@/composables/util'

const userStore = useUserStore()
const router = useRouter()

const logoutHandler = async () => {
  try {
    await showModal('是否要登出', 'warning', '')
    
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
