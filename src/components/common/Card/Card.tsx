import React from 'react'
import { Box, BoxProps } from '@chakra-ui/react'

export interface CardProps extends BoxProps {
  variant?: 'elevated' | 'outline';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ variant = 'elevated', ...props }, ref) => {
  return (
    <Box
      ref={ref}
      p={6}
      borderRadius="lg"
      bg="white"
      boxShadow={variant === 'elevated' ? 'md' : undefined}
      borderWidth={variant === 'outline' ? '1px' : undefined}
      borderColor={variant === 'outline' ? 'gray.200' : undefined}
      transition="all 0.2s"
      _hover={{
        boxShadow: variant === 'elevated' ? 'lg' : undefined,
      }}
      {...props}
    />
  )
}) 