'use server'

import { redirect } from 'next/navigation';
import { API_ROUTES, APP_ROUTES } from '@/lib/constants';

/**
 * Initiates Google OAuth flow
 */
export async function initiateGoogleAuth() {
  // In a real implementation, you'd get the redirect URL from your backend
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const redirectUrl = `${apiUrl}${API_ROUTES.AUTH.GOOGLE}`;
  
  // For server components, use redirect
  redirect(redirectUrl);
}

/**
 * Processes an OAuth callback with a token
 */
export async function processAuthCallback(token: string) {
  // Store the token in cookies for client-side access
  if (token) {
    // In a real implementation, verify the token with your backend
    // and get additional user information if needed
    
    // For now, just return the token so the client can use it
    return { success: true, token };
  }
  
  return { success: false, error: 'No token provided' };
}
