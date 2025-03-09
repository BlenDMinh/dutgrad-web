import { z } from 'zod';
import Cookies from 'js-cookie';

// Login request validation schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

// Token expiration time (15 minutes in seconds)
const ACCESS_TOKEN_EXPIRY = 15 * 60;
// Refresh token expiration (7 days)
const REFRESH_TOKEN_EXPIRY = 7;

// User can be authenticated with either accessToken or token
interface AuthTokensProps {
  accessToken: string;
}

// Set tokens in localStorage and cookies
export function setAuthTokens({ accessToken }: { accessToken: string }): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    
    // Set cookies for middleware to access
    Cookies.set('has-session', 'true', { path: '/', sameSite: 'strict' });
    Cookies.set('auth-token', accessToken, { path: '/', sameSite: 'strict' });
  }
}

// Get access token from localStorage
export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
}

// Set access token (used during token refresh or when getting it from OAuth)
export function setAccessToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
    
    // Set cookies for middleware to access
    Cookies.set('has-session', 'true', { path: '/', sameSite: 'strict' });
    Cookies.set('auth-token', token, { path: '/', sameSite: 'strict' });
  }
}

// Clear auth tokens on logout
export function clearAuthTokens(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    
    // Clear the auth cookies
    Cookies.remove('has-session', { path: '/' });
    Cookies.remove('auth-token', { path: '/' });
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const hasToken = !!getAccessToken();
  
  if (hasToken && typeof window !== 'undefined') {
    // Ensure the cookie is set whenever we check auth and find a token
    Cookies.set('has-session', 'true', { path: '/', sameSite: 'strict' });
    Cookies.set('auth-token', getAccessToken() as string, { path: '/', sameSite: 'strict' });
  }
  
  return hasToken;
}
