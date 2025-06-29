/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';
import { type ZoneSupervisorUpdateFormData } from '@/modules/zone/interfaces/zone-supervisor-update-form-data.interface';

interface Options {
  zoneSupervisorUpdateForm: UseFormReturn<
    ZoneSupervisorUpdateFormData,
    any,
    ZoneSupervisorUpdateFormData
  >;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isInputTheirSupervisorDisabled: boolean;
}

export const useZoneSupervisorUpdateSubmitButtonLogic = ({
  zoneSupervisorUpdateForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
  isInputTheirSupervisorDisabled,
}: Options): void => {
  //* Watchers
  const newTheirSupervisor = zoneSupervisorUpdateForm.watch('newTheirSupervisor');
  const newZone = zoneSupervisorUpdateForm.watch('newZone');

  //* Effects
  useEffect(() => {
    if (
      zoneSupervisorUpdateForm.formState.errors &&
      Object.values(zoneSupervisorUpdateForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (newTheirSupervisor && newZone && !isInputTheirSupervisorDisabled) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (!newTheirSupervisor || !newZone) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }
  }, [zoneSupervisorUpdateForm.formState, newTheirSupervisor, newZone]);
};
