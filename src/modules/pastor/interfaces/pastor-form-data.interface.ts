import { type MemberRole } from '@/shared/enums/member-role.enum';
export interface PastorFormData {
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
  roles: MemberRole[];
  recordStatus?: string | undefined;
  theirChurch?: string | undefined;
}

export type PastorFormDataKeys =
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
  | 'status'
  | 'theirChurch';
