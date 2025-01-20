import React from 'react'
import { FormControl, FormLabel, FormErrorMessage, Input, InputProps } from '@chakra-ui/react'

export interface FormFieldProps extends InputProps {
  label: string;
  error?: string;
  isRequired?: boolean;
  helperText?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, isRequired, helperText, ...props }, ref) => {
    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        <FormLabel>{label}</FormLabel>
        <Input ref={ref} {...props} />
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
        {helperText && !error && (
          <FormErrorMessage color="gray.600">{helperText}</FormErrorMessage>
        )}
      </FormControl>
    )
  }
) 