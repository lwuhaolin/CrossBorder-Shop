import request from '@/utils/request';
import type { Product, ProductCreateDTO, ProductUpdateDTO, ProductListParams, ProductListResponse } from '@/models/product';
import type { Result, PageResult } from '@/models/common';

// Get product list
export async function getProductList(params: ProductListParams): Promise<Result<PageResult<Product>>> {
  return request({
    url: '/product/page',
    method: 'GET',
    params,
  });
}

// Get product detail
export async function getProductDetail(id: number): Promise<Result<Product>> {
  return request({
    url: `/product/${id}`,
    method: 'GET',
  });
}

// Create product
export async function createProduct(data: ProductCreateDTO): Promise<Result<Product>> {
  return request({
    url: '/product/create',
    method: 'POST',
    data,
  });
}

// Update product
export async function updateProduct(id: number, data: ProductUpdateDTO): Promise<Result<void>> {
  return request({
    url: `/product/${id}`,
    method: 'PUT',
    data,
  });
}

// Delete product
export async function deleteProduct(id: number): Promise<Result<void>> {
  return request({
    url: `/product/${id}`,
    method: 'DELETE',
  });
}

// Update product status
export async function updateProductStatus(id: number, status: number): Promise<Result<void>> {
  return request({
    url: `/product/${id}/status`,
    method: 'PUT',
    data: { status },
  });
}

// Upload product images
export async function uploadProductImages(file: File): Promise<Result<string>> {
  const formData = new FormData();
  formData.append('file', file);
  
  return request({
    url: '/product/upload-images',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
