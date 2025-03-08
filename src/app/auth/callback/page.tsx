"use client"

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { APP_ROUTES } from '@/lib/constants';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get the token from the URL
        const token = searchParams.get('token');
        if (!token) {
          setError('No authentication token received');
          return;
        }
        
        // Use the token to log in
        login(token);
        
        // Redirect to the home page or dashboard
        router.push(APP_ROUTES.HOME);
      } catch (err) {
        console.error('Authentication callback error:', err);
        setError('Failed to process authentication');
      }
    };
    
    processCallback();
  }, [searchParams, router, login]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">Authentication Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => router.push(APP_ROUTES.LOGIN)}
            className="text-primary underline"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-2">Completing login...</h1>
        <p className="text-muted-foreground">Please wait while we verify your authentication.</p>
      </div>
    </div>
  );
}
