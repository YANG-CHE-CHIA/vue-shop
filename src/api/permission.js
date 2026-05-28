import router from "@/router";
import { getToken } from "@/composables/auth";
import { toast } from "@/composables/util";
import { useUserStore } from '@/stores/useUserStore'

router.beforeEach(async (to, from, next) => {

    const token = getToken()
    const userStore = useUserStore()

    //沒有登入的話,就回到登入頁面
    if (to.path !== '/login' && !token) {
        toast('請先登入', 'error')
        return next('/login')
    }

    //防止重複登入
    if (token && to.path == '/login') {
        toast('請勿重複登入', 'error')
        return next(from.path || '/')
    }

    //如果用戶登入,就自動取得用戶訊息,並存在pinia當中
    if (token && !userStore.user.id) {
        try {
            await userStore.getInfo() 
        } catch (error) {
            toast('登入狀態失效，請重新登入', 'error')
            return next('/login')
        }
    }

    next()
})