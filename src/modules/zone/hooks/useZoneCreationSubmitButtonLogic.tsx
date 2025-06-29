/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';
import { type ZoneFormData } from '@/modules/zone/interfaces/zone-form-data.interface';

interface Options {
  isInputDisabled: boolean;
  setIsSubmitButtonDisabled: (value: boolean) => void;
  setIsMessageErrorDisabled: (value: boolean) => void;
  zoneCreationForm: UseFormReturn<ZoneFormData, any, ZoneFormData>;
}

export const useZoneCreationSubmitButtonLogic = ({
  zoneCreationForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
  isInputDisabled,
}: Options): void => {
  //* Watchers
  const zoneName = zoneCreationForm.watch('zoneName');
  const country = zoneCreationForm.watch('country');
  const department = zoneCreationForm.watch('department');
  const province = zoneCreationForm.watch('province');
  const district = zoneCreationForm.watch('district');
  const theirSupervisor = zoneCreationForm.watch('theirSupervisor');

  //* Effects
  useEffect(() => {
    if (
      zoneCreationForm.formState.errors &&
      Object.values(zoneCreationForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      theirSupervisor &&
      Object.values(zoneCreationForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (!zoneName || !country || !department || !province || !district) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }
  }, [
    zoneCreationForm.formState,
    zoneName,
    country,
    department,
    province,
    district,
    theirSupervisor,
  ]);
};
