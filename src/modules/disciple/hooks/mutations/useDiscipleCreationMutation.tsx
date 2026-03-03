import { type UseFormReturn } from 'react-hook-form';
import { type UseMutationResult } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import { createDisciple } from '@/modules/disciple/services/disciple.service';
import { type DiscipleFormData, type DiscipleResponse } from '@/modules/disciple/types';

interface Options {
  discipleCreationForm: UseFormReturn<DiscipleFormData, any, DiscipleFormData | undefined>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useDiscipleCreationMutation = ({
  discipleCreationForm,
  setIsInputDisabled,
}: Options): UseMutationResult<DiscipleResponse, ErrorResponse, DiscipleFormData, unknown> => {
  return useMutationWrapper({
    mutationFn: createDisciple,
    messages: { success: 'Registro creado exitosamente.' },
    redirectPath: '/disciples',
    successDelay: 1600,
    callbacks: {
      onSuccessCallback: () => {
        setTimeout(() => {
          discipleCreationForm.reset();
        }, 1700);
      },
      onErrorCallback: () => {
        setIsInputDisabled(false);
      },
    },
  });
};
