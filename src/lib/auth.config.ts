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

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      async authorize(credentials, request) {
        const { email, password } = credentials || {};
        
        const client = createClient({
          connectionString: process.env.POSTGRES_URL_NON_POOLING
        });
        await client.connect();
        
        try {
          const { rows } = await client.query(
            'SELECT id, email, name, role, facility_id FROM users WHERE email = $1',
            [email]
          );

          if (rows.length === 0) {
            return null;
          }

          const user = rows[0];
          // In production, verify password hash here
          // For test users, allow any password
          return {
            id: user.id?.toString() || '',
            email: user.email?.toString() || '',
            name: user.name?.toString() || null,
            role: (user.role?.toString() || 'visitor') as UserRole,
            facility_id: user.facility_id?.toString() || '',
            image: null,
            emailVerified: new Date()
          } satisfies CustomUser;
        } finally {
          await client.end();
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
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
      if (token && session.user) {
        session.user = {
          ...session.user,
          role: (token.role || 'visitor') as UserRole,
          facility_id: token.facility_id || ''
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
