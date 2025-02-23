import { authConfig } from '@/config/auth';
import NextAuth from 'next-auth';

export default NextAuth(authConfig);
