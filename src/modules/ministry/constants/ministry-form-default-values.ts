import { Country } from '@/shared/enums/country.enum';
import { Province } from '@/shared/enums/province.enum';
import { Department } from '@/shared/enums/department.enum';

import { type MinistryFormData } from '@/modules/ministry/types';

//* Base default values - shared between create and update modes
const baseMinistryDefaultValues: Partial<MinistryFormData> = {
  customMinistryName: '',
  ministryType: '',
  email: '',
  foundingDate: undefined,
  serviceTimes: [],
  phoneNumber: '',
  district: '',
  urbanSector: '',
  address: '',
  referenceAddress: '',
  theirPastor: '',
};

//* Create mode: pre-filled with default location values
export const ministryCreateDefaultValues = {
  ...baseMinistryDefaultValues,
  country: Country.Perú,
  department: Department.Lima,
  province: Province.Lima,
} as MinistryFormData;

//* Update mode: empty location values, includes recordStatus
export const ministryUpdateDefaultValues = {
  ...baseMinistryDefaultValues,
  country: '',
  department: '',
  province: '',
  recordStatus: '',
} as MinistryFormData;
