import type { Address } from '../types';

export interface PersonalInfoForm {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phone: string;
  address?: Address;
  barNumber?: string;
  barState?: string;
  firmName?: string;
  institution?: string;
  department?: string;
  position?: string;
  employeeId?: string;
}
