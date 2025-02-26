import React from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { WaitingRoom } from '@/components/communication/WaitingRoom/WaitingRoom';
import { Box, Container, Heading, Text } from '@chakra-ui/react';

export default async function NewCallPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/calls/new');
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
