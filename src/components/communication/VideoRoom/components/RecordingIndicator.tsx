import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { MdFiberManualRecord } from 'react-icons/md';

export const RecordingIndicator = () => {
  return (
    <Box
      position="absolute"
      top={4}
      right={4}
      bg="red.500"
      color="white"
      px={3}
      py={1}
      borderRadius="full"
      display="flex"
      alignItems="center"
    >
      <MdFiberManualRecord />
      <Text ml={2} fontSize="sm">
        Recording
      </Text>
    </Box>
  );
};
