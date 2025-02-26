'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get the callback URL from the URL parameters or default to '/'
    const params = new URLSearchParams(window.location.search);
    const callbackUrl = params.get('callbackUrl') || '/';
    
    // Prevent redirect loops by checking if the callback URL contains 'login'
    const safeCallbackUrl = callbackUrl.includes('/login') ? '/' : callbackUrl;
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: 'Error',
          description: 'Invalid credentials',
          status: 'error',
          duration: 3000,
        });
      } else {
        router.push(safeCallbackUrl);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during login',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <VStack as="form" onSubmit={handleSubmit} spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">Login</Text>
        
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormControl>

        <Button type="submit" colorScheme="blue" w="full">
          Sign In
        </Button>

        <Text fontSize="sm" color="gray.600">
          Test Users:
          <br />
          inmate@test.facility.com
          <br />
          family@test.facility.com
          <br />
          staff@test.facility.com
        </Text>
      </VStack>
    </Box>
  );
}
