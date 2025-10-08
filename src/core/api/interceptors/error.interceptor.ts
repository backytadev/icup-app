import { toast } from 'sonner';
import type { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '@/stores/auth/auth.store';

export const setupErrorInterceptor = (api: AxiosInstance) => {
  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<any>) => {
      if (!error.response) {
        toast.error('Error de conexión con el servidor. Intenta nuevamente.', {
          position: 'top-center',
        });
        return Promise.reject(error);
      }

      const { status, data } = error.response;

      switch (status) {
        case 400:
          toast.error(data?.message || 'Solicitud incorrecta');
          break;

        case 401:
          toast.error('Tu sesión ha expirado. Inicia sesión nuevamente.', {
            position: 'top-center',
          });
          useAuthStore.getState().logoutUser();
          break;

        case 403:
          toast.error('No tienes permisos para realizar esta acción.', {
            position: 'top-center',
          });
          break;

        case 404:
          toast.error('El recurso solicitado no fue encontrado.');
          break;

        case 500:
        default:
          toast.error('Error interno del servidor. Intenta más tarde.');
          break;
      }

      return Promise.reject(error);
    }
  );
};
