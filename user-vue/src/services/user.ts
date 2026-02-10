import request from '@/utils/request'
import type { User, UserUpdateDTO, PasswordChangeDTO, LoginDTO } from '@/models/user'
import type { Result } from '@/models/common'
import { mapUserVOToUser, mapLoginVOToFrontendFormat, mapUserUpdateDTOToBackend } from '@/utils/dataMapper'

// User login
export async function login(data: LoginDTO): Promise<any> {
  const response = await request({
    url: '/user/login',
    method: 'POST',
    data,
  })

  // 后端返回 LoginVO，需要转换字段
  if (response.data) {
    response.data = mapLoginVOToFrontendFormat(response.data)
  }

  return response
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
  const response: Result<any> = await request({
    url: '/user/info',
    method: 'GET',
  })

  // 后端返回 UserVO，需要映射字段
  if (response.data) {
    response.data = mapUserVOToUser(response.data)
  }

  return response as Result<User>
}

// Update user info
export async function updateUser(data: UserUpdateDTO): Promise<Result<void>> {
  // 将前端数据转换为后端期望的格式
  const backendData = mapUserUpdateDTOToBackend(data)

  return request({
    url: '/user/update',
    method: 'PUT',
    data: backendData,
  })
}

// Update password
// 注意：后端期望 Query Parameter，使用 URL 查询参数而不是 JSON body
export async function updatePassword(data: PasswordChangeDTO): Promise<Result<void>> {
  // 后端使用 @RequestParam，期望查询参数格式
  // 后端字段：oldPassword, newPassword（而不是 currentPassword）
  return request({
    url: `/user/password?oldPassword=${encodeURIComponent(data.currentPassword)}&newPassword=${encodeURIComponent(data.newPassword)}`,
    method: 'PUT',
  })
}

// Register user
export async function register(data: any): Promise<Result<void>> {
  return request({
    url: '/user/register',
    method: 'POST',
    data,
  })
}
