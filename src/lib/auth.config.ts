import { type DefaultSession } from 'next-auth';
import { type NextAuthConfig } from 'next-auth';
import { type User } from 'next-auth';
import { type JWT } from 'next-auth/jwt';
import { type AdapterUser } from '@auth/core/adapters';
import { CredentialsProvider } from 'next-auth/providers/credentials';
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

  interface JWT {
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

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      async authorize(credentials: Record<string, any>): Promise<AuthUser | null> {
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
    async jwt({ token, user }: { token: JWT; user: User | null }): Promise<JWT> {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }): Promise<DefaultSession> {
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
