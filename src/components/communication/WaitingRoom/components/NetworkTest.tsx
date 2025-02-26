'use client';

import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  HStack,
  Text, 
  Button,
  Progress,
  Badge,
} from '@chakra-ui/react';

export interface NetworkTestProps {
  onComplete: (status: { isGood: boolean; speed: number }) => void;
}

export const NetworkTest: React.FC<NetworkTestProps> = ({ onComplete }) => {
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'testing' | 'complete'>('idle');

  const runTest = async () => {
    setTesting(true);
    setStatus('testing');
    
    // Simulate network test
    setTimeout(() => {
      const result = { isGood: true, speed: 5.5 };
      setTesting(false);
      setStatus('complete');
      onComplete(result);
    }, 2000);
  };

  return (
    <Box borderWidth={1} borderRadius="lg" p={4}>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="bold">Network Test</Text>
          {status === 'complete' && (
            <Badge colorScheme="green">Connection Good</Badge>
          )}
        </HStack>

        {status === 'testing' && <Progress size="xs" isIndeterminate />}

        <Button 
          onClick={runTest} 
          isLoading={testing}
          loadingText="Testing Connection"
        >
          Test Connection
        </Button>
      </VStack>
    </Box>
  );
};
