<template>
  <a-card v-if="!currentUser">
    <div style="text-align: center; padding: 50px">请先登录</div>
  </a-card>
  <a-card v-else title="个人信息">
    <template #extra>
      <a-button type="primary" disabled>
        <template #icon><EditOutlined /></template>
        编辑资料
      </a-button>
    </template>
    <a-descriptions :column="2" bordered>
      <a-descriptions-item label="用户ID">{{ currentUser.id }}</a-descriptions-item>
      <a-descriptions-item label="用户名">{{ currentUser.username }}</a-descriptions-item>
      <a-descriptions-item label="昵称">{{ currentUser.nickname || '-' }}</a-descriptions-item>
      <a-descriptions-item label="邮箱">{{ currentUser.email || '-' }}</a-descriptions-item>
      <a-descriptions-item label="手机号">{{ currentUser.phone || '-' }}</a-descriptions-item>
      <a-descriptions-item label="角色名称">{{ currentUser.roles?.[0]?.roleName || '-' }}</a-descriptions-item>
      <a-descriptions-item label="角色代码">{{ currentUser.roles?.[0]?.roleCode || '-' }}</a-descriptions-item>
      <a-descriptions-item label="角色描述" :span="2">{{ currentUser.roles?.[0]?.description || '-' }}</a-descriptions-item>
      <a-descriptions-item label="状态">
        <a-tag v-if="currentUser.status === 1" color="success">正常</a-tag>
        <a-tag v-else color="error">禁用</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="创建时间" :span="2">{{ currentUser.createTime || '-' }}</a-descriptions-item>
      <a-descriptions-item v-if="currentUser.lastLoginTime" label="最后登录" :span="2">
        {{ currentUser.lastLoginTime }}
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EditOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const currentUser = computed(() => userStore.currentUser)
</script>
