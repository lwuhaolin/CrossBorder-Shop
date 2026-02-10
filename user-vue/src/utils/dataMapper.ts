/**
 * 数据映射工具 - 用于转换后端返回的数据格式到前端期望的格式
 * 由于后端连接多个系统，此工具将后端的字段映射到前端的字段
 */

import type { User } from '@/models/user'
import type { Address } from '@/models/address'

/**
 * 将后端 UserVO 响应映射为前端 User 模型
 * 后端字段 -> 前端字段：
 * - nickname -> name
 * - roles[0] -> role
 * - createTime -> createdAt
 * - lastLoginTime -> lastLoginAt
 */
export function mapUserVOToUser(backendUser: any): User {
  if (!backendUser) return {} as User

  return {
    id: backendUser.id,
    username: backendUser.username,
    name: backendUser.nickname,  // 后端: nickname -> 前端: name
    email: backendUser.email,
    phone: backendUser.phone,
    avatar: backendUser.avatar,
    role: backendUser.roles?.[0]?.roleName || backendUser.roles?.[0] || undefined,  // 取第一个角色
    status: backendUser.status,
    createdAt: backendUser.createTime,  // 后端: createTime -> 前端: createdAt
    lastLoginAt: backendUser.lastLoginTime,  // 后端: lastLoginTime -> 前端: lastLoginAt
  }
}

/**
 * 将前端 UserUpdateDTO 转换为后端期望的格式
 * 前端字段 -> 后端字段：
 * - name -> nickname
 */
export function mapUserUpdateDTOToBackend(frontendData: any): any {
  const backendData: any = {
    email: frontendData.email,
    phone: frontendData.phone,
    avatar: frontendData.avatar,
  }

  // 处理 nickname（前端可能发送为 name）
  if (frontendData.nickname !== undefined) {
    backendData.nickname = frontendData.nickname
  } else if (frontendData.name !== undefined) {
    backendData.nickname = frontendData.name
  }

  // 可选字段
  if (frontendData.gender !== undefined) {
    backendData.gender = frontendData.gender
  }
  if (frontendData.birthday !== undefined) {
    backendData.birthday = frontendData.birthday
  }

  return backendData
}

/**
 * 将后端 ShippingAddressVO 响应映射为前端 Address 模型
 */
export function mapShippingAddressVOToAddress(backendAddress: any): Address {
  if (!backendAddress) return {} as Address

  return {
    id: backendAddress.id,
    userId: backendAddress.userId,
    receiverName: backendAddress.receiverName,
    receiverPhone: backendAddress.receiverPhone,
    country: backendAddress.country,
    province: backendAddress.province,
    city: backendAddress.city,
    district: backendAddress.district,
    detailAddress: backendAddress.detailAddress,
    postalCode: backendAddress.postalCode,  // 添加邮编
    isDefault: backendAddress.isDefault,
    createdAt: backendAddress.createTime,  // 后端: createTime -> 前端: createdAt
    updatedAt: backendAddress.updateTime,  // 后端: updateTime -> 前端: updatedAt
  }
}

/**
 * 将前端 AddressCreateDTO 转换为后端期望的格式（ShippingAddressDTO）
 */
export function mapAddressCreateDTOToBackend(frontendData: any): any {
  return {
    receiverName: frontendData.receiverName,
    receiverPhone: frontendData.receiverPhone,
    country: frontendData.country,
    province: frontendData.province,
    city: frontendData.city,
    district: frontendData.district,
    detailAddress: frontendData.detailAddress,
    postalCode: frontendData.postalCode,
    isDefault: frontendData.isDefault,
    // 移除前端的 label 字段（后端不支持）
  }
}

/**
 * 将后端 LoginVO 响应映射为前端期望的格式
 * 后端返回：{ accessToken, refreshToken, tokenType, accessTokenExpiresIn, refreshTokenExpiresIn, userInfo }
 * 前端需要：{ token, refreshToken, user, ... }
 */
export function mapLoginVOToFrontendFormat(backendResponse: any): any {
  if (!backendResponse) return backendResponse

  return {
    // Token 字段映射
    token: backendResponse.accessToken,  // 后端: accessToken -> 前端: token
    accessToken: backendResponse.accessToken,  // 保留原字段供后续使用
    refreshToken: backendResponse.refreshToken,
    tokenType: backendResponse.tokenType,
    accessTokenExpiresIn: backendResponse.accessTokenExpiresIn,
    refreshTokenExpiresIn: backendResponse.refreshTokenExpiresIn,

    // 用户信息映射
    user: mapUserVOToUser(backendResponse.userInfo),  // 后端: userInfo -> 前端: user
    userInfo: backendResponse.userInfo,  // 保留原字段

    // 保留其他字段
    ...backendResponse,
  }
}

/**
 * 转换后端 OrderVO 列表响应
 * 后端没有返回分页结构，直接返回 List<OrderVO>
 * 前端需要将其转换为 PageResult 格式
 */
export function mapOrderListToPageResult(backendOrders: any[]): any {
  return {
    list: backendOrders || [],
    total: backendOrders?.length || 0,
    page: 1,
    pageSize: backendOrders?.length || 0,
  }
}
