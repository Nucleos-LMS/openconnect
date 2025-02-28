'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { Box, Text, Button, VStack, HStack, Divider, Badge, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';

interface SessionHistoryEntry {
  timestamp: string;
  status: string;
  session: any;
  cookies?: Record<string, string>;
  localStorage?: Record<string, string>;
  sessionStorage?: Record<string, string>;
}

interface StorageInfo {
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
  cookies: string[];
}

export default function SessionDebugger() {
  const { data: session, status, update } = useSession();
  const [visible, setVisible] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<SessionHistoryEntry[]>([]);
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    localStorage: {},
    sessionStorage: {},
    cookies: []
  });
  
  // Function to get all storage information
  const getStorageInfo = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    try {
      // Get localStorage items related to auth
      const localStorageItems: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('next-auth') || key.includes('csrf'))) {
          localStorageItems[key] = localStorage.getItem(key) || '';
        }
      }
      
      // Get sessionStorage items related to auth
      const sessionStorageItems: Record<string, string> = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.includes('next-auth') || key.includes('csrf'))) {
          sessionStorageItems[key] = sessionStorage.getItem(key) || '';
        }
      }
      
      // Get cookies
      const cookies = document.cookie.split(';').map(c => c.trim());
      
      return {
        localStorage: localStorageItems,
        sessionStorage: sessionStorageItems,
        cookies
      };
    } catch (e) {
      console.error('[SESSION DEBUG] Error accessing storage:', e);
      return null;
    }
  }, []);
  
  // Update storage info periodically
  useEffect(() => {
    const updateStorageInfo = () => {
      const info = getStorageInfo();
      if (info) {
        setStorageInfo(info);
        
        // Log detailed storage information
        console.log('[SESSION DEBUG] localStorage items:', info.localStorage);
        console.log('[SESSION DEBUG] sessionStorage items:', info.sessionStorage);
        console.log('[SESSION DEBUG] cookies:', info.cookies);
      }
    };
    
    // Update immediately
    updateStorageInfo();
    
    // Then update every 2 seconds
    const intervalId = setInterval(updateStorageInfo, 2000);
    
    return () => clearInterval(intervalId);
  }, [getStorageInfo]);
  
  useEffect(() => {
    // Add to history when session changes
    const info = getStorageInfo();
    
    setSessionHistory(prev => [
      ...prev, 
      { 
        timestamp: new Date().toISOString(),
        status,
        session: session ? JSON.parse(JSON.stringify(session)) : null,
        cookies: info?.cookies.reduce<Record<string, string>>((acc, cookie) => {
          const [key, value] = cookie.split('=');
          if (key) acc[key] = value || '';
          return acc;
        }, {}),
        localStorage: info?.localStorage,
        sessionStorage: info?.sessionStorage
      }
    ].slice(-10)); // Keep only the last 10 entries
    
    console.log('[SESSION DEBUG] Status changed to:', status);
    console.log('[SESSION DEBUG] Session data:', session);
    
    // Check for CSRF token
    const csrfToken = info?.localStorage['next-auth.csrf-token'] || 
                      info?.sessionStorage['next-auth.csrf-token'] || 
                      info?.cookies.find(c => c.startsWith('next-auth.csrf-token='));
    
    console.log('[SESSION DEBUG] CSRF token exists:', !!csrfToken);
    
    // Check for session token
    const sessionToken = info?.localStorage['next-auth.session-token'] || 
                         info?.sessionStorage['next-auth.session-token'] || 
                         info?.cookies.find(c => c.startsWith('next-auth.session-token='));
    
    console.log('[SESSION DEBUG] Session token exists:', !!sessionToken);
    
    // Log URL and pathname
    console.log('[SESSION DEBUG] Current URL:', window.location.href);
    console.log('[SESSION DEBUG] Current pathname:', window.location.pathname);
    
  }, [session, status, getStorageInfo]);
  
  // Force session refresh
  const handleRefreshSession = async () => {
    console.log('[SESSION DEBUG] Manually refreshing session...');
    await update();
    console.log('[SESSION DEBUG] Session refresh completed');
  };
  
  // Test sign out
  const handleTestSignOut = async () => {
    console.log('[SESSION DEBUG] Testing sign out...');
    await signOut({ redirect: false });
  };
  
  // Test sign in
  const handleTestSignIn = async () => {
    console.log('[SESSION DEBUG] Testing sign in with test account...');
    await signIn('credentials', { 
      redirect: false,
      email: 'inmate@test.facility.com',
      password: 'password123'
    });
  };
  
  if (!visible) {
    return (
      <Button 
        position="fixed" 
        bottom="10px" 
        right="10px" 
        size="xs" 
        onClick={() => setVisible(true)}
        colorScheme="blue"
      >
        Debug
      </Button>
    );
  }
  
  return (
    <Box
      position="fixed"
      bottom="10px"
      right="10px"
      bg="white"
      p={3}
      borderRadius="md"
      maxW="400px"
      maxH="80vh"
      overflow="auto"
      zIndex={9999}
      boxShadow="xl"
    >
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between">
          <Text fontSize="sm" fontWeight="bold">Session Debugger</Text>
          <Button size="xs" onClick={() => setVisible(false)}>
            Hide
          </Button>
        </HStack>
        
        <Box>
          <HStack>
            <Text fontSize="xs" fontWeight="bold">Status:</Text>
            <Badge colorScheme={status === 'authenticated' ? 'green' : status === 'loading' ? 'yellow' : 'red'}>
              {status}
            </Badge>
          </HStack>
          
          <HStack mt={2} spacing={2}>
            <Button size="xs" onClick={handleRefreshSession} colorScheme="blue">
              Refresh Session
            </Button>
            <Button size="xs" onClick={handleTestSignIn} colorScheme="green">
              Test Sign In
            </Button>
            <Button size="xs" onClick={handleTestSignOut} colorScheme="red">
              Test Sign Out
            </Button>
          </HStack>
        </Box>
        
        <Divider />
        
        <Accordion allowToggle defaultIndex={[0]}>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontSize="xs" fontWeight="bold">Session Data</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text fontSize="xs" as="pre" overflowX="auto" whiteSpace="pre-wrap">
                {JSON.stringify(session, null, 2)}
              </Text>
            </AccordionPanel>
          </AccordionItem>
          
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontSize="xs" fontWeight="bold">Storage</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text fontSize="xs" fontWeight="bold">Cookies:</Text>
              <Text fontSize="xs" as="pre" overflowX="auto" whiteSpace="pre-wrap">
                {storageInfo.cookies.join('\n')}
              </Text>
              
              <Text fontSize="xs" fontWeight="bold" mt={2}>LocalStorage:</Text>
              <Text fontSize="xs" as="pre" overflowX="auto" whiteSpace="pre-wrap">
                {JSON.stringify(storageInfo.localStorage, null, 2)}
              </Text>
              
              <Text fontSize="xs" fontWeight="bold" mt={2}>SessionStorage:</Text>
              <Text fontSize="xs" as="pre" overflowX="auto" whiteSpace="pre-wrap">
                {JSON.stringify(storageInfo.sessionStorage, null, 2)}
              </Text>
            </AccordionPanel>
          </AccordionItem>
          
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontSize="xs" fontWeight="bold">History ({sessionHistory.length})</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              {sessionHistory.map((entry, i) => (
                <Box key={i} mt={1} p={1} bg="gray.50" borderRadius="sm" borderWidth="1px">
                  <Text fontSize="xs" fontWeight="bold">
                    {new Date(entry.timestamp).toLocaleTimeString()} - {entry.status}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Session: {entry.session ? 'Yes' : 'No'}
                  </Text>
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Box>
  );
}
