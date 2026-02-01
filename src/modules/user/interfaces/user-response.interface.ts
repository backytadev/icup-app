import { ChurchResponse } from '@/modules/church/types';
import { type MinistryResponse } from '@/modules/ministry/types';
import { type CreatedBy, type UpdatedBy } from '@/shared/interfaces/relations-response.interface';

export interface UserResponse {
  id: string;
  userName: string;
  firstNames: string;
  lastNames: string;
  gender: string;
  email: string;
  roles: string[];
  createdAt?: Date;
  createdBy?: CreatedBy;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  inactivationCategory?: string;
  inactivationReason?: string;
  recordStatus: string;
  churches: string[] | ChurchResponse[];
  ministries: string[] | MinistryResponse[];
}
