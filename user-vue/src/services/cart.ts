import request from '@/utils/request'
import type { Cart, CartAddDTO, UpdateCartItemDTO, CartCalculateResponse } from '@/models/cart'
import type { Result } from '@/models/common'

// Add to cart
export async function addToCart(data: CartAddDTO): Promise<Result<void>> {
  return request({
    url: '/cart/add',
    method: 'POST',
    data,
  })
}

// Get cart
export async function getCart(): Promise<Result<Cart>> {
  return request({
    url: `/cart`,
    method: 'GET',
  })
}

// Update cart item (with quantity and selected status)
export async function updateCartItem(data: UpdateCartItemDTO): Promise<Result<void>> {
  return request({
    url: `/cart/update`,
    method: 'PUT',
    data,
  })
}

// Delete cart item
export async function deleteCartItem(id: number): Promise<Result<void>> {
  return request({
    url: `/cart/item/${id}`,
    method: 'DELETE',
  })
}

// Clear cart
export async function clearCart(): Promise<Result<void>> {
  return request({
    url: '/cart/clear',
    method: 'DELETE',
  })
}

// Calculate cart total
export async function calculateCart(): Promise<Result<CartCalculateResponse>> {
  return request({
    url: '/cart/calculate',
    method: 'GET',
  })
}
