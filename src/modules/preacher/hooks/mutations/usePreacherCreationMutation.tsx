import { type UseFormReturn } from 'react-hook-form';
import { type UseMutationResult } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import { createPreacher } from '@/modules/preacher/services/preacher.service';
import { type PreacherFormData, type PreacherResponse } from '@/modules/preacher/types';

interface Options {
  preacherCreationForm: UseFormReturn<PreacherFormData, any, PreacherFormData | undefined>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const usePreacherCreationMutation = ({
  preacherCreationForm,
  setIsInputDisabled,
}: Options): UseMutationResult<PreacherResponse, ErrorResponse, PreacherFormData, unknown> => {
  return useMutationWrapper({
    mutationFn: createPreacher,
    messages: { success: 'Registro creado exitosamente.' },
    redirectPath: '/preachers',
    successDelay: 1600,
    callbacks: {
      onSuccessCallback: () => {
        setTimeout(() => {
          preacherCreationForm.reset();
        }, 1700);
      },
      onErrorCallback: () => {
        setIsInputDisabled(false);
      },
    },
  });
};
