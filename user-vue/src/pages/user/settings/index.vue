<template>
  <div class="settings-page">
    <div class="container">
      <h1 class="title">{{ t('settings.title') }}</h1>

      <a-card :title="t('settings.profileInformation')" class="card">
        <a-form ref="formRef" :model="formData" layout="vertical" @finish="handleSubmit">
          <a-form-item
            name="nickname"
            :label="t('settings.username')"
            :rules="[{ required: true, message: t('common.required') }]"
          >
            <a-input v-model:value="formData.nickname" />
          </a-form-item>
          <a-form-item
            name="email"
            :label="t('settings.email')"
            :rules="[
              { required: true, message: t('common.required') },
              { type: 'email', message: t('common.required') },
            ]"
          >
            <a-input v-model:value="formData.email" />
          </a-form-item>
          <a-form-item name="phone" :label="t('settings.phone')">
            <a-input v-model:value="formData.phone" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" :loading="loading">
              {{ t('settings.saveChanges') }}
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>

      <a-card :title="t('settings.changePassword')" class="card">
        <a-form ref="passwordFormRef" :model="passwordFormData" layout="vertical" @finish="handlePasswordChange">
          <a-form-item
            name="currentPassword"
            :label="t('settings.currentPassword')"
            :rules="[{ required: true, message: t('common.required') }]"
          >
            <a-input-password v-model:value="passwordFormData.currentPassword" />
          </a-form-item>
          <a-form-item
            name="newPassword"
            :label="t('settings.newPassword')"
            :rules="[
              { required: true, message: t('common.required') },
              { min: 6, message: t('settings.minPasswordLength') },
            ]"
          >
            <a-input-password v-model:value="passwordFormData.newPassword" />
          </a-form-item>
          <a-form-item
            name="confirmPassword"
            :label="t('settings.confirmPassword')"
            :rules="[
              { required: true, message: t('common.required') },
              {
                validator: validatePasswordMatch,
              },
            ]"
          >
            <a-input-password v-model:value="passwordFormData.confirmPassword" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" :loading="loading">
              {{ t('settings.changePasswordBtn') }}
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '@/i18n'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { updateUser, updatePassword } from '@/services/user'
import { getUserInfo, setUserInfo } from '@/utils/request'
import type { UserUpdateDTO, PasswordChangeDTO } from '@/models/user'

const { t } = useI18n()

const formRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()
const loading = ref(false)

const formData = ref<UserUpdateDTO>({
  nickname: '',
  email: '',
  phone: '',
})

const passwordFormData = ref<PasswordChangeDTO>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

onMounted(() => {
  const user = getUserInfo()
  if (user) {
    formData.value = {
      nickname: user.name || user.username || '',  // 映射 user.name 到 nickname
      email: user.email || '',
      phone: user.phone || '',
    }
  }
})

const handleSubmit = async () => {
  try {
    loading.value = true
    await updateUser(formData.value)

    const user = getUserInfo()
    if (user) {
      const updatedUser = { ...user, ...formData.value }
      setUserInfo(updatedUser)
    }

    message.success(t('settings.updated'))
  } catch (error) {
    console.error('Failed to update profile:', error)
    message.error(t('common.error'))
  } finally {
    loading.value = false
  }
}

const validatePasswordMatch = (_: any, value: string) => {
  if (!value) {
    return Promise.reject(new Error(t('common.required')))
  }
  if (value !== passwordFormData.value.newPassword) {
    return Promise.reject(new Error(t('settings.passwordsNotMatch')))
  }
  return Promise.resolve()
}

const handlePasswordChange = async () => {
  try {
    loading.value = true
    const { currentPassword, newPassword } = passwordFormData.value
    await updatePassword({
      currentPassword,
      newPassword,
      confirmPassword: newPassword,
    })
    message.success(t('settings.passwordChanged'))
    passwordFormRef.value?.resetFields()
  } catch (error) {
    console.error('Failed to change password:', error)
    message.error(t('common.error'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.settings-page {
  min-height: calc(100vh - 64px - 200px);
  background: #f5f5f5;
  padding: 24px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 24px;
  margin: 0 0 24px 0;
}

.card {
  margin-bottom: 24px;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .title {
    font-size: 22px;
  }
}
</style>
