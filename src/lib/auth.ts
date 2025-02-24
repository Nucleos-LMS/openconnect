import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const { 
  handlers: authHandler,
  auth,
  signIn,
  signOut
} = NextAuth(authConfig);

export type { Session, User } from 'next-auth';
