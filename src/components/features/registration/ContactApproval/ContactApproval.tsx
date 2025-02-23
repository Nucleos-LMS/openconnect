import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import type { UserType, ValidationError } from '../types';

interface ContactApprovalProps {
  userType: UserType;
  personalInfo: any;
  onNext: (data: any) => void;
  onError: (error: ValidationError) => void;
}

export const ContactApproval = ({
  userType,
  personalInfo,
  onNext,
  onError
}: ContactApprovalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit for approval
      const res = await fetch('/api/registration/contact-approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userType,
          personalInfo
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      onNext({ status: 'pending_approval' });
    } catch (error: any) {
      onError({
        field: 'approval',
        code: 'submission_error',
        message: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={6} as="form" onSubmit={handleSubmit}>
      <Box textAlign="center">
        <Heading size="lg">Contact Approval</Heading>
        <Text mt={2} color="gray.600">
          Your registration will be reviewed by facility staff
        </Text>
      </Box>

      <Box p={6} borderWidth={1} borderRadius="md">
        <Text>
          Thank you for providing your information. Your registration will be reviewed by facility staff to:
        </Text>
        <Stack mt={4} spacing={2}>
          <Text>• Verify your identity and documentation</Text>
          <Text>• Confirm your relationship with the inmate</Text>
          <Text>• Ensure compliance with facility policies</Text>
        </Stack>
      </Box>

      <Button
        type="submit"
        colorScheme="blue"
        size="lg"
        isLoading={isSubmitting}
      >
        Submit for Approval
      </Button>
    </Stack>
  );
};
