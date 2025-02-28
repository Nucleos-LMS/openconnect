import React from 'react';
import { Box, Heading, Text, VStack, HStack, Button, Avatar, Badge, Flex, useColorModeValue } from '@chakra-ui/react';

interface UserProfileProps {
  userName?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  onEditProfile?: () => void;
  isStorybook?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userName,
  userEmail,
  userRole,
  onEditProfile,
  isStorybook = false,
}) => {
  // Determine role-specific styling
  const isInmate = userRole === 'Resident';
  const isFamily = userRole === 'Family';
  const isLegal = userRole === 'Legal';
  const isStaff = userRole === 'Staff';
  
  // Get role badge color
  const getRoleBadgeColor = (): string => {
    switch (userRole) {
      case 'Resident':
        return 'blue';
      case 'Family':
        return 'green';
      case 'Legal':
        return 'purple';
      case 'Staff':
        return 'red';
      default:
        return 'gray';
    }
  };
  
  // Track profile view for analytics
  React.useEffect(() => {
    if (!isStorybook) {
      console.log('[ANALYTICS] Profile viewed', { userRole });
    }
  }, [isStorybook, userRole]);
  
  const handleEditProfile = () => {
    if (!isStorybook) {
      console.log('[ANALYTICS] Edit profile clicked', { userRole });
    }
    
    if (onEditProfile) {
      onEditProfile();
    } else if (!isStorybook) {
      console.log('[UserProfile] Edit profile action not provided');
    }
  };
  
  // Get background color based on color mode
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box 
      p={6} 
      borderWidth={1} 
      borderRadius="lg" 
      boxShadow="md"
      bg={bgColor}
      borderColor={borderColor}
    >
      <VStack spacing={6} align="stretch">
        <Flex justifyContent="space-between" alignItems="flex-start">
          <HStack spacing={4} align="flex-start">
            <Avatar 
              size="xl" 
              name={userName || 'User'} 
              bg={getRoleBadgeColor() + '.500'}
              color="white"
            />
            <VStack align="start" spacing={1}>
              <Heading size="md">{userName || 'User'}</Heading>
              <Text color="gray.600">{userEmail}</Text>
              <HStack mt={1}>
                <Badge colorScheme={getRoleBadgeColor()}>
                  {userRole || 'User'}
                </Badge>
                {isLegal && <Badge colorScheme="yellow">Legal Representative</Badge>}
                {isStaff && <Badge colorScheme="orange">Staff Access</Badge>}
              </HStack>
            </VStack>
          </HStack>
          
          <Button 
            size="sm" 
            colorScheme="blue" 
            variant="outline"
            onClick={handleEditProfile}
          >
            Edit Profile
          </Button>
        </Flex>
        
        {/* Role-specific information */}
        {isInmate && (
          <Box mt={4} p={4} borderWidth={1} borderRadius="md" borderColor={borderColor}>
            <Heading size="sm" mb={2}>Resident Information</Heading>
            <Text fontSize="sm">ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</Text>
            <Text fontSize="sm">Facility: Example Correctional Facility</Text>
          </Box>
        )}
        
        {isFamily && (
          <Box mt={4} p={4} borderWidth={1} borderRadius="md" borderColor={borderColor}>
            <Heading size="sm" mb={2}>Family Information</Heading>
            <Text fontSize="sm">Relationship: Family Member</Text>
            <Text fontSize="sm">Approved Contacts: 3</Text>
          </Box>
        )}
        
        {isLegal && (
          <Box mt={4} p={4} borderWidth={1} borderRadius="md" borderColor={borderColor}>
            <Heading size="sm" mb={2}>Legal Information</Heading>
            <Text fontSize="sm">Bar ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</Text>
            <Text fontSize="sm">Clients: 5</Text>
          </Box>
        )}
        
        {isStaff && (
          <Box mt={4} p={4} borderWidth={1} borderRadius="md" borderColor={borderColor}>
            <Heading size="sm" mb={2}>Staff Information</Heading>
            <Text fontSize="sm">Department: Administration</Text>
            <Text fontSize="sm">Access Level: Full</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
