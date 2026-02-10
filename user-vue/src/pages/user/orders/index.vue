<template>
  <div class="order-list-page">
    <div class="container">
      <h1 class="title">{{ t('order.title') }}</h1>

      <a-card class="card">
        <a-table
          :columns="columns"
          :data-source="orders"
          :loading="loading"
          :pagination="pagination"
          row-key="id"
          @change="handleTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'createTime'">
              {{ formatDate(record.createTime) }}
            </template>
            <template v-else-if="column.key === 'totalAmount'">
              {{ record.totalAmount?.toFixed(2) || '0.00' }}
            </template>
            <template v-else-if="column.key === 'convertedAmount'">
              {{ record.convertedAmount?.toFixed(2) || '0.00' }}
            </template>
            <template v-else-if="column.key === 'orderStatus'">
              <a-tag :color="getStatusColor(record.orderStatus)">
                {{ getStatusText(record.orderStatus) }}
              </a-tag>
            </template>
            <template v-else-if="column.key === 'action'">
              <a-button type="link" @click="goToDetail(record.id)">
                <template #icon>
                  <EyeOutlined />
                </template>
                {{ t('order.viewDetails') }}
              </a-button>
            </template>
          </template>
        </a-table>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from '@/i18n'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { EyeOutlined } from '@ant-design/icons-vue'
import type { Order, OrderListParams } from '@/models/order'
import { OrderStatus } from '@/models/order'
import { getOrderList } from '@/services/order'

const { t } = useI18n()
const router = useRouter()

const orders = ref<Order[]>([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const pagination = computed(() => ({
  current: page.value,
  pageSize: pageSize.value,
  total: total.value,
  showTotal: (total: number) => `Total: ${total} items`,
}))

const columns = [
  {
    title: t('order.orderNo'),
    dataIndex: 'orderNumber',
    key: 'orderNumber',
  },
  {
    title: t('order.createdAt'),
    key: 'createTime',
  },
  {
    title: t('order.amount'),
    key: 'totalAmount',
  },
  {
    title: t('order.actualAmount'),
    key: 'convertedAmount',
  },
  {
    title: t('order.status'),
    key: 'orderStatus',
  },
  {
    title: t('common.edit'),
    key: 'action',
  },
]

const statusMap: Record<number, string> = {
  [OrderStatus.PENDING]: 'orange',
  [OrderStatus.PAID]: 'blue',
  [OrderStatus.SHIPPED]: 'cyan',
  [OrderStatus.COMPLETED]: 'green',
  [OrderStatus.CANCELED]: 'red',
  [OrderStatus.REFUNDING]: 'purple',
  [OrderStatus.REFUNDED]: 'default',
}

const statusTextMap: Record<number, string> = {
  [OrderStatus.PENDING]: t('order.pending'),
  [OrderStatus.PAID]: t('order.paid'),
  [OrderStatus.SHIPPED]: t('order.shipped'),
  [OrderStatus.COMPLETED]: t('order.completed'),
  [OrderStatus.CANCELED]: t('order.cancelled'),
  [OrderStatus.REFUNDING]: t('order.refunding'),
  [OrderStatus.REFUNDED]: t('order.refunded'),
}

onMounted(() => {
  loadOrders()
})

const loadOrders = async () => {
  try {
    loading.value = true
    const params: OrderListParams = {
      page: page.value,
      pageSize: pageSize.value,
    }
    const response = await getOrderList(params)

    // Handle different response structures
    if (response.data) {
      orders.value = response.data.list || response.data
      total.value = response.data.total || (Array.isArray(response.data) ? response.data.length : 0)
    } else {
      orders.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('Failed to load orders:', error)
    message.error(t('common.error'))
  } finally {
    loading.value = false
  }
}

const getStatusText = (status: number) => {
  return statusTextMap[status] || t('common.info')
}

const getStatusColor = (status: number) => {
  return statusMap[status] || 'default'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const handleTableChange = (pag: any) => {
  page.value = pag.current
  pageSize.value = pag.pageSize
  loadOrders()
}

const goToDetail = (orderId: number) => {
  router.push(`/user/orders/${orderId}`)
}
</script>

<style scoped>
.order-list-page {
  min-height: calc(100vh - 64px - 200px);
  background: #f5f5f5;
  padding: 24px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 24px;
}

.card {
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
