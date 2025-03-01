/**
 * Dashboard Component
 * 
 * CHANGES:
 * - Added proper type declarations for Node.js require
 * - Enhanced dynamic import handling for Next.js navigation
 * - Improved type safety for router instance
 */
import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Flex,
  Badge,
  Icon,
  Divider,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
} from '@chakra-ui/react';

// Define a type for the router instance
interface RouterInstance {
  push: (path: string) => void;
  back: () => void;
  forward: () => void;
  refresh: () => void;
  replace: (path: string) => void;
  prefetch: (path: string) => Promise<void>;
}

// Conditionally import useRouter to avoid errors in Storybook
let useRouter: () => RouterInstance;
try {
  // Dynamic import to avoid issues in Storybook
  // Using dynamic import with proper type handling
  const nextNavigation = typeof require !== 'undefined' ? require('next/navigation') : null;
  useRouter = nextNavigation?.useRouter;
} catch (e) {
  // Mock router for Storybook environment
  useRouter = () => ({
    push: (path: string) => {
      console.log(`[Storybook] Navigation to: ${path}`);
    },
    back: () => {
      console.log(`[Storybook] Navigation: back`);
    },
    forward: () => {
      console.log(`[Storybook] Navigation: forward`);
    },
    refresh: () => {
      console.log(`[Storybook] Navigation: refresh`);
    },
    replace: (path: string) => {
      console.log(`[Storybook] Navigation: replace ${path}`);
    },
    prefetch: (path: string) => {
      console.log(`[Storybook] Navigation: prefetch ${path}`);
      return Promise.resolve();
    }
  });
}

interface DashboardProps {
  userName?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  onNewCall?: () => void;
  onViewCalls?: () => void;
  onViewProfile?: () => void;
  onViewSchedule?: () => void;
  onViewContacts?: () => void;
  onViewSettings?: () => void;
  // For Storybook testing
  isStorybook?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userName,
  userEmail,
  userRole,
  onNewCall,
  onViewCalls,
  onViewProfile,
  onViewSchedule,
  onViewContacts,
  onViewSettings,
  isStorybook = false,
}) => {
  // Only use router in non-Storybook environment
  const router = isStorybook ? null : useRouter();
  
  // Type guard for router
  const hasRouter = (router: any): router is RouterInstance => {
    return router !== null;
  };
  
  // Determine user role for role-specific UI elements
  const isInmate = userRole === 'Resident';
  const isFamily = userRole === 'Family';
  const isLegal = userRole === 'Legal';
  const isStaff = userRole === 'Staff';
  
  // Analytics tracking for dashboard actions
  const trackAction = (action: string, details?: Record<string, any>) => {
    console.log(`[ANALYTICS] Dashboard action: ${action}`, details);
    // In a real implementation, this would send analytics data to a tracking service
  };
  
  const handleNewCall = () => {
    trackAction('new_call', { userRole });
    
    if (onNewCall) {
      onNewCall();
    } else if (hasRouter(router)) {
      router.push('/calls/new');
    } else {
      console.log('[Dashboard] Navigate to: /calls/new');
    }
  };

  const handleViewCalls = () => {
    trackAction('view_calls', { userRole });
    
    if (onViewCalls) {
      onViewCalls();
    } else if (hasRouter(router)) {
      router.push('/calls');
    } else {
      console.log('[Dashboard] Navigate to: /calls');
    }
  };
  
  const handleViewProfile = () => {
    trackAction('view_profile', { userRole });
    
    if (onViewProfile) {
      onViewProfile();
    } else if (hasRouter(router)) {
      router.push('/profile');
    } else {
      console.log('[Dashboard] Navigate to: /profile');
    }
  };
  
  const handleViewSchedule = () => {
    trackAction('view_schedule', { userRole });
    
    if (onViewSchedule) {
      onViewSchedule();
    } else if (hasRouter(router)) {
      router.push('/schedule');
    } else {
      console.log('[Dashboard] Navigate to: /schedule');
    }
  };
  
  const handleViewContacts = () => {
    trackAction('view_contacts', { userRole });
    
    if (onViewContacts) {
      onViewContacts();
    } else if (hasRouter(router)) {
      router.push('/contacts');
    } else {
      console.log('[Dashboard] Navigate to: /contacts');
    }
  };
  
  const handleViewSettings = () => {
    trackAction('view_settings', { userRole });
    
    if (onViewSettings) {
      onViewSettings();
    } else if (hasRouter(router)) {
      router.push('/settings');
    } else {
      console.log('[Dashboard] Navigate to: /settings');
    }
  };

  return (
    <Box maxW="6xl" mx="auto" mt={8} p={6}>
      <VStack spacing={8} align="stretch">
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <Heading as="h1" size="xl">
              Welcome, {userName || userEmail || 'User'}
            </Heading>
            <HStack mt={2}>
              <Badge colorScheme={
                isInmate ? 'blue' : 
                isFamily ? 'green' : 
                isLegal ? 'purple' : 
                isStaff ? 'red' : 'gray'
              }>
                {userRole || 'User'}
              </Badge>
              {isLegal && <Badge colorScheme="yellow">Legal Representative</Badge>}
              {isStaff && <Badge colorScheme="orange">Staff Access</Badge>}
            </HStack>
          </Box>
          <Button size="sm" colorScheme="gray" onClick={handleViewProfile}>
            View Profile
          </Button>
        </Flex>

        <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
          <VStack spacing={6} align="stretch">
            <Heading as="h2" size="lg">
              Quick Actions
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Button colorScheme="blue" size="lg" onClick={handleNewCall}>
                Start New Call
              </Button>
              <Button colorScheme="gray" size="lg" onClick={handleViewCalls}>
                View My Calls
              </Button>
              
              {/* Role-specific actions */}
              {isInmate && (
                <Button colorScheme="teal" onClick={handleViewContacts}>
                  Manage Contacts
                </Button>
              )}
              
              {(isFamily || isInmate) && (
                <Button colorScheme="purple" onClick={handleViewSchedule}>
                  Schedule Visits
                </Button>
              )}
              
              {isLegal && (
                <Button colorScheme="yellow" onClick={handleViewSchedule}>
                  Legal Consultations
                </Button>
              )}
              
              {isStaff && (
                <Button colorScheme="red" onClick={handleViewSettings}>
                  System Settings
                </Button>
              )}
            </SimpleGrid>
          </VStack>
        </Box>
        
        {/* Role-specific sections */}
        {isInmate && (
          <Card>
            <CardHeader>
              <Heading size="md">Educational Programs</Heading>
            </CardHeader>
            <CardBody>
              <Text>Access your educational programs and courses here.</Text>
              <Button mt={4} colorScheme="teal" variant="outline">
                View Programs
              </Button>
            </CardBody>
          </Card>
        )}
        
        {isFamily && (
          <Card>
            <CardHeader>
              <Heading size="md">Family Resources</Heading>
            </CardHeader>
            <CardBody>
              <Text>Access resources and support for families.</Text>
              <Button mt={4} colorScheme="green" variant="outline">
                View Resources
              </Button>
            </CardBody>
          </Card>
        )}
        
        {isLegal && (
          <Card>
            <CardHeader>
              <Heading size="md">Client Management</Heading>
            </CardHeader>
            <CardBody>
              <Text>Manage your client list and case information.</Text>
              <Button mt={4} colorScheme="purple" variant="outline">
                View Clients
              </Button>
            </CardBody>
          </Card>
        )}
        
        {isStaff && (
          <Card>
            <CardHeader>
              <Heading size="md">System Monitoring</Heading>
            </CardHeader>
            <CardBody>
              <Text>Monitor system usage and generate reports.</Text>
              <Button mt={4} colorScheme="red" variant="outline">
                View Reports
              </Button>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Box>
  );
};
