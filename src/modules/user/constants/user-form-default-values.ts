import { type UserFormData } from '@/modules/user/types';

export const userCreateDefaultValues: UserFormData = {
  firstNames: '',
  lastNames: '',
  gender: '',
  email: '',
  userName: '',
  password: '',
  passwordConfirm: '',
  roles: [],
  churches: [],
  ministries: [],
};

export const userUpdateDefaultValues: UserFormData = {
  firstNames: '',
  lastNames: '',
  gender: '',
  email: '',
  userName: '',
  roles: [],
  churches: [],
  ministries: [],
  recordStatus: '',
};
