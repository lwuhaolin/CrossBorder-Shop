<template>
  <div class="profile-page">
    <div class="container">
      <h1 class="title">{{ t('profile.myProfile') }}</h1>

      <a-card :loading="loading" class="card">
        <div class="header">
          <a-avatar size="large" :icon="UserOutlined" />
          <div class="info">
            <h2>{{ user?.username }}</h2>
            <p>{{ user?.email }}</p>
          </div>
          <a-button @click="goToSettings">
            <template #icon>
              <EditOutlined />
            </template>
            {{ t('profile.editProfile') }}
          </a-button>
        </div>

        <a-descriptions :column="1" :bordered="true" style="margin-top: 24px">
          <a-descriptions-item :label="t('profile.username')">
            {{ user?.username }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('profile.email')">
            {{ user?.email }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('profile.phone')">
            {{ user?.phone || t('common.info') }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('profile.role')">
            {{ user?.role }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('profile.memberSince')">
            {{ user?.createdAt ? formatDate(user.createdAt) : '-' }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '@/i18n'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, EditOutlined } from '@ant-design/icons-vue'
import type { User } from '@/models/user'
import { getCurrentUser } from '@/services/user'

const { t } = useI18n()
const router = useRouter()

const user = ref<User | null>(null)
const loading = ref(true)

onMounted(() => {
  loadProfile()
})

const loadProfile = async () => {
  try {
    loading.value = true
    const response = await getCurrentUser()
    user.value = response.data || null
  } catch (error) {
    console.error('Failed to load profile:', error)
    message.error(t('profile.failedToLoad'))
  } finally {
    loading.value = false
  }
}

const goToSettings = () => {
  router.push('/user/settings')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.profile-page {
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
  border-radius: 8px;
}

.header {
  display: flex;
  align-items: center;
  gap: 24px;
}

.info {
  flex: 1;
}

.info h2 {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.info p {
  color: #666;
  margin: 4px 0 0;
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .title {
    font-size: 22px;
  }

  .header {
    flex-direction: column;
    text-align: center;
  }
}
</style>
