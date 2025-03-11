// Import types from next-auth
import type { Session as NextAuthSession, User as NextAuthUser } from 'next-auth';

export type UserRole = 'visitor' | 'family' | 'legal' | 'educator' | 'staff' | 'resident';

// Define our custom user properties
export interface CustomUserProperties {
  role: UserRole;
  facility_id: string;
  emailVerified: Date | null;
}

// Combine with NextAuth's User type
export type CustomUser = NextAuthUser & CustomUserProperties;

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
  interface User {
    role?: UserRole;
    facility_id?: string;
    emailVerified?: Date | null;
  }
}
