import { type UpdatedBy } from '@/shared/interfaces/relations-response.interface';

export interface ChurchColumns {
  id: string;
  churchName?: string;
  phoneNumber?: string;
  district?: string;
  urbanSector?: string;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
}
