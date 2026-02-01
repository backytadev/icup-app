import { type UseMutationResult } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useInactivateMutation } from '@/shared/hooks';

import { inactivateMinistry } from '@/modules/ministry/services/ministry.service';

interface Options {
  scrollToTop: () => void;
  setIsCardOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSelectInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

interface InactivateMinistryOptions {
  id: string;
  ministryInactivationCategory: string;
  ministryInactivationReason: string;
}

export const useMinistryInactivationMutation = ({
  scrollToTop,
  setIsCardOpen,
  setIsButtonDisabled,
  setIsSelectInputDisabled,
}: Options): UseMutationResult<void, ErrorResponse, InactivateMinistryOptions, unknown> => {
  return useInactivateMutation({
    mutationFn: inactivateMinistry,
    invalidateQueries: [['ministries-by-term']],
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
