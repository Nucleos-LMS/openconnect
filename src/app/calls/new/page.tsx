import React, { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

const WaitingRoom = dynamic(
  () => import('@/components/communication/WaitingRoom/WaitingRoom').then(mod => mod.WaitingRoom),
  { ssr: false }
);
import { Box, Container, Heading, Text } from '@chakra-ui/react';

export default async function NewCallPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/login');
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
        user={{
          id: session.user.id ?? '',
          role: session.user.role ?? 'visitor',
          facilityId: session.user.facility_id ?? ''
        }}
      />
    </Container>
  );
}
