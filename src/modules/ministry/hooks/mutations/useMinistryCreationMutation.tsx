import { type UseFormReturn } from 'react-hook-form';
import { type UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

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
  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: createMinistry,
    messages: { success: 'Ministerio creado exitosamente.' },
    redirectPath: '/ministries',
    successDelay: 1600,
    callbacks: {
      onSuccessCallback: () => {
        //* Invalidate queries immediately - no need for setTimeout
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey[0];
            return typeof queryKey === 'string' && queryKey.includes('ministr');
          },
        });

        //* Reset form immediately after success
        ministryCreationForm.reset();
      },
      onErrorCallback: () => {
        setIsInputDisabled(false);
      },
    },
  });
};
