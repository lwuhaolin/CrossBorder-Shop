// User related types

/**
 * User information
 */
export interface User {
  id: number
  /** Username for login */
  username: string
  /** User's display name */
  name?: string
  /** Email address */
  email?: string
  /** Phone number */
  phone?: string
  /** Avatar URL */
  avatar?: string
  /** User role (e.g., 'admin', 'user') */
  role?: string
  /** User status: 1 = active, 0 = inactive */
  status?: number
  /** Account creation timestamp */
  createdAt?: string
  /** Last update timestamp */
  updatedAt?: string
  /** Last login timestamp */
  lastLoginAt?: string
}

export interface UserUpdateDTO {
  username?: string
  email?: string
  phone?: string
  avatar?: string
}

/**
 * Password change request DTO (for API)
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
