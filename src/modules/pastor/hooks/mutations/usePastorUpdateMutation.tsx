import { type UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import { type PastorResponse } from '@/modules/pastor/types/pastor-response.interface';
import { updatePastor, type UpdatePastorOptions } from '@/modules/pastor/services/pastor.service';

interface Options {
  dialogClose: () => void;
  scrollToTop: () => void;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const usePastorUpdateMutation = ({
  dialogClose,
  scrollToTop,
  setIsInputDisabled,
  setIsSubmitButtonDisabled,
}: Options): UseMutationResult<PastorResponse, ErrorResponse, UpdatePastorOptions, unknown> => {
  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: updatePastor,
    messages: { success: 'Cambios guardados correctamente.' },
    successDelay: 1500,
    errorDelay: 1500,
    callbacks: {
      onSuccessCallback: () => {
        //* Invalidate all pastor-related queries
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey[0];
            return typeof queryKey === 'string' && queryKey.includes('pastor');
          },
        });

        scrollToTop();
        dialogClose();
        setIsInputDisabled(false);
      },
      onErrorCallback: () => {
        setIsInputDisabled(false);
        setIsSubmitButtonDisabled(false);
      },
    },
  });
};
