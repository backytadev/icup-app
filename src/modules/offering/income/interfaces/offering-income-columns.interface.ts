import {
  Zone,
  Anexe,
  Pastor,
  Copastor,
  Disciple,
  Preacher,
  Supervisor,
  FamilyGroup,
  ExternalDonor,
  type UpdatedBy,
} from '@/shared/interfaces/relations-response.interface';

export interface OfferingIncomeColumns {
  id: string;
  church?: Anexe | null;
  type?: string;
  subType?: string;
  category?: string;
  amount?: string;
  currency?: string;
  date?: Date;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  recordStatus?: string;
  memberType?: string;
  familyGroup?: FamilyGroup | null;
  zone?: Zone | null;
  disciple?: Disciple | null;
  preacher?: Preacher | null;
  supervisor?: Supervisor | null;
  copastor?: Copastor | null;
  pastor?: Pastor | null;
  externalDonor?: ExternalDonor | null;
}
