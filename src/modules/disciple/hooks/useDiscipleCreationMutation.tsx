import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { type UseFormReturn } from 'react-hook-form';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';

import { createDisciple } from '@/modules/disciple/services/disciple.service';
import { type DiscipleResponse } from '@/modules/disciple/interfaces/disciple-response.interface';
import { type DiscipleFormData } from '@/modules/disciple/interfaces/disciple-form-data.interface';

interface Options {
  discipleCreationForm: UseFormReturn<DiscipleFormData, any, DiscipleFormData>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useDiscipleCreationMutation = ({
  discipleCreationForm,
  setIsInputDisabled,
  setIsSubmitButtonDisabled,
}: Options): UseMutationResult<DiscipleResponse, ErrorResponse, DiscipleFormData, unknown> => {
  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Mutation
  const mutation = useMutation({
    mutationFn: createDisciple,
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
        navigate('/disciples');
      }, 1600);

      setTimeout(() => {
        discipleCreationForm.reset();
      }, 1700);
    },
  });

  return mutation;
};
