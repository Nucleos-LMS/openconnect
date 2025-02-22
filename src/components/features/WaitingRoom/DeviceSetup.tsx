import React from 'react'
import { Box, VStack, Heading, Button } from '@chakra-ui/react'

export interface DeviceSetupProps {
  onComplete?: () => void
}

export const DeviceSetup: React.FC<DeviceSetupProps> = ({ onComplete }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6}>
      <VStack spacing={4} align="stretch">
        <Heading size="md">Device Setup</Heading>
        {/* Camera and microphone selection will be implemented here */}
        <Button onClick={onComplete} colorScheme="primary">
          Confirm Devices
        </Button>
      </VStack>
    </Box>
  )
}
