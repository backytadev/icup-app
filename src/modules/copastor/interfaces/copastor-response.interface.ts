import {
  type Zone,
  type Member,
  type Disciple,
  type Preacher,
  type CreatedBy,
  type UpdatedBy,
  type Supervisor,
  type FamilyGroup,
  type TheirChurch,
  type TheirPastor,
} from '@/shared/interfaces/relations-response.interface';

export interface CopastorResponse {
  id: string;
  member: Member;
  createdAt?: Date;
  createdBy?: CreatedBy;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  inactivationCategory?: string;
  inactivationReason?: string;
  supervisors?: Supervisor[];
  zones?: Zone[];
  preachers?: Preacher[];
  familyGroups?: FamilyGroup[];
  disciples?: Disciple[];
  recordStatus: string;
  relationType: string;
  theirPastor?: TheirPastor | null;
  theirChurch?: TheirChurch | null;
}
