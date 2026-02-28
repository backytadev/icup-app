import { type UpdatedBy } from '@/shared/interfaces/relations-response.interface';

export interface FamilyGroupColumns {
  id: string;
  familyGroupName?: string;
  familyGroupCode?: string;
  district?: string;
  urbanSector?: string;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  recordStatus?: string;
}
