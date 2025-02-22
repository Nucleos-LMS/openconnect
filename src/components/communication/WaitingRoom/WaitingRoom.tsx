import React from 'react';
import { Box, VStack, Text, Button, useToast } from '@chakra-ui/react';
import { DeviceSetup } from './DeviceSetup';
import { NetworkTest } from './NetworkTest';
import { ParticipantStatus } from './ParticipantStatus';
import { CallInfo } from './CallInfo';

export interface WaitingRoomProps {
  callType: 'standard' | 'legal' | 'educational';
  scheduledTime: string;
  participants: Array<{
    name: string;
    role: string;
    isReady: boolean;
  }>;
  onJoinCall: () => void;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({
  callType,
  scheduledTime,
  participants,
  onJoinCall,
}) => {
  const toast = useToast();

  return (
    <VStack spacing={6} align="stretch" p={6}>
      <Box bg="blue.50" p={4} borderRadius="md">
        <Text>
          This call may be monitored and recorded for security purposes. 
          By continuing, you agree to our terms of service and privacy policy.
        </Text>
      </Box>

      <CallInfo 
        type={callType}
        scheduledTime={scheduledTime}
        participants={participants}
      />

      <DeviceSetup 
        onError={(error) => {
          toast({
            title: "Device Setup Error",
            description: error,
            status: "error",
            duration: 5000,
          });
        }}
      />

      <NetworkTest 
        onComplete={(status) => {
          if (status.isGood) {
            toast({
              title: "Network Test Complete",
              description: "Your connection is good for video calls",
              status: "success",
              duration: 3000,
            });
          } else {
            toast({
              title: "Network Test Warning",
              description: "Your connection may be unstable",
              status: "warning",
              duration: 5000,
            });
          }
        }}
      />

      <ParticipantStatus participants={participants} />

      <Button 
        colorScheme="blue"
        size="lg"
        onClick={onJoinCall}
        isDisabled={participants.some(p => !p.isReady)}
      >
        Join Call
      </Button>
    </VStack>
  );
};
