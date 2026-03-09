import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Layout
import MainLayout from '../layouts/MainLayout.vue'

// Pages
import Home from '../pages/index.vue'
import ProductList from '../pages/products/index.vue'
import ProductDetail from '../pages/products/ProductDetail.vue'
import Cart from '../pages/cart/index.vue'
import Checkout from '../pages/checkout/index.vue'
import Login from '../pages/user/login.vue'
import Register from '../pages/user/register.vue'
import Profile from '../pages/user/profile.vue'
import OrderList from '../pages/user/orders/index.vue'
import OrderDetail from '../pages/user/orders/OrderDetail.vue'
import Addresses from '../pages/user/addresses/index.vue'
import Favorites from '../pages/user/favorites/index.vue'
import Settings from '../pages/user/settings/index.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        component: Home,
        meta: { title: 'Home' }
      },
      {
        path: 'products',
        component: ProductList,
        meta: { title: 'Products' }
      },
      {
        path: 'products/:id',
        component: ProductDetail,
        meta: { title: 'Product Detail' }
      },
      {
        path: 'cart',
        component: Cart,
        meta: { title: 'Shopping Cart' }
      },
      {
        path: 'checkout',
        component: Checkout,
        meta: { title: 'Checkout' }
      },
      {
        path: 'user/profile',
        component: Profile,
        meta: { title: 'Profile', requiresAuth: true }
      },
      {
        path: 'user/orders',
        component: OrderList,
        meta: { title: 'My Orders', requiresAuth: true }
      },
      {
        path: 'user/orders/:id',
        component: OrderDetail,
        meta: { title: 'Order Detail', requiresAuth: true }
      },
      {
        path: 'user/addresses',
        component: Addresses,
        meta: { title: 'Addresses', requiresAuth: true }
      },
      {
        path: 'user/favorites',
        component: Favorites,
        meta: { title: 'Favorites', requiresAuth: true }
      },
      {
        path: 'user/settings',
        component: Settings,
        meta: { title: 'Settings', requiresAuth: true }
      }
    ]
  },
  {
    path: '/user/login',
    component: Login,
    meta: { title: 'Login' }
  },
  {
    path: '/user/register',
    component: Register,
    meta: { title: 'Register' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !token) {
    next('/user/login')
  } else if ((to.path === '/user/login' || to.path === '/user/register') && token) {
    next('/')
  } else {
    next()
  }
})

export default router
