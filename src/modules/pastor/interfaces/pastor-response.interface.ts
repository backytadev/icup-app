import {
  type Zone,
  type Member,
  type Copastor,
  type Preacher,
  type Ministry,
  type Disciple,
  type CreatedBy,
  type UpdatedBy,
  type Supervisor,
  type FamilyGroup,
  type TheirChurch,
} from '@/shared/interfaces/relations-response.interface';

export interface PastorResponse {
  id: string;
  member: Member;
  createdAt?: Date;
  createdBy?: CreatedBy;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  inactivationCategory?: string;
  inactivationReason?: string;
  copastors?: Copastor[];
  supervisors?: Supervisor[];
  zones?: Zone[];
  preachers?: Preacher[];
  familyGroups?: FamilyGroup[];
  disciples?: Disciple[];
  ministries?: Ministry[];
  relationType: string;
  recordStatus: string;
  theirChurch?: TheirChurch | null;
}
