import React, { useState } from 'react'
import { VStack, Button, Text, useToast } from '@chakra-ui/react'
import { Card } from '@/components/common/Card'
import { FormField } from '@/components/common/Form'

export interface EmailVerificationProps {
  onSubmit: (email: string) => Promise<void>;
  isLoading?: boolean;
}

export const EmailVerification = ({ onSubmit, isLoading }: EmailVerificationProps) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Email is required')
      return
    }

    try {
      await onSubmit(email)
      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox for the verification link',
        status: 'success',
      })
    } catch (err) {
      setError('Failed to send verification email. Please try again.')
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
          isLoading={isLoading}
        >
          Continue
        </Button>
      </VStack>
    </Card>
  )
} 