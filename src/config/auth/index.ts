import type { NextAuthConfig } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

interface User extends DefaultSession['user'] {
  id: string;
  email: string;
  name: string;
  role: string;
  facility_id: string;
}

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const res = await fetch(`${process.env.BACKEND_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: credentials.email,
              password: credentials.password,
            }),
          });

          const user = await res.json();
          if (!res.ok) throw new Error(user.detail);
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            facility_id: user.facility_id,
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
    async jwt({ token, user }: { token: any; user: User | null }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          facility_id: user.facility_id
        } as JWT;
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
    signIn: '/auth/login',
    error: '/auth/error',
  }
};
