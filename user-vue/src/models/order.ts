// Order related types
export interface Order {
  id: number
  orderNumber: string
  buyerId: number
  sellerId: number
  orderStatus: number  // 0=待支付, 1=已支付, 2=已发货, 3=已完成, 4=已取消
  paymentStatus: number  // 0=未支付, 1=已支付, 2=已退款
  totalAmount: number
  productAmount: number
  freightAmount: number
  discountAmount: number
  currency: string
  exchangeRate: number
  convertedAmount: number
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
  createTime: string
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
  productId: number
  productName: string
  productCode: string
  imageUrl: string
  skuId?: number
  skuName?: string
  price: number
  quantity: number
  totalPrice: number
}

export interface OrderAddress {
  id: number
  receiverName: string
  receiverPhone: string
  country?: string
  province: string
  city: string
  district: string
  detailAddress: string
  postalCode?: string
}

export interface OrderStatusUpdateDTO {
  status: OrderStatus
  remark?: string
}

export interface OrderShipDTO {
  trackingNo: string
  shippingCompany?: string
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
  status?: number
  keyword?: string
}

export interface OrderListResponse {
  list: Order[]
  total: number
  page: number
  pageSize: number
}
