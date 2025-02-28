import { handlers } from '@/lib/auth';
import { NextRequest } from 'next/server';

// Enhanced logging wrapper for NextAuth handlers
const enhancedHandlers = {
  GET: async (req: NextRequest) => {
    console.log('[AUTH API DEBUG] GET request to:', req.nextUrl.pathname);
    
    try {
      const response = await handlers.GET(req);
      console.log('[AUTH API DEBUG] GET response status:', response.status);
      return response;
    } catch (error) {
      console.error('[AUTH API DEBUG] Error in GET handler:', error);
      throw error;
    }
  },
  
  POST: async (req: NextRequest) => {
    console.log('[AUTH API DEBUG] POST request to:', req.nextUrl.pathname);
    
    try {
      const response = await handlers.POST(req);
      console.log('[AUTH API DEBUG] POST response status:', response.status);
      return response;
    } catch (error) {
      console.error('[AUTH API DEBUG] Error in POST handler:', error);
      throw error;
    }
  }
};

export const GET = enhancedHandlers.GET;
export const POST = enhancedHandlers.POST;
