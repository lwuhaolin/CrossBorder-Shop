// User related types

/**
 * Role information
 */
export interface Role {
  id?: number;
  roleName: string;
  roleCode: string;
  description?: string;
}

/**
 * User information
 */
export interface User {
  id?: number;
  username: string;
  nickname?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  gender?: number; // 0=Unknown, 1=Male, 2=Female
  birthday?: string;
  status?: number; // 0=Disabled, 1=Active, 2=Locked
  lastLoginTime?: string;
  lastLoginIp?: string;
  roles?: Role[];
  createTime?: string;
  updateTime?: string;
}

export interface UserUpdateDTO {
  username?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  nickname?: string;
  gender?: number;
  birthday?: string;
  status?: number;
}

/**
 * Password change request DTO (for API)
 */
export interface PasswordChangeDTO {
  oldPassword: string;
  newPassword: string;
}

/**
 * Password update form values (client-side only)
 */
export interface PasswordUpdateDTO extends PasswordChangeDTO {
  confirmPassword: string;
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface RegisterDTO {
  username: string;
  password: string;
  confirmPassword: string;
  email?: string;
  phone?: string;
  roleId?: number;
}

export interface LoginResponse {
  accessToken: string;
  accessTokenExpiresIn: string;
  refreshToken: string;
  refreshTokenExpiresIn: string;
  tokenType: string;
  userInfo: User;
}

export interface UserListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: number;
}

export interface UserListResponse {
  list: User[];
  total: number;
  page: number;
  pageSize: number;
}
