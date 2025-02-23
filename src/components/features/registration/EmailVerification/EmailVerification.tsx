import React, { useState } from 'react'
import { VStack, Button, Text, useToast } from '@chakra-ui/react'
import { Card } from '@/components/common/Card'
import { FormField } from '@/components/common/Form'

import type { UserType, ValidationError } from '../types';

export interface EmailVerificationProps {
  userType: UserType;
  onNext: (data: { email: string }) => void;
  onError: (error: ValidationError) => void;
}

export const EmailVerification = ({ userType, onNext, onError }: EmailVerificationProps) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email || !emailRegex.test(email)) {
        throw new Error('Please enter a valid email address')
      }

      // Additional validation for legal/educator
      if (userType === 'legal' && !email.includes('.gov') && !email.includes('.edu') && !email.includes('.org')) {
        throw new Error('Legal representatives must use a .gov, .edu, or .org email')
      }
      if (userType === 'educator' && !email.includes('.edu')) {
        throw new Error('Educators must use a .edu email address')
      }

      // Submit email for verification
      const res = await fetch('/api/registration/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userType })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message)
      }

      onNext({ email })
      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox for the verification link',
        status: 'success',
      })
    } catch (err: any) {
      const error = {
        field: 'email',
        code: 'validation_error',
        message: err.message || 'Failed to verify email. Please try again.'
      }
      onError(error)
      setError(error.message)
    }
  }

  return (
    <Card as="form" onSubmit={handleSubmit} maxW="md" width="100%">
      <VStack spacing={6}>
        <Text fontSize="xl" fontWeight="bold">
          Get Started
        </Text>
        <Text color="gray.600" textAlign="center">
          Enter your email address to begin registration. We'll send you a verification link.
        </Text>
        
        <FormField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          isRequired
          placeholder="you@example.com"
        />

        <Button
          type="submit"
          colorScheme="primary"
          width="100%"
          isLoading={false}
        >
          Continue
        </Button>
      </VStack>
    </Card>
  )
}  