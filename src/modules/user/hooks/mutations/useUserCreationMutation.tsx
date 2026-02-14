import { type UseFormReturn } from 'react-hook-form';
import { type UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import { createUser } from '@/modules/user/services/user.service';
import { type UserResponse } from '@/modules/user/types/user-response.interface';
import { type UserFormData } from '@/modules/user/types/user-form-data.interface';

interface Options {
  userCreationForm: UseFormReturn<UserFormData, any, UserFormData | undefined>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useUserCreationMutation = ({
  userCreationForm,
  setIsInputDisabled,
  setIsSubmitButtonDisabled,
}: Options): UseMutationResult<UserResponse, ErrorResponse, UserFormData, unknown> => {
  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: createUser,
    messages: { success: 'Usuario creado exitosamente.' },
    redirectPath: '/users',
    successDelay: 1600,
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

        setTimeout(() => {
          userCreationForm.reset();
        }, 100);
      },
      onErrorCallback: () => {
        setIsInputDisabled(false);
        setIsSubmitButtonDisabled(false);
      },
    },
  });
};
