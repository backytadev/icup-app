import { isAxiosError } from 'axios';
import { icupApi } from '@/core/api/icupApi';

export const apiRequest = async <T>(
  method: 'get' | 'post' | 'patch' | 'delete',
  url: string,
  options?: any
): Promise<T> => {
  try {
    const { data } = await icupApi[method]<T>(url, options);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) throw error.response.data;
    throw new Error('Ocurrió un error inesperado, hable con el administrador');
  }
};
