/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';
import { type UserFormData } from '@/modules/user/interfaces/user-form-data.interface';

interface Options {
  isInputDisabled: boolean;
  userCreationForm: UseFormReturn<UserFormData, any, UserFormData>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorPasswordDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorRolesDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useUserCreationSubmitButtonLogic = ({
  userCreationForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
  setIsMessageErrorPasswordDisabled,
  setIsMessageErrorRolesDisabled,
  isInputDisabled,
}: Options): void => {
  //* Watchers
  const firstNames = userCreationForm.watch('firstNames');
  const lastNames = userCreationForm.watch('lastNames');
  const email = userCreationForm.watch('email');
  const password = userCreationForm.watch('password');
  const passwordConfirm = userCreationForm.watch('passwordConfirm');
  const roles = userCreationForm.watch('roles');
  const recordStatus = userCreationForm.watch('recordStatus');

  //* Effects
  useEffect(() => {
    if (
      userCreationForm.formState.errors &&
      Object.values(userCreationForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      firstNames &&
      lastNames &&
      email &&
      password &&
      passwordConfirm &&
      roles &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
      setIsMessageErrorPasswordDisabled(false);
      setIsMessageErrorRolesDisabled(false);
    }

    if (!firstNames || !lastNames || !email || !password || !passwordConfirm || !roles) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (password !== passwordConfirm) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorPasswordDisabled(true);
    }

    if (roles?.length === 0) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorRolesDisabled(true);
    }
  }, [
    userCreationForm.formState,
    firstNames,
    lastNames,
    email,
    password,
    passwordConfirm,
    roles,
    recordStatus,
  ]);
};
