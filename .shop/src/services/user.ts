import request from '@/utils/request';
import type { User, UserUpdateDTO, PasswordChangeDTO, LoginDTO, LoginResponse } from '@/models/user';
import type { Result } from '@/models/common';

// User login
export async function login(data: LoginDTO): Promise<Result<LoginResponse>> {
  return request({
    url: '/user/login',
    method: 'POST',
    data,
  });
}

// User logout
export async function logout(): Promise<Result<void>> {
  return request({
    url: '/user/logout',
    method: 'POST',
  });
}

// Get current user info
export async function getCurrentUser(): Promise<Result<User>> {
  return request({
    url: '/user/info',
    method: 'GET',
  });
}

// Update user info
export async function updateUser(data: UserUpdateDTO): Promise<Result<void>> {
  return request({
    url: '/user/update',
    method: 'PUT',
    data,
  });
}

// Update password
export async function updatePassword(data: PasswordChangeDTO): Promise<Result<void>> {
  return request({
    url: '/user/password',
    method: 'PUT',
    data,
  });
}
