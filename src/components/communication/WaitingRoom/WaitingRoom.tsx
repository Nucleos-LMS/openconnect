'use client';

import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, Button, useToast, Heading, Stack, Checkbox } from '@chakra-ui/react';
import { DeviceSetup } from './components/DeviceSetup';
import { NetworkTest } from './components/NetworkTest';
import { ParticipantStatus } from './components/ParticipantStatus';
import { CallInfo } from './components/CallInfo';

interface Contact {
  id: string;
  name: string;
  role: string;
}

export interface WaitingRoomProps {
  userId: string;
  userRole: string;
  facilityId: string;
  callType?: 'standard' | 'legal' | 'educational';
  scheduledTime?: string;
  participants?: Array<{
    name: string;
    role: string;
    isReady: boolean;
  }>;
  onJoinCall?: (selectedParticipants?: string[]) => void;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({
  userId,
  userRole,
  facilityId,
  callType = 'standard',
  scheduledTime = new Date().toISOString(),
  participants = [],
  onJoinCall = () => {},
}) => {
  const toast = useToast();
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [availableContacts, setAvailableContacts] = useState<Contact[]>([]);
  
  // Fetch available contacts based on user role and facility
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`/api/contacts?facilityId=${facilityId}&userRole=${userRole}`);
        if (response.ok) {
          const data = await response.json();
          setAvailableContacts(data);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    
    fetchContacts();
  }, [facilityId, userRole]);

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
        onError={(error: string) => {
          toast({
            title: "Device Setup Error",
            description: error,
            status: "error",
            duration: 5000,
          });
        }}
      />

      <NetworkTest 
        onComplete={(status: { isGood: boolean; speed: number }) => {
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

      <Box mt={6}>
        <Heading size="md">Select Participants</Heading>
        <Stack mt={2}>
          {availableContacts.map((contact) => (
            <Checkbox
              key={contact.id}
              isChecked={selectedParticipants.includes(contact.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedParticipants([...selectedParticipants, contact.id]);
                } else {
                  setSelectedParticipants(selectedParticipants.filter(id => id !== contact.id));
                }
              }}
            >
              {contact.name} ({contact.role})
            </Checkbox>
          ))}
        </Stack>
      </Box>

      <Button 
        colorScheme="blue"
        size="lg"
        onClick={() => onJoinCall(selectedParticipants)}
        isDisabled={participants.some(p => !p.isReady)}
      >
        Join Call
      </Button>
    </VStack>
  );
};
