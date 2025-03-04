/**
 * Shared Type Declarations
 * 
 * This file contains shared type declarations used across the authentication system.
 * These types are used by both auth.config.ts and next-auth.ts to ensure consistency.
 */

export type UserRole = 'visitor' | 'family' | 'legal' | 'educator' | 'staff' | 'resident';

export interface CustomUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  facility_id: string;
  image: string | null;
  emailVerified: Date | null;
}
