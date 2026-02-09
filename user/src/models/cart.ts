// Cart related types
export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  stock?: number;
  quantity: number;
  selected?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Cart {
  userId: number;
  items: CartItem[];
  totalAmount?: number;
  totalQuantity?: number;
}

export interface CartAddDTO {
  productId: number;
  quantity: number;
}

export interface CartUpdateDTO {
  quantity: number;
}

export interface UpdateCartItemDTO {
  id: number;
  quantity: number;
  selected?: boolean;
}

export interface CartCalculateResponse {
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
}
