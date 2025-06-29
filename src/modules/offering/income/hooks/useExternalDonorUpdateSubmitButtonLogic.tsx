/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { type ExternalDonorFormData } from '@/modules/offering/income/interfaces/external-donor-form-data.interface';

interface Options {
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  externalDonorUpdateForm: UseFormReturn<ExternalDonorFormData, any, ExternalDonorFormData>;
  isInputDisabled: boolean;
}

export const useExternalDonorUpdateSubmitButtonLogic = ({
  externalDonorUpdateForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
  isInputDisabled,
}: Options): void => {
  //* Watchers
  const donorFirstNames = externalDonorUpdateForm.watch('externalDonorFirstNames');
  const donorLastNames = externalDonorUpdateForm.watch('externalDonorLastNames');
  const donorGender = externalDonorUpdateForm.watch('externalDonorGender');
  const donorBirthDate = externalDonorUpdateForm.watch('externalDonorBirthDate');
  const donorEmail = externalDonorUpdateForm.watch('externalDonorEmail');
  const donorPhoneNumber = externalDonorUpdateForm.watch('externalDonorPhoneNumber');
  const donorOriginCountry = externalDonorUpdateForm.watch('externalDonorOriginCountry');
  const donorResidenceCountry = externalDonorUpdateForm.watch('externalDonorResidenceCountry');
  const donorResidenceCity = externalDonorUpdateForm.watch('externalDonorResidenceCity');
  const donorPostalCode = externalDonorUpdateForm.watch('externalDonorPostalCode');

  //* Effects
  useEffect(() => {
    if (
      externalDonorUpdateForm.formState.errors &&
      Object.values(externalDonorUpdateForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      donorFirstNames &&
      donorLastNames &&
      donorGender &&
      Object.values(externalDonorUpdateForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (!donorFirstNames || !donorLastNames || !donorGender) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }
  }, [
    externalDonorUpdateForm.formState,
    donorFirstNames,
    donorLastNames,
    donorGender,
    donorBirthDate,
    donorEmail,
    donorPhoneNumber,
    donorOriginCountry,
    donorResidenceCountry,
    donorResidenceCity,
    donorPostalCode,
  ]);
};
