import { MemberRole } from '@/shared/enums/member-role.enum';
import { RelationType } from '@/shared/enums/relation-type.enum';

import { type PastorFormData } from '@/modules/pastor/types/pastor-form-data.interface';

//* Base default values - shared between create and update modes
const basePastorDefaultValues: Partial<PastorFormData> = {
  firstNames: '',
  lastNames: '',
  gender: '',
  originCountry: '',
  birthDate: undefined,
  maritalStatus: '',
  numberChildren: '0',
  conversionDate: undefined,
  email: '',
  phoneNumber: '',
  residenceCountry: '',
  residenceDepartment: '',
  residenceProvince: '',
  residenceDistrict: '',
  residenceUrbanSector: '',
  residenceAddress: '',
  referenceAddress: '',
  roles: [MemberRole.Pastor],
  relationType: RelationType.OnlyRelatedHierarchicalCover,
  theirChurch: '',
};

//* Create mode: no recordStatus field
export const pastorCreateDefaultValues = {
  ...basePastorDefaultValues,
} as PastorFormData;

//* Update mode: includes recordStatus field
export const pastorUpdateDefaultValues = {
  ...basePastorDefaultValues,
  recordStatus: undefined,
} as PastorFormData;
