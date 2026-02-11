<template>
  <a-config-provider :theme="themeConfig">
    <a-layout class="admin-layout">
      <a-layout-sider
        v-model:collapsed="collapsed"
        collapsible
        :width="220"
        :collapsed-width="80"
        class="sider"
      >
        <div class="logo">
          <span v-if="!collapsed" class="logo-text">跨境商品订货系统</span>
          <span v-else class="logo-text-collapsed">订</span>
        </div>
        <a-menu
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
          theme="dark"
          mode="inline"
          @click="onMenuClick"
        >
          <template v-for="item in menuItems" :key="item.path">
            <a-sub-menu v-if="item.children" :key="item.path">
              <template #icon>
                <component :is="item.icon" />
              </template>
              <template #title>{{ item.label }}</template>
              <a-menu-item v-for="child in item.children" :key="child.path">
                {{ child.label }}
              </a-menu-item>
            </a-sub-menu>
            <a-menu-item v-else :key="item.path">
              <template #icon>
                <component :is="item.icon" />
              </template>
              <span>{{ item.label }}</span>
            </a-menu-item>
          </template>
        </a-menu>
      </a-layout-sider>

      <a-layout>
        <a-layout-header class="header">
          <div class="header-left">
            <menu-unfold-outlined
              v-if="collapsed"
              class="trigger"
              @click="collapsed = false"
            />
            <menu-fold-outlined
              v-else
              class="trigger"
              @click="collapsed = true"
            />
          </div>
          <div class="header-right">
            <a-dropdown>
              <span class="user-info">
                <a-avatar
                  :size="32"
                  :src="currentUser?.avatar"
                  :style="!currentUser?.avatar ? { backgroundColor: '#78AA64' } : {}"
                >
                  {{ currentUser?.nickname?.charAt(0) || currentUser?.username?.charAt(0)?.toUpperCase() }}
                </a-avatar>
                <span class="username">{{ currentUser?.nickname || currentUser?.username }}</span>
              </span>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="profile" @click="router.push('/user/profile')">
                    个人信息
                  </a-menu-item>
                  <a-menu-item key="password" @click="router.push('/user/password')">
                    修改密码
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="logout" @click="handleLogout">
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </a-layout-header>

        <a-layout-content class="content">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, watch, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  EnvironmentOutlined,
  UserOutlined,
  LinkOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const collapsed = ref(false)
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

const currentUser = computed(() => userStore.currentUser)
const isAdmin = computed(() => userStore.isAdmin)

const themeConfig = {
  token: {
    colorPrimary: '#78AA64',
    borderRadius: 8,
  },
}

interface MenuItem {
  path: string
  label: string
  icon?: any
  children?: MenuItem[]
}

const adminMenuItems: MenuItem[] = [
  { path: '/dashboard', label: '仪表盘', icon: h(DashboardOutlined) },
  { path: '/admin/users', label: '用户管理', icon: h(UserOutlined) },
  { path: '/products', label: '商品管理', icon: h(ShoppingOutlined) },
  { path: '/admin/rates', label: '汇率管理', icon: h(LinkOutlined) },
  { path: '/admin/settings', label: '系统配置', icon: h(SettingOutlined) },
  {
    path: '/user',
    label: '个人中心',
    icon: h(UserOutlined),
    children: [
      { path: '/user/profile', label: '个人信息' },
      { path: '/user/password', label: '修改密码' },
    ],
  },
]

const sellerMenuItems: MenuItem[] = [
  { path: '/dashboard', label: '仪表盘', icon: h(DashboardOutlined) },
  { path: '/products', label: '商品管理', icon: h(ShoppingOutlined) },
  { path: '/categories', label: '分类管理', icon: h(AppstoreOutlined) },
  { path: '/orders', label: '订单管理', icon: h(ShoppingCartOutlined) },
  { path: '/addresses', label: '地址管理', icon: h(EnvironmentOutlined) },
  {
    path: '/user',
    label: '个人中心',
    icon: h(UserOutlined),
    children: [
      { path: '/user/profile', label: '个人信息' },
      { path: '/user/password', label: '修改密码' },
    ],
  },
]

const menuItems = computed(() => isAdmin.value ? adminMenuItems : sellerMenuItems)

// Sync route to selected menu key
watch(
  () => route.path,
  (path) => {
    selectedKeys.value = [path]
    // Auto-open parent menu for sub-routes
    const parentItem = menuItems.value.find(
      item => item.children?.some(child => child.path === path)
    )
    if (parentItem && !openKeys.value.includes(parentItem.path)) {
      openKeys.value = [...openKeys.value, parentItem.path]
    }
  },
  { immediate: true }
)

const onMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}

const handleLogout = async () => {
  await userStore.logout()
  message.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

.sider {
  background: linear-gradient(to bottom, rgba(120, 170, 100, 0.9), rgba(120, 170, 100, 1.0)) !important;
}

.sider :deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
}

.sider :deep(.ant-menu) {
  background: transparent;
}

.sider :deep(.ant-layout-sider-trigger) {
  background: rgba(0, 0, 0, 0.15);
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  overflow: hidden;
}

.logo-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.logo-text-collapsed {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
}

.header {
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  height: 64px;
  line-height: 64px;
}

.header-left {
  display: flex;
  align-items: center;
}

.trigger {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
  padding: 0 12px;
}

.trigger:hover {
  color: #78AA64;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  font-size: 14px;
  color: #333;
}

.content {
  margin: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  min-height: 280px;
}
</style>
