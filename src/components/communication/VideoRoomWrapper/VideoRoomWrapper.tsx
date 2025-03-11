'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { VideoRoom } from '../VideoRoom/VideoRoom';
import { Box, Container, Heading, Text } from '@chakra-ui/react';

export const VideoRoomWrapper: React.FC = () => {
  const { data: session, status } = useSession();
  const params = useParams();
  const callId = params.id as string;

  if (status === 'loading') {
    return (
      <Container maxW="container.md" py={8}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container maxW="container.md" py={8}>
        <Heading size="lg">Access Denied</Heading>
        <Text mt={4}>Please sign in to join the video call.</Text>
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
      />
    </Container>
  );
};
