/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import { AuthResponse } from '@/schemas/auth';
import { ApiResponse, isSuccessResponse } from '@/schemas/api';
import { registerSchema } from '@/schemas/auth';
import { z } from 'zod';

type RegisterFormData = z.infer<typeof registerSchema>;

interface LoginRequest {
  email: string;
  password: string;
}
interface ExchangeStateRequest {
  state: string;
}

const handleResponse = <T>(response: ApiResponse<T>): T => {
  if (isSuccessResponse(response)) {
    return response.data;
  }
  throw new Error(response.error || response.message || 'Unknown error');
};

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, credentials);
    return handleResponse(response.data);
  },

  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(API_ROUTES.AUTH.REGISTER, data);
    return handleResponse(response.data);
  },
  
  logout: async (): Promise<void> => {
    const response = await apiClient.post(API_ROUTES.AUTH.LOGOUT);
    return handleResponse(response.data);
  },
  
  exchangeState: async (state: string): Promise<AuthResponse> => {
    const endpoint = `${API_ROUTES.AUTH.EXCHANGE_STATE}?state=${encodeURIComponent(state)}`;
    const response = await apiClient.post<AuthResponse>(endpoint);
    return handleResponse(response.data);
  },
  
  getGoogleAuthUrl: (): string => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
    const callbackUrl = `${backendUrl}/${apiVersion}${API_ROUTES.AUTH.GOOGLE}`;
    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=openid%20email%20profile&access_type=offline&service=lso&o2v=2&ddm=1&flowName=GeneralOAuthFlow`
    return googleLoginUrl;
  },
};

export const userService = {
  getProfile: async () => {
    const response = await apiClient.get('/users/me');
    return handleResponse(response.data);
  },
  
  updateProfile: async (data: any) => {
    const response = await apiClient.put('/users/me', data);
    return handleResponse(response.data);
  },
};
