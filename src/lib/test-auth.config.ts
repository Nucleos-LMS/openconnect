import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Import UserRole type from auth.config.ts
type UserRole = 'visitor' | 'family' | 'legal' | 'educator' | 'staff';

// Determine if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

console.log('[TEST AUTH CONFIG] Environment:', process.env.NODE_ENV);
console.log('[TEST AUTH CONFIG] isDev:', isDev);
console.log('[TEST AUTH CONFIG] NEXTAUTH_URL:', process.env.NEXTAUTH_URL);

export const testAuthConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  // Session / Cookie logic
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: { email: { type: 'email' }, password: { type: 'password' } },
      async authorize(credentials) {
        console.log('[TEST AUTH DEBUG] authorize() called with email:', credentials?.email);
        
        // For test purposes, accept any credentials
        if (credentials?.email) {
          return { 
            id: '1', 
            email: credentials.email as string, 
            name: 'Test User',
            role: 'visitor',
            facility_id: '123',
            image: null,
            emailVerified: new Date()
          };
        }
        return null;
      },
    })
  ],
  // Minimal callbacks
  callbacks: {
    async jwt({ token, user }) {
      console.log('[TEST AUTH DEBUG] jwt() callback called');
      
      if (user) {
        console.log('[TEST AUTH DEBUG] jwt() adding user data to token');
        return {
          ...token,
          role: user.role,
          facility_id: user.facility_id
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log('[TEST AUTH DEBUG] session() callback called');
      
      if (token && session.user) {
        console.log('[TEST AUTH DEBUG] session() adding token data to session');
        // Create a new user object with the correct types
        session.user = {
          ...session.user,
          // Use a valid role value that matches the expected UserRole type
          role: 'visitor' as UserRole,
          facility_id: token.facility_id || ''
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('[TEST AUTH DEBUG] redirect() callback called with:', { url, baseUrl });
      
      // If the URL is relative, prepend the base URL
      if (url.startsWith('/')) {
        const fullUrl = `${baseUrl}${url}`;
        console.log('[TEST AUTH DEBUG] Relative URL, redirecting to:', fullUrl);
        return fullUrl;
      }
      
      // If the URL is on the same site, allow it
      if (url.startsWith(baseUrl)) {
        console.log('[TEST AUTH DEBUG] Same-site URL, redirecting to:', url);
        return url;
      }
      
      // Default to dashboard for authenticated users
      console.log('[TEST AUTH DEBUG] Default redirect to dashboard');
      return `${baseUrl}/dashboard`;
    },
  },
  // Local cookies
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        secure: false, // Set to false for local development
        sameSite: 'lax',
        path: '/',
      },
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        secure: false, // Set to false for local development
        sameSite: 'lax',
        path: '/',
      },
    },
  },
  pages: {
    signIn: '/login',
  },
};
