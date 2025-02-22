import React from 'react';
import { 
  Box, 
  VStack,
  HStack, 
  Text,
  Badge,
  Avatar,
} from '@chakra-ui/react';

interface Participant {
  name: string;
  role: string;
  isReady: boolean;
}

export interface ParticipantStatusProps {
  participants: Participant[];
}

export const ParticipantStatus: React.FC<ParticipantStatusProps> = ({ 
  participants 
}) => {
  return (
    <Box borderWidth={1} borderRadius="lg" p={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold">Participants</Text>

        {participants.map((participant, index) => (
          <HStack key={index} justify="space-between">
            <HStack>
              <Avatar size="sm" name={participant.name} />
              <VStack align="start" spacing={0}>
                <Text fontWeight="medium">{participant.name}</Text>
                <Text fontSize="sm" color="gray.600">{participant.role}</Text>
              </VStack>
            </HStack>
            <Badge 
              colorScheme={participant.isReady ? "green" : "yellow"}
            >
              {participant.isReady ? "Ready" : "Not Ready"}
            </Badge>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};
