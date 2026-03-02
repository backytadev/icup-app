import {
  type Member,
  type Disciple,
  type CreatedBy,
  type TheirZone,
  type UpdatedBy,
  type TheirChurch,
  type TheirPastor,
  type TheirCopastor,
  type TheirSupervisor,
  type TheirFamilyGroup,
} from '@/shared/interfaces/relations-response.interface';

export interface PreacherResponse {
  id: string;
  member: Member;
  createdAt?: Date;
  createdBy?: CreatedBy;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  inactivationCategory?: string;
  inactivationReason?: string;
  disciples?: Disciple[];
  recordStatus?: string;
  relationType: string;
  theirChurch?: TheirChurch | null;
  theirPastor?: TheirPastor | null;
  theirCopastor?: TheirCopastor | null;
  theirSupervisor?: TheirSupervisor | null;
  theirFamilyGroup?: TheirFamilyGroup | null;
  theirZone?: TheirZone | null;
}
