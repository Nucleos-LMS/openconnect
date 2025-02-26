import { type DefaultSession } from 'next-auth';

type UserRole = 'visitor' | 'family' | 'legal' | 'educator' | 'staff';

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
  interface Session extends DefaultSession {
    user: CustomUser;
  }
  interface User extends CustomUser {}
}
