import { type UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import { inactivateUser, type InactivateUserOptions } from '@/modules/user/services/user.service';

interface Options {
  scrollToTop: () => void;
  setIsCardOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSelectInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useUserInactivationMutation = ({
  scrollToTop,
  setIsCardOpen,
  setIsButtonDisabled,
  setIsSelectInputDisabled,
}: Options): UseMutationResult<void, ErrorResponse, InactivateUserOptions, unknown> => {
  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: inactivateUser,
    messages: { success: 'Usuario eliminado correctamente.' },
    successDelay: 2000,
    errorDelay: 2000,
    callbacks: {
      onSuccessCallback: () => {
        //* Invalidate all user-related queries
        setTimeout(() => {
          queryClient.invalidateQueries({
            predicate: (query) => {
              const queryKey = query.queryKey[0];
              return typeof queryKey === 'string' && queryKey.includes('user');
            }
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
