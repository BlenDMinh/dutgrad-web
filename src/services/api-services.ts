import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import { AuthResponse } from '@/schemas/auth';
import { ApiResponse, isSuccessResponse } from '@/schemas/api';

// Types for request and response
interface LoginRequest {
  email: string;
  password: string;
}

interface ExchangeStateRequest {
  state: string;
}

// Helper method to handle API responses
const handleResponse = <T>(response: ApiResponse<T>): T => {
  if (isSuccessResponse(response)) {
    return response.data;
  }
  throw new Error(response.error || response.message || 'Unknown error');
};

// Auth service
export const authService = {
  // Login with email and password
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, credentials);
    return handleResponse(response.data);
  },
  
  // Logout the user
  logout: async (): Promise<void> => {
    const response = await apiClient.post(API_ROUTES.AUTH.LOGOUT);
    return handleResponse(response.data);
  },
  
  // Exchange OAuth state for tokens
  exchangeState: async (state: string): Promise<AuthResponse> => {
    const endpoint = `${API_ROUTES.AUTH.EXCHANGE_STATE}?state=${encodeURIComponent(state)}`;
    const response = await apiClient.post<AuthResponse>(endpoint);
    return handleResponse(response.data);
  },
  
  // Google OAuth redirect URL
  getGoogleAuthUrl: (): string => {
    // Build the backend callback URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
    const callbackUrl = `${backendUrl}/${apiVersion}${API_ROUTES.AUTH.GOOGLE}`;
    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=openid%20email%20profile&access_type=offline&service=lso&o2v=2&ddm=1&flowName=GeneralOAuthFlow`
    return googleLoginUrl;
  },
};

// User service
export const userService = {
  // Get current user profile
  getProfile: async () => {
    const response = await apiClient.get('/users/me');
    return handleResponse(response.data);
  },
  
  // Update user profile
  updateProfile: async (data: any) => {
    const response = await apiClient.put('/users/me', data);
    return handleResponse(response.data);
  },
};
