/**
 * NextAuth Type Declarations
 * 
 * CHANGES:
 * - Fixed TypeScript error with Session.user property
 * - Improved type declarations to avoid conflicts
 * - Added proper module augmentation for next-auth
 */
import { type DefaultSession } from 'next-auth';
import type { CustomUser } from './shared';

declare module 'next-auth' {
  interface User extends CustomUser {}
  interface Session extends DefaultSession {
    user: CustomUser & DefaultSession['user'];
  }
}
