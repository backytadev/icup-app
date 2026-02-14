import { type UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import { type UserResponse } from '@/modules/user/types/user-response.interface';
import { updateUser, type UpdateUserOptions } from '@/modules/user/services/user.service';

interface Options {
  dialogClose: () => void;
  scrollToTop: () => void;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const usePasswordUpdateMutation = ({
  dialogClose,
  scrollToTop,
  setIsInputDisabled,
  setIsSubmitButtonDisabled,
}: Options): UseMutationResult<UserResponse, ErrorResponse, UpdateUserOptions, unknown> => {
  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: updateUser,
    messages: { success: 'Contraseña actualizada correctamente.' },
    successDelay: 1500,
    errorDelay: 1500,
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
          dialogClose();
          setIsInputDisabled(false);
        }, 800);
      },
      onErrorCallback: () => {
        setIsInputDisabled(false);
        setIsSubmitButtonDisabled(false);
      },
    },
  });
};
