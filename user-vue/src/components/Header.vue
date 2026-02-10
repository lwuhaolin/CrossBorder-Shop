<template>
  <a-layout-header class="header">
    <div class="container">
      <!-- Logo -->
      <div class="logo" @click="handleLogoClick">
        CrossBorder Shop
      </div>

      <!-- Search Bar -->
      <div class="search">
        <a-input-search
          :placeholder="t('product.search')"
          allow-clear
          size="large"
          @search="handleSearch"
        >
          <template #enterButton>
            <SearchOutlined />
          </template>
        </a-input-search>
      </div>

      <!-- Desktop Actions -->
      <div class="actions">
        <a-space size="large">
          <LanguageSwitcher />
          <a-badge :count="cartCount" :show-zero="true">
            <ShoppingCartOutlined class="icon" @click="handleGoToCart" />
          </a-badge>
          <a-dropdown>
            <template #overlay>
              <a-menu :items="userMenuItems" @click="handleUserMenuClick" />
            </template>
            <UserOutlined class="icon" />
          </a-dropdown>
        </a-space>
      </div>

      <!-- Mobile Menu -->
      <div class="mobileMenu">
        <a-space size="middle">
          <LanguageSwitcher />
          <a-badge :count="cartCount" :show-zero="true">
            <ShoppingCartOutlined class="icon" @click="handleGoToCart" />
          </a-badge>
          <a-dropdown>
            <template #overlay>
              <a-menu :items="userMenuItems" @click="handleUserMenuClick" />
            </template>
            <MenuOutlined class="icon" />
          </a-dropdown>
        </a-space>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  MenuOutlined,
} from '@ant-design/icons-vue'
import { getToken, removeToken, removeRefreshToken, removeUserInfo } from '@/utils/request'
import { useI18n } from '@/i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import type { MenuProps } from 'ant-design-vue'

const router = useRouter()
const { t } = useI18n()
const cartCount = ref(0)
const isLoggedIn = ref(false)

onMounted(() => {
  // Check if user is logged in
  const token = getToken()
  isLoggedIn.value = !!token

  // Get cart count from localStorage
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  cartCount.value = cart.length

  // Listen for cart updates
  const handleCartUpdate = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cartCount.value = cart.length
  }

  window.addEventListener('storage', handleCartUpdate)

  // Cleanup on unmount
  return () => {
    window.removeEventListener('storage', handleCartUpdate)
  }
})

const handleSearch = (value: string) => {
  if (value.trim()) {
    router.push(`/products?search=${encodeURIComponent(value)}`)
  }
}

const handleLogoClick = () => {
  router.push('/')
}

const handleGoToCart = () => {
  router.push('/cart')
}

const handleLogout = () => {
  removeToken()
  removeRefreshToken()
  removeUserInfo()
  isLoggedIn.value = false
  router.push('/')
}

const handleUserMenuClick = (e: any) => {
  const { key } = e
  switch (key) {
    case 'profile':
      router.push('/user/profile')
      break
    case 'orders':
      router.push('/user/orders')
      break
    case 'addresses':
      router.push('/user/addresses')
      break
    case 'favorites':
      router.push('/user/favorites')
      break
    case 'settings':
      router.push('/user/settings')
      break
    case 'logout':
      handleLogout()
      break
    case 'login':
      router.push('/user/login')
      break
    case 'register':
      router.push('/user/register')
      break
  }
}

const userMenuItems = computed<MenuProps['items']>(() => {
  if (isLoggedIn.value) {
    return [
      {
        key: 'profile',
        label: t('nav.profile'),
      },
      {
        key: 'orders',
        label: t('nav.orders'),
      },
      {
        key: 'addresses',
        label: t('nav.addresses'),
      },
      {
        key: 'favorites',
        label: t('nav.favorites'),
      },
      {
        key: 'settings',
        label: t('nav.settings'),
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        label: t('nav.logout'),
      },
    ]
  } else {
    return [
      {
        key: 'login',
        label: t('nav.login'),
      },
      {
        key: 'register',
        label: t('nav.register'),
      },
    ]
  }
})
</script>

<style scoped>
.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 999;
  line-height: 64px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
  cursor: pointer;
  white-space: nowrap;
}

.search {
  flex: 1;
  max-width: 600px;
  margin: 0 40px;
  display: flex;
  justify-content: center;
}

.actions {
  display: flex;
  align-items: center;
}

.icon {
  font-size: 24px;
  cursor: pointer;
  color: #333;
  transition: color 0.3s;
}

.icon:hover {
  color: #1890ff;
}

.mobileMenu {
  display: none;
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .logo {
    font-size: 18px;
  }

  .search {
    display: none;
  }

  .actions {
    display: none;
  }

  .mobileMenu {
    display: flex;
  }

  .icon {
    font-size: 20px;
  }
}
</style>
