import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  HStack,
  Text, 
  Select,
  Button,
  Progress,
} from '@chakra-ui/react';

export interface DeviceSetupProps {
  onError: (error: string) => void;
}

export const DeviceSetup: React.FC<DeviceSetupProps> = ({ onError }) => {
  const [testing, setTesting] = useState(false);

  return (
    <Box borderWidth={1} borderRadius="lg" p={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold">Device Setup</Text>
        
        <HStack>
          <Select placeholder="Select camera">
            <option value="camera1">Camera 1</option>
            <option value="camera2">Camera 2</option>
          </Select>
          <Button onClick={() => {/* Test camera */}}>Test</Button>
        </HStack>

        <HStack>
          <Select placeholder="Select microphone">
            <option value="mic1">Microphone 1</option>
            <option value="mic2">Microphone 2</option>
          </Select>
          <Button onClick={() => {/* Test microphone */}}>Test</Button>
        </HStack>

        <HStack>
          <Select placeholder="Select speakers">
            <option value="speaker1">Speaker 1</option>
            <option value="speaker2">Speaker 2</option>
          </Select>
          <Button onClick={() => {/* Test speakers */}}>Test</Button>
        </HStack>

        {testing && <Progress size="xs" isIndeterminate />}
      </VStack>
    </Box>
  );
};
