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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Switch,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Alert,
  AlertIcon,
  useDisclosure,
} from '@chakra-ui/react';
import { 
  FaMicrophone, 
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
  FaExclamationTriangle,
  FaCog,
  FaImage,
  FaSignal,
  FaRecordVinyl,
} from 'react-icons/fa';

interface VideoRoomProps {
  isPrivateCall?: boolean;
  isLegalConsultation?: boolean;
  scheduledEndTime?: Date;
  participantName?: string;
  connectionQuality?: 'good' | 'fair' | 'poor';
  isRecording?: boolean;
  signalStrength?: number; // 1-5
  userName?: string;
  userRole?: string;
}

export const VideoRoom: React.FC<VideoRoomProps> = ({
  isPrivateCall = false,
  isLegalConsultation = false,
  scheduledEndTime,
  participantName = 'Participant',
  connectionQuality = 'good',
  isRecording = false,
  signalStrength = 5,
  userName = 'You',
  userRole = 'Resident',
}) => {
  // Mock states for UI demonstration
  const [isMuted, setIsMuted] = React.useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = React.useState(true);
  const [remainingTime, setRemainingTime] = React.useState<string>('14:59');
  const [virtualBackground, setVirtualBackground] = React.useState<string>('none');
  const [noiseReduction, setNoiseReduction] = React.useState(true);
  const [audioGain, setAudioGain] = React.useState(75);
  const { isOpen: isDisclaimerOpen, onClose: onDisclaimerClose } = useDisclosure({ defaultIsOpen: true });

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const controlsBg = useColorModeValue('white', 'gray.800');

  const renderSignalStrength = () => {
    return (
      <HStack spacing={1}>
        {[...Array(5)].map((_, i) => (
          <Box
            key={i}
            w="3px"
            h={`${(i + 1) * 4}px`}
            bg={i < signalStrength ? 'green.500' : 'gray.300'}
            borderRadius="sm"
          />
        ))}
      </HStack>
    );
  };

  return (
    <Box>
      {/* Legal Disclaimer */}
      {isDisclaimerOpen && (
        <Alert status="info" mb={4}>
          <AlertIcon />
          <Text fontSize="sm">
            This call may be monitored and recorded for security purposes. 
            By continuing, you agree to our terms of service and privacy policy.
          </Text>
        </Alert>
      )}

      <Grid
        h={{ base: 'calc(100vh - 16rem)', lg: 'calc(100vh - 12rem)' }}
        templateRows={{ base: '1fr auto', lg: '1fr auto' }}
        templateColumns={{ base: '1fr', lg: '1fr 300px' }}
        bg={bgColor}
        gap={4}
        p={4}
      >
        {/* Main video area */}
        <Box
          bg="gray.900"
          borderRadius="lg"
          position="relative"
          overflow="hidden"
        >
          {/* Status indicators */}
          <Box
            position="absolute"
            top={4}
            left={4}
            zIndex={2}
          >
            <VStack align="start" spacing={2}>
              <HStack spacing={2}>
                {renderSignalStrength()}
                <Badge colorScheme={connectionQuality === 'good' ? 'green' : connectionQuality === 'fair' ? 'yellow' : 'red'}>
                  {connectionQuality.toUpperCase()}
                </Badge>
                {isPrivateCall && (
                  <Badge colorScheme="purple">PRIVATE</Badge>
                )}
                {isLegalConsultation && (
                  <Badge colorScheme="blue">LEGAL - NOT RECORDED</Badge>
                )}
                {isRecording && (
                  <Badge colorScheme="red" display="flex" alignItems="center" gap={1}>
                    <FaRecordVinyl /> RECORDING
                  </Badge>
                )}
              </HStack>
            </VStack>
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
        <VStack spacing={4} display={{ base: 'none', lg: 'flex' }}>
          {/* Self view */}
          <Box
            bg="gray.900"
            borderRadius="lg"
            w="100%"
            h="200px"
            position="relative"
          >
            <VStack
              position="absolute"
              bottom={2}
              left={2}
              align="start"
              spacing={1}
            >
              <Badge>{userName}</Badge>
              <Text fontSize="xs" color="gray.300">{userRole}</Text>
            </VStack>
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
              <HStack>
                <Text>Signal:</Text>
                {renderSignalStrength()}
              </HStack>
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
        flexWrap={{ base: 'wrap', md: 'nowrap' }}
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
        
        {/* Settings Menu */}
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Call settings"
            icon={<FaCog />}
            size="lg"
            isRound
          />
          <MenuList>
            <MenuItem icon={<FaImage />}>
              Virtual Background
              <Menu>
                <MenuList>
                  <MenuItem onClick={() => setVirtualBackground('none')}>None</MenuItem>
                  <MenuItem onClick={() => setVirtualBackground('blur')}>Blur</MenuItem>
                  <MenuItem onClick={() => setVirtualBackground('office')}>Office</MenuItem>
                  <MenuItem onClick={() => setVirtualBackground('library')}>Library</MenuItem>
                </MenuList>
              </Menu>
            </MenuItem>
            <MenuItem>
              <HStack justify="space-between" w="100%">
                <Text>Noise Reduction</Text>
                <Switch
                  isChecked={noiseReduction}
                  onChange={(e) => setNoiseReduction(e.target.checked)}
                />
              </HStack>
            </MenuItem>
            <MenuItem>
              <VStack w="100%" align="stretch">
                <Text>Microphone Level</Text>
                <Slider
                  value={audioGain}
                  onChange={setAudioGain}
                  min={0}
                  max={100}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </VStack>
            </MenuItem>
          </MenuList>
        </Menu>

        <IconButton
          aria-label="End call"
          icon={<FaPhoneSlash />}
          colorScheme="red"
          size="lg"
          isRound
        />
        
        {connectionQuality === 'poor' && (
          <Popover>
            <PopoverTrigger>
              <IconButton
                aria-label="Connection warning"
                icon={<FaExclamationTriangle />}
                colorScheme="yellow"
                size="lg"
                isRound
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Poor Connection</PopoverHeader>
              <PopoverBody>
                Your connection quality is poor. Try moving to a location with better signal strength or connecting to a different network.
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )}
      </Flex>
    </Box>
  );
}; 