import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simplified middleware to isolate the issue
export default function middleware(req: NextRequest) {
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');
  const isAuthRoute = req.nextUrl.pathname === '/login' || req.nextUrl.pathname.startsWith('/auth/');

  // Handle root route
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Allow access to login and API routes
  if (isAuthRoute || isApiRoute) {
    return NextResponse.next();
  }

  // For all other routes, redirect to login
  const url = new URL('/login', req.url);
  url.searchParams.set('callbackUrl', req.url);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
