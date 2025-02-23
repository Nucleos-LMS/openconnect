import { useState } from 'react';
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
} from '@chakra-ui/react';
import { 
  nameSchema, 
  phoneSchema, 
  dateOfBirthSchema, 
  barNumberSchema,
  institutionSchema,
  UserType, 
  ValidationError, 
  Address 
} from '../types';

interface PersonalInfoProps {
  userType: UserType;
  email: string;
  onNext: (data: PersonalInfoForm) => void;
  onError: (error: ValidationError) => void;
}

interface PersonalInfoForm {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phone: string;
  address: Address;
  // Legal representative fields
  barNumber?: string;
  barState?: string;
  firmName?: string;
  practiceAreas?: string[];
  // Educator fields
  institution?: string;
  department?: string;
  position?: string;
  employeeId?: string;
}

export const PersonalInfo = ({
  userType,
  email,
  onNext,
  onError
}: PersonalInfoProps) => {
  const [form, setForm] = useState<PersonalInfoForm>({
    firstName: '',
    lastName: '',
    ...(userType === 'family' && { dateOfBirth: '' }),
    phone: '',
    address: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    },
    ...(userType === 'legal' && {
      barNumber: '',
      barState: '',
      firmName: '',
      practiceAreas: []
    }),
    ...(userType === 'educator' && {
      institution: '',
      department: '',
      position: '',
      employeeId: ''
    })
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate fields
      nameSchema.parse(form.firstName);
      nameSchema.parse(form.lastName);
      phoneSchema.parse(form.phone);
      
      if (userType === 'family') {
        dateOfBirthSchema.parse(new Date(form.dateOfBirth!));
      } else if (userType === 'legal') {
        barNumberSchema.parse(form.barNumber!);
      } else if (userType === 'educator') {
        institutionSchema.parse(form.institution!);
      }

      // Submit personal info
      const res = await fetch('/api/registration/personal-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userType,
          personalInfo: {
            ...form,
            email
          }
        })
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
        <Heading size="lg">Personal Information</Heading>
        <Text mt={2} color="gray.600">
          Please provide your personal details
        </Text>
      </Box>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <FormControl isRequired>
          <FormLabel>First Name</FormLabel>
          <Input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Last Name</FormLabel>
          <Input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
          />
        </FormControl>
      </Grid>

      <FormControl isRequired>
        <FormLabel>Phone Number</FormLabel>
        <Input
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="+1 (555) 555-5555"
        />
      </FormControl>

      {userType === 'family' && (
        <FormControl isRequired>
          <FormLabel>Date of Birth</FormLabel>
          <Input
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
          />
        </FormControl>
      )}

      {userType === 'legal' && (
        <Box mb={6}>
          <Text fontWeight="medium" mb={4}>Legal Information</Text>
          <Stack spacing={4}>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <FormControl isRequired>
                <FormLabel>Bar Number</FormLabel>
                <Input
                  name="barNumber"
                  value={form.barNumber}
                  onChange={handleChange}
                  placeholder="Enter bar number"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Bar State</FormLabel>
                <Select
                  name="barState"
                  value={form.barState}
                  onChange={handleChange}
                >
                  <option value="">Select State</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  {/* Add more states */}
                </Select>
              </FormControl>
            </Grid>

            <FormControl>
              <FormLabel>Firm Name</FormLabel>
              <Input
                name="firmName"
                value={form.firmName}
                onChange={handleChange}
                placeholder="Enter firm name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Practice Areas</FormLabel>
              <Select
                name="practiceAreas"
                value={form.practiceAreas?.[0] || ''}
                onChange={(e) => setForm(prev => ({ ...prev, practiceAreas: [e.target.value] }))}
              >
                <option value="">Select Practice Area</option>
                <option value="criminal">Criminal Law</option>
                <option value="civil">Civil Law</option>
                <option value="appeal">Appeals</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>
          </Stack>
        </Box>
      )}

      {userType === 'educator' && (
        <Box mb={6}>
          <Text fontWeight="medium" mb={4}>Professional Information</Text>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Institution</FormLabel>
              <Input
                name="institution"
                value={form.institution}
                onChange={handleChange}
                placeholder="Enter institution name"
              />
            </FormControl>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <FormControl>
                <FormLabel>Department</FormLabel>
                <Input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Enter department"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Position</FormLabel>
                <Input
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  placeholder="Enter position"
                />
              </FormControl>
            </Grid>

            <FormControl>
              <FormLabel>Employee ID</FormLabel>
              <Input
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                placeholder="Enter employee ID"
              />
            </FormControl>
          </Stack>
        </Box>
      )}

      <Box>
        <Text fontWeight="medium" mb={4}>Address</Text>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Street Address</FormLabel>
            <Input
              name="address.street1"
              value={form.address.street1}
              onChange={handleChange}
              placeholder="123 Main St"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Apartment, suite, etc.</FormLabel>
            <Input
              name="address.street2"
              value={form.address.street2}
              onChange={handleChange}
              placeholder="Apt 4B"
            />
          </FormControl>

          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <FormControl isRequired>
              <FormLabel>City</FormLabel>
              <Input
                name="address.city"
                value={form.address.city}
                onChange={handleChange}
                placeholder="City"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>State</FormLabel>
              <Select
                name="address.state"
                value={form.address.state}
                onChange={handleChange}
              >
                <option value="">Select State</option>
                <option value="CA">California</option>
                <option value="NY">New York</option>
                {/* Add more states */}
              </Select>
            </FormControl>
          </Grid>

          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <FormControl isRequired>
              <FormLabel>ZIP Code</FormLabel>
              <Input
                name="address.zipCode"
                value={form.address.zipCode}
                onChange={handleChange}
                placeholder="12345"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Country</FormLabel>
              <Select
                name="address.country"
                value={form.address.country}
                onChange={handleChange}
              >
                <option value="US">United States</option>
                {/* Add more countries */}
              </Select>
            </FormControl>
          </Grid>
        </Stack>
      </Box>

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
