import { Country } from '@/shared/enums/country.enum';
import { Province } from '@/shared/enums/province.enum';
import { Department } from '@/shared/enums/department.enum';

import { type MinistryFormData } from '@/modules/ministry/types';

export const ministryCreateDefaultValues: MinistryFormData = {
  customMinistryName: '',
  ministryType: '',
  email: '',
  foundingDate: undefined as unknown as Date,
  phoneNumber: '',
  country: Country.Perú,
  department: Department.Lima,
  province: Province.Lima,
  district: '',
  urbanSector: '',
  address: '',
  serviceTimes: [],
  referenceAddress: '',
  theirPastor: '',
};

export const ministryUpdateDefaultValues: MinistryFormData = {
  customMinistryName: '',
  ministryType: '',
  email: '',
  foundingDate: undefined as unknown as Date,
  serviceTimes: [],
  phoneNumber: '',
  country: '',
  department: '',
  province: '',
  district: '',
  urbanSector: '',
  address: '',
  referenceAddress: '',
  recordStatus: '',
  theirPastor: '',
};
