// Order related types
export interface Order {
  id: number;
  orderNumber: string; // 后端字段名
  buyerId: number; // 买家ID
  sellerId?: number; // 卖家ID
  orderStatus: OrderStatus; // 订单状态
  paymentStatus?: PaymentStatus; // 支付状态
  totalAmount: number; // 订单总金额
  productAmount?: number; // 商品总金额
  freightAmount?: number; // 运费
  discountAmount?: number; // 优惠金额
  currency?: string; // 原币种
  exchangeRate?: number; // 汇率
  convertedAmount?: number; // 换算后金额
  targetCurrency?: string; // 目标币种
  paymentMethod?: string; // 支付方式
  paymentTime?: string; // 支付时间
  paymentTransactionId?: string; // 支付流水号
  logisticsCompany?: string; // 物流公司
  trackingNo?: string; // 物流单号
  sellerAddress?: string; // 卖家退货地址
  shipTime?: string; // 发货时间
  completeTime?: string; // 完成时间
  cancelTime?: string; // 取消时间
  cancelReason?: string; // 取消原因
  remark?: string; // 备注
  buyerMessage?: string; // 买家留言
  createTime?: string; // 创建时间
  items?: OrderItem[]; // 订单明细
  address?: ShippingAddress; // 收货地址
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
  trackingNo?: string;
  shippingCompany?: string;
  shippingCompanyCode?: string;
  remark?: string;
}

export interface RefundDTO {
  reason: string;
  amount?: number;
  images?: string[];
}
