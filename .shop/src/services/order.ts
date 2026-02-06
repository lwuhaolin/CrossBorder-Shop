import request from '@/utils/request';
import type { Order, OrderListParams, OrderListResponse, OrderStatusUpdateDTO, OrderShipDTO, RefundDTO } from '@/models/order';
import type { Result, PageResult } from '@/models/common';

// Get order list
export async function getOrderList(params: OrderListParams): Promise<Result<PageResult<Order>>> {
  return request({
    url: '/order/seller/list',
    method: 'GET',
    params,
  });
}

// Get order detail
export async function getOrderDetail(id: number): Promise<Result<Order>> {
  return request({
    url: `/order/${id}`,
    method: 'GET',
  });
}

// Update order status
export async function updateOrderStatus(id: number, data: OrderStatusUpdateDTO): Promise<Result<void>> {
  return request({
    url: `/order/${id}/status`,
    method: 'PUT',
    data,
  });
}

// Ship order
export async function shipOrder(id: number, data: OrderShipDTO): Promise<Result<void>> {
  return request({
    url: `/order/${id}/ship`,
    method: 'PUT',
    data,
  });
}

// Cancel order
export async function cancelOrder(id: number, reason?: string): Promise<Result<void>> {
  return request({
    url: `/order/${id}/cancel`,
    method: 'PUT',
    data: { reason },
  });
}

// Refund order
export async function refundOrder(id: number, data: RefundDTO): Promise<Result<void>> {
  return request({
    url: `/order/${id}/refund`,
    method: 'POST',
    data,
  });
}
