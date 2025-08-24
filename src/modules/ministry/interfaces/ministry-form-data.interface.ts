import { type MinistryServiceTime } from '@/modules/ministry/enums/ministry-service-time.enum';

export interface MinistryFormData {
  customMinistryName: string;
  ministryType: string;
  serviceTimes: MinistryServiceTime[];
  foundingDate: Date;
  email?: string | undefined;
  phoneNumber?: string | undefined;
  country: string;
  department: string;
  province: string;
  district: string;
  urbanSector: string;
  address: string;
  referenceAddress: string;
  recordStatus?: string | undefined;
  theirPastor?: string | undefined;
}

export type MinistryFormDataKeys =
  | 'customMinistryName'
  | 'ministryType'
  | 'serviceTimes'
  | 'foundingDate'
  | 'serviceTimes'
  | 'phoneNumber'
  | 'email'
  | 'country'
  | 'department'
  | 'province'
  | 'district'
  | 'urbanSector'
  | 'address'
  | 'referenceAddress'
  | 'recordStatus'
  | 'theirPastor';
