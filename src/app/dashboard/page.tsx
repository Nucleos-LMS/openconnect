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

  return (
    <Dashboard 
      userName={session?.user?.name}
      userEmail={session?.user?.email}
      userRole={session?.user?.role || 'Resident'}
    />
  );
}
