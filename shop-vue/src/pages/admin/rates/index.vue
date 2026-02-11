<template>
  <div>
    <!-- Search Form -->
    <a-card :bordered="false" style="margin-bottom: 16px">
      <a-form layout="inline" :model="searchForm" @finish="handleSearch">
        <a-form-item label="源币种">
          <a-select
            v-model:value="searchForm.fromCurrency"
            placeholder="请选择源币种"
            allow-clear
            style="width: 200px"
            :options="currencyOptions"
          />
        </a-form-item>
        <a-form-item label="目标币种">
          <a-select
            v-model:value="searchForm.toCurrency"
            placeholder="请选择目标币种"
            allow-clear
            style="width: 200px"
            :options="currencyOptions"
          />
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
        <a-button type="primary" @click="openAddModal">
          <template #icon><PlusOutlined /></template>
          新增汇率
        </a-button>
      </div>

      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        :scroll="{ x: 900 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'fromCurrency'">
            <strong>{{ record.fromCurrency }}</strong>
          </template>
          <template v-else-if="column.dataIndex === 'toCurrency'">
            <strong>{{ record.toCurrency }}</strong>
          </template>
          <template v-else-if="column.dataIndex === 'rate'">
            {{ Number(record.rate).toFixed(4) }}
          </template>
          <template v-else-if="column.dataIndex === 'createTime'">
            {{ record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm') : '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'updateTime'">
            {{ record.updateTime ? dayjs(record.updateTime).format('YYYY-MM-DD HH:mm') : '-' }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space size="small">
              <a-button type="link" size="small" @click="openEditModal(record)">
                编辑
              </a-button>
              <a-button type="link" size="small" danger @click="handleDelete(record)">
                删除
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Add Modal -->
    <a-modal
      v-model:open="addModalVisible"
      title="新增汇率"
      ok-text="保存"
      cancel-text="取消"
      :confirm-loading="addLoading"
      @ok="handleAddOk"
      @cancel="handleAddCancel"
    >
      <a-form
        ref="addFormRef"
        :model="addFormData"
        :rules="addFormRules"
        layout="vertical"
      >
        <a-form-item label="源币种" name="fromCurrency">
          <a-select
            v-model:value="addFormData.fromCurrency"
            placeholder="选择源币种"
            :options="currencyOptions"
          />
        </a-form-item>
        <a-form-item label="目标币种" name="toCurrency">
          <a-select
            v-model:value="addFormData.toCurrency"
            placeholder="选择目标币种"
            :options="currencyOptions"
          />
        </a-form-item>
        <a-form-item label="汇率" name="rate">
          <a-input-number
            v-model:value="addFormData.rate"
            placeholder="输入汇率"
            :min="0"
            :step="0.0001"
            :precision="4"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Edit Modal -->
    <a-modal
      v-model:open="editModalVisible"
      title="编辑汇率"
      ok-text="保存"
      cancel-text="取消"
      :confirm-loading="editLoading"
      @ok="handleEditOk"
      @cancel="handleEditCancel"
    >
      <a-form
        ref="editFormRef"
        :model="editFormData"
        :rules="editFormRules"
        layout="vertical"
      >
        <a-form-item label="源币种" name="fromCurrency">
          <a-select
            v-model:value="editFormData.fromCurrency"
            disabled
            :options="currencyOptions"
          />
        </a-form-item>
        <a-form-item label="目标币种" name="toCurrency">
          <a-select
            v-model:value="editFormData.toCurrency"
            disabled
            :options="currencyOptions"
          />
        </a-form-item>
        <a-form-item label="汇率" name="rate">
          <a-input-number
            v-model:value="editFormData.rate"
            :min="0"
            :step="0.0001"
            :precision="4"
            style="width: 100%"
          />
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
  getCurrencies,
  getExchangeRates,
  createExchangeRate,
  updateExchangeRate,
  deleteExchangeRate,
} from '@/services/rate'
import type { ExchangeRate, Currency } from '@/models/rate'
import type { FormInstance } from 'ant-design-vue'

const loading = ref(false)
const dataSource = ref<ExchangeRate[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const currencies = ref<Currency[]>([])

const searchForm = reactive({
  fromCurrency: undefined as string | undefined,
  toCurrency: undefined as string | undefined,
})

const currencyOptions = computed(() =>
  currencies.value.map((c) => ({
    label: `${c.currencyCode} - ${c.currencyName}`,
    value: c.currencyCode,
  }))
)

const columns = [
  { title: '源币种', dataIndex: 'fromCurrency', width: 120 },
  { title: '目标币种', dataIndex: 'toCurrency', width: 120 },
  { title: '汇率', dataIndex: 'rate', width: 120 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '更新时间', dataIndex: 'updateTime', width: 180 },
  { title: '操作', key: 'action', width: 180, fixed: 'right' as const },
]

const pagination = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: total.value,
  showSizeChanger: true,
  showTotal: (t: number) => `共 ${t} 条`,
}))

// Add modal
const addModalVisible = ref(false)
const addLoading = ref(false)
const addFormRef = ref<FormInstance>()
const addFormData = reactive({
  fromCurrency: undefined as string | undefined,
  toCurrency: undefined as string | undefined,
  rate: undefined as number | undefined,
})
const addFormRules = {
  fromCurrency: [{ required: true, message: '请选择源币种', trigger: 'change' }],
  toCurrency: [{ required: true, message: '请选择目标币种', trigger: 'change' }],
  rate: [{ required: true, message: '请输入汇率', trigger: 'blur' }],
}

// Edit modal
const editModalVisible = ref(false)
const editLoading = ref(false)
const editFormRef = ref<FormInstance>()
const editingRate = ref<ExchangeRate | null>(null)
const editFormData = reactive({
  fromCurrency: undefined as string | undefined,
  toCurrency: undefined as string | undefined,
  rate: undefined as number | undefined,
})
const editFormRules = {
  rate: [{ required: true, message: '请输入汇率', trigger: 'blur' }],
}

const loadCurrencies = async () => {
  try {
    const response = await getCurrencies()
    currencies.value = response.data || []
  } catch {
    console.error('Failed to load currencies')
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const response = await getExchangeRates({
      page: currentPage.value,
      pageSize: pageSize.value,
      fromCurrency: searchForm.fromCurrency,
      toCurrency: searchForm.toCurrency,
    })
    const data = response.data
    dataSource.value = data?.list || []
    total.value = data?.total || 0
  } catch {
    message.error('加载汇率列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

const handleReset = () => {
  searchForm.fromCurrency = undefined
  searchForm.toCurrency = undefined
  currentPage.value = 1
  fetchData()
}

const handleTableChange = (pag: any) => {
  currentPage.value = pag.current
  pageSize.value = pag.pageSize
  fetchData()
}

// Add handlers
const openAddModal = () => {
  addFormData.fromCurrency = undefined
  addFormData.toCurrency = undefined
  addFormData.rate = undefined
  addModalVisible.value = true
}

const handleAddOk = async () => {
  try {
    await addFormRef.value?.validateFields()
  } catch {
    return
  }

  addLoading.value = true
  try {
    await createExchangeRate({
      fromCurrency: addFormData.fromCurrency!,
      toCurrency: addFormData.toCurrency!,
      rate: addFormData.rate!,
    })
    message.success('汇率已添加')
    addModalVisible.value = false
    fetchData()
  } catch {
    message.error('保存失败')
  } finally {
    addLoading.value = false
  }
}

const handleAddCancel = () => {
  addModalVisible.value = false
}

// Edit handlers
const openEditModal = (record: ExchangeRate) => {
  editingRate.value = record
  editFormData.fromCurrency = record.fromCurrency
  editFormData.toCurrency = record.toCurrency
  editFormData.rate = record.rate
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
    if (editingRate.value?.id) {
      await updateExchangeRate(editingRate.value.id, {
        fromCurrency: editFormData.fromCurrency!,
        toCurrency: editFormData.toCurrency!,
        rate: editFormData.rate!,
      })
      message.success('汇率已更新')
      editModalVisible.value = false
      fetchData()
    }
  } catch {
    message.error('保存失败')
  } finally {
    editLoading.value = false
  }
}

const handleEditCancel = () => {
  editModalVisible.value = false
  editingRate.value = null
}

const handleDelete = (record: ExchangeRate) => {
  Modal.confirm({
    title: '删除汇率',
    content: `确定要删除汇率 ${record.fromCurrency}/${record.toCurrency} 吗？`,
    okType: 'danger',
    okButtonProps: { danger: true },
    onOk: async () => {
      try {
        await deleteExchangeRate(record.id!)
        message.success('汇率已删除')
        fetchData()
      } catch {
        message.error('操作失败')
      }
    },
  })
}

onMounted(() => {
  loadCurrencies()
  fetchData()
})
</script>
