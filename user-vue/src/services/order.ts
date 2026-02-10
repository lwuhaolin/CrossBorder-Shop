import request from '@/utils/request'
import type { Order, OrderListParams, OrderStatusUpdateDTO, OrderShipDTO, RefundDTO } from '@/models/order'
import type { Result, PageResult } from '@/models/common'
import { mapOrderListToPageResult } from '@/utils/dataMapper'

// Get order list
// 注意：后端返回 List<OrderVO> 而不是分页结构，会在此处进行转换
export async function getOrderList(params: OrderListParams): Promise<Result<PageResult<Order>>> {
  // 后端只接收 orderStatus 参数，page 和 pageSize 在这里被忽略
  const backendParams: any = {}
  if (params.status !== undefined) {
    backendParams.orderStatus = params.status
  }

  const response: any = await request({
    url: '/order/buyer/list',
    method: 'GET',
    params: backendParams,
  })

  // 后端返回 List<OrderVO>，转换为 PageResult 格式
  if (Array.isArray(response.data)) {
    const pageResult = mapOrderListToPageResult(response.data)
    return {
      code: response.code,
      message: response.message,
      data: pageResult,
    } as Result<PageResult<Order>>
  }

  return response as Result<PageResult<Order>>
}

// Get order detail
export async function getOrderDetail(id: number): Promise<Result<Order>> {
  return request({
    url: `/order/${id}`,
    method: 'GET',
  })
}

// Update order status
export async function updateOrderStatus(id: number, data: OrderStatusUpdateDTO): Promise<Result<void>> {
  return request({
    url: `/order/${id}/status`,
    method: 'PUT',
    data,
  })
}

// Ship order
export async function shipOrder(id: number, data: OrderShipDTO): Promise<Result<void>> {
  return request({
    url: `/order/${id}/ship`,
    method: 'PUT',
    data,
  })
}

// Cancel order
export async function cancelOrder(id: number, reason?: string): Promise<Result<void>> {
  return request({
    url: `/order/${id}/cancel`,
    method: 'POST',
    data: { reason },
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

// Create order (user-facing)
export async function createOrder(data: any): Promise<any> {
  return request({
    url: '/order/create',
    method: 'POST',
    data,
  })
}

// Pay order
export async function payOrder(id: number): Promise<Result<void>> {
  return request({
    url: `/order/${id}/pay`,
    method: 'POST',
  })
}

// Confirm order (confirm receipt)
export async function confirmOrder(id: number): Promise<Result<void>> {
  return request({
    url: `/order/${id}/confirm`,
    method: 'POST',
  })
}
