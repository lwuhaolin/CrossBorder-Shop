import request from '@/utils/request';
import type { Category, CategoryCreateDTO, CategoryUpdateDTO } from '@/models/category';
import type { Result } from '@/models/common';

// Get category tree
export async function getCategoryTree(): Promise<Result<Category[]>> {
  return request({
    url: '/category/tree',
    method: 'GET',
  });
}

// Get category list
export async function getCategoryList(): Promise<Result<Category[]>> {
  return request({
    url: '/category/list',
    method: 'GET',
  });
}

// Create category
export async function createCategory(data: CategoryCreateDTO): Promise<Result<Category>> {
  return request({
    url: '/category',
    method: 'POST',
    data,
  });
}

// Update category
export async function updateCategory(id: number, data: CategoryUpdateDTO): Promise<Result<void>> {
  return request({
    url: '/category',
    method: 'PUT',
    data: {
      ...data,
      id,
    },
  });
}

// Delete category
export async function deleteCategory(id: number): Promise<Result<void>> {
  return request({
    url: `/category/${id}`,
    method: 'DELETE',
  });
}
