import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/pages/index.vue'
import Login from '@/pages/Login.vue'
import NotFound from '@/pages/404.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'ndex',
      component: Index,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    }
  ],
})

export default router
