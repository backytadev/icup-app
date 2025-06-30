/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';
import { type UserPasswordUpdateFormData } from '@/modules/user/interfaces/user-password-update-form-data.interface';

interface Options {
  isInputDisabled: boolean;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  userPasswordUpdateForm: UseFormReturn<
    UserPasswordUpdateFormData,
    any,
    UserPasswordUpdateFormData | undefined
  >;
  setIsMessageErrorPasswordDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useUserUpdatePasswordSubmitButtonLogic = ({
  userPasswordUpdateForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
  setIsMessageErrorPasswordDisabled,
  isInputDisabled,
}: Options): void => {
  //* Watchers
  const currentPassword = userPasswordUpdateForm.watch('currentPassword');
  const newPassword = userPasswordUpdateForm.watch('newPassword');
  const newPasswordConfirm = userPasswordUpdateForm.watch('newPasswordConfirm');

  //* Effects
  useEffect(() => {
    if (
      userPasswordUpdateForm.formState.errors &&
      Object.values(userPasswordUpdateForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (currentPassword && newPassword && newPasswordConfirm && !isInputDisabled) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
      setIsMessageErrorPasswordDisabled(false);
    }

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (newPassword !== newPasswordConfirm) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorPasswordDisabled(true);
    }
  }, [userPasswordUpdateForm.formState, currentPassword, newPassword, newPasswordConfirm]);
};
