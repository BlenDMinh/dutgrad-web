import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { getAccessToken, setAccessToken } from './auth';
import { ApiResponse } from '@/schemas/api';

// Create a proper base URL with environment variables
const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const baseURL = `${apiBaseUrl}/${apiVersion}`;

// Create the API client instance
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Only attempt refresh if we have a refresh token
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        try {
          // Attempt to refresh the token
          const refreshResponse = await axios.post(`${baseURL}/auth/refresh`, {
            refreshToken,
          });
          
          if (refreshResponse.data?.data?.token) {
            // Update tokens
            const newToken = refreshResponse.data.data.token;
            setAccessToken(newToken);
            
            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }
      
      // If refresh failed or no refresh token, redirect to login
      if (typeof window !== 'undefined') {
        Cookies.remove('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Type-safe wrapper functions for API calls
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.get<ApiResponse<T>>(url, config);
  },
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.post<ApiResponse<T>>(url, data, config);
  },
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.put<ApiResponse<T>>(url, data, config);
  },
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.patch<ApiResponse<T>>(url, data, config);
  },
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.delete<ApiResponse<T>>(url, config);
  },
  
  // Access the underlying axios instance if needed
  instance: api
};

export default apiClient;
