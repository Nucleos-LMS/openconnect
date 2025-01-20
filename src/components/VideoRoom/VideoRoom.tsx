import React from 'react';
import {
  Box,
  Grid,
  Flex,
  IconButton,
  Text,
  HStack,
  VStack,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  FaMicrophone, 
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
  FaExclamationTriangle
} from 'react-icons/fa';

interface VideoRoomProps {
  isPrivateCall?: boolean;
  isLegalConsultation?: boolean;
  scheduledEndTime?: Date;
  participantName?: string;
  connectionQuality?: 'good' | 'fair' | 'poor';
}

export const VideoRoom: React.FC<VideoRoomProps> = ({
  isPrivateCall = false,
  isLegalConsultation = false,
  scheduledEndTime,
  participantName = 'Participant',
  connectionQuality = 'good',
}) => {
  // Mock states for UI demonstration
  const [isMuted, setIsMuted] = React.useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = React.useState(true);
  const [remainingTime, setRemainingTime] = React.useState<string>('14:59');

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const controlsBg = useColorModeValue('white', 'gray.800');

  return (
    <Grid
      h="100vh"
      templateRows="1fr auto"
      bg={bgColor}
      gap={4}
      p={4}
    >
      {/* Main video area */}
      <Grid templateColumns="1fr 300px" gap={4}>
        <Box
          bg="gray.900"
          borderRadius="lg"
          position="relative"
          overflow="hidden"
        >
          {/* Main video placeholder */}
          <Box
            position="absolute"
            top={4}
            left={4}
            zIndex={2}
          >
            <HStack spacing={2}>
              <Badge colorScheme={connectionQuality === 'good' ? 'green' : connectionQuality === 'fair' ? 'yellow' : 'red'}>
                {connectionQuality.toUpperCase()}
              </Badge>
              {isPrivateCall && (
                <Badge colorScheme="purple">PRIVATE</Badge>
              )}
              {isLegalConsultation && (
                <Badge colorScheme="blue">LEGAL - NOT RECORDED</Badge>
              )}
            </HStack>
          </Box>

          {/* Timer */}
          <Box
            position="absolute"
            top={4}
            right={4}
            zIndex={2}
          >
            <Badge
              colorScheme="blue"
              fontSize="lg"
              p={2}
            >
              {remainingTime}
            </Badge>
          </Box>
        </Box>

        {/* Side panel */}
        <VStack spacing={4}>
          {/* Self view */}
          <Box
            bg="gray.900"
            borderRadius="lg"
            w="100%"
            h="200px"
            position="relative"
          >
            <Badge
              position="absolute"
              bottom={2}
              left={2}
            >
              You
            </Badge>
          </Box>

          {/* Call info */}
          <Box
            p={4}
            bg={controlsBg}
            borderRadius="lg"
            w="100%"
          >
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">Call Information</Text>
              <Text>Connected with: {participantName}</Text>
              <Text size="sm" color={connectionQuality === 'good' ? 'green.500' : connectionQuality === 'fair' ? 'yellow.500' : 'red.500'}>
                Connection: {connectionQuality}
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Grid>

      {/* Controls */}
      <Flex
        bg={controlsBg}
        p={4}
        borderRadius="lg"
        justify="center"
        align="center"
        gap={4}
      >
        <IconButton
          aria-label="Toggle microphone"
          icon={isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          onClick={() => setIsMuted(!isMuted)}
          colorScheme={isMuted ? 'red' : 'gray'}
          size="lg"
          isRound
        />
        <IconButton
          aria-label="Toggle video"
          icon={isVideoEnabled ? <FaVideo /> : <FaVideoSlash />}
          onClick={() => setIsVideoEnabled(!isVideoEnabled)}
          colorScheme={isVideoEnabled ? 'gray' : 'red'}
          size="lg"
          isRound
        />
        <IconButton
          aria-label="End call"
          icon={<FaPhoneSlash />}
          colorScheme="red"
          size="lg"
          isRound
        />
        {connectionQuality === 'poor' && (
          <IconButton
            aria-label="Connection warning"
            icon={<FaExclamationTriangle />}
            colorScheme="yellow"
            size="lg"
            isRound
          />
        )}
      </Flex>
    </Grid>
  );
}; 