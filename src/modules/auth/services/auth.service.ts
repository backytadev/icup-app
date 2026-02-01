import { AxiosError } from 'axios';

import { icupApi } from '@/core/api/icupApi';
import { type UserRole } from '@/modules/user/enums/user-role.enum';
import { MinistryType } from '@/modules/ministry/enums/ministry-type.enum';
import { ChurchResponse } from '@/modules/church/types';
import { type MinistryResponse } from '@/modules/ministry/types';

export interface LoginResponse {
  id: string;
  firstNames: string;
  lastNames: string;
  ministryType?: MinistryType;
  email: string;
  gender: string;
  roles: UserRole[];
  status: string;
  token: string;
  churches: ChurchResponse[];
  ministries: MinistryResponse[];
}

export class AuthService {
  static login = async (
    email: string,
    password: string,
    userName: string
  ): Promise<LoginResponse> => {
    try {
      const { data } = await icupApi.post<LoginResponse>('/auth/login', {
        email,
        password,
        userName,
      });

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      }

      throw new Error('No se puede iniciar sesión, hable con el administrador.');
    }
  };
}
