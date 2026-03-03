import {
  type Member,
  type CreatedBy,
  type UpdatedBy,
  type TheirChurch,
  type TheirPastor,
  type TheirCopastor,
  type TheirSupervisor,
  type TheirPreacher,
  type TheirZone,
  type TheirFamilyGroup,
} from '@/shared/interfaces/relations-response.interface';

export interface DiscipleResponse {
  id: string;
  member: Member;
  createdAt?: Date;
  createdBy?: CreatedBy;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  relationType: string;
  inactivationCategory?: string;
  inactivationReason?: string;
  recordStatus: string;
  theirChurch?: TheirChurch | null;
  theirPastor?: TheirPastor | null;
  theirCopastor?: TheirCopastor | null;
  theirSupervisor?: TheirSupervisor | null;
  theirPreacher?: TheirPreacher | null;
  theirZone?: TheirZone | null;
  theirFamilyGroup?: TheirFamilyGroup | null;
}
