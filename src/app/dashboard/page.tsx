'use client';

/**
 * Dashboard Page Component
 * 
 * CHANGES:
 * - Added proper type declarations for next-auth/react and next/navigation
 * - Enhanced with improved authentication handling using client-side navigation
 * - Added detailed logging for better debugging of authentication issues
 * - Implemented session refresh mechanism for handling stalled loading states
 * - Improved loading UI with spinner and better messaging
 */
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Text, Spinner, Center } from '@chakra-ui/react';
import { Dashboard } from '@/components/features/dashboard/Dashboard';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Enhanced logging for dashboard page
  useEffect(() => {
    console.log('[DASHBOARD] Page loaded, session status:', status);
    console.log('[DASHBOARD] Session data:', session);
    
    // Force refresh session if needed
    if (status === 'loading') {
      const checkTimeout = setTimeout(() => {
        console.log('[DASHBOARD] Session still loading after timeout, checking session');
        
        // If session is still loading after timeout, try to fetch it again
        fetch('/api/auth/session')
          .then(res => res.json())
          .then(data => {
            console.log('[DASHBOARD] Session data after timeout:', data);
            
            // If session exists but status is still loading, force refresh
            if (data && data.user) {
              console.log('[DASHBOARD] Session exists but status is still loading, forcing refresh');
              router.refresh();
            } else {
              console.log('[DASHBOARD] No session after timeout, redirecting to login');
              router.push('/login');
            }
          })
          .catch(err => {
            console.error('[DASHBOARD] Error fetching session:', err);
            router.push('/login');
          });
      }, 3000);
      
      return () => clearTimeout(checkTimeout);
    }
  }, [status, session, router]);

  // Handle redirect for unauthenticated users
  useEffect(() => {
    if (status === 'unauthenticated') {
      console.log('[DASHBOARD] User is unauthenticated, redirecting to login');
      router.push('/login');
    }
  }, [status, router]);
  
  // Show loading spinner for unauthenticated users while redirecting
  if (status === 'unauthenticated') {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <Center h="100vh">
        <Box textAlign="center">
          <Spinner size="xl" color="blue.500" mb={4} />
          <Text>Loading your dashboard...</Text>
        </Box>
      </Center>
    );
  }

  // Get user data from session with proper type handling
  const userName = session?.user?.name || null;
  const userEmail = session?.user?.email || null;
  const userRole = (session?.user as any)?.role || 'Resident';
  
  console.log('[DASHBOARD] Rendering dashboard for user:', {
    email: userEmail,
    role: userRole
  });

  return (
    <Dashboard 
      userName={userName}
      userEmail={userEmail}
      userRole={userRole}
    />
  );
}
