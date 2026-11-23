import { createRouter, createWebHashHistory } from 'vue-router'
import Admin from '@/layouts/admin.vue'
import Login from '@/pages/Login.vue'

// 1. 基礎路由：所有人都可以直接訪問
const routes = [
  {
    path: '/',
    name: 'admin',
    component: Admin,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: "登入頁面" }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/404.vue'),
  }
]

// 2. 動態權限路由：根據後端選單動態比對加載
const asyncRoutes = [
  {
    path: '', // 巢狀預設子路由，訪問 '/' 時會渲染 Admin + Index
    name: 'HomeIndex',
    component: () => import('@/pages/Index.vue'),
    meta: { title: "後台首頁" }
  },
  {
    path: '/goods/list',
    name: 'GoodsList',
    component: () => import('@/pages/goods/list.vue'),
    meta: { title: "商品管理" }
  },
  {
    path: '/category/list',
    name: 'CategoryList',
    component: () => import('@/pages/category/list.vue'),
    meta: { title: "分類列表" }
  },
  {
    path: '/user/list',
    name: 'UserList',
    component: () => import('@/pages/user/list.vue'),
    meta: { title: "用戶列表" }
  },
  {
    path: '/order/list',
    name: 'OrderList',
    component: () => import('@/pages/order/list.vue'),
    meta: { title: "訂單列表" }
  },
  {
    path: '/comment/list',
    name: 'CommentList',
    component: () => import('@/pages/comment/list.vue'),
    meta: { title: "評價列表" }
  },
  {
    path: '/image/list',
    name: 'ImageList',
    component: () => import('@/pages/image/list.vue'),
    meta: { title: "圖庫列表" }
  },
  {
    path: '/notice/list',
    name: 'NoticeList',
    component: () => import('@/pages/notice/list.vue'),
    meta: { title: "公告列表" }
  },
  {
    path: '/setting/base',
    name: 'SettingBase',
    component: () => import('@/pages/setting/base.vue'),
    meta: { title: "配置列表" }
  },
  {
    path: '/setting/buy',
    name: 'SettingBuy',
    component: () => import('@/pages/setting/buy.vue'),
    meta: { title: "支付設置" }
  },
  {
    path: '/setting/ship',
    name: 'SettingShip',
    component: () => import('@/pages/setting/ship.vue'),
    meta: { title: "物流設置" }
  },
  {
    path: '/coupon/list',
    name: 'CouponList',
    component: () => import('@/pages/coupon/list.vue'),
    meta: { title: "優惠券列表" }
  },
  {
    path: '/manager/list',
    name: 'Manager',
    component: () => import('@/pages/manager/list.vue'),
    meta: { title: "管理員管理" }
  },
  {
    path: '/access/list',
    name: 'Access',
    component: () => import('@/pages/access/list.vue'),
    meta: { title: "菜單權限管理" }
  }
  ,
  {
    path: '/role/list',
    name: 'Role',
    component: () => import('@/pages/role/list.vue'),
    meta: { title: "角色管理" }
  }
  ,
  {
    path: '/skus/list',
    name: 'Skus',
    component: () => import('@/pages/skus/list.vue'),
    meta: { title: "規格管理" }
  }
  ,
  {
    path: '/level/list',
    name: 'Level',
    component: () => import('@/pages/level/list.vue'),
    meta: { title: "會員等級" }
  }
  ,
  {
    path: '/distribution/index',
    name: 'DistributionIndex',
    component: () => import('@/pages/distribution/index.vue'),
    meta: { title: "分銷員管理" }
  },
  {
    path: '/distribution/setting',
    name: 'DistributionSetting',
    component: () => import('@/pages/distribution/setting.vue'),
    meta: { title: "分銷設置" }
  }
]

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

// 動態添加路由的工具函式
export function addRoutes(menus) {
  let hasNewRoutes = false

  const findAndAddRoutes = (arr) => {
    arr.forEach(e => {
      // 特殊處理後台首頁的對應關係
      const targetPath = e.frontpath === '/' ? '' : e.frontpath

      // 依據 path 尋找對應的本機路由設定
      let item = asyncRoutes.find(o => o.path === targetPath)

      // 💡 安全檢查：確保找到該路由，且該路由的 name 尚未被註冊過
      if (item && !router.hasRoute(item.name)) {
        router.addRoute("admin", item)
        hasNewRoutes = true
      }

      // 遞迴處理子選單
      if (e.child && e.child.length > 0) {
        findAndAddRoutes(e.child)
      }
    })
  }

  findAndAddRoutes(menus)
  return hasNewRoutes
}