<template>
  <div>
    <!-- Table -->
    <a-card :bordered="false">
      <div style="margin-bottom: 16px">
        <a-button type="primary" @click="openCreateModal">
          <template #icon><PlusOutlined /></template>
          新建地址
        </a-button>
      </div>

      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        :scroll="{ x: 1400 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'receiverName'">
            <strong>{{ record.receiverName }}</strong>
          </template>
          <template v-else-if="column.key === 'region'">
            {{ record.country }} {{ record.province }} {{ record.city }} {{ record.district }}
          </template>
          <template v-else-if="column.dataIndex === 'label'">
            <a-tag v-if="record.label">{{ record.label }}</a-tag>
            <span v-else>-</span>
          </template>
          <template v-else-if="column.dataIndex === 'isDefault'">
            <template v-if="record.isDefault">
              <a-tag color="gold">⭐ 默认</a-tag>
            </template>
            <template v-else>
              <a-button type="link" size="small" @click="handleSetDefault(record.id)">
                设为默认
              </a-button>
            </template>
          </template>
          <template v-else-if="column.dataIndex === 'createdAt'">
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
      :title="isEdit ? '编辑地址' : '新建地址'"
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
        <a-form-item label="收件人" name="receiverName">
          <a-input v-model:value="formData.receiverName" placeholder="请输入收件人姓名" />
        </a-form-item>
        <a-form-item label="手机号" name="receiverPhone">
          <a-input v-model:value="formData.receiverPhone" placeholder="请输入手机号" />
        </a-form-item>
        <a-form-item label="国家" name="country">
          <a-input v-model:value="formData.country" placeholder="请输入国家" />
        </a-form-item>
        <a-form-item label="省份" name="province">
          <a-input v-model:value="formData.province" placeholder="请输入省份" />
        </a-form-item>
        <a-form-item label="城市" name="city">
          <a-input v-model:value="formData.city" placeholder="请输入城市" />
        </a-form-item>
        <a-form-item label="区/县" name="district">
          <a-input v-model:value="formData.district" placeholder="请输入区/县" />
        </a-form-item>
        <a-form-item label="详细地址" name="detailAddress">
          <a-input v-model:value="formData.detailAddress" placeholder="请输入详细地址" />
        </a-form-item>
        <a-form-item label="地址标签" name="label">
          <a-input v-model:value="formData.label" placeholder="如：家、公司、学校" />
        </a-form-item>
        <a-form-item label="设为默认地址" name="isDefault">
          <a-switch v-model:checked="formData.isDefault" />
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
  getAddressList,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '@/services/address'
import type { Address, AddressCreateDTO } from '@/models/address'
import type { FormInstance } from 'ant-design-vue'

const loading = ref(false)
const dataSource = ref<Address[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const modalVisible = ref(false)
const modalLoading = ref(false)
const isEdit = ref(false)
const currentAddress = ref<Address | null>(null)
const formRef = ref<FormInstance>()

const formData = reactive({
  receiverName: '',
  receiverPhone: '',
  country: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  label: '',
  isDefault: false,
})

const formRules = {
  receiverName: [{ required: true, message: '请输入收件人姓名', trigger: 'blur' }],
  receiverPhone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  country: [{ required: true, message: '请输入国家', trigger: 'blur' }],
  province: [{ required: true, message: '请输入省份', trigger: 'blur' }],
  city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
  district: [{ required: true, message: '请输入区/县', trigger: 'blur' }],
  detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
}

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '收件人', dataIndex: 'receiverName', width: 120 },
  { title: '手机号', dataIndex: 'receiverPhone', width: 130 },
  { title: '地区', key: 'region', width: 200 },
  { title: '详细地址', dataIndex: 'detailAddress', width: 250, ellipsis: true },
  { title: '标签', dataIndex: 'label', width: 100 },
  { title: '默认', dataIndex: 'isDefault', width: 100 },
  { title: '创建时间', dataIndex: 'createdAt', width: 180 },
  { title: '操作', key: 'action', width: 200, fixed: 'right' as const },
]

const pagination = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: total.value,
  showSizeChanger: true,
  showTotal: (t: number) => `共 ${t} 条`,
}))

const fetchData = async () => {
  loading.value = true
  try {
    const response = await getAddressList()
    const addresses = response.data || []
    total.value = addresses.length
    const start = (currentPage.value - 1) * pageSize.value
    dataSource.value = addresses.slice(start, start + pageSize.value)
  } catch {
    message.error('加载地址列表失败')
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  currentPage.value = pag.current
  pageSize.value = pag.pageSize
  fetchData()
}

const resetForm = () => {
  formData.receiverName = ''
  formData.receiverPhone = ''
  formData.country = ''
  formData.province = ''
  formData.city = ''
  formData.district = ''
  formData.detailAddress = ''
  formData.label = ''
  formData.isDefault = false
}

const openCreateModal = () => {
  isEdit.value = false
  currentAddress.value = null
  resetForm()
  modalVisible.value = true
}

const openEditModal = (record: Address) => {
  isEdit.value = true
  currentAddress.value = record
  formData.receiverName = record.receiverName
  formData.receiverPhone = record.receiverPhone
  formData.country = record.country
  formData.province = record.province
  formData.city = record.city
  formData.district = record.district
  formData.detailAddress = record.detailAddress
  formData.label = record.label || ''
  formData.isDefault = record.isDefault || false
  modalVisible.value = true
}

const handleModalOk = async () => {
  try {
    await formRef.value?.validateFields()
  } catch {
    return
  }

  modalLoading.value = true
  try {
    const submitData: AddressCreateDTO = {
      receiverName: formData.receiverName,
      receiverPhone: formData.receiverPhone,
      country: formData.country,
      province: formData.province,
      city: formData.city,
      district: formData.district,
      detailAddress: formData.detailAddress,
      label: formData.label || undefined,
      isDefault: formData.isDefault,
    }

    if (isEdit.value && currentAddress.value) {
      await updateAddress(currentAddress.value.id, { ...submitData, id: currentAddress.value.id })
      message.success('更新成功')
    } else {
      await createAddress(submitData)
      message.success('创建成功')
    }
    modalVisible.value = false
    fetchData()
  } catch {
    message.error(isEdit.value ? '更新失败' : '创建失败')
  } finally {
    modalLoading.value = false
  }
}

const handleModalCancel = () => {
  modalVisible.value = false
  currentAddress.value = null
}

const handleSetDefault = async (id: number) => {
  try {
    await setDefaultAddress(id)
    message.success('设置默认地址成功')
    fetchData()
  } catch {
    message.error('设置失败')
  }
}

const handleDelete = (record: Address) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这个地址吗？',
    okType: 'danger',
    onOk: async () => {
      try {
        await deleteAddress(record.id)
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
