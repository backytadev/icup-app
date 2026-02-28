import {
  type Preacher,
  type Disciple,
  type CreatedBy,
  type UpdatedBy,
  type TheirChurch,
  type FamilyGroup,
  type TheirPastor,
  type TheirCopastor,
  type TheirSupervisor,
} from '@/shared/interfaces/relations-response.interface';

export interface ZoneResponse {
  id: string;
  zoneName: string;
  country: string;
  department: string;
  province: string;
  district: string;
  recordStatus: string;
  disciples?: Disciple[];
  preachers?: Preacher[];
  familyGroups?: FamilyGroup[];
  createdAt?: Date;
  createdBy?: CreatedBy;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  inactivationCategory?: string;
  inactivationReason?: string;
  theirChurch?: TheirChurch | null;
  theirPastor?: TheirPastor | null;
  theirCopastor?: TheirCopastor | null;
  theirSupervisor?: TheirSupervisor | null;
}
