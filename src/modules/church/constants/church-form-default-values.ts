import { Country } from '@/shared/enums/country.enum';
import { Province } from '@/shared/enums/province.enum';
import { Department } from '@/shared/enums/department.enum';

import { type ChurchFormData } from '@/modules/church/types';

export const churchCreateDefaultValues: ChurchFormData = {
  churchName: '',
  abbreviatedChurchName: '',
  email: '',
  foundingDate: undefined as unknown as Date,
  isAnexe: false,
  phoneNumber: '',
  country: Country.Perú,
  department: Department.Lima,
  province: Province.Lima,
  district: '',
  urbanSector: '',
  address: '',
  serviceTimes: [],
  referenceAddress: '',
  theirMainChurch: '',
};

export const churchUpdateDefaultValues: ChurchFormData = {
  churchName: '',
  abbreviatedChurchName: '',
  email: '',
  foundingDate: undefined as unknown as Date,
  serviceTimes: [],
  isAnexe: false,
  phoneNumber: '',
  country: '',
  department: '',
  province: '',
  district: '',
  urbanSector: '',
  address: '',
  referenceAddress: '',
  recordStatus: '',
  theirMainChurch: '',
};
