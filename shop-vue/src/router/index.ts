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
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('access_token')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
