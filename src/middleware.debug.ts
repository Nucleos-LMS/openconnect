import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// This is a debug version of the middleware that logs detailed information
// about the request, session, and authentication state
export async function debugMiddleware(req: NextRequest) {
  console.log('[MIDDLEWARE DEBUG] Request URL:', req.nextUrl.toString());
  console.log('[MIDDLEWARE DEBUG] Request pathname:', req.nextUrl.pathname);
  console.log('[MIDDLEWARE DEBUG] Request method:', req.method);
  console.log('[MIDDLEWARE DEBUG] Request headers:', Object.fromEntries(req.headers.entries()));
  console.log('[MIDDLEWARE DEBUG] Request cookies:', req.cookies);
  
  // Check for authentication token
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    console.log('[MIDDLEWARE DEBUG] JWT token exists:', !!token);
    if (token) {
      console.log('[MIDDLEWARE DEBUG] JWT token data:', {
        name: token.name,
        email: token.email,
        role: token.role,
        exp: token.exp,
        iat: token.iat,
      });
    }
  } catch (error) {
    console.error('[MIDDLEWARE DEBUG] Error getting token:', error);
  }
  
  // Continue with the request
  return NextResponse.next();
}

// Export a function to wrap the original middleware with debug logging
export function withDebugLogging(middleware: (req: NextRequest) => NextResponse | Promise<NextResponse>) {
  return async function(req: NextRequest) {
    // Log request details before middleware
    console.log('[MIDDLEWARE DEBUG] ===== Request Start =====');
    await debugMiddleware(req);
    
    // Call the original middleware
    const response = await middleware(req);
    
    // Log response details after middleware
    console.log('[MIDDLEWARE DEBUG] Response status:', response.status);
    console.log('[MIDDLEWARE DEBUG] Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('[MIDDLEWARE DEBUG] ===== Request End =====');
    
    return response;
  };
}
