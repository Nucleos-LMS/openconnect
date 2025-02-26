import { type NextAuthConfig } from 'next-auth';
import { JWT } from '@auth/core/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@vercel/postgres';
import { AdapterUser } from '@auth/core/adapters';

type UserRole = 'visitor' | 'family' | 'legal' | 'educator' | 'staff';

interface CustomUser extends AdapterUser {
  role: UserRole;
  facility_id: string;
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
        
        const client = createClient();
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
          const customUser: CustomUser = {
            id: user.id?.toString() || '',
            email: user.email?.toString() || '',
            name: user.name?.toString() || null,
            role: (user.role?.toString() || 'visitor') as UserRole,
            facility_id: user.facility_id?.toString() || '',
            image: null,
            emailVerified: new Date()
          };
          return customUser;
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
