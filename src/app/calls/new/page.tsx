'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { WaitingRoom } from '@/components/communication/WaitingRoom/WaitingRoom';
import { Box, Container, Heading, Text, useToast, Button, RadioGroup, Radio, Stack } from '@chakra-ui/react';

export default function NewCallPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();
  const [isCreatingCall, setIsCreatingCall] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<'twilio' | 'google-meet'>('twilio');

  // This function will be called when the user is ready to join the call
  const handleJoinCall = async (selectedParticipants: string[] = []) => {
    if (!session?.user) return;
    
    try {
      setIsCreatingCall(true);
      setError(null);
      
      console.log('Creating call with participants:', selectedParticipants);
      
      // Create a new call in the database
      const response = await fetch('/api/calls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          facilityId: session.user.facility_id || '123',
          scheduledStart: new Date().toISOString(),
          participants: selectedParticipants,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create call');
      }
      
      const data = await response.json();
      console.log('Call created successfully:', data);
      
      // For testing purposes, use a mock call ID if the API returns a mock ID
      const callId = data.id || `mock-${Date.now()}`;
      
      // Navigate to the call page
      router.push(`/calls/${callId}`);
    } catch (error: any) {
      console.error('Error creating call:', error);
      setError(error.message || 'There was an error creating your call');
      toast({
        title: 'Error creating call',
        description: error.message || 'There was an error creating your call. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsCreatingCall(false);
    }
  };

  // Handle retry after error
  const handleRetry = () => {
    setError(null);
  };

  if (status === 'loading' || isCreatingCall) {
    return (
      <Container maxW="container.md" py={8}>
        <Text>{isCreatingCall ? 'Creating your call...' : 'Loading...'}</Text>
      </Container>
    );
  }

  if (!session?.user) {
    router.push('/login?callbackUrl=/calls/new');
    return null;
  }
  
  if (error) {
    return (
      <Container maxW="container.md" py={8}>
        <Heading as="h2" size="lg" color="red.500">Error Creating Call</Heading>
        <Text mt={4}>{error}</Text>
        <Button 
          mt={6} 
          colorScheme="blue" 
          onClick={handleRetry}
        >
          Try Again
        </Button>
        <Button 
          mt={6} 
          ml={4} 
          variant="outline" 
          onClick={() => router.push('/dashboard')}
        >
          Return to Dashboard
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading size="lg">Start Video Call</Heading>
        <Text mt={2} color="gray.600">
          Set up your devices and prepare for your call
        </Text>
      </Box>
      
      <Box mb={4}>
        <Heading as="h3" size="md" mb={2}>Select Video Provider</Heading>
        <RadioGroup onChange={(value) => setSelectedProvider(value as 'twilio' | 'google-meet')} value={selectedProvider}>
          <Stack direction="row">
            <Radio value="twilio">Twilio</Radio>
            <Radio value="google-meet">Google Meet</Radio>
          </Stack>
        </RadioGroup>
      </Box>

      <WaitingRoom
        userId={session?.user?.id || ''}
        userRole={session?.user?.role || 'visitor'}
        facilityId={session?.user?.facility_id || '123'}
        callType="standard"
        scheduledTime={new Date().toISOString()}
        participants={[]}
        onJoinCall={handleJoinCall}
        provider={selectedProvider}
      />
    </Container>
  );
}
