import { defineStyleConfig } from '@chakra-ui/react'

export const Button = defineStyleConfig({
  baseStyle: {
    fontWeight: 'semibold',
    borderRadius: 'lg',
  },
  sizes: {
    lg: {
      fontSize: 'md',
      px: 6,
      py: 3,
    },
    md: {
      fontSize: 'sm',
      px: 4,
      py: 2,
    },
    sm: {
      fontSize: 'sm',
      px: 3,
      py: 1,
    },
  },
  defaultProps: {
    size: 'md',
    variant: 'solid',
  },
})

export const Card = defineStyleConfig({
  baseStyle: {
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    alignItems: 'start',
    gap: 2,
  },
  variants: {
    elevated: {
      padding: 6,
      borderRadius: 'xl',
      boxShadow: 'base',
      _hover: {
        boxShadow: 'md',
      },
    },
    outline: {
      padding: 6,
      borderRadius: 'xl',
      borderWidth: '1px',
      borderColor: 'gray.200',
    },
  },
  defaultProps: {
    variant: 'elevated',
  },
})

export const Form = {
  parts: ['container', 'requiredIndicator', 'helperText'],
  baseStyle: {
    container: {
      width: '100%',
    },
    requiredIndicator: {
      color: 'red.500',
    },
    helperText: {
      color: 'gray.600',
      fontSize: 'sm',
      mt: 1,
    },
  },
} 