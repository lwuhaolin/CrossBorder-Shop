<template>
  <div class="login-page">
    <div class="container">
      <a-card class="card">
        <div class="header">
          <h1>{{ t('login.title') }}</h1>
          <p>{{ t('login.welcome') }}</p>
        </div>

        <a-form
          name="login"
          :model="formData"
          layout="vertical"
          size="large"
          @finish="onFinish"
        >
          <a-form-item
            name="username"
            :rules="[
              { required: true, message: t('login.usernameRequired') },
              { type: 'string', message: t('login.usernameInvalid') },
            ]"
          >
            <a-input v-model:value="formData.username" :placeholder="t('login.username')">
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
            name="password"
            :rules="[{ required: true, message: t('login.passwordRequired') }]"
          >
            <a-input-password
              v-model:value="formData.password"
              :placeholder="t('login.password')"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit" block :loading="loading">
              {{ t('login.submit') }}
            </a-button>
          </a-form-item>
        </a-form>

        <div class="footer">
          <span>{{ t('login.noAccount') }}</span>
          <a-button type="link" @click="() => router.push('/user/register')">
            {{ t('login.registerNow') }}
          </a-button>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { login } from '@/services/user'
import { setToken, setRefreshToken, setUserInfo } from '@/utils/request'
import { useI18n } from '@/i18n'

const router = useRouter()
const { t } = useI18n()
const loading = ref(false)
const formData = reactive({
  username: '',
  password: '',
})

const onFinish = async () => {
  try {
    loading.value = true

    const response = await login(formData)

    if (response?.data) {
      setToken(response.data.accessToken)
      setRefreshToken(response.data.refreshToken)
      setUserInfo(response.data.userInfo || response.data.user)

      message.success(t('login.success'))
      // Use window.location.href instead of router to ensure a fresh page load
      // This helps avoid token-related race conditions
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    }
  } catch (error: any) {
    message.error(error.message || t('login.error'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 64px - 200px);
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.container {
  width: 100%;
  max-width: 400px;
}

.card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.header h1 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
  margin-top: 0;
}

.header p {
  color: #666;
  margin: 0;
}

.footer {
  text-align: center;
  margin-top: 16px;
}

.footer span {
  margin-right: 8px;
}
</style>


