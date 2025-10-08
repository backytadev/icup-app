/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-extraneous-class */

import { AxiosError } from 'axios';

import { icupApi } from '@/core/api/icupApi';
import { type UserRole } from '@/modules/user/enums/user-role.enum';

export interface LoginResponse {
  id: string;
  firstNames: string;
  lastNames: string;
  email: string;
  gender: string;
  roles: UserRole[];
  status: string;
  token: string;
}

export class AuthService {
  static login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const { data } = await icupApi.post<LoginResponse>('/auth/login', { email, password });

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      }

      throw new Error('No se puede iniciar sesión, hable con el administrador.');
    }
  };
}
