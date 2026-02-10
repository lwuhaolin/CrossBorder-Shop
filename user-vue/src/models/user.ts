// User related types

/**
 * User information
 * 注意：前端使用的字段通过 dataMapper 从后端 UserVO 进行转换
 * 后端字段 -> 前端字段映射：
 * - nickname -> name
 * - roles[0] -> role
 * - createTime -> createdAt
 * - lastLoginTime -> lastLoginAt
 */
export interface User {
  id: number
  /** Username for login */
  username: string
  /** User's display name (映射自 nickname) */
  name?: string
  /** User role (映射自 roles[0]) */
  role?: string
  /** Email address */
  email?: string
  /** Phone number */
  phone?: string
  /** Avatar URL */
  avatar?: string
  /** User status: 0=禁用, 1=正常, 2=锁定 */
  status?: number
  /** Gender: 0=未知, 1=男, 2=女 (后端字段) */
  gender?: number
  /** Birthday (后端字段) */
  birthday?: string
  /** Account creation timestamp (映射自 createTime) */
  createdAt?: string
  /** Last update timestamp */
  updatedAt?: string
  /** Last login timestamp (映射自 lastLoginTime) */
  lastLoginAt?: string
  /** Last login IP (后端字段) */
  lastLoginIp?: string
}

export interface UserUpdateDTO {
  /** 昵称（对应后端的 nickname） */
  nickname?: string
  /** 电子邮箱 */
  email?: string
  /** 手机号 */
  phone?: string
  /** 头像 URL */
  avatar?: string
  /** 性别：0=未知, 1=男, 2=女 */
  gender?: number
  /** 生日 */
  birthday?: string
}

/**
 * Password change request DTO (for API)
 * 注意：后端期望 oldPassword 和 newPassword 作为查询参数
 * 前端这里使用 currentPassword，在 service 层进行转换
 */
export interface PasswordChangeDTO {
  currentPassword: string
  newPassword: string
  confirmPassword?: string
}

/**
 * Password update form values (client-side only)
 */
export interface PasswordUpdateDTO extends PasswordChangeDTO {
  confirmPassword: string
}

export interface LoginDTO {
  username: string
  password: string
}

export interface RegisterDTO {
  username: string
  password: string
  confirmPassword: string
  email?: string
  phone?: string
}

export interface LoginResponse {
  token: string
  user: User
}
