import { type UseFormReturn } from 'react-hook-form';
import { type UseMutationResult } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import { createCopastor } from '@/modules/copastor/services/copastor.service';
import { type CopastorFormData, type CopastorResponse } from '@/modules/copastor/types';

interface Options {
  copastorCreationForm: UseFormReturn<CopastorFormData, any, CopastorFormData | undefined>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useCopastorCreationMutation = ({
  copastorCreationForm,
  setIsInputDisabled,
}: Options): UseMutationResult<CopastorResponse, ErrorResponse, CopastorFormData, unknown> => {
  return useMutationWrapper({
    mutationFn: createCopastor,
    messages: { success: 'Registro creado exitosamente.' },
    redirectPath: '/copastors',
    successDelay: 1600,
    callbacks: {
      onSuccessCallback: () => {
        setTimeout(() => {
          copastorCreationForm.reset();
        }, 1700);
      },
      onErrorCallback: () => {
        setIsInputDisabled(false);
      },
    },
  });
};
