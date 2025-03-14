'use server'

import { redirect } from 'next/navigation';
import { API_ROUTES } from '@/lib/constants';

/**
 * Initiates Google OAuth flow
 */
export async function initiateGoogleAuth() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const redirectUrl = `${apiUrl}${API_ROUTES.AUTH.GOOGLE}`;
  
  redirect(redirectUrl);
}

/**
 * Processes an OAuth callback with a token
 */
export async function processAuthCallback(token: string) {
  if (token) {
    return { success: true, token };
  }
  
  return { success: false, error: 'No token provided' };
}
