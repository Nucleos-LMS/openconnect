/**
 * Authentication Middleware
 * 
 * CHANGES:
 * - Added proper type declarations for next/server, next-auth/jwt, and Node.js
 * - Enhanced logging for better debugging of authentication issues
 * - Improved token verification and route protection
 * - Ensured compatibility with NextAuth's redirect functionality
 * - Properly configured callbackUrl for seamless authentication flow
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withDebugLogging } from './middleware.debug';
import { getToken } from 'next-auth/jwt';

// Enhanced middleware with proper token verification and debug logging
async function middleware(req: NextRequest) {
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');
  const isAuthRoute = req.nextUrl.pathname === '/login' || req.nextUrl.pathname.startsWith('/auth/');
  const isDashboardRoute = req.nextUrl.pathname === '/dashboard' || req.nextUrl.pathname.startsWith('/dashboard/');
  const isStaticAsset = req.nextUrl.pathname.match(/\.(js|css|png|jpg|svg|ico)$/);
  const isPublicRoute = req.nextUrl.pathname.startsWith('/_next') || 
                        req.nextUrl.pathname === '/favicon.ico' ||
                        req.nextUrl.pathname.startsWith('/images/');

  console.log('[MIDDLEWARE] Processing request:', req.nextUrl.pathname);
  console.log('[MIDDLEWARE] isApiRoute:', isApiRoute);
  console.log('[MIDDLEWARE] isAuthRoute:', isAuthRoute);
  console.log('[MIDDLEWARE] isDashboardRoute:', isDashboardRoute);
  console.log('[MIDDLEWARE] isPublicRoute:', isPublicRoute);
  
  // Skip middleware for static assets and public routes
  if (isStaticAsset || isPublicRoute) {
    console.log('[MIDDLEWARE] Static asset or public route, skipping middleware');
    return NextResponse.next();
  }

  // Get the token using next-auth/jwt which handles different environments correctly
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  console.log('[MIDDLEWARE] Token exists:', !!token);
  if (token) {
    console.log('[MIDDLEWARE] Token user:', token.email);
    console.log('[MIDDLEWARE] Token role:', token.role);
    console.log('[MIDDLEWARE] Token expiry:', token.exp);
  }
  
  // Handle root route
  if (req.nextUrl.pathname === '/') {
    console.log('[MIDDLEWARE] Root route, checking for token');
    
    if (token) {
      console.log('[MIDDLEWARE] Token found, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } else {
      console.log('[MIDDLEWARE] No token, redirecting to login');
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Always allow access to login and API routes regardless of authentication status
  if (isAuthRoute || isApiRoute) {
    console.log('[MIDDLEWARE] API or auth route, skipping auth check');
    return NextResponse.next();
  }
  
  // For protected routes (including dashboard), ensure user is authenticated
  if (!token) {
    console.log('[MIDDLEWARE] No token for protected route, redirecting to login');
    
    // Only redirect if not already on the login page to avoid redirect loops
    if (!req.nextUrl.pathname.startsWith('/login')) {
      const url = new URL('/login', req.url);
      url.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(url);
    }
  }

  // If we get here, user is authenticated and accessing a protected route
  console.log('[MIDDLEWARE] Token found, allowing access to protected route');
  return NextResponse.next();
}

// Export the middleware with debug logging wrapper
export default withDebugLogging(middleware);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
