import {
  type CreatedBy,
  type UpdatedBy,
  type TheirChurch,
  type TheirPastor,
  type TheirCopastor,
  type TheirSupervisor,
  type TheirPreacher,
  type TheirZone,
  type Disciple,
} from '@/shared/interfaces/relations-response.interface';

export interface FamilyGroupResponse {
  id: string;
  familyGroupName: string;
  familyGroupNumber: number;
  familyGroupCode: string;
  serviceTime: string;
  country: string;
  department: string;
  province: string;
  district: string;
  urbanSector: string;
  address: string;
  referenceAddress: string;
  recordStatus: string;
  disciples?: Disciple[];
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
  theirPreacher?: TheirPreacher | null;
  theirZone?: TheirZone | null;
}
