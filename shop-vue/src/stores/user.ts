import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, logout as logoutApi, getCurrentUser } from '@/services/user'
import {
  setToken, setRefreshToken, setUserInfo,
  removeToken, removeRefreshToken, removeUserInfo,
  getUserInfo,
} from '@/utils/request'
import type { User, LoginDTO } from '@/models/user'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(getUserInfo())
  const loading = ref(false)

  const isLoggedIn = computed(() => !!currentUser.value)

  const roles = computed(() => {
    return (currentUser.value?.roles || []).map(r => r.roleCode)
  })

  const isAdmin = computed(() => roles.value.includes('ADMIN'))
  const isSeller = computed(() => roles.value.includes('SELLER'))

  const login = async (data: LoginDTO) => {
    loading.value = true
    try {
      const response = await loginApi(data)
      if (response?.data) {
        setToken(response.data.accessToken)
        setRefreshToken(response.data.refreshToken)
        setUserInfo(response.data.userInfo)
        currentUser.value = response.data.userInfo
        return response
      }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await logoutApi()
    } catch {
      // ignore logout errors
    } finally {
      removeToken()
      removeRefreshToken()
      removeUserInfo()
      currentUser.value = null
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const response = await getCurrentUser()
      if (response.data) {
        currentUser.value = response.data
        setUserInfo(response.data)
      }
    } catch {
      // ignore
    }
  }

  return {
    currentUser,
    loading,
    isLoggedIn,
    roles,
    isAdmin,
    isSeller,
    login,
    logout,
    fetchCurrentUser,
  }
})
