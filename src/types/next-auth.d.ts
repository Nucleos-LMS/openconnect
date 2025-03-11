// Type definitions for next-auth
import { type UserRole, type CustomUser } from '../lib/types/next-auth';

// No need to extend User with CustomUser, just declare the properties we need
declare module 'next-auth' {
  interface User {
    role?: UserRole;
    facility_id?: string;
  }
  
  interface Session {
    user: CustomUser;
  }
}
