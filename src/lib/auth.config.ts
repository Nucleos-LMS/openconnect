import type { DefaultSession } from 'next-auth';
import type { AuthOptions } from 'next-auth';
import type { JWT as NextAuthJWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@vercel/postgres';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      facility_id: string;
      image?: string | null;
    }
  }

  interface JWT extends NextAuthJWT {
    role?: string;
    facility_id?: string;
  }
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  facility_id: string;
  image?: string | null;
}

export const authConfig: AuthOptions = {
  providers: [
    Credentials({
      async authorize(credentials, request): Promise<AuthUser | null> {
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
          const typedUser: AuthUser = {
            id: user.id?.toString() || '',
            email: user.email?.toString() || '',
            name: user.name?.toString() || '',
            role: user.role?.toString() || '',
            facility_id: user.facility_id?.toString() || '',
            image: null
          };
          return typedUser;
        } finally {
          await client.end();
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: AuthUser | null }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: DefaultSession; token: JWT }) {
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
