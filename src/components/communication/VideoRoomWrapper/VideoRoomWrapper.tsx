'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { VideoRoom } from '../VideoRoom/VideoRoom';
import { Box, Container, Heading, Text, Button, useToast, Code, VStack } from '@chakra-ui/react';

interface VideoRoomWrapperProps {
  provider?: 'twilio' | 'google-meet';
}

export const VideoRoomWrapper: React.FC<VideoRoomWrapperProps> = ({ 
  provider = 'twilio'
}) => {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const callId = params.id as string;
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState<'twilio' | 'google-meet'>(provider);

  // Check for environment variables on component mount
  useEffect(() => {
    // For development purposes only, check if Twilio environment variables are set
    const missingEnvVars = [];
    if (!process.env.NEXT_PUBLIC_TWILIO_ENABLED && !process.env.TWILIO_API_KEY_SID) missingEnvVars.push('TWILIO_API_KEY_SID');
    if (!process.env.NEXT_PUBLIC_TWILIO_ENABLED && !process.env.TWILIO_API_KEY_SECRET) missingEnvVars.push('TWILIO_API_KEY_SECRET');
    
    if (missingEnvVars.length > 0) {
      console.warn(`Missing environment variables: ${missingEnvVars.join(', ')}`);
      
      // For development, we'll use mock data if environment variables are missing
      if (process.env.NODE_ENV === 'development') {
        setDebugInfo({
          environment: process.env.NODE_ENV,
          missingVars: missingEnvVars,
          mockMode: true
        });
      }
    }
  }, []);

  // Handle connection errors
  const handleConnectionError = (errorMessage: string) => {
    setError(errorMessage);
    setConnectionAttempts(prev => prev + 1);
    toast({
      title: 'Connection Error',
      description: errorMessage,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  // Retry connection
  const handleRetry = () => {
    setError(null);
    setIsConnecting(true);
    
    // For development, if we're missing environment variables, simulate a successful connection
    if (process.env.NODE_ENV === 'development' && debugInfo?.mockMode) {
      setTimeout(() => {
        setIsConnecting(false);
        toast({
          title: 'Development Mode',
          description: 'Using mock video connection for development',
          status: 'info',
          duration: 3000,
        });
      }, 1500);
      return;
    }
    
    // Real reconnection attempt
    setTimeout(() => {
      setIsConnecting(false);
    }, 2000);
  };

  if (status === 'loading' || isConnecting) {
    return (
      <Container maxW="container.md" py={8}>
        <Text>{isConnecting ? 'Connecting to video call...' : 'Loading video call...'}</Text>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container maxW="container.md" py={8}>
        <Heading size="lg">Access Denied</Heading>
        <Text mt={4}>Please sign in to join the video call.</Text>
        <Button 
          mt={4} 
          colorScheme="blue" 
          onClick={() => router.push(`/login?callbackUrl=/calls/${callId}`)}
        >
          Sign In
        </Button>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md" py={8}>
        <Heading size="lg">Connection Error</Heading>
        <Text mt={4}>{error}</Text>
        <Button mt={4} colorScheme="blue" onClick={handleRetry}>
          Retry Connection
        </Button>
        <Button 
          mt={4} 
          ml={2} 
          variant="outline" 
          onClick={() => router.push('/dashboard')}
        >
          Return to Dashboard
        </Button>
        
        {process.env.NODE_ENV === 'development' && (
          <VStack mt={8} align="start" spacing={2}>
            <Text fontSize="sm" color="gray.500">Development Debug Info:</Text>
            <Text fontSize="sm">Missing Twilio API credentials. For development, you need to set:</Text>
            <Code p={2} borderRadius="md" fontSize="xs" width="100%">
              TWILIO_API_KEY_SID=your_api_key_sid<br/>
              TWILIO_API_KEY_SECRET=your_api_key_secret
            </Code>
            <Text fontSize="xs" color="gray.500">
              These should be added to your .env.local file. For production, add them to your Vercel environment variables.
            </Text>
          </VStack>
        )}
      </Container>
    );
  }

  // For development, if we're in mock mode, show a mock interface
  if (process.env.NODE_ENV === 'development' && (debugInfo?.mockMode || process.env.NEXT_PUBLIC_MOCK_VIDEO_ENABLED === 'true')) {
    return (
      <Container maxW="container.xl" p={4}>
        <Box bg="blue.50" p={4} borderRadius="md" mb={4}>
          <Text fontWeight="bold">Development Mock Mode</Text>
          <Text fontSize="sm">Using mock video interface for development.</Text>
        </Box>
        
        <Box border="1px" borderColor="gray.200" borderRadius="md" p={4}>
          <Heading size="md" mb={4}>Mock Video Call: {callId}</Heading>
          <Box bg="black" height="400px" width="100%" position="relative" mb={4}>
            <Box 
              position="absolute" 
              bottom="10px" 
              right="10px" 
              bg="rgba(0,0,0,0.5)" 
              p={2} 
              borderRadius="md"
              width="150px"
              height="100px"
            >
              <Text color="white" fontSize="xs" textAlign="center">You</Text>
            </Box>
            <Text color="white" position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
              Mock Video Feed - Call ID: {callId}
            </Text>
          </Box>
          <Box mb={4}>
            <Button colorScheme="red" mr={2} leftIcon={<span>🎤</span>}>Mute</Button>
            <Button colorScheme="red" mr={2} leftIcon={<span>📹</span>}>Stop Video</Button>
            <Button colorScheme="blue" mr={2} leftIcon={<span>💬</span>}>Chat</Button>
            <Button colorScheme="red" onClick={() => router.push('/dashboard')}>End Call</Button>
          </Box>
          <Text fontSize="sm" color="gray.500">Connected as: {session?.user?.name || 'User'} ({session?.user?.role || 'unknown role'})</Text>
          <Text fontSize="sm" color="gray.500">Call duration: 00:00:00</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" p={0}>
      <VideoRoom
        callId={callId}
        userId={session?.user?.id ?? ''}
        userRole={(session?.user?.role as string ?? 'visitor') as 'resident' | 'visitor' | 'attorney' | 'staff'}
        facilityId={session?.user?.facility_id as string ?? ''}
        onError={handleConnectionError}
        provider={selectedProvider}
      />
    </Container>
  );
};
