import type { 
  FamilyMemberInfo,
  LegalRepresentativeInfo,
  EducatorInfo,
  PersonalInfoForm,
  Address
} from './types';

export function transformToFamilyMemberInfo(data: PersonalInfoForm, email: string): FamilyMemberInfo {
  const address: Address = {
    street1: data.address?.street1 || '',
    street2: data.address?.street2 || '',
    city: data.address?.city || '',
    state: data.address?.state || '',
    zipCode: data.address?.zipCode || '',
    country: data.address?.country || 'US'
  };

  return {
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: email,
    phone: data.phone || '',
    dateOfBirth: new Date(data.dateOfBirth || Date.now()),
    address,
    governmentId: {
      type: 'state_id' as const,
      number: '',
      expirationDate: new Date(),
      issuingCountry: 'US'
    },
    relationships: [{
      inmateId: '',
      facilityId: '',
      relationship: 'other' as const,
      isPrimaryContact: true
    }]
  };
}

export function transformToLegalRepresentativeInfo(data: PersonalInfoForm, email: string): LegalRepresentativeInfo {
  const address: Address = {
    street1: data.address?.street1 || '',
    street2: data.address?.street2 || '',
    city: data.address?.city || '',
    state: data.address?.state || '',
    zipCode: data.address?.zipCode || '',
    country: data.address?.country || 'US'
  };

  return {
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: email,
    phone: data.phone || '',
    dateOfBirth: new Date(data.dateOfBirth || Date.now()),
    address,
    barNumber: data.barNumber || '',
    barState: data.barState || '',
    firmName: data.firmName || '',
    firmAddress: address,
    credentials: {
      barCardImage: new File([], 'placeholder'),
      professionalEmail: email,
      practiceAreas: []
    },
    clients: []
  };
}

export function transformToEducatorInfo(data: PersonalInfoForm, email: string): EducatorInfo {
  const address: Address = {
    street1: data.address?.street1 || '',
    street2: data.address?.street2 || '',
    city: data.address?.city || '',
    state: data.address?.state || '',
    zipCode: data.address?.zipCode || '',
    country: data.address?.country || 'US'
  };

  return {
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: email,
    phone: data.phone || '',
    dateOfBirth: new Date(data.dateOfBirth || Date.now()),
    address,
    institution: data.institution || '',
    department: data.department || '',
    position: data.position || '',
    employeeId: data.employeeId || '',
    credentials: {
      institutionEmail: email,
      employmentVerification: new File([], 'placeholder')
    },
    programs: []
  };
}
