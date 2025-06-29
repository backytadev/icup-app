import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { type UseFormReturn } from 'react-hook-form';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';

import { createPastor } from '@/modules/pastor/services/pastor.service';
import { type PastorResponse } from '@/modules/pastor/interfaces/pastor-response.interface';
import { type PastorFormData } from '@/modules/pastor/interfaces/pastor-form-data.interface';

interface Options {
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  pastorCreationForm: UseFormReturn<PastorFormData, any, PastorFormData>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const usePastorCreationMutation = ({
  pastorCreationForm,
  setIsInputDisabled,
  setIsSubmitButtonDisabled,
}: Options): UseMutationResult<PastorResponse, ErrorResponse, PastorFormData, unknown> => {
  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Mutation
  const mutation = useMutation({
    mutationFn: createPastor,
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
        navigate('/pastors');
      }, 1600);

      setTimeout(() => {
        pastorCreationForm.reset();
      }, 1700);
    },
  });

  return mutation;
};
