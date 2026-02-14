import { type UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import { type ChurchResponse } from '@/modules/church/types';
import { updateChurch, type UpdateChurchOptions } from '@/modules/church/services/church.service';

interface Options {
  dialogClose: () => void;
  scrollToTop: () => void;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useChurchUpdateMutation = ({
  dialogClose,
  scrollToTop,
  setIsInputDisabled,
}: Options): UseMutationResult<ChurchResponse, ErrorResponse, UpdateChurchOptions, unknown> => {
  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: updateChurch,
    messages: { success: 'Cambios guardados correctamente.' },
    successDelay: 1500,
    errorDelay: 1500,
    callbacks: {
      onSuccessCallback: () => {
        //* Invalidate all church-related queries
        setTimeout(() => {
          queryClient.invalidateQueries({
            predicate: (query) => {
              const queryKey = query.queryKey[0];
              return typeof queryKey === 'string' && queryKey.includes('churches');
            }
          });
        }, 700);

        scrollToTop();
        setTimeout(() => {
          dialogClose();
        }, 800);
      },
      onErrorCallback: () => {
        setIsInputDisabled(false);
      },
    },
  });
};
