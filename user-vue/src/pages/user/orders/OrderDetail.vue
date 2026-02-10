<template>
  <div class="order-detail-page">
    <div v-if="loading" class="loading">
      <a-spin size="large" />
    </div>
    <div v-else-if="!order" class="empty">
      <a-empty :description="t('order.notFound')" />
    </div>
    <div v-else class="container">
      <h1 class="title">{{ t('order.orderInformation') }}</h1>

      <a-card class="card">
        <a-descriptions title="" :column="2" :bordered="true">
          <a-descriptions-item :label="t('order.orderId')">
            #{{ order.orderNumber || order.id }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('order.status')">
            <a-tag :color="getStatusColor(order.orderStatus)">
              {{ getStatusText(order.orderStatus) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item :label="t('order.createdAt')">
            {{ formatDate(order.createTime) }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('order.total')">
            ${{ order.totalAmount.toFixed(2) }}
          </a-descriptions-item>
        </a-descriptions>

        <div v-if="order.orderStatus !== OrderStatus.CANCELED" class="steps">
          <a-steps :current="getStatusStep(order.orderStatus)">
            <a-step :title="t('order.pending')" :description="t('common.info')" />
            <a-step :title="t('order.paid')" :description="t('common.info')" />
            <a-step :title="t('order.shipped')" :description="t('common.info')" />
            <a-step :title="t('order.delivered')" :description="t('common.info')" />
          </a-steps>
        </div>

        <div class="section">
          <h3>{{ t('order.orderItems') }}</h3>
          <a-table
            :columns="columns"
            :data-source="order.items"
            :pagination="false"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'price'">
                ${{ record.price.toFixed(2) }}
              </template>
              <template v-else-if="column.key === 'subtotal'">
                ${{ record.totalPrice.toFixed(2) }}
              </template>
            </template>
          </a-table>
        </div>

        <div v-if="order.address" class="section">
          <h3>{{ t('order.shippingAddress') }}</h3>
          <p>
            {{ order.address.receiverName }} - {{ order.address.receiverPhone }}
            <br />
            {{ order.address.detailAddress }}
            <br />
            {{ order.address.city }}, {{ order.address.province }} {{ order.address.district }}
          </p>
        </div>

        <div v-if="getActionButtons().length > 0" class="actions">
          <a-space>
            <template v-for="btn in getActionButtons()" :key="btn.key">
              <a-button
                :type="btn.type"
                :danger="btn.danger"
                :loading="actionLoading"
                @click="btn.onClick"
              >
                {{ btn.label }}
              </a-button>
            </template>
          </a-space>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '@/i18n'
import { useRoute } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import type { Order } from '@/models/order'
import { OrderStatus } from '@/models/order'
import {
  getOrderDetail,
  payOrder,
  cancelOrder,
  confirmOrder,
} from '@/services/order'
import { clearCart } from '@/services/cart'

const { t } = useI18n()
const route = useRoute()

const order = ref<Order | null>(null)
const loading = ref(true)
const actionLoading = ref(false)

const columns = [
  {
    title: t('order.product'),
    dataIndex: 'productName',
    key: 'productName',
  },
  {
    title: t('product.price'),
    key: 'price',
  },
  {
    title: t('product.quantity'),
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: t('order.subtotal'),
    key: 'subtotal',
  },
]

const statusColorMap: Record<number, string> = {
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

const statusStepMap: Record<number, number> = {
  [OrderStatus.PENDING]: 0,
  [OrderStatus.PAID]: 1,
  [OrderStatus.SHIPPED]: 2,
  [OrderStatus.COMPLETED]: 3,
  [OrderStatus.CANCELED]: -1,
  [OrderStatus.REFUNDING]: -1,
  [OrderStatus.REFUNDED]: -1,
}

onMounted(() => {
  const id = route.params.id as string
  if (id) {
    loadOrder(Number(id))
  }
})

const loadOrder = async (id: number) => {
  try {
    loading.value = true
    const response = await getOrderDetail(id)
    order.value = response.data || null
  } catch (error) {
    console.error('Failed to load order:', error)
    message.error(t('common.error'))
  } finally {
    loading.value = false
  }
}

const getStatusStep = (status: number) => {
  return statusStepMap[status] ?? 0
}

const getStatusText = (status: number) => {
  return statusTextMap[status] || t('common.info')
}

const getStatusColor = (status: number) => {
  return statusColorMap[status] || 'default'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const handlePayOrder = () => {
  if (!order.value) return
  Modal.confirm({
    title: t('order.confirmPay'),
    content: t('order.paymentConfirm'),
    okText: t('common.confirm'),
    cancelText: t('common.cancel'),
    onOk: async () => {
      try {
        actionLoading.value = true
        await payOrder(order.value!.id)

        // Clear cart after payment
        localStorage.setItem('cart', JSON.stringify([]))
        window.dispatchEvent(new Event('storage'))

        // Call backend API to clear cart
        try {
          await clearCart()
        } catch (error) {
          console.warn('Failed to clear cart on backend:', error)
        }

        message.success(t('order.paymentSuccess'))
        const id = route.params.id as string
        if (id) {
          await loadOrder(Number(id))
        }
      } catch (error) {
        console.error('Payment failed:', error)
        message.error(t('order.paymentFailed'))
      } finally {
        actionLoading.value = false
      }
    },
  })
}

const handleCancelOrder = () => {
  if (!order.value) return
  Modal.confirm({
    title: t('order.confirmCancel'),
    content: t('order.cancelConfirm'),
    okText: t('common.confirm'),
    cancelText: t('common.cancel'),
    okButtonProps: { danger: true },
    onOk: async () => {
      try {
        actionLoading.value = true
        await cancelOrder(order.value!.id)
        message.success(t('order.cancelSuccess'))
        const id = route.params.id as string
        if (id) {
          await loadOrder(Number(id))
        }
      } catch (error) {
        console.error('Cancel failed:', error)
        message.error(t('order.cancelFailed'))
      } finally {
        actionLoading.value = false
      }
    },
  })
}

const handleConfirmOrder = () => {
  if (!order.value) return
  Modal.confirm({
    title: t('order.confirmReceipt'),
    content: t('order.receiptConfirm'),
    okText: t('common.confirm'),
    cancelText: t('common.cancel'),
    onOk: async () => {
      try {
        actionLoading.value = true
        await confirmOrder(order.value!.id)
        message.success(t('order.confirmSuccess'))
        const id = route.params.id as string
        if (id) {
          await loadOrder(Number(id))
        }
      } catch (error) {
        console.error('Confirm failed:', error)
        message.error(t('order.confirmFailed'))
      } finally {
        actionLoading.value = false
      }
    },
  })
}

const getActionButtons = () => {
  if (!order.value) return []

  const buttons: Array<any> = []

  // Pending status: show pay and cancel buttons
  if (order.value.orderStatus === OrderStatus.PENDING) {
    buttons.push({
      key: 'pay',
      type: 'primary',
      label: t('order.pay'),
      onClick: handlePayOrder,
    })
    buttons.push({
      key: 'cancel',
      danger: true,
      label: t('order.cancel'),
      onClick: handleCancelOrder,
    })
  }

  // Shipped status: show confirm receipt button
  if (order.value.orderStatus === OrderStatus.SHIPPED) {
    buttons.push({
      key: 'confirm',
      type: 'primary',
      label: t('order.confirmReceipt'),
      onClick: handleConfirmOrder,
    })
  }

  return buttons
}
</script>

<style scoped>
.order-detail-page {
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
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.steps {
  margin: 24px 0;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 4px;
}

.section {
  margin-top: 24px;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
}

.section h3 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
}

.section p {
  color: #666;
  line-height: 1.8;
  margin: 0;
}

.actions {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-start;
  gap: 12px;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px - 200px);
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px - 200px);
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .title {
    font-size: 22px;
    margin-bottom: 16px;
  }

  .actions {
    flex-direction: column;
  }

  .actions :deep(.ant-space) {
    width: 100%;
  }

  .actions :deep(.ant-button) {
    width: 100%;
  }

  .section {
    margin-top: 16px;
    padding: 12px 0;
  }

  .section h3 {
    font-size: 14px;
  }
}
</style>
