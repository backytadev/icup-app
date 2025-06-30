/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';
import { type UserFormData } from '@/modules/user/interfaces/user-form-data.interface';

interface Options {
  isInputDisabled: boolean;
  userUpdateForm: UseFormReturn<UserFormData, any, UserFormData | undefined>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useUserUpdateSubmitButtonLogic = ({
  userUpdateForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
  isInputDisabled,
}: Options): void => {
  //* Watchers
  const firstNames = userUpdateForm.watch('firstNames');
  const lastNames = userUpdateForm.watch('lastNames');
  const email = userUpdateForm.watch('email');
  const gender = userUpdateForm.watch('gender');
  const roles = userUpdateForm.watch('roles');
  const recordStatus = userUpdateForm.watch('recordStatus');

  //* Effects
  useEffect(() => {
    if (
      userUpdateForm.formState.errors &&
      Object.values(userUpdateForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (firstNames && lastNames && email && roles && gender && !isInputDisabled) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (!firstNames || !lastNames || !email || !roles || !gender) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (roles?.length === 0) {
      setIsSubmitButtonDisabled(true);
    }
  }, [userUpdateForm.formState, firstNames, lastNames, email, roles, gender, recordStatus]);
};
