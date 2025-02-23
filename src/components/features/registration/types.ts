import { z } from 'zod';

// Common types
export type UserType = 'family' | 'legal' | 'educator';

export type ValidationError = {
  field: string;
  code: string;
  message: string;
  details?: any;
};

export type Address = {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type GovernmentId = {
  type: 'drivers_license' | 'state_id' | 'passport';
  number: string;
  expirationDate: Date;
  issuingState?: string;
  issuingCountry: string;
};

export type Relationship = {
  inmateId: string;
  facilityId: string;
  relationship: 'parent' | 'spouse' | 'child' | 'sibling' | 'other';
  relationshipDetails?: string;
  isPrimaryContact: boolean;
};

// Registration step types
export type RegistrationStep = 
  | 'user_type'
  | 'email_verification'
  | 'personal_info'
  | 'identity_verification'
  | 'relationship_info'
  | 'contact_approval'
  | 'complete';

export type RegistrationState = {
  step: RegistrationStep;
  userType?: UserType;
  email?: string;
  personalInfo?: any;
  identityInfo?: any;
  relationships?: Relationship[];
  errors?: ValidationError[];
};

// Validation schemas
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name cannot exceed 50 characters')
  .regex(/^[a-zA-Z\-\s]+$/, 'Name can only contain letters and hyphens');

export const emailSchema = z
  .string()
  .email('Invalid email format');

export const phoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{1,14}$/, 'Phone number must be in E.164 format');

export const dateOfBirthSchema = z
  .date()
  .refine((date: Date) => {
    const age = new Date().getFullYear() - date.getFullYear();
    return age >= 18;
  }, 'Must be at least 18 years old');
