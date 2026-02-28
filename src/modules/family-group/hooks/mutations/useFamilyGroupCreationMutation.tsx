import { type UseFormReturn } from 'react-hook-form';
import { type UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import { createFamilyGroup } from '@/modules/family-group/services/family-group.service';
import { type FamilyGroupResponse, type FamilyGroupFormData } from '@/modules/family-group/types';

interface Options {
  familyGroupCreationForm: UseFormReturn<FamilyGroupFormData, any, FamilyGroupFormData | undefined>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useFamilyGroupCreationMutation = ({
  familyGroupCreationForm,
  setIsInputDisabled,
}: Options): UseMutationResult<FamilyGroupResponse, ErrorResponse, FamilyGroupFormData, unknown> => {
  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: createFamilyGroup,
    messages: { success: 'Grupo Familiar creado exitosamente.' },
    redirectPath: '/family-groups',
    successDelay: 1600,
    callbacks: {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey[0];
            return typeof queryKey === 'string' && queryKey.includes('family-group');
          },
        });

        familyGroupCreationForm.reset();
      },
      onErrorCallback: () => {
        setIsInputDisabled(false);
      },
    },
  });
};
