import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withDebugLogging } from './middleware.debug';
import { getToken } from 'next-auth/jwt';

// Enhanced middleware with proper token verification
async function middleware(req: NextRequest) {
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');
  const isAuthRoute = req.nextUrl.pathname === '/login' || req.nextUrl.pathname.startsWith('/auth/');
  const isDashboardRoute = req.nextUrl.pathname === '/dashboard' || req.nextUrl.pathname.startsWith('/dashboard/');
  const isStaticAsset = req.nextUrl.pathname.match(/\.(js|css|png|jpg|svg|ico)$/);

  console.log('[MIDDLEWARE] Processing request:', req.nextUrl.pathname);
  console.log('[MIDDLEWARE] isApiRoute:', isApiRoute);
  console.log('[MIDDLEWARE] isAuthRoute:', isAuthRoute);
  console.log('[MIDDLEWARE] isDashboardRoute:', isDashboardRoute);
  
  // Skip middleware for static assets
  if (isStaticAsset) {
    return NextResponse.next();
  }

  // Get the token using next-auth/jwt which handles different environments correctly
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  console.log('[MIDDLEWARE] Token exists:', !!token);
  
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

  // Allow access to login and API routes
  if (isAuthRoute || isApiRoute) {
    console.log('[MIDDLEWARE] API or auth route, skipping auth check');
    return NextResponse.next();
  }
  
  // For dashboard routes, ensure user is authenticated
  if (isDashboardRoute) {
    console.log('[MIDDLEWARE] Dashboard route, checking authentication');
    
    if (!token) {
      console.log('[MIDDLEWARE] No token, redirecting to login');
      const url = new URL('/login', req.url);
      url.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(url);
    }
  }

  // For all other routes, redirect to login if not authenticated
  if (!token) {
    console.log('[MIDDLEWARE] No token, redirecting to login');
    const url = new URL('/login', req.url);
    url.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(url);
  }

  console.log('[MIDDLEWARE] Token found, allowing access');
  return NextResponse.next();
}

// Export the middleware with debug logging wrapper
export default withDebugLogging(middleware);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
