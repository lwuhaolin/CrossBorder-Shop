<template>
  <a-card title="修改密码">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
      :style="{ maxWidth: '500px' }"
      @finish="handleSubmit"
    >
      <a-form-item label="原密码" name="oldPassword">
        <a-input-password v-model:value="formState.oldPassword" placeholder="请输入原密码" />
      </a-form-item>
      <a-form-item label="新密码" name="newPassword">
        <a-input-password v-model:value="formState.newPassword" placeholder="请输入新密码" />
      </a-form-item>
      <a-form-item label="确认新密码" name="confirmPassword">
        <a-input-password v-model:value="formState.confirmPassword" placeholder="请再次输入新密码" />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" html-type="submit" :loading="loading">确认修改</a-button>
          <a-button @click="resetForm">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import { updatePassword } from '@/services/user'
import { removeToken, removeRefreshToken, removeUserInfo } from '@/utils/request'
import type { PasswordChangeDTO } from '@/models/user'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

const formState = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const validateConfirmPassword = async (_rule: Rule, value: string) => {
  if (value && value !== formState.newPassword) {
    return Promise.reject('两次输入的新密码不一致')
  }
  return Promise.resolve()
}

const rules: Record<string, Rule[]> = {
  oldPassword: [{ required: true, message: '请输入原密码' }],
  newPassword: [
    { required: true, message: '请输入新密码' },
    { min: 6, message: '密码长度至少6位' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码' },
    { min: 6, message: '密码长度至少6位' },
    { validator: validateConfirmPassword },
  ],
}

const handleSubmit = async () => {
  if (formState.newPassword !== formState.confirmPassword) {
    message.error('两次输入的新密码不一致')
    return
  }

  loading.value = true
  try {
    const data: PasswordChangeDTO = {
      oldPassword: formState.oldPassword,
      newPassword: formState.newPassword,
    }
    await updatePassword(data)
    message.success('密码修改成功，请重新登录')

    removeToken()
    removeRefreshToken()
    removeUserInfo()

    setTimeout(() => {
      router.push('/login')
    }, 1000)
  } catch {
    message.error('密码修改失败')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  formRef.value?.resetFields()
}
</script>
