import type { Address } from '../types';

export interface PersonalInfoForm {
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
