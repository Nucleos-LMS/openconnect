import type { NextAuthConfig } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { urls } from '../urls';
import type { UserRole, CustomUser } from '../../lib/types/next-auth';

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, request): Promise<CustomUser | null> {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const res = await fetch(`${urls.api}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: credentials.email,
              password: credentials.password,
            }),
          });

          const user = await res.json();
          if (!res.ok) throw new Error(user.detail);
          
          const typedUser = {
            id: user.id.toString(),
            email: user.email.toString(),
            name: user.name.toString(),
            role: user.role.toString(),
            facility_id: user.facility_id.toString(),
            image: null, // Add the image property
          };
          return {
            ...typedUser,
            emailVerified: new Date()
          };
        } catch (error) {
          throw new Error('Invalid credentials');
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          facility_id: user.facility_id
        };
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as string,
          facility_id: token.facility_id as string
        };
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  }
};
