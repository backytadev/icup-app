import { type UseFormReturn } from 'react-hook-form';
import { type UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

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
  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: createChurch,
    messages: { success: 'Iglesia creada exitosamente.' },
    redirectPath: '/churches',
    successDelay: 1600,
    callbacks: {
      onSuccessCallback: () => {
        //* Invalidate queries immediately - no need for setTimeout
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey[0];
            return typeof queryKey === 'string' && queryKey.includes('churches');
          },
        });

        //* Reset form immediately after success
        churchCreationForm.reset();
      },
      onErrorCallback: () => {
        setIsInputDisabled(false);
      },
    },
  });
};
