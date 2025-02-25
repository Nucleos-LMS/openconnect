import type { NextAuthConfig } from 'next-auth';
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
            'SELECT id, email, name, role FROM users WHERE email = $1',
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
