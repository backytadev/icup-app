/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';
import { type ZoneFormData } from '@/modules/zone/interfaces/zone-form-data.interface';

interface Options {
  isInputDisabled: boolean;
  zoneUpdateForm: UseFormReturn<ZoneFormData, any, ZoneFormData | undefined>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useZoneUpdateSubmitButtonLogic = ({
  zoneUpdateForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
  isInputDisabled,
}: Options): void => {
  //* Watchers
  const zoneName = zoneUpdateForm.watch('zoneName');
  const country = zoneUpdateForm.watch('country');
  const department = zoneUpdateForm.watch('department');
  const province = zoneUpdateForm.watch('province');
  const district = zoneUpdateForm.watch('district');
  const recordStatus = zoneUpdateForm.watch('recordStatus');
  const theirSupervisor = zoneUpdateForm.watch('theirSupervisor');

  //* Effects
  useEffect(() => {
    if (
      zoneUpdateForm.formState.errors &&
      Object.values(zoneUpdateForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      theirSupervisor &&
      Object.values(zoneUpdateForm.formState.errors).length === 0 &&
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
    zoneUpdateForm.formState,
    zoneName,
    country,
    department,
    province,
    district,
    recordStatus,
    theirSupervisor,
  ]);
};
