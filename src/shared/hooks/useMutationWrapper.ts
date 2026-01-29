import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
  type QueryKey,
} from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';

/* ================================ */
/*       Types & Interfaces         */
/* ================================ */

interface MutationCallbacks<TData> {
  onSuccessCallback?: (data: TData) => void;
  onErrorCallback?: () => void;
}

interface MutationMessages {
  success: string;
  error?: string;
}

interface MutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  messages: MutationMessages;
  redirectPath?: string;
  invalidateQueries?: QueryKey[];
  callbacks?: MutationCallbacks<TData>;
  successDelay?: number;
  errorDelay?: number;
}

/* ================================ */
/*       Mutation Wrapper Hook      */
/* ================================ */

export function useMutationWrapper<TData, TVariables>({
  mutationFn,
  messages,
  redirectPath,
  invalidateQueries = [],
  callbacks,
  successDelay = 1500,
  errorDelay = 1500,
}: MutationOptions<TData, TVariables>): UseMutationResult<
  TData,
  ErrorResponse,
  TVariables,
  unknown
> {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onError: (error: ErrorResponse) => {
      if (error.message !== 'Unauthorized') {
        toast.error(messages.error ?? error.message, {
          position: 'top-center',
          className: 'justify-center',
        });

        if (callbacks?.onErrorCallback) {
          setTimeout(() => {
            callbacks.onErrorCallback?.();
          }, errorDelay);
        }
      }

      if (error.message === 'Unauthorized') {
        toast.error('Operación rechazada, el token expiró ingresa nuevamente.', {
          position: 'top-center',
          className: 'justify-center',
        });

        setTimeout(() => {
          navigate('/');
        }, 3500);
      }
    },
    onSuccess: (data: TData) => {
      toast.success(messages.success, {
        position: 'top-center',
        className: 'justify-center',
      });

      // Invalidate queries if specified
      if (invalidateQueries.length > 0) {
        setTimeout(() => {
          invalidateQueries.forEach((queryKey) => {
            queryClient.invalidateQueries({ queryKey });
          });
        }, 700);
      }

      // Execute success callback
      if (callbacks?.onSuccessCallback) {
        setTimeout(() => {
          callbacks.onSuccessCallback?.(data);
        }, successDelay);
      }

      // Navigate if redirect path is specified
      if (redirectPath) {
        setTimeout(() => {
          navigate(redirectPath);
        }, successDelay);
      }
    },
  });
}

/* ================================ */
/*    Pre-configured Mutations      */
/* ================================ */

interface CreateMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  successMessage?: string;
  redirectPath: string;
  onSuccess?: () => void;
  onError?: () => void;
}

export function useCreateMutation<TData, TVariables>({
  mutationFn,
  successMessage = 'Registro creado exitosamente.',
  redirectPath,
  onSuccess,
  onError,
}: CreateMutationOptions<TData, TVariables>): UseMutationResult<
  TData,
  ErrorResponse,
  TVariables,
  unknown
> {
  return useMutationWrapper({
    mutationFn,
    messages: { success: successMessage },
    redirectPath,
    successDelay: 1600,
    callbacks: {
      onSuccessCallback: onSuccess,
      onErrorCallback: onError,
    },
  });
}

interface UpdateMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  successMessage?: string;
  invalidateQueries: QueryKey[];
  onSuccess?: () => void;
  onError?: () => void;
}

export function useUpdateMutation<TData, TVariables>({
  mutationFn,
  successMessage = 'Cambios guardados correctamente.',
  invalidateQueries,
  onSuccess,
  onError,
}: UpdateMutationOptions<TData, TVariables>): UseMutationResult<
  TData,
  ErrorResponse,
  TVariables,
  unknown
> {
  return useMutationWrapper({
    mutationFn,
    messages: { success: successMessage },
    invalidateQueries,
    successDelay: 1500,
    errorDelay: 1500,
    callbacks: {
      onSuccessCallback: onSuccess,
      onErrorCallback: onError,
    },
  });
}

interface InactivateMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  successMessage?: string;
  invalidateQueries: QueryKey[];
  onSuccess?: () => void;
  onError?: () => void;
}

export function useInactivateMutation<TData, TVariables>({
  mutationFn,
  successMessage = 'Registro eliminado correctamente.',
  invalidateQueries,
  onSuccess,
  onError,
}: InactivateMutationOptions<TData, TVariables>): UseMutationResult<
  TData,
  ErrorResponse,
  TVariables,
  unknown
> {
  return useMutationWrapper({
    mutationFn,
    messages: { success: successMessage },
    invalidateQueries,
    successDelay: 2000,
    errorDelay: 2000,
    callbacks: {
      onSuccessCallback: onSuccess,
      onErrorCallback: onError,
    },
  });
}
