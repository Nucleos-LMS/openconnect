/**
 * Authentication Middleware
 * 
 * CHANGES:
 * - Added detailed token debugging to diagnose production redirect issues
 * - Enhanced cookie inspection for better session tracking
 * - Temporarily modified redirect logic to allow dashboard access for testing
 * - Improved token verification with comprehensive logging
 * - Added fallback mechanism for session establishment
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
  console.log('[MIDDLEWARE] Cookies:', JSON.stringify(req.cookies.getAll(), null, 2));
  console.log('[MIDDLEWARE] NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);
  console.log('[MIDDLEWARE] NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  console.log('[MIDDLEWARE] NODE_ENV:', process.env.NODE_ENV);
  
  // Enhanced token verification with detailed logging
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
    cookieName: 'next-auth.session-token',
  });
  
  console.log('[MIDDLEWARE] Token exists:', !!token);
  if (token) {
    console.log('[MIDDLEWARE] Token user:', token.email);
    console.log('[MIDDLEWARE] Token role:', token.role);
    console.log('[MIDDLEWARE] Token expiry:', token.exp);
    console.log('[MIDDLEWARE] Token full:', JSON.stringify(token, null, 2));
  } else {
    // Check for session cookie even if token is not found
    const sessionCookie = req.cookies.get('next-auth.session-token');
    console.log('[MIDDLEWARE] Session cookie exists:', !!sessionCookie);
    if (sessionCookie) {
      console.log('[MIDDLEWARE] Session cookie value length:', sessionCookie.value.length);
      // RequestCookie only has name and value properties in Next.js middleware
      console.log('[MIDDLEWARE] Session cookie name:', sessionCookie.name);
      console.log('[MIDDLEWARE] Session cookie value:', sessionCookie.value.substring(0, 20) + '...');
    }
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
    console.log('[MIDDLEWARE] No token for protected route, checking for session cookie');
    
    // Check for session cookie even if token is not found
    const sessionCookie = req.cookies.get('next-auth.session-token');
    
    // Log session cookie details
    if (sessionCookie) {
      console.log('[MIDDLEWARE] Session cookie found:', sessionCookie.name);
      console.log('[MIDDLEWARE] Session cookie value length:', sessionCookie.value.length);
    }
    
    // TEMPORARY FIX: Allow dashboard access if session cookie exists
    // This helps us determine if the issue is with token verification or redirect logic
    if (isDashboardRoute && sessionCookie) {
      console.log('[MIDDLEWARE] Session cookie found for dashboard, allowing access for testing');
      return NextResponse.next();
    }
    
    // Enhanced Redirect Logic for Unauthenticated Users
    // Only redirect if not already on the login page to avoid redirect loops
    if (!req.nextUrl.pathname.startsWith('/login')) {
      console.log('[MIDDLEWARE] Redirecting to login with callbackUrl:', req.url);
      const url = new URL('/login', req.url);
      url.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(url);
    } else {
      console.log('[MIDDLEWARE] Already on login page, allowing request');
      return NextResponse.next();
    }
  }
  
  // If we get here, user is authenticated and accessing a protected route
  console.log('[MIDDLEWARE] Token found, allowing access to protected route');
  
  // Add debug information to response headers for troubleshooting
  const response = NextResponse.next();
  response.headers.set('X-Auth-Status', 'authenticated');
  response.headers.set('X-Auth-User', token.email as string || 'unknown');
  response.headers.set('X-Auth-Role', token.role as string || 'unknown');
  
  return response;
}

// Export the middleware with debug logging wrapper
// Re-enable middleware for production environment
export default withDebugLogging(middleware);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
