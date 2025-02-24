import 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      facility_id: string;
    }
  }
  
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    facility_id: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
    facility_id: string;
  }
}
