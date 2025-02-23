import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequestWithAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    return NextResponse.next();
  },
  {
  callbacks: {
    authorized({ req, token }) {
      // Protect all routes except public ones
      const publicPaths = ['/auth/login', '/auth/register'];
      const isPublicPath = publicPaths.some(path => 
        req.nextUrl.pathname.startsWith(path)
      );
      
      return !!token || isPublicPath;
    }
  }
});

export const config = {
  matcher: [
    // Match all paths except public assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
};
