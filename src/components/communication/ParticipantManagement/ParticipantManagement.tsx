import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from '@chakra-ui/react';
import { ChevronDownIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export interface Participant {
  id: string;
  name: string;
  role: 'resident' | 'visitor' | 'attorney' | 'staff';
  audioEnabled?: boolean;
  videoEnabled?: boolean;
}

export interface ParticipantManagementProps {
  participants: Participant[];
  currentUserRole: 'resident' | 'visitor' | 'attorney' | 'staff';
  onToggleAudio: (participantId: string) => void;
  onToggleVideo: (participantId: string) => void;
  onRemoveParticipant?: (participantId: string) => void;
}

const roleHierarchy = {
  staff: 4,
  attorney: 3,
  resident: 2,
  visitor: 1,
};

const getRoleColor = (role: Participant['role']) => {
  switch (role) {
    case 'staff':
      return 'purple';
    case 'attorney':
      return 'blue';
    case 'resident':
      return 'green';
    case 'visitor':
      return 'orange';
    default:
      return 'gray';
  }
};

export const ParticipantManagement: React.FC<ParticipantManagementProps> = ({
  participants,
  currentUserRole,
  onToggleAudio,
  onToggleVideo,
  onRemoveParticipant,
}) => {
  const toast = useToast();
  const currentUserLevel = roleHierarchy[currentUserRole];

  const canManageParticipant = (participantRole: Participant['role']) => {
    return currentUserLevel > roleHierarchy[participantRole];
  };

  const handleRemoveParticipant = (participant: Participant) => {
    if (!canManageParticipant(participant.role)) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to remove this participant",
        status: "error",
        duration: 3000,
      });
      return;
    }
    onRemoveParticipant?.(participant.id);
  };

  return (
    <Box borderWidth={1} borderRadius="lg" p={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold">Participants</Text>

        {participants.map((participant) => (
          <HStack key={participant.id} justify="space-between" p={2} borderWidth={1} borderRadius="md">
            <VStack align="start" spacing={1}>
              <Text fontWeight="medium">{participant.name}</Text>
              <HStack spacing={2}>
                <Badge colorScheme={getRoleColor(participant.role)}>
                  {participant.role.charAt(0).toUpperCase() + participant.role.slice(1)}
                </Badge>
                <Badge colorScheme={participant.audioEnabled ? 'green' : 'red'}>
                  {participant.audioEnabled ? 'Audio On' : 'Audio Off'}
                </Badge>
                <Badge colorScheme={participant.videoEnabled ? 'green' : 'red'}>
                  {participant.videoEnabled ? 'Video On' : 'Video Off'}
                </Badge>
              </HStack>
            </VStack>

            <HStack>
              {canManageParticipant(participant.role) && (
                <>
                  <IconButton
                    aria-label="Toggle audio"
                    icon={participant.audioEnabled ? <ViewIcon /> : <ViewOffIcon />}
                    onClick={() => onToggleAudio(participant.id)}
                    size="sm"
                  />
                  <IconButton
                    aria-label="Toggle video"
                    icon={participant.videoEnabled ? <ViewIcon /> : <ViewOffIcon />}
                    onClick={() => onToggleVideo(participant.id)}
                    size="sm"
                  />
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<ChevronDownIcon />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem onClick={() => handleRemoveParticipant(participant)}>
                        Remove Participant
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </>
              )}
            </HStack>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};
