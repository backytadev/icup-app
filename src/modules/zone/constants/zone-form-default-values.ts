import { Country } from '@/shared/enums/country.enum';
import { Province } from '@/shared/enums/province.enum';
import { Department } from '@/shared/enums/department.enum';

import { type ZoneFormData } from '@/modules/zone/types';

//* Base default values - shared between create and update modes
const baseZoneDefaultValues: Partial<ZoneFormData> = {
  zoneName: '',
  district: '',
  theirSupervisor: '',
};

//* Create mode: pre-filled with default location values
export const zoneCreateDefaultValues = {
  ...baseZoneDefaultValues,
  country: Country.Perú,
  department: Department.Lima,
  province: Province.Lima,
} as ZoneFormData;

//* Update mode: empty location values, includes recordStatus
export const zoneUpdateDefaultValues = {
  ...baseZoneDefaultValues,
  country: '',
  department: '',
  province: '',
  recordStatus: '',
} as ZoneFormData;
