import { type UseMutationResult } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useUpdateMutation } from '@/shared/hooks';

import { type ChurchResponse } from '@/modules/church/types';
import { updateChurch, type UpdateChurchOptions } from '@/modules/church/services/church.service';

interface Options {
  dialogClose: () => void;
  scrollToTop: () => void;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useChurchUpdateMutation = ({
  dialogClose,
  scrollToTop,
  setIsInputDisabled,
  setIsSubmitButtonDisabled,
}: Options): UseMutationResult<ChurchResponse, ErrorResponse, UpdateChurchOptions, unknown> => {
  return useUpdateMutation({
    mutationFn: updateChurch,
    invalidateQueries: [['churches-by-term']],
    onSuccess: () => {
      scrollToTop();
      setTimeout(() => {
        dialogClose();
        setIsInputDisabled(false);
      }, 800);
    },
    onError: () => {
      setIsInputDisabled(false);
      setIsSubmitButtonDisabled(false);
    },
  });
};
