// Order related types
export interface Order {
  id: number;
  orderNo: string;
  userId: number;
  username?: string;
  totalAmount: number;
  actualAmount: number;
  shippingFee?: number;
  discountAmount?: number;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  shippingStatus?: ShippingStatus;
  shippingAddressId?: number;
  shippingAddress?: ShippingAddress;
  items?: OrderItem[];
  remark?: string;
  trackingNo?: string;
  createdAt?: string;
  updatedAt?: string;
  paidAt?: string;
  shippedAt?: string;
  completedAt?: string;
  canceledAt?: string;
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
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  totalAmount: number;
}

export interface OrderListParams {
  page?: number;
  pageSize?: number;
  orderNo?: string;
  userId?: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  shippingStatus?: ShippingStatus;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface OrderListResponse {
  list: Order[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ShippingAddress {
  id: number;
  userId?: number;
  receiverName: string;
  receiverPhone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  isDefault?: boolean;
  label?: string;
}

export interface OrderStatusUpdateDTO {
  status: OrderStatus;
  remark?: string;
}

export interface OrderShipDTO {
  trackingNo: string;
  shippingCompany?: string;
  remark?: string;
}

export interface RefundDTO {
  reason: string;
  amount?: number;
  images?: string[];
}
