'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

function ErrorContent() {
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setError(searchParams.get('error'));
  }, []);

  const handleBack = () => {
    window.location.href = '/auth/login';
  };

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
        onClick={handleBack}
      >
        Back to Login
      </Button>
    </Box>
  );
}

// Server component wrapper
export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
