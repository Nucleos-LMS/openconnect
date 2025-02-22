import React from 'react'
import { Box, VStack, Heading } from '@chakra-ui/react'

export const BackgroundPreview: React.FC = () => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6}>
      <VStack spacing={4} align="stretch">
        <Heading size="md">Background Preview</Heading>
        {/* Virtual background preview will be implemented here */}
      </VStack>
    </Box>
  )
}
