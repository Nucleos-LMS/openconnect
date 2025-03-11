'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { WaitingRoom } from '@/components/communication/WaitingRoom/WaitingRoom';
import { Box, Container, Heading, Text, useToast } from '@chakra-ui/react';

export default function NewCallPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();
  const [isCreatingCall, setIsCreatingCall] = useState(false);

  // This function will be called when the user is ready to join the call
  const handleJoinCall = async () => {
    if (!session?.user) return;
    
    try {
      setIsCreatingCall(true);
      
      // Create a new call in the database
      const response = await fetch('/api/calls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          facilityId: session.user.facility_id || '123',
          scheduledStart: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create call');
      }
      
      const data = await response.json();
      router.push(`/calls/${data.id}`);
    } catch (error) {
      console.error('Error creating call:', error);
      toast({
        title: 'Error creating call',
        description: 'There was an error creating your call. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsCreatingCall(false);
    }
  };

  if (status === 'loading') {
    return (
      <Container maxW="container.md" py={8}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  if (!session?.user) {
    router.push('/login?callbackUrl=/calls/new');
    return null;
  }
  
  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading size="lg">Start Video Call</Heading>
        <Text mt={2} color="gray.600">
          Set up your devices and prepare for your call
        </Text>
      </Box>

      <WaitingRoom
        userId={session?.user?.id || ''}
        userRole={session?.user?.role || 'visitor'}
        facilityId={session?.user?.facility_id || '123'}
        callType="standard"
        scheduledTime={new Date().toISOString()}
        participants={[]}
        onJoinCall={handleJoinCall}
      />
    </Container>
  );

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading size="lg">Start Video Call</Heading>
        <Text mt={2} color="gray.600">
          Set up your devices and prepare for your call
        </Text>
      </Box>

      <WaitingRoom
        userId={session.user.id ?? ''}
        userRole={session.user.role ?? 'visitor'}
        facilityId={session.user.facility_id ?? ''}
        callType="standard"
        scheduledTime={new Date().toISOString()}
        participants={[]}
        onJoinCall={() => {}}
      />
    </Container>
  );
}
