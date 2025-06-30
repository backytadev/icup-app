/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { type ExternalDonorResponse } from '@/modules/offering/income/interfaces/external-donor-response.interface';
import { type ExternalDonorFormData } from '@/modules/offering/income/interfaces/external-donor-form-data.interface';

interface Options {
  data: ExternalDonorResponse | undefined;
  setIsLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
  externalDonorUpdateForm: UseFormReturn<
    ExternalDonorFormData,
    any,
    ExternalDonorFormData | undefined
  >;
}

export const useExternalDonorEffects = ({
  data,
  setIsLoadingData,
  externalDonorUpdateForm,
}: Options): void => {
  //* Set data
  useEffect(() => {
    externalDonorUpdateForm.setValue('externalDonorFirstNames', data?.firstNames ?? '');
    externalDonorUpdateForm.setValue('externalDonorLastNames', data?.lastNames ?? '');
    externalDonorUpdateForm.setValue('externalDonorGender', data?.gender ?? '');
    externalDonorUpdateForm.setValue(
      'externalDonorBirthDate',
      data?.birthDate !== '1969-12-31' ? new Date(String(data?.birthDate).replace(/-/g, '/')) : null
    );
    externalDonorUpdateForm.setValue('externalDonorEmail', data?.email ?? '');
    externalDonorUpdateForm.setValue('externalDonorPhoneNumber', data?.phoneNumber ?? '');
    externalDonorUpdateForm.setValue('externalDonorOriginCountry', data?.originCountry ?? '');
    externalDonorUpdateForm.setValue('externalDonorResidenceCountry', data?.residenceCountry ?? '');
    externalDonorUpdateForm.setValue('externalDonorResidenceCity', data?.residenceCity ?? '');
    externalDonorUpdateForm.setValue('externalDonorPostalCode', data?.postalCode ?? '');

    const timeoutId = setTimeout(() => {
      setIsLoadingData(false);
    }, 1200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
};
