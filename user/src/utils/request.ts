import axios, { AxiosError } from "axios";
import { message } from "antd";

const SUCCESS_CODE = 200;
const TIMEOUT = 10000;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

// Token management
const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_INFO_KEY = "user_info";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const setRefreshToken = (refreshToken: string) => localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);
export const removeRefreshToken = () => localStorage.removeItem(REFRESH_TOKEN_KEY);
export const getUserInfo = (): any | null => {
  const info = localStorage.getItem(USER_INFO_KEY);
  return info ? JSON.parse(info) : null;
};
export const setUserInfo = (userInfo: any) => localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
export const removeUserInfo = () => localStorage.removeItem(USER_INFO_KEY);

// Image URL helper - combine server URL with image path
export const getImageUrl = (imagePath?: string): string => {
  

  

 
  
 
  
  const fullUrl = `${API_BASE_URL}${imagePath}`;
  
  return fullUrl;
};

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  withCredentials: true,
});

// Track if a refresh is in progress to avoid multiple concurrent requests
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  })

  isRefreshing = false;
  failedQueue = [];
};

const isPublicEndpoint = (url?: string) => {
  if (!url) return false;
  return (
    url.includes('/user/login') ||
    url.includes('/user/register') ||
    url.includes('/user/refresh') ||
    url.includes('/product/') ||
    url.includes('/category/')
  );
};

// Request interceptor - Add JWT token
instance.interceptors.request.use(
  async (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }

    // No access token: try refresh if possible (except public endpoints)
    if (!isPublicEndpoint(config.url)) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const refreshAxios = axios.create({
            baseURL: API_BASE_URL,
            timeout: TIMEOUT,
            withCredentials: true,
          });

          const res = await refreshAxios.post(
            `/user/refresh?refreshToken=${encodeURIComponent(refreshToken)}`,
            {}
          );

          const { data } = res;
          if (data && data.code === SUCCESS_CODE) {
            const { accessToken } = data.data || data;
            setToken(accessToken);
            const newRefreshToken = (data.data || data).refreshToken;
            if (newRefreshToken) {
              setRefreshToken(newRefreshToken);
            }
            config.headers.Authorization = `Bearer ${accessToken}`;
            return config;
          }
        } catch (err) {
          // fall through to login redirect
        }
      }

      removeToken();
      removeRefreshToken();
      removeUserInfo();
      // Only redirect to login if not already on login page
      if (window.location.pathname !== '/user/login' && window.location.pathname !== '/user/register') {
        window.location.href = '/user/login';
      }
      return Promise.reject(new Error('No access token'));
    }

    // For public endpoints (login, register), allow request without token
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

        // Check if it's a token expired error (code 1007)
        if (data.code === 1007) {
          // TOKEN_EXPIRED - try to refresh
          console.log("开始刷新token");

          return handleTokenExpired(data, response.config);
        }

        // Handle other error responses
        message.error(data.message || '操作失败');
        return Promise.reject(data);
      }
      // Return data directly if no code field
      return data;
    }
    return Promise.reject(response?.data);
  },
  (error: AxiosError<any>) => {
    // Handle HTTP errors
    if (error.response) {
      const { status, data } = error.response;
      const config = error.config as any;

      switch (status) {
        case 401:
          // Unauthorized - Try to refresh token (HTTP 401)
          return handleTokenRefresh(error, config);

        case 403:
          // Forbidden - true permission denied, do NOT try to refresh
          message.error('没有权限访问此资源');
          return Promise.reject(error);

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

// Handle token refresh when received 401 HTTP status
function handleTokenRefresh(error: AxiosError<any>, config: any) {
  if (!isRefreshing) {
    isRefreshing = true;
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      const refreshAxios = axios.create({
        baseURL: API_BASE_URL,
        timeout: TIMEOUT,
        withCredentials: true,
      });

      return refreshAxios.post(
        `/user/refresh?refreshToken=${encodeURIComponent(refreshToken)}`,
        {}
      ).then((res) => {
        const { data } = res;
        if (data && data.code === SUCCESS_CODE) {
          const { accessToken } = data.data || data;
          setToken(accessToken);
          const newRefreshToken = (data.data || data).refreshToken;
          if (newRefreshToken) {
            setRefreshToken(newRefreshToken);
          }
          instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          if (config) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
          processQueue(null, accessToken);
          return instance(config);
        } else {
          removeToken();
          removeRefreshToken();
          removeUserInfo();
          message.error('登录已过期，请重新登录');
          if (window.location.pathname !== '/user/login') {
            window.location.href = '/user/login';
          }
          processQueue(new Error('Token refresh failed'), null);
          return Promise.reject(error);
        }
      }).catch((err) => {
        console.error('Token refresh error:', {
          status: err.response?.status,
          data: err.response?.data,
        });
        removeToken();
        removeRefreshToken();
        removeUserInfo();
        message.error('登录已过期，请重新登录');
        if (window.location.pathname !== '/user/login') {
          window.location.href = '/user/login';
        }
        processQueue(err, null);
        return Promise.reject(err);
      });
    } else {
      removeToken();
      removeUserInfo();
      message.error('登录已过期，请重新登录');
      if (window.location.pathname !== '/user/login') {
        window.location.href = '/user/login';
      }
      processQueue(new Error('No refresh token'), null);
      return Promise.reject(error);
    }
  } else {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then(token => {
      if (config && token) {
        config.headers.Authorization = `Bearer ${token}`;
        return instance(config);
      }
      return Promise.reject(error);
    }).catch(err => {
      return Promise.reject(err);
    });
  }
}

// Handle token expired error (code 1007) in response body
function handleTokenExpired(data: any, config?: any) {
  if (!isRefreshing) {
    isRefreshing = true;
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      const refreshAxios = axios.create({
        baseURL: API_BASE_URL,
        timeout: TIMEOUT,
        withCredentials: true,
      });

      return refreshAxios.post(
        `/user/refresh?refreshToken=${encodeURIComponent(refreshToken)}`,
        {}
      ).then((res) => {
        const { data: resData } = res;
        if (resData && resData.code === SUCCESS_CODE) {
          const { accessToken } = resData.data || resData;
          setToken(accessToken);
          const newRefreshToken = (resData.data || resData).refreshToken;
          if (newRefreshToken) {
            setRefreshToken(newRefreshToken);
          }
          instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          message.success('Token已自动刷新，请重试');
          // 如果有 config，使用新 token 重试请求
          if (config) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            return instance(config);
          }
          return Promise.resolve(resData);
        } else {
          removeToken();
          removeRefreshToken();
          removeUserInfo();
          message.error('登录已过期，请重新登录');
          if (window.location.pathname !== '/user/login') {
            window.location.href = '/user/login';
          }
          processQueue(new Error('Token refresh failed'), null);
          return Promise.reject(data);
        }
      }).catch((err) => {
        console.error('Token refresh error:', {
          status: err.response?.status,
          data: err.response?.data,
        });
        removeToken();
        removeRefreshToken();
        removeUserInfo();
        message.error('登录已过期，请重新登录');
        if (window.location.pathname !== '/user/login') {
          window.location.href = '/user/login';
        }
        processQueue(err, null);
        return Promise.reject(data);
      });
    } else {
      removeToken();
      removeUserInfo();
      message.error('登录已过期，请重新登录');
      if (window.location.pathname !== '/user/login') {
        window.location.href = '/user/login';
      }
      processQueue(new Error('No refresh token'), null);
      return Promise.reject(data);
    }
  } else {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then(token => {
      if (token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        if (config) {
          config.headers.Authorization = `Bearer ${token}`;
          return instance(config);
        }
      }
      return Promise.reject(data);
    }).catch(err => {
      return Promise.reject(data);
    });
  }
}

export default instance;