/* eslint-disable @typescript-eslint/no-floating-promises */

import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import {
  inactivateOfferingIncome,
  type InactivateOfferingIncomeOptions,
} from '@/modules/offering/income/services/offering-income.service';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';

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
  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* QueryClient
  const queryClient = useQueryClient();

  //* Mutation
  const mutation = useMutation({
    mutationFn: inactivateOfferingIncome,
    onError: (error: ErrorResponse) => {
      if (error.message !== 'Unauthorized') {
        toast.error(error.message, {
          position: 'top-center',
          className: 'justify-center',
        });

        setTimeout(() => {
          setIsCardOpen(true);
          setIsButtonDisabled(false);
          setIsSelectInputDisabled(false);
          setIsTextAreaDisabled(false);
        }, 2000);
      }

      if (error.message === 'Unauthorized') {
        toast.error('Operación rechazada, el token expiro ingresa nuevamente.', {
          position: 'top-center',
          className: 'justify-center',
        });

        setTimeout(() => {
          navigate('/');
        }, 3500);
      }
    },
    onSuccess: () => {
      toast.success('Registro eliminado correctamente.', {
        position: 'top-center',
        className: 'justify-center',
      });

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
  });

  return mutation;
};
