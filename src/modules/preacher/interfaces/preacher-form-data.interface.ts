import { type MemberRole } from '@/shared/enums/member-role.enum';
import { MinistryAssignment } from '@/shared/interfaces/ministry-assignment';

export interface PreacherFormData {
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
  relationType: string;
  isDirectRelationToPastor?: boolean | undefined;
  theirSupervisor?: string | undefined;
  theirCopastor?: string | undefined;
  theirPastorRelationDirect?: string | undefined;
  theirPastorOnlyMinistries?: string | undefined;
  theirMinistries?: MinistryAssignment[] | undefined;
}

export type PreacherFormDataKeys =
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
  | 'ReferenceAddress'
  | 'residenceRoles'
  | 'recordStatus'
  | 'relationType'
  | 'isDirectRelationToPastor'
  | 'theirSupervisor'
  | 'theirCopastor'
  | 'theirPastorRelationDirect'
  | 'theirPastorOnlyMinistries'
  | 'theirMinistries';
