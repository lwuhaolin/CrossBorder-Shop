<template>
  <div>
    <!-- Table -->
    <a-card :bordered="false">
      <div style="margin-bottom: 16px">
        <a-button type="primary" @click="openCreateModal">
          <template #icon><PlusOutlined /></template>
          新建分类
        </a-button>
      </div>

      <a-table
        :columns="columns"
        :data-source="treeData"
        :loading="loading"
        :pagination="false"
        row-key="id"
        :scroll="{ x: 1100 }"
        :default-expand-all-rows="true"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'categoryName'">
            <strong>{{ record.categoryName }}</strong>
          </template>
          <template v-else-if="column.dataIndex === 'createTime'">
            {{ record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm') : '-' }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space size="small">
              <a-button type="link" size="small" @click="openEditModal(record)">
                <template #icon><EditOutlined /></template>
                编辑
              </a-button>
              <a-button type="link" size="small" danger @click="handleDelete(record)">
                <template #icon><DeleteOutlined /></template>
                删除
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Create/Edit Modal -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑分类' : '新建分类'"
      :confirm-loading="modalLoading"
      :destroy-on-close="true"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        layout="vertical"
      >
        <a-form-item label="分类名称" name="categoryName">
          <a-input v-model:value="formData.categoryName" placeholder="请输入分类名称" />
        </a-form-item>
        <a-form-item label="分类编码" name="categoryCode">
          <a-input
            v-model:value="formData.categoryCode"
            placeholder="请输入分类编码（英文大写，如：FLOWER）"
          />
        </a-form-item>
        <a-form-item label="父分类" name="parentId">
          <a-select
            v-model:value="formData.parentId"
            placeholder="请选择父分类，不选则为顶级分类"
            allow-clear
            :options="parentOptions"
          />
        </a-form-item>
        <a-form-item label="排序" name="sort">
          <a-input-number
            v-model:value="formData.sort"
            placeholder="数字越小越靠前"
            :min="0"
            :precision="0"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="图标" name="icon">
          <a-input v-model:value="formData.icon" placeholder="请输入图标名称或URL" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import {
  getCategoryList,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/category'
import type { Category, CategoryCreateDTO } from '@/models/category'
import type { FormInstance } from 'ant-design-vue'

const loading = ref(false)
const flatList = ref<Category[]>([])
const treeData = ref<Category[]>([])

const modalVisible = ref(false)
const modalLoading = ref(false)
const isEdit = ref(false)
const currentCategory = ref<Category | null>(null)
const formRef = ref<FormInstance>()

const formData = reactive({
  categoryName: '',
  categoryCode: '',
  parentId: undefined as number | undefined,
  sort: 1,
  icon: '',
})

const formRules = {
  categoryName: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { max: 50, message: '分类名称不能超过50个字符', trigger: 'blur' },
  ],
  categoryCode: [
    { required: true, message: '请输入分类编码', trigger: 'blur' },
    { pattern: /^[A-Z_]+$/, message: '分类编码只能包含大写字母和下划线', trigger: 'blur' },
    { max: 50, message: '分类编码不能超过50个字符', trigger: 'blur' },
  ],
}

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '分类名称', dataIndex: 'categoryName', width: 200 },
  { title: '分类编码', dataIndex: 'categoryCode', width: 150 },
  { title: '层级', dataIndex: 'level', width: 80 },
  { title: '排序', dataIndex: 'sort', width: 80 },
  { title: '图标', dataIndex: 'icon', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 150, fixed: 'right' as const },
]

const parentOptions = computed(() => {
  return flatList.value
    .filter((cat) => {
      if (isEdit.value && currentCategory.value) {
        return cat.id !== currentCategory.value.id
      }
      return true
    })
    .map((cat) => ({
      label: cat.categoryName,
      value: cat.id,
    }))
})

const buildTree = (categories: Category[], parentId?: number | null): Category[] => {
  return categories
    .filter((cat) => {
      if (parentId === undefined || parentId === null || parentId === 0) {
        return cat.parentId === 0 || cat.parentId === null || cat.parentId === undefined
      }
      return cat.parentId === parentId
    })
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
    .map((cat) => ({
      ...cat,
      children: buildTree(categories, cat.id),
    }))
}

const fetchData = async () => {
  loading.value = true
  try {
    const response = await getCategoryList()
    const categories = response.data || []
    flatList.value = categories
    treeData.value = buildTree(categories, 0)
  } catch {
    message.error('加载分类列表失败')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  formData.categoryName = ''
  formData.categoryCode = ''
  formData.parentId = undefined
  formData.sort = 1
  formData.icon = ''
}

const openCreateModal = () => {
  isEdit.value = false
  currentCategory.value = null
  resetForm()
  modalVisible.value = true
}

const openEditModal = (record: Category) => {
  isEdit.value = true
  currentCategory.value = record
  formData.categoryName = record.categoryName
  formData.categoryCode = record.categoryCode || ''
  formData.parentId = record.parentId && record.parentId !== 0 ? record.parentId : undefined
  formData.sort = record.sort ?? 1
  formData.icon = record.icon || ''
  modalVisible.value = true
}

const computeLevel = (parentId?: number): number => {
  if (!parentId) return 1
  const parent = flatList.value.find((cat) => cat.id === parentId)
  return parent ? (parent.level || 1) + 1 : 1
}

const handleModalOk = async () => {
  try {
    await formRef.value?.validateFields()
  } catch {
    return
  }

  modalLoading.value = true
  try {
    const level = computeLevel(formData.parentId)
    const submitData: CategoryCreateDTO = {
      categoryName: formData.categoryName,
      categoryCode: formData.categoryCode,
      parentId: formData.parentId || 0,
      level,
      sort: formData.sort,
      icon: formData.icon || undefined,
    }

    if (isEdit.value && currentCategory.value) {
      await updateCategory(currentCategory.value.id, { ...submitData, id: currentCategory.value.id })
      message.success('更新成功')
    } else {
      await createCategory(submitData)
      message.success('创建成功')
    }
    modalVisible.value = false
    fetchData()
  } catch (error: any) {
    const errorMsg = error?.response?.data?.message || error?.message || ''
    if (
      errorMsg.includes('Duplicate') ||
      errorMsg.includes('重复') ||
      errorMsg.includes('uk_category_code')
    ) {
      message.error('分类编码已存在，请使用其他编码')
    } else {
      message.error(errorMsg || (isEdit.value ? '更新失败' : '创建失败'))
    }
  } finally {
    modalLoading.value = false
  }
}

const handleModalCancel = () => {
  modalVisible.value = false
  currentCategory.value = null
}

const handleDelete = (record: Category) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这个分类吗？删除后，该分类下的子分类也会被删除。',
    okType: 'danger',
    onOk: async () => {
      try {
        await deleteCategory(record.id)
        message.success('删除成功')
        fetchData()
      } catch {
        message.error('删除失败')
      }
    },
  })
}

onMounted(() => {
  fetchData()
})
</script>
