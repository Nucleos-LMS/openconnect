import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
} from '@chakra-ui/react';
import type { UserType, GovernmentId } from '../types';

interface IdentityVerificationProps {
  userType: UserType;
  personalInfo: any;
  onNext: (data: any) => void;
  onError: (error: any) => void;
}

interface IdentityForm {
  type: 'drivers_license' | 'state_id' | 'passport';
  number: string;
  expirationDate: string;
  issuingState?: string;
  issuingCountry: string;
  documentFile?: File;
}

export const IdentityVerification = ({
  userType,
  personalInfo,
  onNext,
  onError
}: IdentityVerificationProps) => {
  const [form, setForm] = useState<IdentityForm>({
    type: 'drivers_license',
    number: '',
    expirationDate: '',
    issuingState: '',
    issuingCountry: 'US',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({ ...prev, documentFile: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate expiration date
      const expirationDate = new Date(form.expirationDate);
      if (expirationDate < new Date()) {
        throw new Error('ID has expired');
      }

      // Create form data for file upload
      const formData = new FormData();
      formData.append('type', form.type);
      formData.append('number', form.number);
      formData.append('expirationDate', form.expirationDate);
      if (form.issuingState) {
        formData.append('issuingState', form.issuingState);
      }
      formData.append('issuingCountry', form.issuingCountry);
      if (form.documentFile) {
        formData.append('document', form.documentFile);
      }

      // Submit identity verification
      const res = await fetch('/api/registration/verify-identity', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      onNext(form);
    } catch (error: any) {
      onError({
        field: error.path?.[0] || 'form',
        code: 'validation_error',
        message: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={6} as="form" onSubmit={handleSubmit}>
      <Box textAlign="center">
        <Heading size="lg">Identity Verification</Heading>
        <Text mt={2} color="gray.600">
          Please provide your identification details
        </Text>
      </Box>

      <FormControl isRequired>
        <FormLabel>ID Type</FormLabel>
        <Select
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option value="drivers_license">Driver's License</option>
          <option value="state_id">State ID</option>
          <option value="passport">Passport</option>
        </Select>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>ID Number</FormLabel>
        <Input
          name="number"
          value={form.number}
          onChange={handleChange}
          placeholder="Enter ID number"
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Expiration Date</FormLabel>
        <Input
          name="expirationDate"
          type="date"
          value={form.expirationDate}
          onChange={handleChange}
        />
      </FormControl>

      {form.type !== 'passport' && (
        <FormControl isRequired>
          <FormLabel>Issuing State</FormLabel>
          <Select
            name="issuingState"
            value={form.issuingState}
            onChange={handleChange}
          >
            <option value="">Select State</option>
            <option value="CA">California</option>
            <option value="NY">New York</option>
            {/* Add more states */}
          </Select>
        </FormControl>
      )}

      <FormControl isRequired>
        <FormLabel>Issuing Country</FormLabel>
        <Select
          name="issuingCountry"
          value={form.issuingCountry}
          onChange={handleChange}
        >
          <option value="US">United States</option>
          {/* Add more countries */}
        </Select>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Upload ID Document</FormLabel>
        <Input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
        />
        <Text mt={1} fontSize="sm" color="gray.500">
          Accepted formats: JPG, PNG, PDF
        </Text>
      </FormControl>

      <Button
        type="submit"
        colorScheme="blue"
        size="lg"
        isLoading={isSubmitting}
      >
        Continue
      </Button>
    </Stack>
  );
};
