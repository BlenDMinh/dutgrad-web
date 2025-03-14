"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, clearAuthTokens, setAuthTokens } from '@/lib/auth';
import { logoutUser, registerUser } from '@/actions/auth-actions';
import { APP_ROUTES } from '@/lib/constants';


interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  login: (accessToken: string) => void;
  register: (data: { first_name: string; last_name: string; email: string; password: string }) => Promise<void>;
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

  const login = (accessToken: string) => {
    setAuthTokens({ accessToken });
    setIsLoggedIn(true);
  };

  const register = async (data: { first_name: string; last_name: string; email: string; password: string }) => {
    try {
      const formData = new FormData();
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('email', data.email);
      formData.append('password', data.password);
  
      const response = await registerUser(formData); 
  
      if (response.error) {
        console.error("Registration failed:", response.error);
        return;
      }
      router.push(APP_ROUTES.LOGIN);
    } catch (error) {
      console.error("Error during registration:", error);
    }
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
    login,
    register
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
