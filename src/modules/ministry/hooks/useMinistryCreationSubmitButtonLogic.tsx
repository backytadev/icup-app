/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';
import { type MinistryFormData } from '@/modules/ministry/interfaces/ministry-form-data.interface';

interface Options {
  ministryCreationForm: UseFormReturn<MinistryFormData, any, MinistryFormData | undefined>;
  isInputDisabled: boolean;
  setIsSubmitButtonDisabled: (value: boolean) => void;
  setIsMessageErrorDisabled: (value: boolean) => void;
}

export const useMinistryCreationSubmitButtonLogic = ({
  ministryCreationForm,
  isInputDisabled,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
}: Options): void => {
  //* Watchers
  const ministryType = ministryCreationForm.watch('ministryType');
  const foundingDate = ministryCreationForm.watch('foundingDate');
  const serviceTimes = ministryCreationForm.watch('serviceTimes');
  const emailAddress = ministryCreationForm.watch('email');
  const phoneNumber = ministryCreationForm.watch('phoneNumber');
  const country = ministryCreationForm.watch('country');
  const department = ministryCreationForm.watch('department');
  const province = ministryCreationForm.watch('province');
  const district = ministryCreationForm.watch('district');
  const urbanSector = ministryCreationForm.watch('urbanSector');
  const address = ministryCreationForm.watch('address');
  const referenceAddress = ministryCreationForm.watch('referenceAddress');
  const theirPastor = ministryCreationForm.watch('theirPastor');

  //* Effects
  useEffect(() => {
    if (
      ministryCreationForm.formState.errors &&
      Object.values(ministryCreationForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      theirPastor &&
      Object.values(ministryCreationForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (Object.values(ministryCreationForm.formState.errors).length === 0 && !isInputDisabled) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      !ministryType ||
      !foundingDate ||
      !serviceTimes ||
      !country ||
      !department ||
      !province ||
      !district ||
      !urbanSector ||
      !address ||
      !referenceAddress ||
      !theirPastor
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }
  }, [
    ministryCreationForm.formState,
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
    theirPastor,
  ]);
};
