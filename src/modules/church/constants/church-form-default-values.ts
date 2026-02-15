import { Country } from '@/shared/enums/country.enum';
import { Province } from '@/shared/enums/province.enum';
import { Department } from '@/shared/enums/department.enum';

import { type ChurchFormData } from '@/modules/church/types';

//* Base default values - shared between create and update modes
const baseChurchDefaultValues: Partial<ChurchFormData> = {
  churchName: '',
  abbreviatedChurchName: '',
  email: '',
  foundingDate: undefined,
  serviceTimes: [],
  isAnexe: false,
  phoneNumber: '',
  district: '',
  urbanSector: '',
  address: '',
  referenceAddress: '',
  theirMainChurch: '',
};

//* Create mode: pre-filled with default location values
export const churchCreateDefaultValues = {
  ...baseChurchDefaultValues,
  country: Country.Perú,
  department: Department.Lima,
  province: Province.Lima,
} as ChurchFormData;

//* Update mode: empty location values, includes recordStatus
export const churchUpdateDefaultValues = {
  ...baseChurchDefaultValues,
  country: '',
  department: '',
  province: '',
  recordStatus: '',
} as ChurchFormData;
