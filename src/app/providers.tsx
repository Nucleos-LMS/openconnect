'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import { theme } from '../styles/theme'
import SessionDebugger from '../components/SessionDebugger'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ChakraProvider theme={theme}>
        {children}
        <SessionDebugger />
      </ChakraProvider>
    </SessionProvider>
  )
}  
