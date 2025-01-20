import React from 'react'
import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react'

export interface OpenConnectButtonProps extends ButtonProps {
  // Add any custom props here
}

export const Button = React.forwardRef<HTMLButtonElement, OpenConnectButtonProps>((props, ref) => {
  return <ChakraButton ref={ref} {...props} />
}) 