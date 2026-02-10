// Cart related types

export interface CartItem {
  id?: number
  productId: number
  productName: string
  productImage: string
  skuId?: number
  skuSpec?: string
  price: number
  subtotal?: number
  quantity: number
  selected?: boolean
  stock?: number
  onShelf?: boolean
}

export interface Cart {
  id?: number
  userId?: number
  totalPrice?: number
  totalQuantity?: number
  items: CartItem[]
}

export interface CartAddDTO {
  productId: number
  quantity: number
}

export interface CartUpdateDTO {
  quantity: number
}

export interface UpdateCartItemDTO {
  id: number
  quantity: number
  selected?: boolean
}

export interface CartCalculateResponse {
  subtotal: number
  shippingFee: number
  discount: number
  total: number
}
