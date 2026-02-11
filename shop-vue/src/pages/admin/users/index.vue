<template>
  <div>
    <!-- Search Form -->
    <a-card :bordered="false" style="margin-bottom: 16px">
      <a-form layout="inline" :model="searchForm" @finish="handleSearch">
        <a-form-item label="用户名">
          <a-input
            v-model:value="searchForm.keyword"
            placeholder="请输入用户名"
            allow-clear
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            v-model:value="searchForm.status"
            placeholder="请选择状态"
            allow-clear
            style="width: 150px"
          >
            <a-select-option :value="0">禁用</a-select-option>
            <a-select-option :value="1">启用</a-select-option>
            <a-select-option :value="2">锁定</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit">搜索</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- Table -->
    <a-card :bordered="false">
      <div style="margin-bottom: 16px">
        <a-button type="primary" @click="handleAddUser">
          <template #icon><PlusOutlined /></template>
          新增用户
        </a-button>
      </div>

      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        :scroll="{ x: 1500 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'username'">
            <strong>{{ record.username }}</strong>
          </template>
          <template v-else-if="column.key === 'roles'">
            <span v-for="role in (record.roles || [])" :key="role.id">
              {{ role.roleName }}
            </span>
            <span v-if="!record.roles || record.roles.length === 0">-</span>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <a-tag :color="statusMap[record.status as number]?.color || 'default'">
              {{ statusMap[record.status as number]?.text || '未知' }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'lastLoginTime'">
            {{ record.lastLoginTime ? dayjs(record.lastLoginTime).format('YYYY-MM-DD HH:mm') : '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'createTime'">
            {{ record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm') : '-' }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space size="small">
              <a-button type="link" size="small" @click="openEditModal(record)">
                编辑
              </a-button>
              <a-button
                v-if="record.status === 1"
                type="link"
                size="small"
                danger
                @click="handleToggleStatus(record, 0)"
              >
                禁用
              </a-button>
              <a-button
                v-else
                type="link"
                size="small"
                @click="handleToggleStatus(record, 1)"
              >
                启用
              </a-button>
              <a-button type="link" size="small" danger @click="handleDelete(record)">
                删除
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Edit Modal -->
    <a-modal
      v-model:open="editModalVisible"
      title="编辑用户"
      :confirm-loading="editLoading"
      :width="500"
      @ok="handleEditOk"
      @cancel="handleEditCancel"
    >
      <a-form
        ref="editFormRef"
        :model="editFormData"
        :rules="editFormRules"
        layout="vertical"
      >
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="editFormData.username" disabled placeholder="用户名不可修改" />
        </a-form-item>
        <a-form-item label="昵称" name="nickname">
          <a-input v-model:value="editFormData.nickname" placeholder="请输入昵称" />
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="editFormData.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item label="电话" name="phone">
          <a-input v-model:value="editFormData.phone" placeholder="请输入电话号码" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import {
  listUsers,
  adminUpdateUser,
  adminDeleteUser,
  adminToggleUserStatus,
} from '@/services/user'
import type { User } from '@/models/user'
import type { FormInstance } from 'ant-design-vue'

const loading = ref(false)
const dataSource = ref<User[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

const searchForm = reactive({
  keyword: undefined as string | undefined,
  status: undefined as number | undefined,
})

const statusMap: Record<number, { color: string; text: string }> = {
  0: { color: 'red', text: '禁用' },
  1: { color: 'green', text: '启用' },
  2: { color: 'orange', text: '锁定' },
}

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '用户名', dataIndex: 'username', width: 120 },
  { title: '昵称', dataIndex: 'nickname', width: 120 },
  { title: '邮箱', dataIndex: 'email', width: 180 },
  { title: '手机号', dataIndex: 'phone', width: 130 },
  { title: '角色', key: 'roles', width: 100 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '最后登录', dataIndex: 'lastLoginTime', width: 180 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 200, fixed: 'right' as const },
]

const pagination = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: total.value,
  showSizeChanger: true,
  showTotal: (t: number) => `共 ${t} 条`,
}))

// Edit modal
const editModalVisible = ref(false)
const editLoading = ref(false)
const editingUser = ref<User | null>(null)
const editFormRef = ref<FormInstance>()

const editFormData = reactive({
  username: '',
  nickname: '',
  email: '',
  phone: '',
})

const editFormRules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [{ type: 'email' as const, message: '邮箱格式不正确', trigger: 'blur' }],
}

const fetchData = async () => {
  loading.value = true
  try {
    const response = await listUsers({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchForm.keyword,
      status: searchForm.status,
    })
    const data = response.data
    dataSource.value = data?.list || []
    total.value = data?.total || 0
  } catch {
    message.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

const handleReset = () => {
  searchForm.keyword = undefined
  searchForm.status = undefined
  currentPage.value = 1
  fetchData()
}

const handleTableChange = (pag: any) => {
  currentPage.value = pag.current
  pageSize.value = pag.pageSize
  fetchData()
}

const handleAddUser = () => {
  message.info('新增用户功能待实现')
}

const openEditModal = (record: User) => {
  editingUser.value = record
  editFormData.username = record.username
  editFormData.nickname = record.nickname || ''
  editFormData.email = record.email || ''
  editFormData.phone = record.phone || ''
  editModalVisible.value = true
}

const handleEditOk = async () => {
  try {
    await editFormRef.value?.validateFields()
  } catch {
    return
  }

  editLoading.value = true
  try {
    if (editingUser.value?.id) {
      await adminUpdateUser(editingUser.value.id, {
        nickname: editFormData.nickname,
        email: editFormData.email,
        phone: editFormData.phone,
      })
      message.success('用户信息已更新')
      editModalVisible.value = false
      fetchData()
    }
  } catch {
    message.error('更新失败')
  } finally {
    editLoading.value = false
  }
}

const handleEditCancel = () => {
  editModalVisible.value = false
  editingUser.value = null
}

const handleToggleStatus = (record: User, targetStatus: number) => {
  const action = targetStatus === 0 ? '禁用' : '启用'
  Modal.confirm({
    title: `${action}用户`,
    content: `确定要${action}用户 ${record.username} 吗？`,
    okButtonProps: targetStatus === 0 ? { danger: true } : {},
    onOk: async () => {
      try {
        await adminToggleUserStatus(record.id!, targetStatus)
        message.success(`用户已${action}`)
        fetchData()
      } catch {
        message.error('操作失败')
      }
    },
  })
}

const handleDelete = (record: User) => {
  Modal.confirm({
    title: '删除用户',
    content: `确定要删除用户 ${record.username} 吗？此操作不可恢复。`,
    okType: 'danger',
    okButtonProps: { danger: true },
    onOk: async () => {
      try {
        await adminDeleteUser(record.id!)
        message.success('用户已删除')
        fetchData()
      } catch {
        message.error('操作失败')
      }
    },
  })
}

onMounted(() => {
  fetchData()
})
</script>
