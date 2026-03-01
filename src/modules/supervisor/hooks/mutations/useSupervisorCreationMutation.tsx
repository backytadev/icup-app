import { type UseFormReturn } from 'react-hook-form';
import { type UseMutationResult } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import { createSupervisor } from '@/modules/supervisor/services/supervisor.service';
import { type SupervisorFormData, type SupervisorResponse } from '@/modules/supervisor/types';

interface Options {
  supervisorCreationForm: UseFormReturn<SupervisorFormData, any, SupervisorFormData | undefined>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useSupervisorCreationMutation = ({
  supervisorCreationForm,
  setIsInputDisabled,
}: Options): UseMutationResult<SupervisorResponse, ErrorResponse, SupervisorFormData, unknown> => {
  return useMutationWrapper({
    mutationFn: createSupervisor,
    messages: { success: 'Registro creado exitosamente.' },
    redirectPath: '/supervisors',
    successDelay: 1600,
    callbacks: {
      onSuccessCallback: () => {
        setTimeout(() => {
          supervisorCreationForm.reset();
        }, 1700);
      },
      onErrorCallback: () => {
        setIsInputDisabled(false);
      },
    },
  });
};
