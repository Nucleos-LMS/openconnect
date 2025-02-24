'use client';

import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <Heading size="lg" mb={4}>Authentication Error</Heading>
      <Text mb={4}>
        {error === 'CredentialsSignin' 
          ? 'Invalid email or password'
          : 'An error occurred during authentication'}
      </Text>
      <Button
        colorScheme="blue"
        onClick={() => router.push('/auth/login')}
      >
        Back to Login
      </Button>
    </Box>
  );
}
