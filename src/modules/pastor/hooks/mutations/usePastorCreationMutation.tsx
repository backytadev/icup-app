import { type UseFormReturn } from 'react-hook-form';
import { type UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import { createPastor } from '@/modules/pastor/services/pastor.service';
import { type PastorResponse } from '@/modules/pastor/types/pastor-response.interface';
import { type PastorFormData } from '@/modules/pastor/types/pastor-form-data.interface';

interface Options {
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  pastorCreationForm: UseFormReturn<PastorFormData, any, PastorFormData | undefined>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const usePastorCreationMutation = ({
  pastorCreationForm,
  setIsInputDisabled,
  setIsSubmitButtonDisabled,
}: Options): UseMutationResult<PastorResponse, ErrorResponse, PastorFormData, unknown> => {
  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: createPastor,
    messages: { success: 'Pastor creado exitosamente.' },
    redirectPath: '/pastors',
    successDelay: 1600,
    callbacks: {
      onSuccessCallback: () => {
        //* Invalidate all pastor-related queries
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey[0];
            return typeof queryKey === 'string' && queryKey.includes('pastor');
          },
        });

        pastorCreationForm.reset();
      },
      onErrorCallback: () => {
        setIsInputDisabled(false);
        setIsSubmitButtonDisabled(false);
      },
    },
  });
};
