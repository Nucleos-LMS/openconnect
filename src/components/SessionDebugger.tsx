'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Box, Text, Button } from '@chakra-ui/react';

interface SessionHistoryEntry {
  timestamp: string;
  status: string;
  session: any;
}

export default function SessionDebugger() {
  const { data: session, status } = useSession();
  const [visible, setVisible] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<SessionHistoryEntry[]>([]);
  
  useEffect(() => {
    // Add to history when session changes
    setSessionHistory(prev => [
      ...prev, 
      { 
        timestamp: new Date().toISOString(),
        status,
        session: session ? JSON.parse(JSON.stringify(session)) : null
      }
    ].slice(-5)); // Keep only the last 5 entries
    
    console.log('[SESSION DEBUG] Status:', status);
    console.log('[SESSION DEBUG] Session:', session);
    
    // Check if we're in a browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      try {
        const sessionStorage = localStorage.getItem('next-auth.session-token');
        console.log('[SESSION DEBUG] Session token exists:', !!sessionStorage);
      } catch (e) {
        console.error('[SESSION DEBUG] Error accessing localStorage:', e);
      }
    }
  }, [session, status]);
  
  if (!visible) {
    return (
      <Button 
        position="fixed" 
        bottom="10px" 
        right="10px" 
        size="xs" 
        onClick={() => setVisible(true)}
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
      bg="gray.100"
      p={2}
      borderRadius="md"
      maxW="300px"
      maxH="300px"
      overflow="auto"
      zIndex={9999}
    >
      <Button size="xs" onClick={() => setVisible(false)} mb={2}>
        Hide
      </Button>
      <Text fontSize="xs" fontWeight="bold">Session Status: {status}</Text>
      <Text fontSize="xs" as="pre" overflowX="auto">
        {JSON.stringify(session, null, 2)}
      </Text>
      <Text fontSize="xs" fontWeight="bold" mt={2}>History:</Text>
      {sessionHistory.map((entry, i) => (
        <Box key={i} mt={1} p={1} bg="gray.200" borderRadius="sm">
          <Text fontSize="xs">{entry.timestamp} - {entry.status}</Text>
        </Box>
      ))}
    </Box>
  );
}
