import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import type { UserType, ValidationError, FamilyMemberInfo } from '../types';

type Relationship = FamilyMemberInfo['relationships'][0];

interface RelationshipInfoProps {
  userType: UserType;
  personalInfo: any;
  onNext: (data: { relationships: Relationship[] }) => void;
  onError: (error: ValidationError) => void;
}

interface RelationshipForm {
  inmateId: string;
  facilityId: string;
  relationship: 'parent' | 'spouse' | 'child' | 'sibling' | 'other';
  relationshipDetails?: string;
  isPrimaryContact: boolean;
}

export const RelationshipInfo = ({
  userType,
  personalInfo,
  onNext,
  onError
}: RelationshipInfoProps) => {
  const [relationships, setRelationships] = useState<RelationshipForm[]>([{
    inmateId: '',
    facilityId: '',
    relationship: 'parent',
    relationshipDetails: '',
    isPrimaryContact: true
  }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleAddRelationship = () => {
    if (userType === 'family' && relationships.length >= 10) {
      toast({
        title: 'Maximum relationships reached',
        description: 'Family members can have up to 10 relationships',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setRelationships(prev => [...prev, {
      inmateId: '',
      facilityId: '',
      relationship: 'parent',
      relationshipDetails: '',
      isPrimaryContact: false
    }]);
  };

  const handleRemoveRelationship = (index: number) => {
    setRelationships(prev => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof RelationshipForm, value: string | boolean) => {
    setRelationships(prev => prev.map((rel, i) => {
      if (i === index) {
        return { ...rel, [field]: value };
      }
      return rel;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate relationships
      if (relationships.length === 0) {
        throw new Error('At least one relationship is required');
      }

      // Submit relationships
      const res = await fetch('/api/registration/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          relationships
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      onNext({ relationships });
    } catch (error: any) {
      onError({
        field: 'relationships',
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
        <Heading size="lg">Add Relationships</Heading>
        <Text mt={2} color="gray.600">
          {userType === 'family' 
            ? 'Add your incarcerated loved ones (maximum 10)'
            : 'Add your clients'}
        </Text>
      </Box>

      {relationships.map((relationship, index) => (
        <Box key={index} p={4} borderWidth={1} borderRadius="md">
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <FormControl isRequired>
              <FormLabel>Facility</FormLabel>
              <Input
                value={relationship.facilityId}
                onChange={(e) => handleChange(index, 'facilityId', e.target.value)}
                placeholder="Search facility..."
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Inmate ID</FormLabel>
              <Input
                value={relationship.inmateId}
                onChange={(e) => handleChange(index, 'inmateId', e.target.value)}
                placeholder="Enter inmate ID"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Relationship</FormLabel>
              <Select
                value={relationship.relationship}
                onChange={(e) => handleChange(index, 'relationship', e.target.value as any)}
              >
                <option value="parent">Parent</option>
                <option value="spouse">Spouse</option>
                <option value="child">Child</option>
                <option value="sibling">Sibling</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>

            {relationship.relationship === 'other' && (
              <FormControl>
                <FormLabel>Relationship Details</FormLabel>
                <Input
                  value={relationship.relationshipDetails}
                  onChange={(e) => handleChange(index, 'relationshipDetails', e.target.value)}
                  placeholder="Specify relationship"
                />
              </FormControl>
            )}

            <FormControl>
              <FormLabel>&nbsp;</FormLabel>
              <Button
                colorScheme="red"
                variant="outline"
                onClick={() => handleRemoveRelationship(index)}
                isDisabled={relationships.length === 1}
                width="full"
              >
                Remove
              </Button>
            </FormControl>
          </Grid>
        </Box>
      ))}

      <Button
        onClick={handleAddRelationship}
        variant="outline"
        isDisabled={userType === 'family' && relationships.length >= 10}
      >
        Add Another Relationship
      </Button>

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
