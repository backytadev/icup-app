import { type UseMutationResult } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useInactivateMutation } from '@/shared/hooks';

import {
  inactivateOfferingIncome,
  type InactivateOfferingIncomeOptions,
} from '@/modules/offering/income/services/offering-income.service';

interface Options {
  dialogClose: () => void;
  scrollToTop: () => void;
  setIsButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useOfferingIncomeCurrencyExchangeMutation = ({
  dialogClose,
  scrollToTop,
  setIsButtonDisabled,
  setIsInputDisabled,
}: Options): UseMutationResult<void, ErrorResponse, InactivateOfferingIncomeOptions, unknown> => {
  return useInactivateMutation({
    mutationFn: inactivateOfferingIncome,
    invalidateQueries: [['offering-income-by-term']],
    onSuccess: () => {
      setTimeout(() => {
        scrollToTop();
      }, 150);

      setTimeout(() => {
        dialogClose();
        setIsInputDisabled(false);
      }, 1200);
    },
    onError: () => {
      setTimeout(() => {
        setIsInputDisabled(false);
        setIsButtonDisabled(false);
      }, 2000);
    },
  });
};
