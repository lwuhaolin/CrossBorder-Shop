<template>
  <div class="register-page">
    <div class="container">
      <a-card class="card">
        <div class="header">
          <h1>{{ t('register.title') }}</h1>
          <p>{{ t('register.welcome') }}</p>
        </div>

        <a-form
          name="register"
          :model="formData"
          layout="vertical"
          size="large"
          @finish="onFinish"
        >
          <a-form-item
            name="username"
            :rules="[
              { required: true, message: t('login.usernameRequired') },
            ]"
          >
            <a-input v-model:value="formData.username" :placeholder="t('register.username')">
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
            name="email"
            :rules="[
              { required: true, message: t('register.email') },
              { type: 'email', message: 'Please enter a valid email!' },
            ]"
          >
            <a-input v-model:value="formData.email" :placeholder="t('register.email')">
              <template #prefix>
                <MailOutlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
            name="phone"
            :rules="[
              { required: true, message: 'Please input your phone number!' },
            ]"
          >
            <a-input v-model:value="formData.phone" placeholder="Phone Number">
              <template #prefix>
                <PhoneOutlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
            name="password"
            :rules="[
              { required: true, message: t('login.passwordRequired') },
              { min: 6, message: 'Password must be at least 6 characters!' },
            ]"
          >
            <a-input-password
              v-model:value="formData.password"
              :placeholder="t('register.password')"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item
            name="confirmPassword"
            :rules="[
              { required: true, message: 'Please confirm your password!' },
              {
                validator: validatePassword,
              },
            ]"
          >
            <a-input-password
              v-model:value="formData.confirmPassword"
              :placeholder="t('register.confirmPassword')"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit" block :loading="loading">
              {{ t('register.submit') }}
            </a-button>
          </a-form-item>
        </a-form>

        <div class="footer">
          <span>{{ t('register.haveAccount') }}</span>
          <a-button type="link" @click="() => router.push('/user/login')">
            {{ t('register.loginNow') }}
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
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons-vue'
import { register } from '@/services/user'
import { useI18n } from '@/i18n'

const router = useRouter()
const { t } = useI18n()
const loading = ref(false)
const formData = reactive({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
})

const validatePassword = (_: any, value: string) => {
  if (!value || formData.password === value) {
    return Promise.resolve()
  }
  return Promise.reject(new Error('Passwords do not match!'))
}

const onFinish = async () => {
  try {
    loading.value = true
    await register(formData)

    message.success(t('register.success'))
    router.push('/user/login')
  } catch (error: any) {
    message.error(error.message || t('register.error'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
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


