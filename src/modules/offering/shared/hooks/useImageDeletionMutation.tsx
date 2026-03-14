import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import {
  deleteImage,
  type DeleteImageOptions,
} from '@/modules/offering/shared/services/images-files.service';

interface Options {
  setIsCardOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useImageDeletionMutation = ({
  setIsCardOpen,
  setIsButtonDisabled,
}: Options): UseMutationResult<void, ErrorResponse, DeleteImageOptions, unknown> => {
  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* QueryClient
  const queryClient = useQueryClient();

  //* Mutation
  const mutation = useMutation({
    mutationFn: deleteImage,
    onError: (error: ErrorResponse) => {
      if (error.message !== 'Unauthorized') {
        toast.error(error.message, {
          position: 'top-center',
          className: 'justify-center',
        });

        setTimeout(() => {
          setIsCardOpen(false);
          setIsButtonDisabled(false);
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
      toast.success('Imagen eliminada correctamente.', {
        position: 'top-center',
        className: 'justify-center',
      });

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['offering-income-by-term'] });
        queryClient.invalidateQueries({ queryKey: ['offering-expenses-by-term'] });
      }, 1000);
    },
  });

  return mutation;
};
