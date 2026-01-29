import { type UseMutationResult } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useInactivateMutation } from '@/shared/hooks';

import {
  inactivateChurch,
  type InactivateChurchOptions,
} from '@/modules/church/services/church.service';

interface Options {
  scrollToTop: () => void;
  setIsCardOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSelectInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useChurchInactivationMutation = ({
  scrollToTop,
  setIsCardOpen,
  setIsButtonDisabled,
  setIsSelectInputDisabled,
}: Options): UseMutationResult<void, ErrorResponse, InactivateChurchOptions, unknown> => {
  return useInactivateMutation({
    mutationFn: inactivateChurch,
    invalidateQueries: [['churches-by-term']],
    onSuccess: () => {
      scrollToTop();
      setTimeout(() => {
        setIsCardOpen(false);
      }, 500);
      setTimeout(() => {
        setIsButtonDisabled(false);
        setIsSelectInputDisabled(false);
      }, 600);
    },
    onError: () => {
      setIsCardOpen(true);
      setIsButtonDisabled(false);
      setIsSelectInputDisabled(false);
    },
  });
};
