'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

interface User {
  name?: string;
  email?: string;
}

interface Session {
  user?: User;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();

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

  const handleNewCall = () => {
    router.push('/calls/new');
  };

  const handleViewCalls = () => {
    router.push('/calls');
  };

  return (
    <Box maxW="6xl" mx="auto" mt={8} p={6}>
      <VStack spacing={8} align="stretch">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h1" size="xl">
            Welcome, {session?.user?.name || session?.user?.email}
          </Heading>
        </Flex>

        <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
          <VStack spacing={6} align="stretch">
            <Heading as="h2" size="lg">
              Quick Actions
            </Heading>
            
            <HStack spacing={4}>
              <Button colorScheme="blue" onClick={handleNewCall}>
                Start New Call
              </Button>
              <Button colorScheme="gray" onClick={handleViewCalls}>
                View My Calls
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
