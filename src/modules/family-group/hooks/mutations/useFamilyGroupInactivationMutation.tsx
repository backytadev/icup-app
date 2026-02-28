import { type UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import {
  inactivateFamilyGroup,
  type InactivateFamilyGroupOptions,
} from '@/modules/family-group/services/family-group.service';

interface Options {
  scrollToTop: () => void;
  setIsCardOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSelectInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useFamilyGroupInactivationMutation = ({
  scrollToTop,
  setIsCardOpen,
  setIsButtonDisabled,
  setIsSelectInputDisabled,
}: Options): UseMutationResult<void, ErrorResponse, InactivateFamilyGroupOptions, unknown> => {
  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: inactivateFamilyGroup,
    messages: { success: 'Registro eliminado correctamente.' },
    successDelay: 2000,
    errorDelay: 2000,
    callbacks: {
      onSuccessCallback: () => {
        setTimeout(() => {
          queryClient.invalidateQueries({
            predicate: (query) => {
              const queryKey = query.queryKey[0];
              return typeof queryKey === 'string' && queryKey.includes('family-group');
            },
          });
        }, 700);

        scrollToTop();
        setTimeout(() => {
          setIsCardOpen(false);
        }, 500);
        setTimeout(() => {
          setIsButtonDisabled(false);
          setIsSelectInputDisabled(false);
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
