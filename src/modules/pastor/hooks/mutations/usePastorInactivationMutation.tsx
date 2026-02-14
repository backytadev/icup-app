import { type UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import {
  inactivatePastor,
  type InactivatePastorOptions,
} from '@/modules/pastor/services/pastor.service';

interface Options {
  scrollToTop: () => void;
  setIsCardOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSelectInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const usePastorInactivationMutation = ({
  scrollToTop,
  setIsCardOpen,
  setIsButtonDisabled,
  setIsSelectInputDisabled,
}: Options): UseMutationResult<void, ErrorResponse, InactivatePastorOptions, unknown> => {
  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: inactivatePastor,
    messages: { success: 'Pastor eliminado correctamente.' },
    successDelay: 2000,
    errorDelay: 2000,
    callbacks: {
      onSuccessCallback: () => {
        //* Invalidate all pastor-related queries
        setTimeout(() => {
          queryClient.invalidateQueries({
            predicate: (query) => {
              const queryKey = query.queryKey[0];
              return typeof queryKey === 'string' && queryKey.includes('pastor');
            }
          });
        }, 700);

        scrollToTop();
        setTimeout(() => {
          setIsCardOpen(false);
        }, 500);
        setTimeout(() => {
          setIsSelectInputDisabled(false);
          setIsButtonDisabled(false);
        }, 600);
      },
      onErrorCallback: () => {
        setIsCardOpen(true);
        setIsButtonDisabled(false);
        setIsSelectInputDisabled(false);
      },
    },
  });
};
