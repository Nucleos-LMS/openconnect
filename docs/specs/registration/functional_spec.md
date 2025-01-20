# Registration System Specification

## Overview
The registration system handles user onboarding for family members, legal representatives, and educators who need to connect with incarcerated individuals.

## User Types & Fields

### 1. Family Member Registration
```typescript
interface FamilyMemberRegistration {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
  phone: string;
  address: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  // Identity Verification
  governmentId: {
    type: 'drivers_license' | 'state_id' | 'passport';
    number: string;
    expirationDate: Date;
    issuingState?: string;
    issuingCountry: string;
  };
  
  // Relationship Information
  relationships: Array<{
    inmateId: string;
    facilityId: string;
    relationship: 'parent' | 'spouse' | 'child' | 'sibling' | 'other';
    relationshipDetails?: string;
    isPrimaryContact: boolean;
  }>;
}
```

### 2. Legal Representative Registration
```typescript
interface LegalRepresentativeRegistration {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Professional Information
  barNumber: string;
  barState: string;
  firmName?: string;
  firmAddress: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Credentials
  credentials: {
    barCardImage: File;
    professionalEmail: string;
    practiceAreas: string[];
  };
  
  // Client Information
  clients: Array<{
    inmateId: string;
    facilityId: string;
    caseNumber?: string;
    representationType: 'criminal' | 'civil' | 'appeal' | 'other';
  }>;
}
```

### 3. Educator Registration
```typescript
interface EducatorRegistration {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Professional Information
  institution: string;
  department?: string;
  position: string;
  employeeId?: string;
  
  // Verification
  credentials: {
    institutionEmail: string;
    employmentVerification: File;
    teachingCertification?: File;
  };
  
  // Program Information
  programs: Array<{
    facilityId: string;
    programName: string;
    programType: 'academic' | 'vocational' | 'rehabilitation';
    expectedStudentCount: number;
  }>;
}
```

## API Endpoints

### 1. Registration Flow

#### Start Registration
```typescript
POST /api/registration/start
Request {
  userType: 'family' | 'legal' | 'educator';
  email: string;
}
Response {
  registrationId: string;
  verificationToken: string;
  expiresAt: Date;
}
```

#### Verify Email
```typescript
POST /api/registration/verify-email
Request {
  registrationId: string;
  verificationToken: string;
}
Response {
  verified: boolean;
  nextStep: 'personal_info' | 'identity_verification' | 'relationship_info';
}
```

#### Submit Personal Information
```typescript
POST /api/registration/personal-info
Request {
  registrationId: string;
  userType: 'family' | 'legal' | 'educator';
  personalInfo: {
    firstName: string;
    lastName: string;
    // ... other fields based on user type
  };
}
Response {
  success: boolean;
  nextStep: 'identity_verification' | 'relationship_info';
  errors?: ValidationError[];
}
```

#### Submit Identity Verification
```typescript
POST /api/registration/verify-identity
Request {
  registrationId: string;
  verificationType: 'government_id' | 'bar_card' | 'employment';
  documents: File[];
  metadata: {
    documentType: string;
    documentNumber: string;
    expirationDate?: Date;
  };
}
Response {
  verificationId: string;
  status: 'pending' | 'approved' | 'rejected';
  estimatedWaitTime?: number;
}
```

#### Add Relationships/Clients
```typescript
POST /api/registration/relationships
Request {
  registrationId: string;
  relationships: Array<{
    inmateId: string;
    facilityId: string;
    relationship: string;
    // ... other fields based on user type
  }>;
}
Response {
  success: boolean;
  pendingApprovals: Array<{
    relationshipId: string;
    status: 'pending' | 'approved' | 'rejected';
    estimatedWaitTime?: number;
  }>;
}
```

### 2. Facility Integration

#### Facility Lookup
```typescript
GET /api/facilities/search
Query {
  query: string;
  state?: string;
  type?: 'state' | 'federal' | 'county';
}
Response {
  facilities: Array<{
    id: string;
    name: string;
    type: string;
    address: Address;
    requirements: {
      idRequired: boolean;
      additionalDocuments: string[];
      visitationHours: string;
    };
  }>;
}
```

#### Inmate Lookup
```typescript
GET /api/inmates/search
Query {
  facilityId: string;
  query: string;
  number?: string;
}
Response {
  inmates: Array<{
    id: string;
    inmateNumber: string;
    firstName: string;
    lastName: string;
    facility: {
      id: string;
      name: string;
    };
    status: 'active' | 'transferred' | 'released';
  }>;
}
```

## Validation Rules

### Personal Information
- Names: 2-50 characters, letters and hyphens only
- Email: Valid email format, institutional email required for legal/educator
- Phone: Valid format with country code
- Address: Required for family members and legal representatives
- Date of Birth: Must be 18+ years old for family members

### Identity Verification
- Government ID: Must not be expired
- Bar Card: Must be active and verifiable
- Employment Verification: Must be dated within last 30 days

### Relationships
- Maximum 10 relationships per family member
- Maximum 50 clients per legal representative
- Maximum 5 programs per educator

## Security Requirements

1. Data Encryption
- All personal information encrypted at rest
- Document storage with encryption at rest
- Secure transmission (TLS 1.3+)

2. Access Control
- Rate limiting on all endpoints
- IP-based blocking after failed attempts
- Session management with secure tokens

3. Document Handling
- Virus scanning for all uploads
- File type restrictions
- Maximum file size limits
- Secure document storage

## Error Handling

```typescript
interface ValidationError {
  field: string;
  code: string;
  message: string;
  details?: any;
}

interface ApiError {
  code: string;
  message: string;
  status: number;
  timestamp: Date;
  requestId: string;
  details?: any;
}
```

## Next Steps
1. Create database schema
2. Implement API endpoints
3. Build registration UI components
4. Set up document storage
5. Implement verification workflows 