import { type NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@vercel/postgres';

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
          return {
            id: user.id?.toString() || '',
            email: user.email?.toString() || '',
            name: user.name?.toString() || '',
            role: user.role?.toString(),
            facility_id: user.facility_id?.toString(),
            image: null
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
        token.role = (user as any).role;
        token.facility_id = (user as any).facility_id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.facility_id = token.facility_id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
