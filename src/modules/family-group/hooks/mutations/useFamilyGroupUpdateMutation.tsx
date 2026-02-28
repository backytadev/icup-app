import { type UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import {
  updateFamilyGroup,
  type UpdateFamilyGroupOptions,
} from '@/modules/family-group/services/family-group.service';
import { type FamilyGroupResponse } from '@/modules/family-group/types';

interface Options {
  dialogClose: () => void;
  scrollToTop: () => void;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useFamilyGroupUpdateMutation = ({
  dialogClose,
  scrollToTop,
  setIsInputDisabled,
}: Options): UseMutationResult<
  FamilyGroupResponse,
  ErrorResponse,
  UpdateFamilyGroupOptions,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: updateFamilyGroup,
    messages: { success: 'Cambios guardados correctamente.' },
    successDelay: 1500,
    errorDelay: 1500,
    callbacks: {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey[0];
            return typeof queryKey === 'string' && queryKey.includes('family-group');
          },
        });

        scrollToTop();
        dialogClose();
      },
      onErrorCallback: () => {
        setIsInputDisabled(false);
      },
    },
  });
};
