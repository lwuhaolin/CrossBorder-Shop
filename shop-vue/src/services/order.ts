import request from '@/utils/request'
import type { Order, OrderListParams, OrderStatusUpdateDTO, OrderShipDTO, RefundDTO } from '@/models/order'
import type { Result, PageResult } from '@/models/common'

// Get order list (seller view)
export async function getOrderList(params: OrderListParams): Promise<Result<PageResult<Order>>> {
  return request({
    url: '/order/seller/list',
    method: 'GET',
    params,
  })
}

// Get order detail
export async function getOrderDetail(id: number): Promise<Result<Order>> {
  return request({
    url: `/order/${id}`,
    method: 'GET',
  })
}

// Update order status (confirm order)
export async function updateOrderStatus(id: number, _data: OrderStatusUpdateDTO): Promise<Result<void>> {
  return request({
    url: `/order/${id}/confirm`,
    method: 'POST',
  })
}

// Ship order
export async function shipOrder(id: number, data: OrderShipDTO): Promise<Result<void>> {
  return request({
    url: `/order/${id}/ship`,
    method: 'POST',
    data,
  })
}

// Cancel order
export async function cancelOrder(id: number, reason?: string): Promise<Result<void>> {
  return request({
    url: `/order/${id}/cancel`,
    method: 'POST',
    params: reason ? { reason } : {},
  })
}

// Refund order
export async function refundOrder(id: number, data: RefundDTO): Promise<Result<void>> {
  return request({
    url: `/order/${id}/refund`,
    method: 'POST',
    data,
  })
}
