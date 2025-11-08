import { ChurchResponse } from '@/modules/church/interfaces/church-response.interface';
import { type UserRole } from '@/modules/user/enums/user-role.enum';

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
  churches: (ChurchResponse | string)[];
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
  | 'churches'
  | 'recordStatus';

export type User = Omit<UserFormData, 'password' | 'passwordConfirm'>;
