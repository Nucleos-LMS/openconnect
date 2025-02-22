import React from 'react'
import { Box, VStack, Heading } from '@chakra-ui/react'
import { DeviceSetup } from './DeviceSetup.tsx'
import { NetworkTest } from './NetworkTest.tsx'
import { BackgroundPreview } from './BackgroundPreview.tsx'

export interface WaitingRoomProps {
  onDeviceSetupComplete?: () => void
  onNetworkTestComplete?: () => void
  onJoinCall?: () => void
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({
  onDeviceSetupComplete,
  onNetworkTestComplete,
  onJoinCall,
}) => {
  return (
    <Box p={8} maxW="container.md" mx="auto">
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Call Setup</Heading>
        <DeviceSetup onComplete={onDeviceSetupComplete} />
        <NetworkTest onComplete={onNetworkTestComplete} />
        <BackgroundPreview />
      </VStack>
    </Box>
  )
}
