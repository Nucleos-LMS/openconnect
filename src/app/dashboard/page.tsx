'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Box, Text } from '@chakra-ui/react';
import { Dashboard } from '@/components/features/dashboard/Dashboard';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    redirect('/login');
  }

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <Box maxW="6xl" mx="auto" mt={8} p={6}>
        <Text>Loading...</Text>
      </Box>
    );
  }

  // Get user data from session with proper type handling
  const userName = session?.user?.name || null;
  const userEmail = session?.user?.email || null;
  const userRole = (session?.user as any)?.role || 'Resident';

  return (
    <Dashboard 
      userName={userName}
      userEmail={userEmail}
      userRole={userRole}
    />
  );
}
