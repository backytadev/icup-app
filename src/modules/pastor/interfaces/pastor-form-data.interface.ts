import { type MemberRole } from '@/shared/enums/member-role.enum';
import { MinistryAssignment } from '@/shared/interfaces/ministry-assignment';
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
  relationType: string;
  roles: MemberRole[];
  recordStatus?: string | undefined;
  theirChurch?: string | undefined;
  theirMinistries?: MinistryAssignment[] | undefined;
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
  | 'relationType'
  | 'roles'
  | 'status'
  | 'theirChurch'
  | 'theirMinistries';
