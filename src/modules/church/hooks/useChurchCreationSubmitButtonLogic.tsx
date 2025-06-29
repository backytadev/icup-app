/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';
import { type ChurchFormData } from '@/modules/church/interfaces/church-form-data.interface';

interface Options {
  churchCreationForm: UseFormReturn<ChurchFormData, any, ChurchFormData>;
  isInputDisabled: boolean;
  setIsSubmitButtonDisabled: (value: boolean) => void;
  setIsMessageErrorDisabled: (value: boolean) => void;
}

export const useChurchCreationSubmitButtonLogic = ({
  churchCreationForm,
  isInputDisabled,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
}: Options): void => {
  //* Watchers
  const nameChurch = churchCreationForm.watch('churchName');
  const foundingDate = churchCreationForm.watch('foundingDate');
  const serviceTimes = churchCreationForm.watch('serviceTimes');
  const emailAddress = churchCreationForm.watch('email');
  const phoneNumber = churchCreationForm.watch('phoneNumber');
  const country = churchCreationForm.watch('country');
  const department = churchCreationForm.watch('department');
  const province = churchCreationForm.watch('province');
  const district = churchCreationForm.watch('district');
  const urbanSector = churchCreationForm.watch('urbanSector');
  const address = churchCreationForm.watch('address');
  const referenceAddress = churchCreationForm.watch('referenceAddress');
  const isAnexe = churchCreationForm.watch('isAnexe');
  const theirMainChurch = churchCreationForm.watch('theirMainChurch');

  //* Effects
  useEffect(() => {
    if (
      churchCreationForm.formState.errors &&
      Object.values(churchCreationForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      isAnexe &&
      theirMainChurch &&
      Object.values(churchCreationForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (isAnexe && !theirMainChurch) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      !isAnexe &&
      Object.values(churchCreationForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      !nameChurch ||
      !foundingDate ||
      !serviceTimes ||
      !emailAddress ||
      !phoneNumber ||
      !country ||
      !department ||
      !province ||
      !district ||
      !urbanSector ||
      !address ||
      !referenceAddress
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }
  }, [
    churchCreationForm.formState,
    nameChurch,
    foundingDate,
    serviceTimes,
    emailAddress,
    phoneNumber,
    country,
    department,
    province,
    district,
    urbanSector,
    address,
    referenceAddress,
    isAnexe,
    theirMainChurch,
  ]);
};
