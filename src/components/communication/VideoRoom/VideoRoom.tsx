import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  useToast
} from '@chakra-ui/react';
import { createVideoProvider } from '@/providers/video/factory';
import { VideoControls } from './components/VideoControls';
import { RecordingIndicator } from './components/RecordingIndicator';

interface VideoRoomProps {
  callId: string;
  userId: string;
  userRole: 'resident' | 'visitor' | 'attorney' | 'staff';
  facilityId: string;
  userName?: string;
}

export const VideoRoom = ({
  callId,
  userId,
  userRole,
  facilityId,
  userName
}: VideoRoomProps) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const providerRef = useRef<Awaited<ReturnType<typeof createVideoProvider>>>();
  const toast = useToast();

  useEffect(() => {
    const joinCall = async () => {
      try {
        providerRef.current = await createVideoProvider('twilio', {
          userId,
          userRole,
          facilityId
        });

        await providerRef.current.joinRoom(callId, {
          id: userId,
          name: userName || 'Anonymous',
          role: userRole,
          audioEnabled: true,
          videoEnabled: true
        });
        
        // Start recording if required by facility settings
        const facilityRes = await fetch(`/api/facilities/${facilityId}/settings`);
        const facilitySettings = await facilityRes.json();
        
        if (facilitySettings.monitoring.recordCalls) {
          await providerRef.current.startRecording({
            aiMonitoring: facilitySettings.monitoring.aiMonitoring
          });
          setIsRecording(true);
        }
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
  }, [callId, userId, userRole, facilityId, userName]);

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
        {isRecording && <RecordingIndicator />}
        <VideoControls
          onMuteAudio={async () => {
            if (providerRef.current) {
              await providerRef.current.muteAudio();
            }
          }}
          onMuteVideo={async () => {
            if (providerRef.current) {
              await providerRef.current.muteVideo();
            }
          }}
          onEndCall={async () => {
            if (providerRef.current) {
              await providerRef.current.leaveRoom(callId);
            }
            window.location.href = '/calls/new';
          }}
        />
      </Box>
    </Flex>
  );
};
