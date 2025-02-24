import type { DefaultSession, User as NextAuthUser } from 'next-auth';
import type { AdapterUser } from '@auth/core/adapters';

export interface User extends NextAuthUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  facility_id: string;
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: User;
  }
  
  interface User extends NextAuthUser {
    role: string;
    facility_id: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    facility_id?: string;
  }
}
