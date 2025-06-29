/* eslint-disable @typescript-eslint/no-floating-promises */

import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { type UseFormReturn } from 'react-hook-form';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { type FamilyGroupResponse } from '@/modules/family-group/interfaces/family-group-response.interface';
import { type FamilyGroupFormData } from '@/modules/family-group/interfaces/family-group-form-data.interface';

import { createFamilyGroup } from '@/modules/family-group/services/family-group.service';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';

interface Options {
  familyGroupCreationForm: UseFormReturn<FamilyGroupFormData, any, FamilyGroupFormData>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useFamilyGroupCreationMutation = ({
  familyGroupCreationForm,
  setIsInputDisabled,
  setIsSubmitButtonDisabled,
}: Options): UseMutationResult<
  FamilyGroupResponse,
  ErrorResponse,
  FamilyGroupFormData,
  unknown
> => {
  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Watchers
  const theirZone = familyGroupCreationForm.watch('theirZone');

  //* QueryClient
  const queryClient = useQueryClient();

  //* Mutation
  const mutation = useMutation({
    mutationFn: createFamilyGroup,
    onError: (error: ErrorResponse) => {
      if (error.message !== 'Unauthorized') {
        toast.error(error.message, {
          position: 'top-center',
          className: 'justify-center',
        });

        setTimeout(() => {
          setIsInputDisabled(false);
          setIsSubmitButtonDisabled(false);
        }, 1500);
      }

      if (error.message === 'Unauthorized') {
        toast.error('Operación rechazada, el token expiro ingresa nuevamente.', {
          position: 'top-center',
          className: 'justify-center',
        });

        setTimeout(() => {
          navigate('/');
        }, 3500);
      }
    },
    onSuccess: () => {
      toast.success('Registro creado exitosamente.', {
        position: 'top-center',
        className: 'justify-center',
      });

      setTimeout(() => {
        navigate('/family-groups');
      }, 1600);

      // New refetch in exchange preachers (new)
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['preachers-by-zone', theirZone] });
      }, 1700);

      setTimeout(() => {
        familyGroupCreationForm.reset();
      }, 1700);
    },
  });

  return mutation;
};
