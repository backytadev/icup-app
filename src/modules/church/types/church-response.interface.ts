import {
  type Copastor,
  type Disciple,
  type FamilyGroup,
  type Pastor,
  type Preacher,
  type Supervisor,
  type Zone,
  type Anexe,
  type CreatedBy,
  type UpdatedBy,
  type MainChurch,
  type Ministry,
} from '@/shared/interfaces/relations-response.interface';

export interface ChurchResponse {
  id: string;
  churchName: string;
  abbreviatedChurchName: string;
  churchCode: string;
  isAnexe: boolean;
  serviceTimes: string[];
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
  createdAt?: Date;
  createdBy?: CreatedBy;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  inactivationCategory?: string;
  inactivationReason?: string;
  anexes?: Anexe[];
  pastors?: Pastor[];
  copastors?: Copastor[];
  supervisors?: Supervisor[];
  zones?: Zone[];
  preachers?: Preacher[];
  familyGroups?: FamilyGroup[];
  disciples?: Disciple[];
  ministries?: Ministry[];
  recordStatus: string;
  theirMainChurch?: MainChurch | null;
}
