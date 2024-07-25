/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';
import { type FamilyGroupFormData } from '@/app/family-group/interfaces';

interface Options {
  familyGroupUpdateForm: UseFormReturn<FamilyGroupFormData, any, FamilyGroupFormData>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDisabled: boolean;
}

export const useFamilyGroupUpdateSubmitButtonLogic = ({
  familyGroupUpdateForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
  isInputDisabled,
}: Options): void => {
  //* Watchers
  const familyGroupName = familyGroupUpdateForm.watch('familyGroupName');
  const country = familyGroupUpdateForm.watch('country');
  const department = familyGroupUpdateForm.watch('department');
  const province = familyGroupUpdateForm.watch('province');
  const district = familyGroupUpdateForm.watch('district');
  const urbanSector = familyGroupUpdateForm.watch('urbanSector');
  const address = familyGroupUpdateForm.watch('address');
  const worshipTime = familyGroupUpdateForm.watch('worshipTime');
  const recordStatus = familyGroupUpdateForm.watch('recordStatus');
  const theirPreacher = familyGroupUpdateForm.watch('theirPreacher');
  const theirZone = familyGroupUpdateForm.watch('theirZone');

  //* Effects
  useEffect(() => {
    if (
      familyGroupUpdateForm.formState.errors &&
      Object.values(familyGroupUpdateForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }
    if (
      theirZone &&
      theirPreacher &&
      Object.values(familyGroupUpdateForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      !familyGroupName ||
      !country ||
      !department ||
      !province ||
      !district ||
      !worshipTime ||
      !address ||
      !urbanSector
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }
  }, [
    familyGroupUpdateForm.formState,
    familyGroupName,
    worshipTime,
    country,
    department,
    province,
    district,
    address,
    urbanSector,
    theirPreacher,
    theirZone,
    recordStatus,
  ]);
};
