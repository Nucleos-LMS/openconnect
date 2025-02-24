import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import {
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
  MdCallEnd
} from 'react-icons/md';

interface VideoControlsProps {
  onMuteAudio: () => void;
  onMuteVideo: () => void;
  onEndCall: () => void;
}

export const VideoControls = ({
  onMuteAudio,
  onMuteVideo,
  onEndCall
}: VideoControlsProps) => {
  const [isAudioMuted, setIsAudioMuted] = React.useState(false);
  const [isVideoMuted, setIsVideoMuted] = React.useState(false);

  const handleAudioToggle = () => {
    setIsAudioMuted(!isAudioMuted);
    onMuteAudio();
  };

  const handleVideoToggle = () => {
    setIsVideoMuted(!isVideoMuted);
    onMuteVideo();
  };

  return (
    <Box
      position="absolute"
      bottom={4}
      left="50%"
      transform="translateX(-50%)"
      bg="blackAlpha.600"
      borderRadius="full"
      px={4}
      py={2}
    >
      <ButtonGroup spacing={4}>
        <Tooltip label={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}>
          <IconButton
            aria-label="Toggle audio"
            icon={isAudioMuted ? <MdMicOff /> : <MdMic />}
            onClick={handleAudioToggle}
            colorScheme={isAudioMuted ? 'red' : 'gray'}
            variant="ghost"
            size="lg"
            isRound
          />
        </Tooltip>

        <Tooltip label={isVideoMuted ? 'Enable Video' : 'Disable Video'}>
          <IconButton
            aria-label="Toggle video"
            icon={isVideoMuted ? <MdVideocamOff /> : <MdVideocam />}
            onClick={handleVideoToggle}
            colorScheme={isVideoMuted ? 'red' : 'gray'}
            variant="ghost"
            size="lg"
            isRound
          />
        </Tooltip>

        <Tooltip label="End Call">
          <Button
            leftIcon={<MdCallEnd />}
            onClick={onEndCall}
            colorScheme="red"
            size="lg"
            borderRadius="full"
          >
            End Call
          </Button>
        </Tooltip>
      </ButtonGroup>
    </Box>
  );
};
