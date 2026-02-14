import { type UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import { type MinistryResponse } from '@/modules/ministry/types';
import {
  updateMinistry,
  type UpdateMinistryOptions,
} from '@/modules/ministry/services/ministry.service';

interface Options {
  dialogClose: () => void;
  scrollToTop: () => void;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useMinistryUpdateMutation = ({
  dialogClose,
  scrollToTop,
  setIsInputDisabled,
}: Options): UseMutationResult<MinistryResponse, ErrorResponse, UpdateMinistryOptions, unknown> => {
  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: updateMinistry,
    messages: { success: 'Cambios guardados correctamente.' },
    successDelay: 1500,
    errorDelay: 1500,
    callbacks: {
      onSuccessCallback: () => {
        //* Invalidate all ministry-related queries
        setTimeout(() => {
          queryClient.invalidateQueries({
            predicate: (query) => {
              const queryKey = query.queryKey[0];
              return typeof queryKey === 'string' && queryKey.includes('ministr');
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
