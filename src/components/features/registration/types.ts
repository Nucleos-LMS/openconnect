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

export type FamilyMemberInfo = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
  phone: string;
  address: Address;
  governmentId: GovernmentId;
  relationships: Array<{
    inmateId: string;
    facilityId: string;
    relationship: 'parent' | 'spouse' | 'child' | 'sibling' | 'other';
    relationshipDetails?: string;
    isPrimaryContact: boolean;
  }>;
};

export type LegalRepresentativeInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  barNumber: string;
  barState: string;
  firmName?: string;
  firmAddress: Address;
  credentials: {
    barCardImage: File;
    professionalEmail: string;
    practiceAreas: string[];
  };
  clients: Array<{
    inmateId: string;
    facilityId: string;
    caseNumber?: string;
    representationType: 'criminal' | 'civil' | 'appeal' | 'other';
  }>;
};

export type EducatorInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  institution: string;
  department?: string;
  position: string;
  employeeId?: string;
  credentials: {
    institutionEmail: string;
    employmentVerification: File;
    teachingCertification?: File;
  };
  programs: Array<{
    facilityId: string;
    programName: string;
    programType: 'academic' | 'vocational' | 'rehabilitation';
    expectedStudentCount: number;
  }>;
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
  personalInfo?: FamilyMemberInfo | LegalRepresentativeInfo | EducatorInfo;
  identityInfo?: {
    governmentId?: GovernmentId;
    barCard?: File;
    employmentVerification?: File;
  };
  relationships?: Array<{
    inmateId: string;
    facilityId: string;
    relationship: string;
    relationshipDetails?: string;
    isPrimaryContact?: boolean;
    caseNumber?: string;
    representationType?: 'criminal' | 'civil' | 'appeal' | 'other';
    programName?: string;
    programType?: 'academic' | 'vocational' | 'rehabilitation';
    expectedStudentCount?: number;
  }>;
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

// Legal representative validation
export const barNumberSchema = z
  .string()
  .min(4, 'Bar number must be at least 4 characters')
  .max(20, 'Bar number cannot exceed 20 characters');

export const practiceAreasSchema = z
  .array(z.string())
  .min(1, 'At least one practice area is required')
  .max(10, 'Maximum 10 practice areas allowed');

export const clientsSchema = z
  .array(z.object({
    inmateId: z.string(),
    facilityId: z.string(),
    caseNumber: z.string().optional(),
    representationType: z.enum(['criminal', 'civil', 'appeal', 'other'])
  }))
  .max(50, 'Maximum 50 clients allowed');

// Educator validation
export const institutionSchema = z
  .string()
  .min(2, 'Institution name must be at least 2 characters')
  .max(100, 'Institution name cannot exceed 100 characters');

export const programsSchema = z
  .array(z.object({
    facilityId: z.string(),
    programName: z.string().min(2).max(100),
    programType: z.enum(['academic', 'vocational', 'rehabilitation']),
    expectedStudentCount: z.number().min(1).max(100)
  }))
  .max(5, 'Maximum 5 programs allowed');
