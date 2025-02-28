import React from 'react';
import { Box, Heading, Text, Stack, Badge, useColorModeValue } from '@chakra-ui/react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// Define the CallData interface that will be imported from the API client
export interface CallData {
  id: string;
  participants: string[];
  startTime: string;
  endTime?: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}

// Conditionally import useRouter to avoid errors in Storybook
let useRouter: () => AppRouterInstance;
try {
  useRouter = require('next/navigation').useRouter;
} catch (e) {
  // Mock router for Storybook environment
  useRouter = () => ({
    push: (path: string) => {
      console.log(`[Storybook] Navigation to: ${path}`);
    },
    back: () => {
      console.log(`[Storybook] Navigation: back`);
    },
    forward: () => {
      console.log(`[Storybook] Navigation: forward`);
    },
    refresh: () => {
      console.log(`[Storybook] Navigation: refresh`);
    },
    replace: (path: string) => {
      console.log(`[Storybook] Navigation: replace ${path}`);
    },
    prefetch: (path: string) => {
      console.log(`[Storybook] Navigation: prefetch ${path}`);
      return Promise.resolve();
    }
  });
}

interface CallListProps {
  calls: CallData[];
  onSelectCall?: (callId: string) => void;
  isStorybook?: boolean;
}

export const CallList: React.FC<CallListProps> = ({ 
  calls, 
  onSelectCall,
  isStorybook = false 
}) => {
  // Only use router in non-Storybook environment
  const router = isStorybook ? null : useRouter();
  
  // Get color mode values for hover effect
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  
  const handleSelectCall = (callId: string) => {
    // Track call selection for analytics
    console.log(`[ANALYTICS] Call selected: ${callId}`);
    
    if (onSelectCall) {
      onSelectCall(callId);
    } else if (router) {
      router.push(`/calls/${callId}`);
    } else {
      console.log(`[CallList] Navigate to call: ${callId}`);
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get badge color based on call status
  const getStatusColor = (status: CallData['status']): string => {
    switch (status) {
      case 'active':
        return 'green';
      case 'scheduled':
        return 'blue';
      case 'completed':
        return 'gray';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Box>
      <Heading size="md" mb={4}>Your Calls</Heading>
      {calls.length === 0 ? (
        <Box p={4} borderWidth={1} borderRadius="md" textAlign="center">
          <Text>No calls found.</Text>
        </Box>
      ) : (
        <Stack spacing={3}>
          {calls.map(call => (
            <Box 
              key={call.id} 
              p={4} 
              borderWidth={1} 
              borderRadius="md"
              onClick={() => handleSelectCall(call.id)}
              cursor="pointer"
              _hover={{ bg: hoverBgColor }}
              transition="background-color 0.2s"
            >
              <Text fontWeight="bold">
                Call ID: {call.id.substring(0, 8)}...
              </Text>
              <Text fontSize="sm" color="gray.600">
                {formatDate(call.startTime)}
              </Text>
              {call.endTime && (
                <Text fontSize="xs" color="gray.500">
                  Ended: {formatDate(call.endTime)}
                </Text>
              )}
              <Badge colorScheme={getStatusColor(call.status)}>
                {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
              </Badge>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};
