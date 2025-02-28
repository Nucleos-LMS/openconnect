import { handlers } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Enhanced logging wrapper for NextAuth handlers
const enhancedHandlers = {
  GET: async (req: NextRequest) => {
    console.log('[AUTH API DEBUG] GET request to:', req.nextUrl.pathname);
    console.log('[AUTH API DEBUG] Query params:', Object.fromEntries(req.nextUrl.searchParams.entries()));
    console.log('[AUTH API DEBUG] Cookies:', req.cookies);
    
    try {
      const response = await handlers.GET(req);
      
      // Log response status
      console.log('[AUTH API DEBUG] GET response status:', response.status);
      
      // Try to log response body if it's JSON
      try {
        const responseClone = response.clone();
        const body = await responseClone.json();
        console.log('[AUTH API DEBUG] GET response body:', body);
      } catch (e) {
        console.log('[AUTH API DEBUG] GET response is not JSON or could not be parsed');
      }
      
      // Log response headers
      console.log('[AUTH API DEBUG] GET response headers:', Object.fromEntries(response.headers.entries()));
      
      return response;
    } catch (error) {
      console.error('[AUTH API DEBUG] Error in GET handler:', error);
      throw error;
    }
  },
  
  POST: async (req: NextRequest) => {
    console.log('[AUTH API DEBUG] POST request to:', req.nextUrl.pathname);
    console.log('[AUTH API DEBUG] Query params:', Object.fromEntries(req.nextUrl.searchParams.entries()));
    console.log('[AUTH API DEBUG] Cookies:', req.cookies);
    
    // Try to log request body if it's JSON
    try {
      const reqClone = req.clone();
      const body = await reqClone.json();
      // Redact password if present
      if (body && body.password) {
        body.password = '[REDACTED]';
      }
      console.log('[AUTH API DEBUG] POST request body:', body);
    } catch (e) {
      console.log('[AUTH API DEBUG] POST request body is not JSON or could not be parsed');
    }
    
    try {
      const response = await handlers.POST(req);
      
      // Log response status
      console.log('[AUTH API DEBUG] POST response status:', response.status);
      
      // Try to log response body if it's JSON
      try {
        const responseClone = response.clone();
        const body = await responseClone.json();
        console.log('[AUTH API DEBUG] POST response body:', body);
      } catch (e) {
        console.log('[AUTH API DEBUG] POST response is not JSON or could not be parsed');
      }
      
      // Log response headers
      console.log('[AUTH API DEBUG] POST response headers:', Object.fromEntries(response.headers.entries()));
      
      // Special handling for CSRF token issues
      const setCookieHeader = response.headers.get('set-cookie');
      if (setCookieHeader) {
        console.log('[AUTH API DEBUG] Set-Cookie header present:', setCookieHeader);
        
        // Check for CSRF token cookie
        if (setCookieHeader.includes('next-auth.csrf-token')) {
          console.log('[AUTH API DEBUG] CSRF token cookie is being set');
        } else {
          console.log('[AUTH API DEBUG] CSRF token cookie is NOT being set');
        }
      } else {
        console.log('[AUTH API DEBUG] No Set-Cookie header in response');
      }
      
      return response;
    } catch (error) {
      console.error('[AUTH API DEBUG] Error in POST handler:', error);
      throw error;
    }
  }
};

export const GET = enhancedHandlers.GET;
export const POST = enhancedHandlers.POST;
