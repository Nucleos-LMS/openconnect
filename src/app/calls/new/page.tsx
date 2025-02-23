'use client';

import { useSession } from 'next-auth/react';
import { WaitingRoom } from '@/components/communication/WaitingRoom/WaitingRoom';
import { Box, Container, Heading, Text } from '@chakra-ui/react';

export default function NewCallPage() {
  const { data: session, status } = useSession();

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
        <Text mt={4}>Please sign in to start a video call.</Text>
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

      <WaitingRoom
        userId={session.user.id}
        userRole={session.user.role}
        facilityId={session.user.facility_id}
      />
    </Container>
  );
}
