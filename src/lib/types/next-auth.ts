// Import types from next-auth
import type { Session as NextAuthSession, User as NextAuthUser } from 'next-auth';

export type UserRole = 'visitor' | 'family' | 'legal' | 'educator' | 'staff' | 'resident';

// Extend the base User type with our custom properties
export interface CustomUser extends NextAuthUser {
  role: UserRole;
  facility_id: string;
  // image and emailVerified are already in the base User type
  emailVerified: Date | null;
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole;
    facility_id?: string;
  }
}

declare module 'next-auth' {
  interface Session extends NextAuthSession {
    user: CustomUser;
  }
  interface User extends CustomUser {
    // Add a property to satisfy ESLint no-empty-interface rule
    _userType?: 'nextauth';
  }
}
