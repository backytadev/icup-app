/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-extraneous-class */

import { AxiosError } from 'axios';

import { icupApi } from '@/core/api/icupApi';
import { type UserRole } from '@/modules/user/enums/user-role.enum';
import { ChurchResponse } from '@/modules/church/interfaces/church-response.interface';

export interface LoginResponse {
  id: string;
  firstNames: string;
  lastNames: string;
  email: string;
  gender: string;
  roles: UserRole[];
  status: string;
  token: string;
  churches: ChurchResponse[];
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
