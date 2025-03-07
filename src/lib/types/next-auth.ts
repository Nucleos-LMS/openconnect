import { type DefaultSession } from 'next-auth';

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

declare module '@auth/core/jwt' {
  interface JWT {
    role?: UserRole;
    facility_id?: string;
  }
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: CustomUser;
  }
  interface User extends CustomUser {
    // Add a property to satisfy ESLint no-empty-interface rule
    _userType?: 'nextauth';
  }
}
