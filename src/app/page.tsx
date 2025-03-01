'use client';

/**
 * Root Page Component
 * 
 * CHANGES:
 * - Added proper type declarations for next-auth/react and next/navigation
 * - Enhanced logging for authentication status and redirects
 */
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function RootPage() {
  const { status } = useSession();
  
  console.log('[ROOT PAGE] Session status:', status);
  
  // Redirect authenticated users to dashboard, unauthenticated to login
  if (status === 'authenticated') {
    console.log('[ROOT PAGE] Authenticated, redirecting to dashboard');
    redirect('/dashboard');
  } else {
    console.log('[ROOT PAGE] Not authenticated, redirecting to login');
    redirect('/login');
  }
}
