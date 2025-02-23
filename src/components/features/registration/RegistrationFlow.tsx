import { useState } from 'react';
import { Box, Container, Heading, Stack, Text } from '@chakra-ui/react';
import { UserTypeSelection } from './UserTypeSelection/UserTypeSelection';
import { EmailVerification } from './EmailVerification/EmailVerification';
import { PersonalInfo } from './PersonalInfo/PersonalInfo';
import { IdentityVerification } from './IdentityVerification/IdentityVerification';
import { RelationshipInfo } from './RelationshipInfo/RelationshipInfo';
import type { RegistrationState, ValidationError, UserType } from './types';

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

  const clearErrors = () => {
    setState(prev => ({ ...prev, errors: undefined }));
  };

  const handleNext = (data: { userType?: UserType; email?: string; personalInfo?: any; identityInfo?: any; relationships?: any }) => {
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
          personalInfo: data
        }));
        break;
      
      case 'identity_verification':
        setState(prev => ({
          ...prev,
          step: 'relationship_info',
          identityInfo: data
        }));
        break;
      
      case 'relationship_info':
        setState(prev => ({
          ...prev,
          step: 'complete',
          relationships: data.relationships
        }));
        break;
    }
  };

  const renderStep = () => {
    switch (state.step) {
      case 'user_type':
        return <UserTypeSelection onNext={handleNext} onError={handleError} />;
      
      case 'email_verification':
        return (
          <EmailVerification
            userType={state.userType!}
            onNext={handleNext}
            onError={handleError}
          />
        );
      
      case 'personal_info':
        return (
          <PersonalInfo
            userType={state.userType!}
            email={state.email!}
            onNext={handleNext}
            onError={handleError}
          />
        );
      
      case 'identity_verification':
        return (
          <IdentityVerification
            userType={state.userType!}
            personalInfo={state.personalInfo}
            onNext={handleNext}
            onError={handleError}
          />
        );
      
      case 'relationship_info':
        return (
          <RelationshipInfo
            userType={state.userType!}
            personalInfo={state.personalInfo}
            onNext={handleNext}
            onError={handleError}
          />
        );
      
      case 'complete':
        return (
          <Box textAlign="center" py={10}>
            <Heading size="lg">Registration Complete!</Heading>
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
