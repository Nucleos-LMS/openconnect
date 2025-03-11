// Type definitions for next-auth
import { type UserRole, type CustomUser } from '../lib/types/next-auth';

declare module 'next-auth' {
  interface User extends CustomUser {
    // Add a property to satisfy ESLint no-empty-interface rule
    _userType?: 'nextauth';
  }
  
  interface Session {
    user: CustomUser;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole;
    facility_id?: string;
  }
}
