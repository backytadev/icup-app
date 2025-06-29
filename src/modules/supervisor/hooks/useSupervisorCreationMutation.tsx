import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { type UseFormReturn } from 'react-hook-form';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';

import { createSupervisor } from '@/modules/supervisor/services/supervisor.service';
import { type SupervisorResponse } from '@/modules/supervisor/interfaces/supervisor-response.interface';
import { type SupervisorFormData } from '@/modules/supervisor/interfaces/supervisor-form-data.interface';

interface Options {
  supervisorCreationForm: UseFormReturn<SupervisorFormData, any, SupervisorFormData>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useSupervisorCreationMutation = ({
  supervisorCreationForm,
  setIsInputDisabled,
  setIsSubmitButtonDisabled,
}: Options): UseMutationResult<SupervisorResponse, ErrorResponse, SupervisorFormData, unknown> => {
  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Mutation
  const mutation = useMutation({
    mutationFn: createSupervisor,
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
        navigate('/supervisors');
      }, 1600);

      setTimeout(() => {
        supervisorCreationForm.reset();
      }, 1700);
    },
  });

  return mutation;
};
