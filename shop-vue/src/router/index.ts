import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Layout
import AdminLayout from '@/layouts/AdminLayout.vue'

// Pages - lazy loaded
const Login = () => import('@/pages/user/login.vue')
const Dashboard = () => import('@/pages/dashboard/index.vue')
const ProductList = () => import('@/pages/products/index.vue')
const ProductCreate = () => import('@/pages/products/create.vue')
const ProductDetail = () => import('@/pages/products/detail.vue')
const ProductEdit = () => import('@/pages/products/edit.vue')
const CategoryList = () => import('@/pages/categories/index.vue')
const OrderList = () => import('@/pages/orders/index.vue')
const OrderDetail = () => import('@/pages/orders/detail.vue')
const AddressList = () => import('@/pages/addresses/index.vue')
const AdminUserList = () => import('@/pages/admin/users/index.vue')
const AdminRates = () => import('@/pages/admin/rates/index.vue')
const AdminSettings = () => import('@/pages/admin/settings/index.vue')
const UserProfile = () => import('@/pages/user/profile.vue')
const UserPassword = () => import('@/pages/user/password.vue')

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: Login,
    meta: { title: '登录' },
  },
  {
    path: '/',
    component: AdminLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        meta: { title: '仪表盘', requiresAuth: true },
      },
      // Product routes
      {
        path: 'products',
        component: ProductList,
        meta: { title: '商品管理', requiresAuth: true },
      },
      {
        path: 'products/create',
        component: ProductCreate,
        meta: { title: '发布商品', requiresAuth: true },
      },
      {
        path: 'products/:id',
        component: ProductDetail,
        meta: { title: '商品详情', requiresAuth: true },
      },
      {
        path: 'products/:id/edit',
        component: ProductEdit,
        meta: { title: '编辑商品', requiresAuth: true },
      },
      // Category routes
      {
        path: 'categories',
        component: CategoryList,
        meta: { title: '分类管理', requiresAuth: true },
      },
      // Order routes
      {
        path: 'orders',
        component: OrderList,
        meta: { title: '订单管理', requiresAuth: true },
      },
      {
        path: 'orders/:id',
        component: OrderDetail,
        meta: { title: '订单详情', requiresAuth: true },
      },
      // Address routes
      {
        path: 'addresses',
        component: AddressList,
        meta: { title: '地址管理', requiresAuth: true },
      },
      // Admin-only routes
      {
        path: 'admin/users',
        component: AdminUserList,
        meta: { title: '用户管理', requiresAuth: true, roles: ['ADMIN'] },
      },
      {
        path: 'admin/rates',
        component: AdminRates,
        meta: { title: '汇率管理', requiresAuth: true, roles: ['ADMIN'] },
      },
      {
        path: 'admin/settings',
        component: AdminSettings,
        meta: { title: '系统配置', requiresAuth: true, roles: ['ADMIN'] },
      },
      // User profile routes
      {
        path: 'user/profile',
        component: UserProfile,
        meta: { title: '个人信息', requiresAuth: true },
      },
      {
        path: 'user/password',
        component: UserPassword,
        meta: { title: '修改密码', requiresAuth: true },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard
router.beforeEach(async (to, _from, next) => {
  const token = localStorage.getItem('access_token')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // Logged-in user visiting /login -> redirect to dashboard
  if (to.path === '/login' && token) {
    next('/dashboard')
    return
  }

  // Unauthenticated user visiting protected page -> redirect to login
  if (requiresAuth && !token) {
    next('/login')
    return
  }

  // Token exists but user info not loaded -> fetch it
  if (token && requiresAuth) {
    const { useUserStore } = await import('@/stores/user')
    const userStore = useUserStore()

    if (!userStore.currentUser) {
      try {
        await userStore.fetchCurrentUser()
      } catch {
        // Token expired or invalid, redirect to login
        next('/login')
        return
      }
    }

    // Role-based access control for /admin/* routes
    const requiredRoles = to.meta.roles as string[] | undefined
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.some(role => userStore.roles.includes(role))
      if (!hasRole) {
        next('/dashboard')
        return
      }
    }
  }

  next()
})

export default router
