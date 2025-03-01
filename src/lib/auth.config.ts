import { type NextAuthConfig } from 'next-auth';
import { JWT } from '@auth/core/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@vercel/postgres';
import { AdapterUser } from '@auth/core/adapters';
import { urls } from '../config/urls';

type UserRole = 'visitor' | 'family' | 'legal' | 'educator' | 'staff';

interface CustomUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  facility_id: string;
  image: string | null;
  emailVerified: Date | null;
}

declare module '@auth/core/jwt' {
  interface JWT {
    role?: UserRole;
    facility_id?: string;
  }
}

declare module 'next-auth' {
  interface User extends CustomUser {}
  interface Session {
    user: CustomUser;
  }
}

/**
 * Environment Variable Handling
 * 
 * CHANGES:
 * - Added proper type checking for process and process.env to avoid client-side errors
 * - Improved environment variable handling to prevent build failures in Vercel deployment
 * - Maintained fallback to window.location.origin when NEXTAUTH_URL is not set
 */
// Check for NEXTAUTH_URL environment variable - only run on server
if (typeof process !== 'undefined' && 
    typeof process.env !== 'undefined' && 
    !process.env.NEXTAUTH_URL && 
    typeof window !== 'undefined') {
  console.warn('[AUTH CONFIG] NEXTAUTH_URL environment variable is not set. Using window.location.origin as fallback.');
  process.env.NEXTAUTH_URL = window.location.origin;
}

// Determine if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

console.log('[AUTH CONFIG] Environment:', process.env.NODE_ENV);
console.log('[AUTH CONFIG] isDev:', isDev);
console.log('[AUTH CONFIG] NEXTAUTH_URL:', process.env.NEXTAUTH_URL);

export const authConfig: NextAuthConfig = {
  debug: true, // Enable debug logging
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax", // Changed from "none" to "lax" for better compatibility
        path: "/",
        secure: !isDev, // Only use secure in production, not in development
      },
    },
    csrfToken: {
      name: "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax", // Changed from "none" to "lax" for better compatibility
        path: "/",
        secure: !isDev, // Only use secure in production, not in development
      },
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials, request) {
        const { email, password } = credentials || {};
        
        console.log('[AUTH DEBUG] authorize() called with email:', email);
        
        // Use environment variables for database connection
        // The @vercel/postgres client automatically uses POSTGRES_URL or POSTGRES_URL_NON_POOLING
        const client = createClient();
        await client.connect();
        
        try {
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
          await client.end();
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
    // Add redirect callback to control redirects after authentication
    async redirect({ url, baseUrl }) {
      console.log('[AUTH DEBUG] redirect() callback called with:', { url, baseUrl });
      
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
