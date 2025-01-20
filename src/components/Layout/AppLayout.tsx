import React from 'react';
import {
  Box,
  Flex,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  HStack,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import { FaBars, FaCog, FaQuestion, FaSignOutAlt } from 'react-icons/fa';

interface AppLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userRole?: string;
  facilityName?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  userName = 'John Doe',
  userRole = 'Resident',
  facilityName = 'Central Facility',
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box h="100vh" overflow="hidden">
      {/* Header */}
      <Flex
        px={4}
        h="16"
        alignItems="center"
        bg={bgColor}
        borderBottomWidth="1px"
        borderColor={borderColor}
        justifyContent="space-between"
      >
        <HStack spacing={4}>
          <IconButton
            display={{ base: 'flex', lg: 'none' }}
            onClick={onOpen}
            variant="ghost"
            aria-label="open menu"
            icon={<FaBars />}
          />
          <Text
            fontSize="xl"
            fontWeight="bold"
            display={{ base: 'none', md: 'flex' }}
          >
            OpenConnect
          </Text>
        </HStack>

        <HStack spacing={4}>
          <Text fontSize="sm" display={{ base: 'none', md: 'flex' }}>
            {facilityName}
          </Text>
          <Menu>
            <MenuButton>
              <HStack>
                <Avatar size="sm" name={userName} />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{userName}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {userRole}
                  </Text>
                </VStack>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FaCog />}>Settings</MenuItem>
              <MenuItem icon={<FaQuestion />}>Help</MenuItem>
              <MenuItem icon={<FaSignOutAlt />}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Sidebar / Drawer */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing={4}>
              <Text>Upcoming Calls</Text>
              <Text>Call History</Text>
              <Text>Contacts</Text>
              <Text>Settings</Text>
              <Text>Help</Text>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main content */}
      <Box
        h="calc(100vh - 4rem)"
        overflow="auto"
        position="relative"
      >
        {children}
      </Box>
    </Box>
  );
}; 