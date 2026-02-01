import { type UseMutationResult } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useUpdateMutation } from '@/shared/hooks';

import { type MinistryResponse } from '@/modules/ministry/types';
import {
  updateMinistry,
  type UpdateMinistryOptions,
} from '@/modules/ministry/services/ministry.service';

interface Options {
  dialogClose: () => void;
  scrollToTop: () => void;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useMinistryUpdateMutation = ({
  dialogClose,
  scrollToTop,
  setIsInputDisabled,
}: Options): UseMutationResult<MinistryResponse, ErrorResponse, UpdateMinistryOptions, unknown> => {
  return useUpdateMutation({
    mutationFn: updateMinistry,
    invalidateQueries: [['ministries-by-term']],
    onSuccess: () => {
      scrollToTop();
      setTimeout(() => {
        dialogClose();
      }, 800);
    },
    onError: () => {
      setIsInputDisabled(false);
    },
  });
};
