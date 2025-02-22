import React from 'react'
import { Box, VStack, Heading, Button } from '@chakra-ui/react'

export interface NetworkTestProps {
  onComplete?: () => void
}

export const NetworkTest: React.FC<NetworkTestProps> = ({ onComplete }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6}>
      <VStack spacing={4} align="stretch">
        <Heading size="md">Network Test</Heading>
        {/* Network speed test UI will be implemented here */}
        <Button onClick={onComplete} colorScheme="primary">
          Start Test
        </Button>
      </VStack>
    </Box>
  )
}
