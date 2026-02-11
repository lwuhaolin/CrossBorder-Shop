<template>
  <div>
    <a-spin :spinning="loading">
      <template v-if="order">
        <a-space direction="vertical" :size="16" style="width: 100%">
          <!-- Order Info -->
          <a-card :title="`订单详情 - ${order.orderNumber || ''}`">
            <template #extra>
              <a-space>
                <a-button @click="router.push('/orders')">
                  <template #icon><ArrowLeftOutlined /></template>
                  返回列表
                </a-button>
                <a-button
                  v-if="order.orderStatus === OrderStatus.PAID"
                  type="primary"
                  @click="shipModalVisible = true"
                >
                  发货
                </a-button>
                <a-button
                  v-if="order.orderStatus === OrderStatus.SHIPPED"
                  type="primary"
                  @click="handleComplete"
                >
                  <template #icon><CheckOutlined /></template>
                  完成订单
                </a-button>
                <a-button
                  v-if="order.orderStatus === OrderStatus.PENDING || order.orderStatus === OrderStatus.PAID"
                  danger
                  @click="handleCancel"
                >
                  <template #icon><CloseOutlined /></template>
                  取消订单
                </a-button>
              </a-space>
            </template>

            <a-descriptions :column="2" bordered>
              <a-descriptions-item label="订单编号">{{ order.orderNumber }}</a-descriptions-item>
              <a-descriptions-item label="买家ID">{{ order.buyerId }}</a-descriptions-item>
              <a-descriptions-item label="卖家ID">{{ order.sellerId || '-' }}</a-descriptions-item>
              <a-descriptions-item label="订单状态">
                <a-tag :color="orderStatusMap[order.orderStatus]?.color || 'default'">
                  {{ orderStatusMap[order.orderStatus]?.text || '未知' }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="支付状态">
                <template v-if="order.paymentStatus !== undefined && order.paymentStatus !== null">
                  <a-tag :color="paymentStatusMap[order.paymentStatus]?.color || 'default'">
                    {{ paymentStatusMap[order.paymentStatus]?.text || '未知' }}
                  </a-tag>
                </template>
                <template v-else>-</template>
              </a-descriptions-item>
              <a-descriptions-item label="支付方式">{{ order.paymentMethod || '-' }}</a-descriptions-item>
              <a-descriptions-item label="物流公司">{{ order.logisticsCompany || '-' }}</a-descriptions-item>
              <a-descriptions-item label="物流单号">{{ order.trackingNo || '-' }}</a-descriptions-item>
              <a-descriptions-item label="订单金额">¥{{ (order.totalAmount || 0).toFixed(2) }}</a-descriptions-item>
              <a-descriptions-item label="商品金额">¥{{ (order.productAmount || 0).toFixed(2) }}</a-descriptions-item>
              <a-descriptions-item label="运费">¥{{ (order.freightAmount || 0).toFixed(2) }}</a-descriptions-item>
              <a-descriptions-item label="优惠金额">¥{{ (order.discountAmount || 0).toFixed(2) }}</a-descriptions-item>
              <a-descriptions-item label="原币种">{{ order.currency || '-' }}</a-descriptions-item>
              <a-descriptions-item label="目标币种">{{ order.targetCurrency || '-' }}</a-descriptions-item>
              <a-descriptions-item label="创建时间">{{ order.createTime || '-' }}</a-descriptions-item>
              <a-descriptions-item label="支付时间">{{ order.paymentTime || '-' }}</a-descriptions-item>
              <a-descriptions-item v-if="order.remark" label="备注" :span="2">
                {{ order.remark }}
              </a-descriptions-item>
            </a-descriptions>
          </a-card>

          <!-- Address -->
          <a-card v-if="order.address" title="收货地址">
            <a-descriptions :column="2" bordered>
              <a-descriptions-item label="收货人">{{ order.address.receiverName }}</a-descriptions-item>
              <a-descriptions-item label="联系电话">{{ order.address.receiverPhone }}</a-descriptions-item>
              <a-descriptions-item label="所在地区" :span="2">{{ order.address.city }}</a-descriptions-item>
              <a-descriptions-item label="详细地址" :span="2">{{ order.address.detailAddress }}</a-descriptions-item>
            </a-descriptions>
          </a-card>

          <!-- Order Items -->
          <a-card title="商品清单">
            <a-table
              :columns="itemColumns"
              :data-source="order.items || []"
              row-key="id"
              :pagination="false"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'productImage'">
                  <a-image
                    v-if="record.productImage"
                    :width="60"
                    :height="60"
                    :src="normalizeImageUrl(record.productImage)"
                    fallback="/placeholder.png"
                    :preview="false"
                    style="object-fit: cover"
                  />
                  <span v-else>-</span>
                </template>
                <template v-else-if="column.dataIndex === 'price'">
                  ¥{{ (record.price || 0).toFixed(2) }}
                </template>
                <template v-else-if="column.dataIndex === 'totalAmount'">
                  ¥{{ (record.totalAmount || 0).toFixed(2) }}
                </template>
              </template>
            </a-table>
          </a-card>

          <!-- Timeline -->
          <a-card title="订单时间线">
            <a-timeline>
              <a-timeline-item color="gray">
                订单创建 - {{ order.createTime || '-' }}
              </a-timeline-item>
              <a-timeline-item v-if="order.paymentTime" color="green">
                支付成功 - {{ order.paymentTime }}
              </a-timeline-item>
              <a-timeline-item v-if="order.shipTime" color="blue">
                订单发货 - {{ order.shipTime }}
              </a-timeline-item>
              <a-timeline-item v-if="order.completeTime" color="green">
                订单完成 - {{ order.completeTime }}
              </a-timeline-item>
              <a-timeline-item v-if="order.cancelTime" color="red">
                订单取消 - {{ order.cancelTime }}
              </a-timeline-item>
            </a-timeline>
          </a-card>
        </a-space>
      </template>

      <a-card v-else-if="!loading">
        <a-empty description="订单不存在" />
      </a-card>
    </a-spin>

    <!-- Ship Modal -->
    <ShipModal
      v-model:open="shipModalVisible"
      :order-id="orderId"
      @success="loadOrder"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { ArrowLeftOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { getOrderDetail, cancelOrder, updateOrderStatus } from '@/services/order'
import { getImageUrl } from '@/utils/request'
import { OrderStatus, PaymentStatus } from '@/models/order'
import type { Order } from '@/models/order'
import ShipModal from './components/ShipModal.vue'

const router = useRouter()
const route = useRoute()
const orderId = Number(route.params.id)

const loading = ref(true)
const order = ref<Order | null>(null)
const shipModalVisible = ref(false)

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

const itemColumns = [
  { title: '商品名称', dataIndex: 'productName' },
  { title: '商品图片', dataIndex: 'productImage', width: 80 },
  { title: '单价', dataIndex: 'price', width: 120 },
  { title: '数量', dataIndex: 'quantity', width: 80 },
  { title: '小计', dataIndex: 'totalAmount', width: 120 },
]

const normalizeImageUrl = (url?: string | null): string => {
  if (!url) return ''
  if (typeof url !== 'string') return ''
  if (url.startsWith('http')) return url
  return getImageUrl(url)
}

const loadOrder = async () => {
  if (!orderId) return
  loading.value = true
  try {
    const response = await getOrderDetail(orderId)
    order.value = response.data ?? null
  } catch {
    message.error('加载订单详情失败')
  } finally {
    loading.value = false
  }
}

const handleComplete = () => {
  Modal.confirm({
    title: '确认完成订单',
    content: '确定要完成这个订单吗？',
    onOk: async () => {
      try {
        await updateOrderStatus(orderId, { status: OrderStatus.COMPLETED })
        message.success('订单已完成')
        loadOrder()
      } catch {
        message.error('操作失败')
      }
    },
  })
}

const handleCancel = () => {
  Modal.confirm({
    title: '确认取消订单',
    content: '确定要取消这个订单吗？',
    okType: 'danger',
    onOk: async () => {
      try {
        await cancelOrder(orderId)
        message.success('订单已取消')
        loadOrder()
      } catch {
        message.error('取消订单失败')
      }
    },
  })
}

onMounted(() => {
  loadOrder()
})
</script>
