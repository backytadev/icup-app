import { type UpdatedBy } from '@/shared/interfaces/relations-response.interface';

export interface MinistryColumns {
  id: string;
  ministryType?: string;
  customMinistryName?: string;
  phoneNumber?: string;
  district?: string;
  urbanSector?: string;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
}
