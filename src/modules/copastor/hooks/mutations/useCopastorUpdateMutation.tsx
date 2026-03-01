import { type UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import {
  updateCopastor,
  type UpdateCopastorOptions,
} from '@/modules/copastor/services/copastor.service';
import { type CopastorResponse } from '@/modules/copastor/types';

interface Options {
  dialogClose: () => void;
  scrollToTop: () => void;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRelationSelectDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useCopastorUpdateMutation = ({
  dialogClose,
  scrollToTop,
  setIsInputDisabled,
  setIsSubmitButtonDisabled,
  setIsRelationSelectDisabled,
}: Options): UseMutationResult<CopastorResponse, ErrorResponse, UpdateCopastorOptions, unknown> => {
  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: updateCopastor,
    messages: { success: 'Cambios guardados correctamente.' },
    successDelay: 1500,
    errorDelay: 1500,
    callbacks: {
      onSuccessCallback: () => {
        setTimeout(() => {
          queryClient.invalidateQueries({
            predicate: (query) => {
              const queryKey = query.queryKey[0];
              return typeof queryKey === 'string' && queryKey.includes('copastor');
            },
          });
        }, 700);

        scrollToTop();
        setTimeout(() => {
          dialogClose();
          setIsInputDisabled(false);
          setIsRelationSelectDisabled?.(false);
        }, 1500);
      },
      onErrorCallback: () => {
        setIsInputDisabled(false);
        setIsSubmitButtonDisabled?.(false);
        setIsRelationSelectDisabled?.(false);
      },
    },
  });
};
