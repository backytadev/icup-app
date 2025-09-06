import { type MemberRole } from '@/shared/enums/member-role.enum';

export interface SupervisorFormData {
  firstNames: string;
  lastNames: string;
  gender: string;
  originCountry: string;
  birthDate: Date;
  maritalStatus: string;
  numberChildren: string;
  conversionDate?: Date;
  email?: string | undefined;
  phoneNumber?: string | undefined;
  residenceCountry: string;
  residenceDepartment: string;
  residenceProvince: string;
  residenceDistrict: string;
  residenceUrbanSector: string;
  residenceAddress: string;
  referenceAddress: string;
  isDirectRelationToPastor?: boolean | undefined;
  roles: MemberRole[];
  recordStatus?: string | undefined;
  theirCopastor?: string | undefined;
  theirPastor?: string | undefined;
}

export type SupervisorFormDataKeys =
  | 'firstNames'
  | 'lastNames'
  | 'gender'
  | 'originCountry'
  | 'birthDate'
  | 'maritalStatus'
  | 'numberChildren'
  | 'conversionDate'
  | 'email'
  | 'phoneNumber'
  | 'residenceCountry'
  | 'residenceDepartment'
  | 'residenceProvince'
  | 'residenceDistrict'
  | 'residenceUrbanSector'
  | 'residenceAddress'
  | 'referenceAddress'
  | 'roles'
  | 'recordStatus'
  | 'isDirectRelationToPastor'
  | 'theirCopastor'
  | 'theirPastor';
