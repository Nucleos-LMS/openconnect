import { NextRequest, NextResponse } from 'next/server';
import { getToken, JWT } from 'next-auth/jwt';

// This is a debug version of the middleware that logs detailed information
// about the request, session, and authentication state
export async function debugMiddleware(req: NextRequest) {
  console.log('[MIDDLEWARE DEBUG] Request URL:', req.nextUrl.toString());
  console.log('[MIDDLEWARE DEBUG] Request pathname:', req.nextUrl.pathname);
  console.log('[MIDDLEWARE DEBUG] Request method:', req.method);
  
  // Check for authentication token
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    console.log('[MIDDLEWARE DEBUG] JWT token exists:', !!token);
    if (token) {
      // Safely log token data with optional chaining
      console.log('[MIDDLEWARE DEBUG] JWT token data:', {
        name: token.name || null,
        email: token.email || null,
        exp: token.exp || null,
        iat: token.iat || null,
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
    console.log('[MIDDLEWARE DEBUG] ===== Request End =====');
    
    return response;
  };
}
