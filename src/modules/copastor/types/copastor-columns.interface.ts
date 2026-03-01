import { type UpdatedBy } from '@/shared/interfaces/relations-response.interface';

export interface CopastorColumns {
  id: string;
  firstNames?: string;
  lastNames?: string;
  gender?: string;
  birthDate?: Date;
  email?: string;
  phoneNumber?: string;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  recordStatus?: string;
}
