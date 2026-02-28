import { Country } from '@/shared/enums/country.enum';
import { Province } from '@/shared/enums/province.enum';
import { District } from '@/shared/enums/district.enum';
import { Department } from '@/shared/enums/department.enum';

import { type FamilyGroupFormData } from '@/modules/family-group/types';

//* Base default values - shared between create and update modes
const baseFamilyGroupDefaultValues: Partial<FamilyGroupFormData> = {
  familyGroupName: '',
  serviceTime: '',
  urbanSector: '',
  address: '',
  referenceAddress: '',
  theirZone: '',
  theirPreacher: '',
};

//* Create mode: pre-filled with default location values
export const familyGroupCreateDefaultValues = {
  ...baseFamilyGroupDefaultValues,
  country: Country.Perú,
  department: Department.Lima,
  province: Province.Lima,
  district: District.Independencia,
} as FamilyGroupFormData;

//* Update mode: empty location values, includes recordStatus
export const familyGroupUpdateDefaultValues = {
  ...baseFamilyGroupDefaultValues,
  country: '',
  department: '',
  province: '',
  district: '',
  recordStatus: '',
} as FamilyGroupFormData;
