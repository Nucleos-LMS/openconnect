import { type NextAuthConfig, DefaultSession } from 'next-auth';
import { JWT } from '@auth/core/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@vercel/postgres';
import { AdapterUser } from '@auth/core/adapters';
import { urls } from '../config/urls';
import type { CustomUser, UserRole } from './types/shared';

declare module '@auth/core/jwt' {
  interface JWT {
    role?: UserRole;
    facility_id?: string;
  }
}

/**
 * Environment Variable Handling
 * 
 * CHANGES:
 * - Added proper type checking for process and process.env to avoid client-side errors
 * - Improved environment variable handling to prevent build failures in Vercel deployment
 * - Added safer environment variable handling for production
 */
// Check for NEXTAUTH_URL environment variable - only run on server
if (typeof process !== 'undefined' && 
    typeof process.env !== 'undefined') {
  
  // Log environment information for debugging
  console.log('[AUTH CONFIG] Environment:', process.env.NODE_ENV);
  console.log('[AUTH CONFIG] NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  
  // Only log a warning if NEXTAUTH_URL is not set
  if (!process.env.NEXTAUTH_URL) {
    console.warn('[AUTH CONFIG] NEXTAUTH_URL environment variable is not set.');
  }
}

// Determine if we're in development mode - safely check environment
// Use a function to avoid client-side reference errors
const getIsDev = () => {
  try {
    return typeof process !== 'undefined' && 
           typeof process.env !== 'undefined' && 
           process.env.NODE_ENV === 'development';
  } catch (e) {
    return false;
  }
};

const isDev = getIsDev();

export const authConfig: NextAuthConfig = {
  debug: true, // Enable debug logging
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? "__Secure-next-auth.session-token" 
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        maxAge: 30 * 24 * 60 * 60, // 30 days
        domain: process.env.NODE_ENV === 'production' 
          ? ".vercel.app" // Use your production domain
          : undefined,
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production' 
        ? "__Secure-next-auth.csrf-token" 
        : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
    callbackUrl: {
      name: process.env.NODE_ENV === 'production' 
        ? "__Secure-next-auth.callback-url" 
        : "next-auth.callback-url",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials, request) {
        const { email, password } = credentials || {};
        
        console.log('[AUTH DEBUG] authorize() called with email:', email);
        
        // For test users, allow any password
        if (typeof email === 'string' && email.endsWith('@test.facility.com')) {
          console.log('[AUTH DEBUG] Test user detected, bypassing database check');
          
          // Determine role based on email prefix
          let role: UserRole = 'visitor';
          if (email.startsWith('inmate@')) {
            role = 'resident' as UserRole;
          } else if (email.startsWith('staff@')) {
            role = 'staff';
          } else if (email.startsWith('family@')) {
            role = 'family';
          }
          
          const customUser = {
            id: '1',
            name: 'Test User',
            email: email as string,
            role,
            facility_id: '123',
            image: null,
            emailVerified: new Date()
          } satisfies CustomUser;
          
          console.log('[AUTH DEBUG] Returning test user:', customUser);
          return customUser;
        }
        
        // For local development, accept any credentials to simplify testing
        if (isDev && typeof email === 'string' && !email.endsWith('@test.facility.com')) {
          console.log('[AUTH DEBUG] Development mode, accepting any credentials');
          return {
            id: '999',
            name: 'Dev User',
            email: email || 'dev@example.com',
            role: 'staff' as UserRole,
            facility_id: '123',
            image: null,
            emailVerified: new Date()
          } satisfies CustomUser;
        }
        
        // For real users, check against database
        let client;
        try {
          // Use environment variables for database connection
          // The @vercel/postgres client automatically uses POSTGRES_URL or POSTGRES_URL_NON_POOLING
          client = createClient();
          await client.connect();
          
          console.log('[AUTH DEBUG] Querying database for user:', email);
          
          const { rows } = await client.query(
            'SELECT id, email, name, role, facility_id FROM users WHERE email = $1',
            [email]
          );

          console.log('[AUTH DEBUG] Query result rows:', rows.length);
          
          if (rows.length === 0) {
            console.log('[AUTH DEBUG] No user found with email:', email);
            return null;
          }

          const user = rows[0];
          console.log('[AUTH DEBUG] User found:', { id: user.id, email: user.email, role: user.role });
          
          // In production, verify password hash here
          // For test users, allow any password
          const customUser = {
            id: user.id?.toString() || '',
            email: user.email?.toString() || '',
            name: user.name?.toString() || null,
            role: (user.role?.toString() || 'visitor') as UserRole,
            facility_id: user.facility_id?.toString() || '',
            image: null,
            emailVerified: new Date()
          } satisfies CustomUser;
          
          console.log('[AUTH DEBUG] Returning user:', customUser);
          return customUser;
        } catch (error) {
          console.error('[AUTH DEBUG] Error in authorize():', error);
          throw error;
        } finally {
          try {
            // Only attempt to close the client if it exists and is defined
            if (client) {
              await client.end();
            }
          } catch (err) {
            console.error('[AUTH DEBUG] Error closing client:', err);
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('[AUTH DEBUG] jwt() callback called');
      
      if (user) {
        console.log('[AUTH DEBUG] jwt() adding user data to token');
        const customUser = user as CustomUser;
        return {
          ...token,
          role: customUser.role,
          facility_id: customUser.facility_id
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log('[AUTH DEBUG] session() callback called');
      
      if (token && session.user) {
        console.log('[AUTH DEBUG] session() adding token data to session');
        session.user = {
          ...session.user,
          role: (token.role || 'visitor') as UserRole,
          facility_id: token.facility_id || ''
        };
      }
      return session;
    },
    // Enhanced redirect callback with improved server-side redirect handling
    async redirect({ url, baseUrl }) {
      console.log('[AUTH DEBUG] redirect() callback called with:', { url, baseUrl });
      console.log('[AUTH DEBUG] Current NODE_ENV:', process.env.NODE_ENV);
      
      // For production environment, always redirect to dashboard after login
      if (process.env.NODE_ENV === 'production' && url.includes('/login')) {
        console.log('[AUTH DEBUG] Production login detected, forcing dashboard redirect');
        return `${baseUrl}/dashboard`;
      }
      
      // For dashboard URLs, ensure they're properly formed
      if (url.includes('/dashboard')) {
        console.log('[AUTH DEBUG] Dashboard URL detected, ensuring proper format');
        return `${baseUrl}/dashboard`;
      }
      
      // If the URL is relative, prepend the base URL
      if (url.startsWith('/')) {
        const fullUrl = `${baseUrl}${url}`;
        console.log('[AUTH DEBUG] Relative URL, redirecting to:', fullUrl);
        return fullUrl;
      }
      
      // If the URL is on the same site, allow it
      if (url.startsWith(baseUrl)) {
        console.log('[AUTH DEBUG] Same-site URL, redirecting to:', url);
        return url;
      }
      
      // Default to dashboard for authenticated users
      console.log('[AUTH DEBUG] Default redirect to dashboard');
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: '/login',
  },
  events: {
    async signIn(message) {
      console.log('[AUTH DEBUG] signIn event:', message);
    },
    async signOut(message) {
      console.log('[AUTH DEBUG] signOut event:', message);
    },
    async createUser(message) {
      console.log('[AUTH DEBUG] createUser event:', message);
    },
    async updateUser(message) {
      console.log('[AUTH DEBUG] updateUser event:', message);
    },
    async linkAccount(message) {
      console.log('[AUTH DEBUG] linkAccount event:', message);
    },
    async session(message) {
      console.log('[AUTH DEBUG] session event:', message);
    },
  },
};
