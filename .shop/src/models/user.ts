// User related types
export interface User {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserUpdateDTO {
  username?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface PasswordUpdateDTO {
  oldPassword: string;
  newPassword: string;
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
  token: string;
  user: User;
}
