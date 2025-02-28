import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withDebugLogging } from './middleware.debug';

// Simplified middleware to isolate the issue
function middleware(req: NextRequest) {
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');
  const isAuthRoute = req.nextUrl.pathname === '/login' || req.nextUrl.pathname.startsWith('/auth/');

  console.log('[MIDDLEWARE] Processing request:', req.nextUrl.pathname);
  console.log('[MIDDLEWARE] isApiRoute:', isApiRoute);
  console.log('[MIDDLEWARE] isAuthRoute:', isAuthRoute);

  // Handle root route
  if (req.nextUrl.pathname === '/') {
    console.log('[MIDDLEWARE] Root route, redirecting to login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Allow access to login and API routes
  if (isAuthRoute || isApiRoute) {
    console.log('[MIDDLEWARE] API or auth route, skipping auth check');
    return NextResponse.next();
  }

  // For all other routes, redirect to login if not authenticated
  const cookies = req.cookies;
  const sessionToken = cookies.get('next-auth.session-token');
  
  console.log('[MIDDLEWARE] Session token cookie exists:', !!sessionToken);
  
  if (!sessionToken) {
    console.log('[MIDDLEWARE] No session token, redirecting to login');
    const url = new URL('/login', req.url);
    url.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(url);
  }

  console.log('[MIDDLEWARE] Session token found, allowing access');
  return NextResponse.next();
}

// Export the middleware with debug logging wrapper
export default withDebugLogging(middleware);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
