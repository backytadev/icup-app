import { type UseFormReturn } from 'react-hook-form';
import { type UseMutationResult } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useCreateMutation } from '@/shared/hooks';

import { createMinistry } from '@/modules/ministry/services/ministry.service';
import { type MinistryResponse, type MinistryFormData } from '@/modules/ministry/types';

interface Options {
  ministryCreationForm: UseFormReturn<MinistryFormData, any, MinistryFormData | undefined>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useMinistryCreationMutation = ({
  ministryCreationForm,
  setIsInputDisabled,
}: Options): UseMutationResult<MinistryResponse, ErrorResponse, MinistryFormData, unknown> => {
  return useCreateMutation({
    mutationFn: createMinistry,
    redirectPath: '/ministries',
    onSuccess: () => {
      setTimeout(() => {
        ministryCreationForm.reset();
      }, 100);
    },
    onError: () => {
      setIsInputDisabled(false);
    },
  });
};
