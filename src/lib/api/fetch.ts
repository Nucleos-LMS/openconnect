import { getSession } from 'next-auth/react';

/**
 * Extended Error interface with additional properties
 */
interface ApiError extends Error {
  status?: number;
  data?: any;
}

/**
 * Authenticated fetch utility for making API requests
 * Automatically adds authentication headers and handles JSON parsing
 */
export async function fetchWithAuth<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    // Get the current session to extract the auth token
    const session = await getSession();
    
    // Log the request for debugging
    console.log(`[API] Fetching ${url}`, { 
      authenticated: !!session,
      method: options.method || 'GET'
    });
    
    // Prepare headers with authentication if session exists
    const headers = new Headers(options.headers || {});
    
    // Set content type to JSON if not specified and we have a body
    if (options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    
    // Add authorization header if we have a session
    if (session?.user) {
      // TypeScript fix: Use type assertion for token access
      const token = (session.user as any).token || '';
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Merge our headers with the options
    const fetchOptions: RequestInit = {
      ...options,
      headers
    };
    
    // Make the request
    const response = await fetch(url, fetchOptions);
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const error = new Error(
        `API request failed: ${response.status} ${response.statusText}`
      ) as ApiError;
      
      error.status = response.status;
      error.data = errorData;
      
      console.error(`[API] Error fetching ${url}`, { 
        status: response.status, 
        statusText: response.statusText,
        data: errorData
      });
      
      throw error;
    }
    
    // Parse JSON response if the response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data as T;
    }
    
    // Return empty object for 204 No Content
    if (response.status === 204) {
      return {} as T;
    }
    
    // Return text response for other content types
    const text = await response.text();
    try {
      // Try to parse as JSON anyway in case content-type is wrong
      return JSON.parse(text) as T;
    } catch {
      // Return as text if not JSON
      return text as unknown as T;
    }
  } catch (error) {
    // Log and rethrow errors
    console.error('[API] Fetch error:', error);
    throw error;
  }
}

/**
 * Simplified fetch utility for public API endpoints that don't require authentication
 */
export async function fetchPublic<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    // Log the request for debugging
    console.log(`[API] Public fetch ${url}`, { 
      method: options.method || 'GET'
    });
    
    // Prepare headers
    const headers = new Headers(options.headers || {});
    
    // Set content type to JSON if not specified and we have a body
    if (options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    
    // Merge our headers with the options
    const fetchOptions: RequestInit = {
      ...options,
      headers
    };
    
    // Make the request
    const response = await fetch(url, fetchOptions);
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const error = new Error(
        `API request failed: ${response.status} ${response.statusText}`
      ) as Error & { status?: number; data?: any };
      
      error.status = response.status;
      error.data = errorData;
      
      console.error(`[API] Error fetching ${url}`, { 
        status: response.status, 
        statusText: response.statusText,
        data: errorData
      });
      
      throw error;
    }
    
    // Parse JSON response if the response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data as T;
    }
    
    // Return empty object for 204 No Content
    if (response.status === 204) {
      return {} as T;
    }
    
    // Return text response for other content types
    const text = await response.text();
    try {
      // Try to parse as JSON anyway in case content-type is wrong
      return JSON.parse(text) as T;
    } catch {
      // Return as text if not JSON
      return text as unknown as T;
    }
  } catch (error) {
    // Log and rethrow errors
    console.error('[API] Public fetch error:', error);
    throw error;
  }
}
