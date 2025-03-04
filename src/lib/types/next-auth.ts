/**
 * NextAuth Type Declarations
 * 
 * CHANGES:
 * - Fixed TypeScript error with Session.user property
 * - Improved type declarations to avoid conflicts
 * - Added proper module augmentation for next-auth
 */
import { type DefaultSession } from 'next-auth';

// Re-export the UserRole type from auth.config.ts to ensure consistency
type UserRole = 'visitor' | 'family' | 'legal' | 'educator' | 'staff' | 'resident';

// Define the CustomUser interface without exporting it
// This avoids conflicts with the same interface in auth.config.ts
interface CustomUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  facility_id: string;
  image: string | null;
  emailVerified: Date | null;
}

// Use module augmentation to extend the next-auth types
declare module 'next-auth' {
  // Extend the User interface
  interface User extends CustomUser {}
}

// No need to redefine Session interface here as it's already defined in auth.config.ts
