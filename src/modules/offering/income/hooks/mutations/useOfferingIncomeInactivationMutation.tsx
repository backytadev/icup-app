import { type UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useInactivateMutation } from '@/shared/hooks';

import {
  inactivateOfferingIncome,
  type InactivateOfferingIncomeOptions,
} from '@/modules/offering/income/services/offering-income.service';

interface Options {
  scrollToTop: () => void;
  setIsCardOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSelectInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTextAreaDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useOfferingIncomeInactivationMutation = ({
  scrollToTop,
  setIsCardOpen,
  setIsSelectInputDisabled,
  setIsTextAreaDisabled,
  setIsButtonDisabled,
}: Options): UseMutationResult<void, ErrorResponse, InactivateOfferingIncomeOptions, unknown> => {
  const queryClient = useQueryClient();

  return useInactivateMutation({
    mutationFn: inactivateOfferingIncome,
    invalidateQueries: [['offering-income-by-term']],
    onSuccess: () => {
      setTimeout(() => {
        scrollToTop();
      }, 150);

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['offering-income-by-term'] });
      }, 1000);

      setTimeout(() => {
        setIsCardOpen(false);
      }, 2000);

      setTimeout(() => {
        setIsButtonDisabled(false);
        setIsSelectInputDisabled(false);
        setIsTextAreaDisabled(false);
      }, 2100);
    },
    onError: () => {
      setTimeout(() => {
        setIsCardOpen(true);
        setIsButtonDisabled(false);
        setIsSelectInputDisabled(false);
        setIsTextAreaDisabled(false);
      }, 2000);
    },
  });
};
