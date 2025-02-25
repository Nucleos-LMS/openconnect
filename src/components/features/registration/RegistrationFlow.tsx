import React, { useState } from 'react';
import { Box, Container, Heading, Stack, Text } from '@chakra-ui/react';
import { UserTypeSelection } from './UserTypeSelection/UserTypeSelection';
import { EmailVerification } from './EmailVerification/EmailVerification';
import { PersonalInfo } from './PersonalInfo/PersonalInfo';
import { IdentityVerification } from './IdentityVerification/IdentityVerification';
import { RelationshipInfo } from './RelationshipInfo/RelationshipInfo';
import { ContactApproval } from './ContactApproval/ContactApproval';
import type { 
  RegistrationState, 
  ValidationError, 
  UserType, 
  FamilyMemberInfo,
  LegalRepresentativeInfo,
  EducatorInfo,
  GovernmentId
} from './types';

export const RegistrationFlow = () => {
  const [state, setState] = useState<RegistrationState>({
    step: 'user_type'
  });

  const handleError = (error: ValidationError) => {
    setState(prev => ({
      ...prev,
      errors: [...(prev.errors || []), error]
    }));
  };

  const handleUserTypeNext = (data: { userType: UserType }) => {
    handleNext({ userType: data.userType });
  };

  const handleEmailNext = (data: { email: string }) => {
    handleNext({ email: data.email });
  };

  const clearErrors = () => {
    setState(prev => ({ ...prev, errors: undefined }));
  };

  const handleNext = (data: { 
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
  }) => {
    clearErrors();
    switch (state.step) {
      case 'user_type':
        setState(prev => ({
          ...prev,
          step: 'email_verification',
          userType: data.userType
        }));
        break;
      
      case 'email_verification':
        setState(prev => ({
          ...prev,
          step: 'personal_info',
          email: data.email
        }));
        break;
      
      case 'personal_info':
        setState(prev => ({
          ...prev,
          step: 'identity_verification',
          personalInfo: data.personalInfo as FamilyMemberInfo | LegalRepresentativeInfo | EducatorInfo
        }));
        break;
      
      case 'identity_verification':
        setState(prev => ({
          ...prev,
          step: 'relationship_info',
          identityInfo: data.identityInfo
        }));
        break;
      
      case 'relationship_info':
        setState(prev => ({
          ...prev,
          step: 'contact_approval',
          relationships: data.relationships
        }));
        break;
      
      case 'contact_approval':
        setState(prev => ({
          ...prev,
          step: 'complete'
        }));
        break;
    }
  };

  const renderStep = () => {
    switch (state.step) {
      case 'user_type':
        return <UserTypeSelection onNext={handleUserTypeNext} onError={handleError} />;
      
      case 'email_verification':
        return (
          <EmailVerification
            userType={state.userType!}
            onNext={handleEmailNext}
            onError={handleError}
          />
        );
      
      case 'personal_info':
        return (
          <PersonalInfo
            userType={state.userType!}
            email={state.email!}
            onNext={(data) => {
              let typedData;
              const baseData = {
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: state.email!,
                phone: data.phone || '',
                dateOfBirth: new Date(),
                address: {
                  street1: data.street1 || '',
                  street2: data.street2,
                  city: data.city || '',
                  state: data.state || '',
                  zipCode: data.zipCode || '',
                  country: data.country || 'US'
                }
              };

              switch (state.userType) {
                case 'family':
                  typedData = {
                    ...baseData,
                    governmentId: {
                      type: 'state_id',
                      number: '',
                      expirationDate: new Date(),
                      issuingCountry: 'US'
                    },
                    relationships: [{
                      inmateId: '',
                      facilityId: '',
                      relationship: 'other',
                      isPrimaryContact: true
                    }]
                  } as FamilyMemberInfo;
                  break;
                case 'legal':
                  typedData = {
                    ...baseData,
                    barNumber: '',
                    barState: '',
                    firmName: '',
                    firmAddress: '',
                    credentials: {
                      barCardImage: new File([], 'placeholder'),
                      professionalEmail: state.email!,
                      practiceAreas: []
                    },
                    clients: []
                  } as LegalRepresentativeInfo;
                  break;
                case 'educator':
                  typedData = {
                    ...baseData,
                    institution: '',
                    department: '',
                    position: '',
                    credentials: {
                      institutionEmail: state.email!,
                      employmentVerification: new File([], 'placeholder')
                    },
                    programs: []
                  } as EducatorInfo;
                  break;
                default:
                  typedData = {
                    ...baseData,
                    governmentId: {
                      type: 'state_id',
                      number: '',
                      expirationDate: new Date(),
                      issuingCountry: 'US'
                    },
                    relationships: []
                  } as FamilyMemberInfo;
              }
              handleNext({ personalInfo: typedData });
            }}
            onError={handleError}
          />
        );
      
      case 'identity_verification':
        return (
          <IdentityVerification
            userType={state.userType!}
            personalInfo={state.personalInfo}
            onNext={(data) => handleNext({ identityInfo: { governmentId: data } })}
            onError={handleError}
          />
        );
      
      case 'relationship_info':
        return (
          <RelationshipInfo
            userType={state.userType!}
            personalInfo={state.personalInfo}
            onNext={(data) => handleNext({ relationships: data.relationships })}
            onError={handleError}
          />
        );
      
      case 'contact_approval':
        return (
          <ContactApproval
            userType={state.userType!}
            personalInfo={state.personalInfo}
            onNext={(data) => handleNext({})}
            onError={handleError}
          />
        );
      
      case 'complete':
        return (
          <Box textAlign="center" py={10}>
            <Heading size="lg">Registration Complete!</Heading>
            <Text mt={4} color="gray.600">
              Your registration has been submitted for approval. You will receive an email once it has been reviewed.
            </Text>
          </Box>
        );
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <Stack spacing={8}>
        {state.errors?.map((error, i) => (
          <Box
            key={i}
            p={4}
            bg="red.50"
            color="red.900"
            borderRadius="md"
          >
            {error.message}
          </Box>
        ))}
        {renderStep()}
      </Stack>
    </Container>
  );
};
