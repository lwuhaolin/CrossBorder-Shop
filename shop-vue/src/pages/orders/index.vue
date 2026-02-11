<template>
  <div>
    <!-- Search Form -->
    <a-card :bordered="false" style="margin-bottom: 16px">
      <a-form layout="inline" :model="searchForm" @finish="handleSearch">
        <a-form-item label="订单状态">
          <a-select
            v-model:value="searchForm.orderStatus"
            placeholder="请选择订单状态"
            allow-clear
            style="width: 180px"
          >
            <a-select-option :value="OrderStatus.PENDING">待支付</a-select-option>
            <a-select-option :value="OrderStatus.PAID">已支付</a-select-option>
            <a-select-option :value="OrderStatus.SHIPPED">已发货</a-select-option>
            <a-select-option :value="OrderStatus.COMPLETED">已完成</a-select-option>
            <a-select-option :value="OrderStatus.CANCELED">已取消</a-select-option>
            <a-select-option :value="OrderStatus.REFUNDING">退款中</a-select-option>
            <a-select-option :value="OrderStatus.REFUNDED">已退款</a-select-option>
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
    <a-card title="订单列表" :bordered="false">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="{ pageSize: 10, showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条` }"
        row-key="id"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'orderNumber'">
            <a-typography-paragraph :copyable="{ text: record.orderNumber }" style="margin: 0">
              {{ record.orderNumber }}
            </a-typography-paragraph>
          </template>
          <template v-else-if="column.dataIndex === 'totalAmount'">
            ¥{{ (record.totalAmount || 0).toFixed(2) }}
          </template>
          <template v-else-if="column.dataIndex === 'productAmount'">
            {{ record.productAmount ? `¥${record.productAmount.toFixed(2)}` : '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'freightAmount'">
            {{ record.freightAmount ? `¥${record.freightAmount.toFixed(2)}` : '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'orderStatus'">
            <a-tag :color="orderStatusMap[record.orderStatus as OrderStatus]?.color || 'default'">
              {{ orderStatusMap[record.orderStatus as OrderStatus]?.text || '未知' }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'paymentStatus'">
            <template v-if="record.paymentStatus !== undefined && record.paymentStatus !== null">
              <a-tag :color="paymentStatusMap[record.paymentStatus as PaymentStatus]?.color || 'default'">
                {{ paymentStatusMap[record.paymentStatus as PaymentStatus]?.text || '未知' }}
              </a-tag>
            </template>
            <template v-else>-</template>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-button type="link" size="small" @click="router.push(`/orders/${record.id}`)">
              <EyeOutlined /> 查看详情
            </a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { EyeOutlined } from '@ant-design/icons-vue'
import { getOrderList } from '@/services/order'
import { OrderStatus, PaymentStatus } from '@/models/order'
import type { Order } from '@/models/order'

const router = useRouter()
const loading = ref(false)
const dataSource = ref<Order[]>([])

const searchForm = reactive({
  orderStatus: undefined as OrderStatus | undefined,
})

const orderStatusMap: Record<OrderStatus, { color: string; text: string }> = {
  [OrderStatus.PENDING]: { color: 'default', text: '待支付' },
  [OrderStatus.PAID]: { color: 'processing', text: '已支付' },
  [OrderStatus.SHIPPED]: { color: 'blue', text: '已发货' },
  [OrderStatus.COMPLETED]: { color: 'success', text: '已完成' },
  [OrderStatus.CANCELED]: { color: 'error', text: '已取消' },
  [OrderStatus.REFUNDING]: { color: 'warning', text: '退款中' },
  [OrderStatus.REFUNDED]: { color: 'default', text: '已退款' },
}

const paymentStatusMap: Record<PaymentStatus, { color: string; text: string }> = {
  [PaymentStatus.UNPAID]: { color: 'default', text: '未支付' },
  [PaymentStatus.PAID]: { color: 'success', text: '已支付' },
  [PaymentStatus.REFUNDED]: { color: 'error', text: '已退款' },
}

const columns = [
  { title: '订单编号', dataIndex: 'orderNumber', width: 180 },
  { title: '买家ID', dataIndex: 'buyerId', width: 100 },
  { title: '订单金额', dataIndex: 'totalAmount', width: 120 },
  { title: '商品金额', dataIndex: 'productAmount', width: 120 },
  { title: '运费', dataIndex: 'freightAmount', width: 100 },
  { title: '订单状态', dataIndex: 'orderStatus', width: 100 },
  { title: '支付状态', dataIndex: 'paymentStatus', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
]

const fetchData = async () => {
  loading.value = true
  try {
    const response = await getOrderList({
      orderStatus: searchForm.orderStatus,
    } as any)

    // Handle both array and PageResult format
    const data = response.data
    if (Array.isArray(data)) {
      dataSource.value = data
    } else if (data && typeof data === 'object') {
      dataSource.value = (data as any).list || []
    } else {
      dataSource.value = []
    }
  } catch {
    message.error('加载订单列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  fetchData()
}

const handleReset = () => {
  searchForm.orderStatus = undefined
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>
