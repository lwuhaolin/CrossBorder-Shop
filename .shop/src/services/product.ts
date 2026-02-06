import request from '@/utils/request';
import type { Product, ProductCreateDTO, ProductUpdateDTO, ProductListParams, ProductListResponse } from '@/models/product';
import type { Result, PageResult } from '@/models/common';

// Get product list
export async function getProductList(params: ProductListParams): Promise<Result<PageResult<Product>>> {
  const { page, pageSize, ...rest } = params || {};
  const response = await request({
    url: '/product/page',
    method: 'GET',
    params: {
      ...rest,
      pageNum: page,
      pageSize,
    },
  });

  const base = response as unknown as Result<any>;
  const data = base?.data;
  const list = Array.isArray(data?.list)
    ? data.list.map((item: any) => ({
      ...item,
      name: item.productName ?? item.name,
      createdAt: item.createTime ?? item.createdAt,
    }))
    : [];

  const normalized: PageResult<Product> = {
    list,
    total: data?.total ?? 0,
    page: data?.page ?? data?.pageNum ?? 1,
    pageSize: data?.pageSize ?? pageSize ?? 10,
  };

  return {
    code: base?.code ?? 0,
    message: base?.message,
    data: normalized,
  } as Result<PageResult<Product>>;
}

// Get product detail
export async function getProductDetail(id: number): Promise<Result<Product>> {
  const response = await request({
    url: `/product/${id}`,
    method: 'GET',
  });

  const base = response as unknown as Result<any>;
  const rawData = base?.data;

  if (!rawData) {
    return base as Result<Product>;
  }

  const normalized: Product = {
    ...rawData,
    name: rawData.productName ?? rawData.name,
    createdAt: rawData.createTime ?? rawData.createdAt,
    images: Array.isArray(rawData.images)
      ? rawData.images.map((img: any) => img.imageUrl ?? img)
      : rawData.images,
  };

  return {
    code: base?.code ?? 0,
    message: base?.message,
    data: normalized,
  } as Result<Product>;
}

// Create product
export async function createProduct(data: ProductCreateDTO): Promise<Result<Product>> {
  return request({
    url: '/product/publish',
    method: 'POST',
    data,
  });
}

// Update product
export async function updateProduct(id: number, data: ProductUpdateDTO): Promise<Result<void>> {
  return request({
    url: '/product/update',
    method: 'PUT',
    data: { ...data, id },
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
  const endpoint = status === 1 ? `/product/${id}/on-shelf` : `/product/${id}/off-shelf`;
  return request({
    url: endpoint,
    method: 'PUT',
  });
}

// Upload product images
export async function uploadProductImages(file: File): Promise<Result<string>> {
  const formData = new FormData();
  formData.append('file', file);

  return request({
    url: '/file/upload',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
