"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, clearAuthTokens, setAuthTokens } from '@/lib/auth';
import { APP_ROUTES } from '@/lib/constants';
import { logoutUser } from './action';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  loginSuccess: (accessToken: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkInitialAuth = async () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);
      setIsLoading(false);
    };
    
    checkInitialAuth();
  }, [pathname]); 

  const checkAuth = async () => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);
    return authenticated;
  };

  const loginSuccess = (accessToken: string) => {
    setAuthTokens({ accessToken });
    setIsLoggedIn(true);
  };
  
  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      clearAuthTokens();
      setIsLoggedIn(false);
      router.push(APP_ROUTES.LOGIN);
    }
  };

  const value = {
    isLoggedIn,
    isLoading,
    logout,
    checkAuth,
    loginSuccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
