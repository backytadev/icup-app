import { Country } from '@/shared/enums/country.enum';
import { Province } from '@/shared/enums/province.enum';
import { Department } from '@/shared/enums/department.enum';
import { MemberRole } from '@/shared/enums/member-role.enum';

import { type SupervisorFormData } from '@/modules/supervisor/types';

//* Base default values - shared between create and update modes
const baseSupervisorDefaultValues: Partial<SupervisorFormData> = {
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
  theirCopastor: '',
  theirPastor: '',
  theirPastorRelationDirect: '',
  theirPastorOnlyMinistries: '',
  theirMinistries: [],
};

//* Create mode: pre-filled with default values
export const supervisorCreateDefaultValues = {
  ...baseSupervisorDefaultValues,
  residenceCountry: Country.Perú,
  residenceDepartment: Department.Lima,
  residenceProvince: Province.Lima,
  relationType: undefined,
  roles: [MemberRole.Supervisor],
} as unknown as SupervisorFormData;

//* Update mode: empty location values, includes recordStatus
export const supervisorUpdateDefaultValues = {
  ...baseSupervisorDefaultValues,
  residenceCountry: '',
  residenceDepartment: '',
  residenceProvince: '',
  relationType: '',
  roles: [],
  recordStatus: '',
} as SupervisorFormData;
