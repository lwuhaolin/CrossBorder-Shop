import request from '@/utils/request'
import type { UserUpdateDTO, PasswordChangeDTO, LoginDTO, User, UserListParams } from '@/models/user'
import type { Result, PageResult } from '@/models/common'

// User login
export async function login(data: LoginDTO): Promise<any> {
  return request({
    url: '/user/login',
    method: 'POST',
    data,
  })
}

// User logout
export async function logout(): Promise<Result<void>> {
  return request({
    url: '/user/logout',
    method: 'POST',
  })
}

// Get current user info
export async function getCurrentUser(): Promise<Result<User>> {
  return request({
    url: '/user/info',
    method: 'GET',
  })
}

// Update user info
export async function updateUser(data: UserUpdateDTO): Promise<Result<void>> {
  return request({
    url: '/user/update',
    method: 'PUT',
    data,
  })
}

// Update password
export async function updatePassword(data: PasswordChangeDTO): Promise<Result<void>> {
  return request({
    url: '/user/password',
    method: 'PUT',
    data,
  })
}

// ===== ADMIN APIS =====

// Get user by ID
export async function getUser(id: number): Promise<Result<User>> {
  return request({
    url: `/user/${id}`,
    method: 'GET',
  })
}

// Get user by username
export async function getUserByUsername(username: string): Promise<Result<User>> {
  return request({
    url: `/user/username/${username}`,
    method: 'GET',
  })
}

// List users (admin)
export async function listUsers(params?: UserListParams): Promise<Result<PageResult<User>>> {
  return request({
    url: '/user/admin/list',
    method: 'GET',
    params,
  })
}

// Admin update user
export async function adminUpdateUser(id: number, data: UserUpdateDTO): Promise<Result<void>> {
  return request({
    url: `/user/admin/${id}`,
    method: 'PUT',
    data,
  })
}

// Admin delete user
export async function adminDeleteUser(id: number): Promise<Result<void>> {
  return request({
    url: `/user/admin/${id}`,
    method: 'DELETE',
  })
}

// Admin disable/enable user
export async function adminToggleUserStatus(id: number, status: number): Promise<Result<void>> {
  return request({
    url: `/user/admin/${id}/status?status=${status}`,
    method: 'PUT',
  })
}
