import type { DefaultSession, NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';

declare module 'next-auth' {
  interface Session {
    user: {
      role: string;
      facility_id: string;
    } & DefaultSession['user']
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

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, request): Promise<User | null> {
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
          
          const typedUser: User = {
            id: user.id.toString(),
            email: user.email.toString(),
            name: user.name.toString(),
            role: user.role.toString(),
            facility_id: user.facility_id.toString(),
          };
          return typedUser;
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
