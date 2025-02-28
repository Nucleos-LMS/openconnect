'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const router = useRouter();
  const toast = useToast();
  const { data: session, status } = useSession();

  // Debug logging for session state changes
  useEffect(() => {
    console.log('[AUTH DEBUG] Session status changed:', status);
    console.log('[AUTH DEBUG] Session data:', session);
    
    setDebugInfo(prev => ({
      ...prev,
      sessionStatus: status,
      sessionData: session ? JSON.parse(JSON.stringify(session)) : null,
      timestamp: new Date().toISOString()
    }));
    
    // Log to UI when session state changes
    if (status === 'authenticated') {
      toast({
        title: 'Session Authenticated',
        description: `User: ${session?.user?.email}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else if (status === 'unauthenticated') {
      toast({
        title: 'Session Unauthenticated',
        description: 'No active session',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [status, session, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Get the callback URL from the URL parameters or default to '/'
    const params = new URLSearchParams(window.location.search);
    const callbackUrl = params.get('callbackUrl') || '/';
    
    // Prevent redirect loops by checking if the callback URL contains 'login'
    const safeCallbackUrl = callbackUrl.includes('/login') ? '/' : callbackUrl;
    
    console.log('[AUTH DEBUG] Login attempt:', { email, callbackUrl, safeCallbackUrl });
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      console.log('[AUTH DEBUG] SignIn result:', result);
      setDebugInfo(prev => ({
        ...prev,
        signInResult: result,
        timestamp: new Date().toISOString()
      }));

      if (result?.error) {
        console.error('[AUTH DEBUG] Login error:', result.error);
        toast({
          title: 'Error',
          description: `Login failed: ${result.error}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.log('[AUTH DEBUG] Login successful, redirecting to:', safeCallbackUrl);
        toast({
          title: 'Success',
          description: 'Login successful, redirecting...',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Add a delay before redirecting to ensure the session is properly established
        setTimeout(() => {
          router.push(safeCallbackUrl);
        }, 1000);
      }
    } catch (error) {
      console.error('[AUTH DEBUG] Unexpected error during login:', error);
      setDebugInfo(prev => ({
        ...prev,
        unexpectedError: error,
        timestamp: new Date().toISOString()
      }));
      
      toast({
        title: 'Error',
        description: 'An unexpected error occurred during login',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <VStack as="form" onSubmit={handleSubmit} spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">Login</Text>
        
        {/* Session status indicator */}
        {status === 'loading' && (
          <Alert status="info">
            <AlertIcon />
            <AlertTitle>Loading session...</AlertTitle>
          </Alert>
        )}
        
        {status === 'authenticated' && (
          <Alert status="success">
            <AlertIcon />
            <AlertTitle>Authenticated!</AlertTitle>
            <AlertDescription>
              Logged in as {session?.user?.email}
            </AlertDescription>
          </Alert>
        )}
        
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

        <Button 
          type="submit" 
          colorScheme="blue" 
          w="full"
          isLoading={loading}
          loadingText="Signing In"
        >
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
        
        {/* Debug information section */}
        <Box mt={4} p={4} borderWidth={1} borderRadius="md" w="full">
          <Text fontSize="sm" fontWeight="bold">Debug Info:</Text>
          <Text fontSize="xs" as="pre" overflowX="auto">
            Session Status: {status}
            {Object.keys(debugInfo).length > 0 && (
              JSON.stringify(debugInfo, null, 2)
            )}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
