// Product related types
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  stock: number;
  categoryId?: number;
  categoryName?: string;
  images?: string[];
  mainImage?: string;
  status: ProductStatus;
  sales?: number;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export enum ProductStatus {
  DRAFT = 0,
  ACTIVE = 1,
  INACTIVE = 2,
}

export interface ProductCreateDTO {
  productName: string;
  description?: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  stock: number;
  categoryId?: number;
  imageUrls?: string[];
  mainImageIndex?: number;
}

export interface ProductUpdateDTO extends ProductCreateDTO {
  id: number;
}

export interface ProductListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  categoryId?: number;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductListResponse {
  list: Product[];
  total: number;
  page: number;
  pageSize: number;
}
