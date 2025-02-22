import React from 'react';
import { 
  Box, 
  VStack,
  HStack,
  Text,
  Badge,
} from '@chakra-ui/react';

export interface CallInfoProps {
  type: 'standard' | 'legal' | 'educational';
  scheduledTime: string;
  participants: Array<{ name: string; role: string }>;
}

export const CallInfo: React.FC<CallInfoProps> = ({ 
  type,
  scheduledTime,
  participants,
}) => {
  const formattedTime = new Date(scheduledTime).toLocaleTimeString();

  return (
    <Box borderWidth={1} borderRadius="lg" p={4}>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="bold">Call Information</Text>
          <Badge colorScheme={
            type === 'legal' ? 'purple' : 
            type === 'educational' ? 'blue' : 
            'green'
          }>
            {type.charAt(0).toUpperCase() + type.slice(1)} Call
          </Badge>
        </HStack>

        <VStack align="start" spacing={2}>
          <Text>
            <Text as="span" fontWeight="medium">Scheduled Time: </Text>
            {formattedTime}
          </Text>
          
          <Text>
            <Text as="span" fontWeight="medium">Participants: </Text>
            {participants.map(p => p.name).join(', ')}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};
