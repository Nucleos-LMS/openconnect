import type { NextAuthConfig } from 'next-auth';
import type { DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { createClient } from '@vercel/postgres';

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  facility_id: string;
} & DefaultSession['user'];

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      async authorize(credentials, request): Promise<User | null> {
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
          const typedUser: User = {
            id: user.id.toString(),
            email: user.email.toString(),
            name: user.name.toString(),
            role: user.role.toString(),
            facility_id: user.facility_id.toString(),
          };
          return typedUser;
        } finally {
          await client.end();
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
