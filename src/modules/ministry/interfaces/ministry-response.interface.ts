import {
  type CreatedBy,
  type UpdatedBy,
  type TheirPastor,
  type TheirChurch,
  type MinistryMember,
} from '@/shared/interfaces/relations-response.interface';

export interface MinistryResponse {
  id: string;
  customMinistryName: string;
  ministryType: string;
  ministryCode: string;
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
  leaders?: MinistryMember[];
  coLeaders?: MinistryMember[];
  members?: MinistryMember[];
  recordStatus: string;
  theirPastor?: TheirPastor | null;
  theirChurch?: TheirChurch | null;
}
