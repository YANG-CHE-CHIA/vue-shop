import { createRouter, createWebHashHistory } from 'vue-router'
import Admin from '@/layouts/admin.vue'
import Index from '@/pages/index.vue'
import Login from '@/pages/Login.vue'
import NotFound from '@/pages/404.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Admin,
      //子路由
      children:[{
        path: '/',
        component: Index,
        meta: {
          title: "後台首頁"
        }
      }]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: "登入頁面"
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    }
  ],
})

export default router
