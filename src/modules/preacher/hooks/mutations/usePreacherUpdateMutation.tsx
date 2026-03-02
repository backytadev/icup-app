import { type UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import {
  updatePreacher,
  type UpdatePreacherOptions,
} from '@/modules/preacher/services/preacher.service';
import { type PreacherResponse } from '@/modules/preacher/types';

interface Options {
  dialogClose: () => void;
  scrollToTop: () => void;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRelationSelectDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const usePreacherUpdateMutation = ({
  dialogClose,
  scrollToTop,
  setIsInputDisabled,
  setIsSubmitButtonDisabled,
  setIsRelationSelectDisabled,
}: Options): UseMutationResult<PreacherResponse, ErrorResponse, UpdatePreacherOptions, unknown> => {
  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: updatePreacher,
    messages: { success: 'Cambios guardados correctamente.' },
    successDelay: 1500,
    errorDelay: 1500,
    callbacks: {
      onSuccessCallback: () => {
        setTimeout(() => {
          queryClient.invalidateQueries({
            predicate: (query) => {
              const queryKey = query.queryKey[0];
              return typeof queryKey === 'string' && queryKey.includes('preacher');
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
