import { auth } from './lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { AuthConfig } from '@auth/core/types';
import type { NextMiddleware } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');
  const isAuthRoute = req.nextUrl.pathname.startsWith('/auth/');

  // Handle root route
  if (req.nextUrl.pathname === '/' && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  if (!isLoggedIn && !isAuthRoute) {
    const url = new URL('/auth/login', req.url);
    url.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL('/calls/new', req.url));
  }

  if (isApiRoute && !isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
