import { type ChurchServiceTime } from '@/modules/church/enums/church-service-time.enum';

export interface ChurchFormData {
  churchName: string;
  abbreviatedChurchName: string;
  isAnexe?: boolean | undefined;
  serviceTimes: ChurchServiceTime[];
  foundingDate: Date;
  email: string;
  phoneNumber: string;
  country: string;
  department: string;
  province: string;
  district: string;
  urbanSector: string;
  address: string;
  referenceAddress: string;
  recordStatus?: string | undefined;
  theirMainChurch?: string | undefined;
}

export type ChurchFormDataKeys =
  | 'churchName'
  | 'isAnexe'
  | 'abbreviatedChurchName'
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
  | 'theirMainChurch';
