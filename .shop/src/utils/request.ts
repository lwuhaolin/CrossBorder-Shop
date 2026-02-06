import axios, { AxiosError } from "axios";
import { message } from "antd";
import type { User } from "@/models/user";

const SUCCESS_CODE = 0;
const TIMEOUT = 10000;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

// Token management
const TOKEN_KEY = "jwt_token";
const USER_INFO_KEY = "user_info";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);
export const getUserInfo = (): User | null => {
  const info = localStorage.getItem(USER_INFO_KEY);
  return info ? JSON.parse(info) : null;
};
export const setUserInfo = (userInfo: User) => localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
export const removeUserInfo = () => localStorage.removeItem(USER_INFO_KEY);

export const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  withCredentials: true,
});

// Request interceptor - Add JWT token
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      const { data } = response;
      // Check if response follows the standard format with code field
      if (data && typeof data.code !== 'undefined') {
        if (data.code === SUCCESS_CODE) {
          return data;
        }
        // Handle error response
        message.error(data.message || '操作失败');
        return Promise.reject(data);
      }
      // Return data directly if no code field (some APIs might not follow standard format)
      return data;
    }
    return Promise.reject(response?.data);
  },
  (error: AxiosError<any>) => {
    // Handle HTTP errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - Clear token and redirect to login
          message.error('登录已过期，请重新登录');
          removeToken();
          removeUserInfo();
          // Redirect to login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          message.error('没有权限访问此资源');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器内部错误');
          break;
        default:
          message.error(data?.message || `请求失败 (${status})`);
      }
    } else if (error.request) {
      // Request was made but no response received
      message.error('网络连接失败，请检查网络设置');
    } else {
      // Something else happened
      message.error('请求失败: ' + error.message);
    }
    
    return Promise.reject(error);
  }
);

export default instance;
