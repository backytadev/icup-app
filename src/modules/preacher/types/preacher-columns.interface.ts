import { type UpdatedBy } from '@/shared/interfaces/relations-response.interface';

export interface PreacherColumns {
  id: string;
  firstNames?: string;
  lastNames?: string;
  gender?: string;
  originCountry?: string;
  birthDate?: Date;
  email?: string;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  recordStatus?: string;
}
