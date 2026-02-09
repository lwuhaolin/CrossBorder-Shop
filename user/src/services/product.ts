import request from '@/utils/request';
import type { Product, ProductListParams } from '@/models/product';
import type { Result, PageResult } from '@/models/common';

// Transform ProductVO from backend to Product for frontend
function transformProduct(productVO: any): Product {
  console.log('[transformProduct] Input:', productVO);

  const product: Product = {
    id: productVO.id,
    name: productVO.productName || productVO.name,
    description: productVO.description,
    price: parseFloat(productVO.price),
    originalPrice: productVO.originalPrice ? parseFloat(productVO.originalPrice) : undefined,
    stock: productVO.stock,
    categoryId: productVO.categoryId,
    categoryName: productVO.categoryName,
    categoryCode: productVO.categoryCode,
    mainImage: productVO.mainImage,
    images: productVO.images && productVO.images.length > 0
      ? productVO.images.map((img: any) => img.imageUrl || img)
      : undefined,
    status: productVO.status || 0,
    sales: productVO.sales,
    createdAt: productVO.createTime,
    updatedAt: productVO.updateTime,
  };

  console.log('[transformProduct] Output:', product);
  return product;
}

// Get product list
export async function getProductList(params: ProductListParams): Promise<Result<PageResult<Product>>> {
  const response: any = await request({
    url: '/product/page',
    method: 'GET',
    params,
  });

  // Transform the response data
  if (response && response.data && response.data.list) {
    const result: Result<PageResult<Product>> = {
      code: response.code,
      message: response.message,
      data: {
        ...response.data,
        list: response.data.list.map(transformProduct),
      },
    };
    return result;
  }

  return response;
}

// Get product detail
export async function getProductDetail(id: number): Promise<Result<Product>> {
  const response: any = await request({
    url: `/product/${id}`,
    method: 'GET',
  });

  // Transform the response data
  if (response && response.data) {
    const result: Result<Product> = {
      code: response.code,
      message: response.message,
      data: transformProduct(response.data),
    };
    return result;
  }

  return response;
}

// Get latest products
export async function getLatestProducts(limit: number = 4): Promise<Result<Product[]>> {
  const response: any = await request({
    url: '/product/latest',
    method: 'GET',
    params: { limit },
  });

  // Transform the response data
  if (response && response.data) {
    const result: Result<Product[]> = {
      code: response.code,
      message: response.message,
      data: response.data.map(transformProduct),
    };
    return result;
  }

  return response;
}
