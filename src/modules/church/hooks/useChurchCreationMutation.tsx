import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { type UseFormReturn } from 'react-hook-form';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';

import { createChurch } from '@/modules/church/services/church.service';
import { type ChurchResponse } from '@/modules/church/interfaces/church-response.interface';
import { type ChurchFormData } from '@/modules/church/interfaces/church-form-data.interface';

interface Options {
  churchCreationForm: UseFormReturn<ChurchFormData, any, ChurchFormData>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useChurchCreationMutation = ({
  churchCreationForm,
  setIsInputDisabled,
  setIsSubmitButtonDisabled,
}: Options): UseMutationResult<ChurchResponse, ErrorResponse, ChurchFormData, unknown> => {
  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Mutation
  const mutation = useMutation({
    mutationFn: createChurch,
    onError: (error: ErrorResponse) => {
      if (error.message !== 'Unauthorized') {
        toast.error(error.message, {
          position: 'top-center',
          className: 'justify-center',
        });

        setTimeout(() => {
          setIsInputDisabled(false);
          setIsSubmitButtonDisabled(false);
        }, 1500);
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
      toast.success('Registro creado exitosamente.', {
        position: 'top-center',
        className: 'justify-center',
      });

      setTimeout(() => {
        navigate('/churches');
      }, 1600);

      setTimeout(() => {
        churchCreationForm.reset();
      }, 1700);
    },
  });

  return mutation;
};
