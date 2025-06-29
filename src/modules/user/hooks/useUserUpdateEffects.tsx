/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { type UserRole } from '@/modules/user/enums/user-role.enum';

import { type UserResponse } from '@/modules/user/interfaces/user-response.interface';
import { type UserFormData } from '@/modules/user/interfaces/user-form-data.interface';

interface Options {
  id: string;
  data: UserResponse | undefined;
  setIsLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
  userUpdateForm: UseFormReturn<UserFormData, any, UserFormData>;
}

export const useUserUpdateEffects = ({
  id,
  data,
  setIsLoadingData,
  userUpdateForm,
}: Options): void => {
  //* Set data
  useEffect(() => {
    userUpdateForm.setValue('firstNames', data?.firstNames ?? '');
    userUpdateForm.setValue('lastNames', data?.lastNames ?? '');
    userUpdateForm.setValue('gender', data?.gender ?? '');
    userUpdateForm.setValue('email', data?.email ?? '');
    userUpdateForm.setValue('roles', data?.roles as UserRole[]);
    userUpdateForm.setValue('recordStatus', data?.recordStatus);

    const timeoutId = setTimeout(() => {
      setIsLoadingData(false);
    }, 1200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  //* Generate dynamic url
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/users/update/${id}/edit`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);
};
