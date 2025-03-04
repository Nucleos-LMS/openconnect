/**
 * NextAuth Type Declarations
 * 
 * CHANGES:
 * - Fixed TypeScript error with Session.user property
 * - Improved type declarations to avoid conflicts
 * - Added proper module augmentation for next-auth
 */
import { type DefaultSession } from 'next-auth';

type UserRole = 'visitor' | 'family' | 'legal' | 'educator' | 'staff';

export interface CustomUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  facility_id: string;
  image: string | null;
  emailVerified: Date | null;
}

declare module 'next-auth' {
  interface Session {
    user: CustomUser & DefaultSession['user'];
  }
  
  interface User extends CustomUser {}
}
