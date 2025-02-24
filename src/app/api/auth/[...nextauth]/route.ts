import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              username: credentials.email as string,
              password: credentials.password as string,
            }),
          });

          const user = await res.json();

          if (res.ok && user) {
            return {
              id: user.id,
              email: credentials.email as string,
              role: user.role || 'visitor',
              facility_id: user.facility_id || '',
              accessToken: user.access_token,
              name: user.name,
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
      }
      return session;
    }
  }
};

const handler = NextAuth(config);
export { handler as GET, handler as POST };
