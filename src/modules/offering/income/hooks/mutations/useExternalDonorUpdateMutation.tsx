import { type UseMutationResult } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useUpdateMutation } from '@/shared/hooks';

import {
  updateExternalDonor,
  type UpdateExternalDonorOptions,
} from '@/modules/offering/income/services/offering-income.service';

import { type ExternalDonorResponse } from '@/modules/offering/income/interfaces/external-donor-response.interface';

interface Options {
  dialogClose: () => void;
  scrollToTop: () => void;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useExternalDonorUpdateMutation = ({
  dialogClose,
  scrollToTop,
  setIsInputDisabled,
  setIsSubmitButtonDisabled,
}: Options): UseMutationResult<
  ExternalDonorResponse,
  ErrorResponse,
  UpdateExternalDonorOptions,
  unknown
> => {
  return useUpdateMutation({
    mutationFn: updateExternalDonor,
    invalidateQueries: [['external-donors']],
    onSuccess: () => {
      setIsSubmitButtonDisabled(true);

      setTimeout(() => {
        scrollToTop();
      }, 150);

      setTimeout(() => {
        dialogClose();
        setIsInputDisabled(false);
      }, 1500);
    },
    onError: () => {
      setTimeout(() => {
        setIsInputDisabled(false);
        setIsSubmitButtonDisabled(false);
      }, 1500);
    },
  });
};
