import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, getUserInfo } from '@/api/manager'
import { setToken, removeToken } from '@/composables/auth'

export const useUserStore = defineStore('user', () => {

    const user = ref({})

    //取得當前用戶訊息
    const getInfo = async () => {
        try {
            const res = await getUserInfo()
            user.value = res
            return res
        } catch (error) {
            throw error
        }
    }

    //登入
    const loginInfo = async (username, password) => {
        try {
            const res = await login(username, password)

            //把token存到cookie中
            setToken(res.token)

            return res

        } catch (error) {
            throw error
        }
    }

    //登出
    const logoutInfo = async () => {
        try {
            //移除Token
            removeToken()

            //清除當前用戶狀態的Pinia
            user.value = {}

        } catch (error) {
            throw error
        }
    }

    return { user, getInfo, loginInfo, logoutInfo }
})