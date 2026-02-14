import { type UserRole } from '@/modules/user/enums/user-role.enum';
import { type ChurchResponse } from '@/modules/church/types';
import { type MinistryResponse } from '@/modules/ministry/types';

export interface UserFormData {
  id?: string;
  firstNames: string;
  lastNames: string;
  email?: string;
  userName?: string;
  password?: string | undefined;
  passwordConfirm?: string | undefined;
  gender: string;
  roles: UserRole[];
  ministries: string[];
  churches: string[];
  recordStatus?: string | undefined;
}

export type UserFormDataKeys =
  | 'id'
  | 'firstNames'
  | 'lastNames'
  | 'email'
  | 'userName'
  | 'gender'
  | 'password'
  | 'passwordConfirm'
  | 'roles'
  | 'ministries'
  | 'churches'
  | 'recordStatus';

// User type from API (with full objects)
export interface User {
  id?: string;
  firstNames: string;
  lastNames: string;
  email?: string;
  userName?: string;
  gender: string;
  roles: UserRole[];
  ministries: (MinistryResponse | string)[];
  churches: (ChurchResponse | string)[];
  recordStatus?: string | undefined;
}
