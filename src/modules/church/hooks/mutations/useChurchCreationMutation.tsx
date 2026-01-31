import { type UseFormReturn } from 'react-hook-form';
import { type UseMutationResult } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useCreateMutation } from '@/shared/hooks';

import { createChurch } from '@/modules/church/services/church.service';
import { type ChurchResponse, type ChurchFormData } from '@/modules/church/types';

interface Options {
  churchCreationForm: UseFormReturn<ChurchFormData, any, ChurchFormData | undefined>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useChurchCreationMutation = ({
  churchCreationForm,
  setIsInputDisabled,
}: Options): UseMutationResult<ChurchResponse, ErrorResponse, ChurchFormData, unknown> => {
  return useCreateMutation({
    mutationFn: createChurch,
    redirectPath: '/churches',
    onSuccess: () => {
      setTimeout(() => {
        churchCreationForm.reset();
      }, 100);
    },
    onError: () => {
      setIsInputDisabled(false);
    },
  });
};
