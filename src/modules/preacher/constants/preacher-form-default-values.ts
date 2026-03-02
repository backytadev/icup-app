import { Country } from '@/shared/enums/country.enum';
import { Province } from '@/shared/enums/province.enum';
import { MemberRole } from '@/shared/enums/member-role.enum';
import { Department } from '@/shared/enums/department.enum';

import { type PreacherFormData } from '@/modules/preacher/types/preacher-form-data.interface';

export const preacherCreateDefaultValues: PreacherFormData = {
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
  roles: [MemberRole.Preacher],
  theirSupervisor: '',
  theirCopastor: '',
  theirPastorOnlyMinistries: '',
  theirPastorRelationDirect: '',
  theirMinistries: [],
};

export const preacherUpdateDefaultValues: PreacherFormData = {
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
  theirSupervisor: '',
  theirCopastor: '',
  theirPastorRelationDirect: '',
  theirPastorOnlyMinistries: '',
  theirMinistries: [],
};
