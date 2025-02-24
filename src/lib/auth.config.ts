import type { NextAuthConfig } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';
import type { User } from '@/lib/types/next-auth';
import Credentials from 'next-auth/providers/credentials';
import { createClient } from '@vercel/postgres';

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };
        
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
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            facility_id: user.facility_id,
          };
        } finally {
          await client.end();
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as User).role;
        token.facility_id = (user as User).facility_id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.role = token.role ?? 'user';
        session.user.facility_id = token.facility_id ?? '';
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
