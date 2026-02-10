// Product related types
export interface Product {
  id: number
  productName?: string
  name?: string
  productCode?: string
  categoryId?: number
  categoryName?: string
  categoryCode?: string
  sellerId?: number
  sellerName?: string
  brand?: string
  price: number
  originalPrice?: number
  currency?: string
  stock: number
  sales?: number
  unit?: string
  weight?: number
  description?: string
  detail?: string
  status: ProductStatus
  isRecommend?: number
  isNew?: number
  isHot?: number
  images?: any[]
  mainImage?: string
  rating?: number
  createdAt?: string
  createTime?: string
  updatedAt?: string
  updateTime?: string
}

export enum ProductStatus {
  DRAFT = 0,
  ACTIVE = 1,
  INACTIVE = 2,
  SOLD_OUT = 3,
}

export interface ProductCreateDTO {
  productName?: string
  description?: string
  price: number
  originalPrice?: number
  stock: number
  categoryId?: number
  images?: string[]
  mainImage?: string
}

export interface ProductUpdateDTO extends ProductCreateDTO {
  id: number
}

export interface ProductListParams {
  pageNum?: number
  page?: number
  pageSize?: number
  keyword?: string
  categoryId?: number
  status?: ProductStatus
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ProductListResponse {
  list: Product[]
  total: number
  page: number
  pageSize: number
}

