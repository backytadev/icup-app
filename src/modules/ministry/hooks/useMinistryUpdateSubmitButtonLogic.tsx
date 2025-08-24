/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';
import { type MinistryFormData } from '@/modules/ministry/interfaces/ministry-form-data.interface';

interface Options {
  ministryUpdateForm: UseFormReturn<MinistryFormData, any, MinistryFormData | undefined>;
  isInputDisabled: boolean;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useMinistryUpdateSubmitButtonLogic = ({
  ministryUpdateForm,
  isInputDisabled,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
}: Options): void => {
  //* Watchers
  const foundingDate = ministryUpdateForm.watch('foundingDate');
  const serviceTimes = ministryUpdateForm.watch('serviceTimes');
  const email = ministryUpdateForm.watch('email');
  const phoneNumber = ministryUpdateForm.watch('phoneNumber');
  const country = ministryUpdateForm.watch('country');
  const department = ministryUpdateForm.watch('department');
  const province = ministryUpdateForm.watch('province');
  const district = ministryUpdateForm.watch('district');
  const urbanSector = ministryUpdateForm.watch('urbanSector');
  const address = ministryUpdateForm.watch('address');
  const referenceAddress = ministryUpdateForm.watch('referenceAddress');
  const recordStatus = ministryUpdateForm.watch('recordStatus');
  const theirPastor = ministryUpdateForm.watch('theirPastor');

  //* Effects
  useEffect(() => {
    if (
      ministryUpdateForm.formState.errors &&
      Object.values(ministryUpdateForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      theirPastor &&
      Object.values(ministryUpdateForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (Object.values(ministryUpdateForm.formState.errors).length === 0 && !isInputDisabled) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      !foundingDate ||
      !serviceTimes ||
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
    ministryUpdateForm.formState,
    foundingDate,
    serviceTimes,
    email,
    phoneNumber,
    country,
    department,
    province,
    district,
    urbanSector,
    address,
    referenceAddress,
    recordStatus,
    theirPastor,
  ]);
};
