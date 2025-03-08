import { NextRequest, NextResponse } from 'next/server';

// Define routes that are public (don't require authentication)
const publicRoutes = ['/login', '/register', '/forgot-password', '/auth/callback'];

// Define routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if token exists in a cookie for server-side auth check
  // This needs to match how you're storing the token on the client
  const token = request.cookies.get('auth-token')?.value;
  
  // For client-side token in localStorage, we need to create a secondary flow
  // We'll store a session indicator in a cookie that middleware can access
  const hasSession = request.cookies.get('has-session')?.value === 'true';
  
  const isAuthenticated = !!token || hasSession;

  // If trying to access protected route but not authenticated
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access auth routes but already authenticated
  if (publicRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Use a static value for matcher that Next.js can statically analyze
export const config = {
  matcher: [
    '/login',
    '/register', 
    '/forgot-password',
    '/auth/callback',
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*'
  ]
};
