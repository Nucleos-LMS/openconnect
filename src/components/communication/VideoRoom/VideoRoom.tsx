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
import type { Room as TwilioRoom } from 'twilio-video';
import { VideoControls } from './components/VideoControls';
import { RecordingIndicator } from './components/RecordingIndicator';

interface VideoRoomProps {
  callId: string;
  userId: string;
  userRole: 'resident' | 'visitor' | 'attorney' | 'staff';
  facilityId: string;
  userName?: string;
  onError?: (errorMessage: string) => void;
  provider?: 'twilio' | 'google-meet' | 'livekit';
}

export const VideoRoom = ({
  callId,
  userId,
  userRole,
  facilityId,
  userName,
  onError,
  provider = 'twilio'
}: VideoRoomProps) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const providerRef = useRef<Awaited<ReturnType<typeof createVideoProvider>>>();
  const toast = useToast();

  useEffect(() => {
    const joinCall = async () => {
      // Determine provider priority: prop > env default
      const envDefault = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_DEFAULT_VIDEO_PROVIDER as 'twilio' | 'google-meet' | 'livekit') || 'twilio';

      try {
        const selectedProvider = provider || envDefault;
        
        providerRef.current = await createVideoProvider(selectedProvider, {
          userId,
          userRole,
          facilityId
        });

        await providerRef.current.joinRoom(callId, {
          id: userId,
          name: userName || 'Anonymous',
          role: userRole as 'resident' | 'visitor' | 'attorney' | 'staff',
          audioEnabled: true,
          videoEnabled: true
        });
        
        // Start recording if required by facility settings
        const facilityRes = await fetch(`/api/facilities/${facilityId}/settings`);
        const facilitySettings = await facilityRes.json();
        
        if (facilitySettings.monitoring.recordCalls) {
          await providerRef.current.startRecording(callId, {
            aiMonitoring: facilitySettings.monitoring.aiMonitoring
          });
          setIsRecording(true);
        }
        setIsConnecting(false);
      } catch (err: any) {
        const errorMessage = err.message || 'Error joining call';
        console.error('Error joining call:', err);
        setError(errorMessage);
        
        // Call the onError callback if provided
        if (onError) {
          onError(errorMessage);
        }
        
        // Check if error is related to missing environment variables
        const isMissingEnvVars = errorMessage.includes('requires apiKey') || 
                                errorMessage.includes('Missing environment');
        
        toast({
          title: 'Error joining call',
          description: isMissingEnvVars 
            ? 'Missing video provider configuration. Please contact support.' 
            : errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true
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
              await providerRef.current.muteAudioTrack();
              setIsAudioMuted(true);
            }
          }}
          onMuteVideo={async () => {
            if (providerRef.current) {
              await providerRef.current.muteVideoTrack();
              setIsVideoMuted(true);
            }
          }}
          onEndCall={async () => {
            if (providerRef.current) {
              await providerRef.current.leaveRoom(callId, userId);
            }
            window.location.href = '/calls/new';
          }}
        />
      </Box>
    </Flex>
  );
};
