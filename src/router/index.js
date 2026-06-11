import { createRouter, createWebHashHistory } from 'vue-router'
import Admin from '@/layouts/admin.vue'
import Index from '@/pages/Index.vue'
import Login from '@/pages/Login.vue'
import NotFound from '@/pages/404.vue'
import GoodList from '@/pages/goods/list.vue'
import CategoryList from '@/pages/category/list.vue'
import UserList from '@/pages/user/list.vue'
import OrderList from '@/pages/order/list.vue'
import CommentList from '@/pages/comment/list.vue'
import ImageList from '@/pages/image/list.vue'
import NoticeList from '@/pages/notice/list.vue'
import SettingList from '@/pages/setting/base.vue'
import CouponList from '@/pages/coupon/list.vue'


const routes =
  [
    {
      path: '/',
      name: 'admin',
      component: Admin,
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
  ]

const asyncRoutes =
  [
    {
      path: '/',
      name: '/',
      component: Index,
      meta: {
        title: "後台首頁"
      }
    },
    {
      path: '/goods/list',
      name: '/goods/list',
      component: GoodList,
      meta: {
        title: "商品管理"
      }
    },
    {
      path: '/category/list',
      name: '/category/list',
      component: CategoryList,
      meta: {
        title: "分類列表"
      }
    },
    {
      path: '/user/list',
      name: '/user/list',
      component: UserList,
      meta: {
        title: "用戶列表"
      }
    },
    {
      path: '/order/list',
      name: '/order/list',
      component: OrderList,
      meta: {
        title: "訂單列表"
      }
    },
    {
      path: '/comment/list',
      name: '/comment/list',
      component: CommentList,
      meta: {
        title: "評價列表"
      }
    },
    {
      path: '/image/list',
      name: '/image/list',
      component: ImageList,
      meta: {
        title: "圖庫列表"
      }
    },
    {
      path: '/notice/list',
      name: '/notice/list',
      component: NoticeList,
      meta: {
        title: "公告列表"
      }
    },
    {
      path: '/setting/base',
      name: '/setting/base',
      component: SettingList,
      meta: {
        title: "配置列表"
      }
    },
    {
      path: '/coupon/list',
      name: '/coupon/list',
      component: CouponList,
      meta: {
        title: "優惠券列表"
      }
    }
  ]
export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export function addRoutes(menus) {
  //是否有新路由
  let hasNewRoutes = false

  const findAndAddRoutes = (arr) => {
    arr.forEach(e => {
      e.frontpath
      let item = asyncRoutes.find(o => o.path == e.frontpath)
      if (item && !router.hasRoute(item.path)) {
        router.addRoute("admin", item)
        hasNewRoutes = true
      }
      if (e.child && e.child.length > 0) {
        findAndAddRoutes(e.child)
      }
    })
  }


  findAndAddRoutes(menus)

  return hasNewRoutes
}
