import { z } from 'zod';
import Cookies from 'js-cookie';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

const ACCESS_TOKEN_EXPIRY = 15 * 60;
const REFRESH_TOKEN_EXPIRY = 7;

interface AuthTokensProps {
  accessToken: string;
}

export function setAuthTokens({ accessToken }: { accessToken: string }): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    
    Cookies.set('has-session', 'true', { path: '/', sameSite: 'strict' });
    Cookies.set('auth-token', accessToken, { path: '/', sameSite: 'strict' });
  }
}

export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
}

export function setAccessToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);

    Cookies.set('has-session', 'true', { path: '/', sameSite: 'strict' });
    Cookies.set('auth-token', token, { path: '/', sameSite: 'strict' });
  }
}

export function clearAuthTokens(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    
    Cookies.remove('has-session', { path: '/' });
    Cookies.remove('auth-token', { path: '/' });
  }
}

export function isAuthenticated(): boolean {
  const hasToken = !!getAccessToken();
  
  if (hasToken && typeof window !== 'undefined') {
    Cookies.set('has-session', 'true', { path: '/', sameSite: 'strict' });
    Cookies.set('auth-token', getAccessToken() as string, { path: '/', sameSite: 'strict' });
  }
  
  return hasToken;
}
