import { NextRequest, NextResponse } from 'next/server';
import { APP_ROUTES } from './lib/constants';

// Define routes that are public (don't require authentication)
const publicRoutes = [
  APP_ROUTES.LOGIN, 
  APP_ROUTES.REGISTER, 
  '/forgot-password', 
  '/auth/callback',
  '/auth/success'
];

// Define routes that require authentication
const protectedRoutes = [
  APP_ROUTES.DASHBOARD, 
  APP_ROUTES.PROFILE, 
  '/settings'
];

// Define routes we don't want to redirect from (like api routes)
const ignoredRoutes = [
  '/_next', 
  '/api', 
  '/favicon.ico',
  '/auth/exchange-state'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for ignored routes
  if (ignoredRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Check if token exists in a cookie for server-side auth check
  const token = request.cookies.get('auth-token')?.value;
  
  // For client-side token in localStorage, we need to create a secondary flow
  // We'll store a session indicator in a cookie that middleware can access
  const hasSession = request.cookies.get('has-session')?.value === 'true';
  
  const isAuthenticated = !!token || hasSession;

  // If trying to access protected route but not authenticated
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    return NextResponse.redirect(new URL(APP_ROUTES.LOGIN, request.url));
  }

  // If trying to access auth routes but already authenticated
  // This is the key issue - we need to make sure this is consistent
  if (publicRoutes.some(route => pathname === route) && isAuthenticated) {
    return NextResponse.redirect(new URL(APP_ROUTES.DASHBOARD, request.url));
  }

  // Special case for home page when authenticated - redirect to dashboard
  if (pathname === '/' && isAuthenticated) {
    return NextResponse.redirect(new URL(APP_ROUTES.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

// Use a static value for matcher that Next.js can statically analyze
export const config = {
  matcher: [
    '/',
    '/login',
    '/register', 
    '/forgot-password',
    '/auth/callback',
    '/auth/success',
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*'
  ]
};
