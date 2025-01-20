import React from 'react'
import { VStack, SimpleGrid, Icon, Text } from '@chakra-ui/react'
import { FaUser, FaGavel, FaGraduationCap } from 'react-icons/fa'
import { Card } from '../../../common/Card'

export interface UserTypeSelectionProps {
  onSelect: (userType: 'family' | 'legal' | 'educator') => void;
}

const userTypes = [
  {
    id: 'family',
    title: 'Family Member',
    description: 'Connect with your incarcerated loved ones',
    icon: FaUser,
  },
  {
    id: 'legal',
    title: 'Legal Representative',
    description: 'Manage cases and communicate with clients',
    icon: FaGavel,
  },
  {
    id: 'educator',
    title: 'Educator',
    description: 'Facilitate educational programs and resources',
    icon: FaGraduationCap,
  },
] as const

export const UserTypeSelection = ({ onSelect }: UserTypeSelectionProps) => {
  return (
    <VStack spacing={6} width="100%" maxW="4xl">
      <Text fontSize="2xl" fontWeight="bold">
        Select Your Role
      </Text>
      <Text color="gray.600" textAlign="center">
        Choose how you'll be using OpenConnect
      </Text>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} width="100%">
        {userTypes.map((type) => (
          <Card
            key={type.id}
            as="button"
            onClick={() => onSelect(type.id)}
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            py={8}
            px={6}
            height="100%"
            transition="all 0.2s"
            _hover={{
              transform: 'translateY(-4px)',
              boxShadow: 'xl',
            }}
          >
            <Icon as={type.icon} boxSize={12} color="primary.500" mb={4} />
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              {type.title}
            </Text>
            <Text color="gray.600">
              {type.description}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </VStack>
  )
} 