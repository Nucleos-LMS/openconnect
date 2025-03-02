'use client';

/**
 * Login Page Component
 * 
 * CHANGES:
 * - Updated to use NextAuth's built-in redirect functionality
 * - Removed manual redirects to avoid conflicts with NextAuth
 * - Enhanced error handling and debugging for authentication flow
 * - Improved user feedback with toast notifications
 */
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

interface DebugInfo {
  sessionStatus?: string;
  sessionData?: any;
  timestamp?: string;
  loginAttempts?: number;
  error?: any;
  callbackUrl?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});
  const router = useRouter();
  const toast = useToast();
  const { data: session, status } = useSession();

  // Debug logging for session state changes
  useEffect(() => {
    console.log('[AUTH DEBUG] Session status changed:', status);
    console.log('[AUTH DEBUG] Session data:', session);
    
    setDebugInfo((prev) => ({
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
      
      // Remove the manual redirect to avoid conflicts with NextAuth
      console.log('[AUTH DEBUG] Session authenticated, NextAuth will handle redirect');
    } else if (status === 'unauthenticated') {
      toast({
        title: 'Session Unauthenticated',
        description: 'No active session',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [status, session, toast, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Get the callback URL from the URL parameters or default to '/'
    let callbackUrl = '/';
    let safeCallbackUrl = '/';
    
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      callbackUrl = params.get('callbackUrl') || '/';
      
      // Validate callback URL to prevent open redirect
      try {
        const url = new URL(callbackUrl, window.location.origin);
        if (url.origin === window.location.origin) {
          safeCallbackUrl = callbackUrl;
        }
      } catch (e) {
        console.error('[AUTH DEBUG] Invalid callback URL:', callbackUrl);
      }
    }
    
    console.log('[AUTH DEBUG] Login attempt with:', { email, callbackUrl: safeCallbackUrl });
    
    // Log current cookies before login attempt
    console.log('[AUTH DEBUG] Cookies before login:', document.cookie);
    
    // Check for CSRF token in cookies or storage
    const csrfCookie = document.cookie.split(';').find(c => c.trim().startsWith('next-auth.csrf-token='));
    console.log('[AUTH DEBUG] CSRF token cookie exists:', !!csrfCookie);
    
    // Log localStorage and sessionStorage
    try {
      const csrfLocalStorage = localStorage.getItem('next-auth.csrf-token');
      const csrfSessionStorage = sessionStorage.getItem('next-auth.csrf-token');
      console.log('[AUTH DEBUG] CSRF token in localStorage:', !!csrfLocalStorage);
      console.log('[AUTH DEBUG] CSRF token in sessionStorage:', !!csrfSessionStorage);
    } catch (e) {
      console.error('[AUTH DEBUG] Error accessing storage:', e);
    }
    
    // Fetch CSRF token explicitly before sign in
    try {
      console.log('[AUTH DEBUG] Fetching CSRF token before sign in...');
      const csrfResponse = await fetch('/api/auth/csrf');
      const csrfData = await csrfResponse.json();
      console.log('[AUTH DEBUG] CSRF token response:', csrfData);
      
      // Check if CSRF token was set in cookies after fetch
      console.log('[AUTH DEBUG] Cookies after CSRF fetch:', document.cookie);
      const csrfCookieAfter = document.cookie.split(';').find(c => c.trim().startsWith('next-auth.csrf-token='));
      console.log('[AUTH DEBUG] CSRF token cookie exists after fetch:', !!csrfCookieAfter);
    } catch (e) {
      console.error('[AUTH DEBUG] Error fetching CSRF token:', e);
    }
    
    try {
      console.log('[AUTH DEBUG] Calling signIn with credentials...');
      const result = await signIn('credentials', {
        redirect: false,  // Change to false to handle redirect manually
        email,
        password,
        callbackUrl: '/dashboard',  // Always redirect to dashboard after login
      });
      
      console.log('[AUTH DEBUG] Sign in result:', result);
      
      // Log cookies after sign in attempt
      console.log('[AUTH DEBUG] Cookies after login attempt:', document.cookie);
      
      // Check for session token after login
      const sessionCookie = document.cookie.split(';').find(c => c.trim().startsWith('next-auth.session-token='));
      console.log('[AUTH DEBUG] Session token cookie exists after login:', !!sessionCookie);
      
      setDebugInfo((prev) => ({
        ...prev,
        loginAttempts: (prev.loginAttempts || 0) + 1,
        error: result?.error,
        callbackUrl: safeCallbackUrl,
      }));
      
      if (result?.error) {
        console.log('[AUTH DEBUG] Login error:', result.error);
        toast({
          title: 'Authentication Error',
          description: result.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (result?.url) {
        console.log('[AUTH DEBUG] Login successful, redirect URL:', result.url);
        
        // Success - show toast notification
        toast({
          title: 'Login Successful',
          description: 'Redirecting to dashboard...',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        /**
         * Enhanced Redirect Logic
         * 
         * CHANGES:
         * - Implemented manual redirect to ensure consistent behavior
         * - Added error handling for router.push to prevent redirect failures
         * - Added fallback redirect mechanism with window.location.href
         */
        console.log('[AUTH DEBUG] Login successful, manually redirecting to dashboard');
        
        // Add a delay before redirect to ensure session is established
        setTimeout(() => {
          console.log('[AUTH DEBUG] Executing redirect to dashboard');
          try {
            router.push('/dashboard');
            // Fallback to window.location if router.push doesn't work
            setTimeout(() => {
              if (window.location.pathname !== '/dashboard') {
                console.log('[AUTH DEBUG] Router push didn\'t work, using window.location');
                window.location.href = '/dashboard';
              }
            }, 1000);
          } catch (err) {
            console.error('[AUTH DEBUG] Error redirecting with router:', err);
            window.location.href = '/dashboard';
          }
        }, 1000);
      }
    } catch (error) {
      console.error('[AUTH DEBUG] Sign in error:', error);
      
      toast({
        title: 'Authentication Error',
        description: 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      setDebugInfo((prev) => ({
        ...prev,
        error,
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={6}>
        Login
      </Text>
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </FormControl>
          
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </FormControl>
          
          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            mt={4}
            isLoading={loading}
          >
            Sign In
          </Button>
        </VStack>
      </form>
      
      <Box mt={4} textAlign="center">
        <Text fontSize="sm">
          Test Users:<br />
          inmate@test.facility.com<br />
          family@test.facility.com<br />
          staff@test.facility.com
        </Text>
      </Box>
      
      {/* Debug information - only visible in development */}
      {process.env.NODE_ENV === 'development' && debugInfo.error && (
        <Alert status="error" mt={4}>
          <AlertIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {JSON.stringify(debugInfo.error, null, 2)}
          </AlertDescription>
        </Alert>
      )}
    </Box>
  );
}
