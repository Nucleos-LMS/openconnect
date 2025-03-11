// Define our basic types without any imports or circular references
export type UserRole = 'visitor' | 'family' | 'legal' | 'educator' | 'staff' | 'resident';

// Define our custom user properties directly
export interface CustomUser {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  facility_id: string;
  image: string | null;
  emailVerified: Date | null;
}

// Extend JWT and Session types in their respective modules
declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole;
    facility_id?: string;
  }
}

declare module 'next-auth' {
  interface Session {
    user: CustomUser;
  }
  
  // Extend the base User type with our properties
  interface User {
    role?: UserRole;
    facility_id?: string;
  }
}
