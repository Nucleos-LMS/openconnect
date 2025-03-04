/**
 * NextAuth Type Declarations
 * 
 * CHANGES:
 * - Fixed TypeScript error with Session.user property
 * - Improved type declarations to avoid conflicts
 * - Added proper module augmentation for next-auth
 */
import { type DefaultSession } from 'next-auth';

// Define the UserRole type directly to avoid circular imports
type UserRole = 'visitor' | 'family' | 'legal' | 'educator' | 'staff' | 'resident';

// Define the CustomUser interface directly to avoid circular imports
interface CustomUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  facility_id: string;
  image: string | null;
  emailVerified: Date | null;
}

declare module 'next-auth' {
  interface User extends CustomUser {}
  interface Session extends DefaultSession {
    user: CustomUser & DefaultSession['user'];
  }
}
