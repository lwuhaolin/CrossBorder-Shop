// User related types

/**
 * User information
 */


export interface UserUpdateDTO {
  username?: string;
  email?: string;
  phone?: string;
  avatar?: string;
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
}

export interface LoginResponse {
  accessToken: string;
  accessTokenExpiresIn: string;
  refreshToken: string;
  refreshTokenExpiresIn: string;
  tokenType: string;
  userInfo: any;
}
