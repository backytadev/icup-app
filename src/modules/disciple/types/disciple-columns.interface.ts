import { type UpdatedBy } from '@/shared/interfaces/relations-response.interface';

export interface DiscipleColumns {
  id: string;
  firstNames?: string;
  lastNames?: string;
  gender?: string;
  originCountry?: string;
  birthDate?: Date;
  email?: string;
  phoneNumber?: string;
  residenceDistrict?: string;
  residenceUrbanSector?: string;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  recordStatus?: string;
}
