import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  useToast
} from '@chakra-ui/react';
import { VideoProvider } from '@/providers/video/factory';

interface VideoRoomProps {
  callId: string;
  userId: string;
  userRole: string;
  facilityId: string;
}

export const VideoRoom = ({
  callId,
  userId,
  userRole,
  facilityId
}: VideoRoomProps) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const joinCall = async () => {
      try {
        const provider = await VideoProvider.create({
          userId,
          userRole,
          facilityId
        });

        await provider.joinRoom(callId);
        setIsConnecting(false);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: 'Error joining call',
          description: err.message,
          status: 'error',
          duration: 5000
        });
      }
    };

    joinCall();
  }, [callId, userId, userRole, facilityId]);

  if (error) {
    return (
      <Container maxW="container.md" py={8}>
        <Box textAlign="center">
          <Heading size="lg" color="red.500" mb={4}>
            Error Joining Call
          </Heading>
          <Text mb={6}>{error}</Text>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  if (isConnecting) {
    return (
      <Container maxW="container.md" py={8}>
        <Box textAlign="center">
          <Heading size="lg" mb={4}>
            Joining Call...
          </Heading>
          <Text>Please wait while we connect you to the call.</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Flex direction="column" h="100vh">
      <Box flex="1" bg="gray.900" position="relative">
        {/* Video elements will be injected here by the provider */}
        <div id="video-container" style={{ width: '100%', height: '100%' }} />
      </Box>
    </Flex>
  );
};
