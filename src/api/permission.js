import { router, addRoutes } from "@/router";
import { getToken } from "@/composables/auth";
import { toast, showFullLoading, hideFullLoading } from "@/composables/util";
import { useUserStore } from '@/stores/useUserStore'

router.beforeEach(async (to, from) => {

    //顯示loading
    showFullLoading()

    const token = getToken()
    const userStore = useUserStore()

    //沒有登入的話,就回到登入頁面
    if (to.path !== '/login' && !token) {
        toast('請先登入', 'error')
        hideFullLoading()
        return '/login'
    }

    //防止重複登入
    if (token && to.path == '/login') {
        toast('請勿重複登入', 'error')
        hideFullLoading()
        return from.path || '/'
    }

    //如果用戶登入,就自動取得用戶訊息,並存在pinia當中
    let hasNewRoutes = false
    if (token && !userStore.user.id) {
        try {
            let res = await userStore.getInfo() 
            //動態添加路由
            hasNewRoutes = addRoutes(res.menus)

        } catch (error) {
            toast('登入狀態失效，請重新登入', 'error')
            return '/login'
        }
    }

    //設定頁面標題
    const title = (to.meta.title ? to.meta.title : "") 
    document.title = title

    return hasNewRoutes ? to.fullPath : true
})


router.afterEach((to, from) => hideFullLoading())