import { Country } from '@/shared/enums/country.enum';
import { Province } from '@/shared/enums/province.enum';
import { MemberRole } from '@/shared/enums/member-role.enum';
import { Department } from '@/shared/enums/department.enum';

import { type DiscipleFormData } from '@/modules/disciple/types/disciple-form-data.interface';

export const discipleCreateDefaultValues: DiscipleFormData = {
  firstNames: '',
  lastNames: '',
  gender: '',
  originCountry: '',
  birthDate: undefined as unknown as Date,
  conversionDate: undefined,
  numberChildren: '',
  maritalStatus: '',
  relationType: '',
  email: '',
  phoneNumber: '',
  residenceCountry: Country.Perú,
  residenceDepartment: Department.Lima,
  residenceProvince: Province.Lima,
  residenceDistrict: '',
  residenceUrbanSector: '',
  residenceAddress: '',
  referenceAddress: '',
  roles: [MemberRole.Disciple],
  theirPastor: '',
  theirFamilyGroup: '',
  theirSupervisor: '',
  theirMinistries: [],
};

export const discipleUpdateDefaultValues: DiscipleFormData = {
  firstNames: '',
  lastNames: '',
  gender: '',
  originCountry: '',
  birthDate: undefined as unknown as Date,
  conversionDate: undefined,
  numberChildren: '',
  maritalStatus: '',
  relationType: '',
  email: '',
  phoneNumber: '',
  residenceCountry: '',
  residenceDepartment: '',
  residenceProvince: '',
  residenceDistrict: '',
  residenceUrbanSector: '',
  residenceAddress: '',
  referenceAddress: '',
  roles: [],
  recordStatus: '',
  theirPastor: '',
  theirFamilyGroup: '',
  theirSupervisor: '',
  theirMinistries: [],
};
