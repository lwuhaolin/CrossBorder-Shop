// Order related types

export interface Order {
  id: number
  orderNumber: string
  buyerId: number
  sellerId?: number
  orderStatus: OrderStatus
  paymentStatus?: PaymentStatus
  totalAmount: number
  productAmount?: number
  freightAmount?: number
  discountAmount?: number
  currency?: string
  exchangeRate?: number
  convertedAmount?: number
  targetCurrency?: string
  paymentMethod?: string
  paymentTime?: string
  paymentTransactionId?: string
  logisticsCompany?: string
  trackingNo?: string
  sellerAddress?: string
  shipTime?: string
  completeTime?: string
  cancelTime?: string
  cancelReason?: string
  remark?: string
  buyerMessage?: string
  createTime?: string
  items?: OrderItem[]
  address?: OrderAddress
}

export enum OrderStatus {
  PENDING = 0,
  PAID = 1,
  SHIPPED = 2,
  COMPLETED = 3,
  CANCELED = 4,
  REFUNDING = 5,
  REFUNDED = 6,
}

export enum PaymentStatus {
  UNPAID = 0,
  PAID = 1,
  REFUNDED = 2,
}

export enum ShippingStatus {
  PENDING = 0,
  SHIPPED = 1,
  DELIVERED = 2,
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  productName: string
  productImage?: string
  price: number
  quantity: number
  totalAmount: number
}

export interface OrderAddress {
  id: number
  userId?: number
  receiverName: string
  receiverPhone: string
  country?: string
  province: string
  city: string
  district: string
  detailAddress: string
  postalCode?: string
  isDefault?: boolean
}

export interface OrderStatusUpdateDTO {
  status: OrderStatus
  remark?: string
}

export interface OrderShipDTO {
  trackingNo?: string
  shippingCompany?: string
  shippingCompanyCode?: string
  remark?: string
}

export interface RefundDTO {
  reason: string
  amount?: number
  images?: string[]
}

export interface OrderListParams {
  page?: number
  pageSize?: number
  orderNo?: string
  userId?: number
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
}
