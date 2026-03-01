import { Country } from '@/shared/enums/country.enum';
import { Province } from '@/shared/enums/province.enum';
import { Department } from '@/shared/enums/department.enum';
import { MemberRole } from '@/shared/enums/member-role.enum';

import { type CopastorFormData } from '@/modules/copastor/types';

//* Base default values - shared between create and update modes
const baseCopastorDefaultValues: Partial<CopastorFormData> = {
  firstNames: '',
  lastNames: '',
  gender: '',
  originCountry: '',
  birthDate: undefined,
  conversionDate: undefined,
  numberChildren: '',
  maritalStatus: '',
  email: '',
  phoneNumber: '',
  residenceDistrict: '',
  residenceUrbanSector: '',
  residenceAddress: '',
  referenceAddress: '',
  theirPastor: '',
  theirMinistries: [],
};

//* Create mode: pre-filled with default values
export const copastorCreateDefaultValues = {
  ...baseCopastorDefaultValues,
  residenceCountry: Country.Perú,
  residenceDepartment: Department.Lima,
  residenceProvince: Province.Lima,
  relationType: undefined,
  roles: [MemberRole.Copastor],
} as unknown as CopastorFormData;

//* Update mode: empty location values, includes recordStatus
export const copastorUpdateDefaultValues = {
  ...baseCopastorDefaultValues,
  residenceCountry: '',
  residenceDepartment: '',
  residenceProvince: '',
  relationType: '',
  roles: [],
  recordStatus: '',
} as CopastorFormData;
