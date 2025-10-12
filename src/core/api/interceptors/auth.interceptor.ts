import { toast } from 'sonner';
import { AxiosError, AxiosInstance } from 'axios';
import { jwtDecode, type JwtPayload } from 'jwt-decode';

import { icupApi } from '@/core/api/icupApi';
import { useAuthStore } from '@/stores/auth/auth.store';

//* Function to check if the token is about to expire
const isTokenExpiringSoon = (token: string) => {
  try {
    const decoded: JwtPayload = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp! - currentTime < 60;
  } catch (error) {
    return false;
  }
};

export const setupAuthInterceptor = (api: AxiosInstance) => {
  let isRefreshing = false;

  //* Interceptors (read zustand storage)
  // Any request that passes through the API executes the interceptor
  icupApi.interceptors.request.use(async (config) => {
    const { token, status, logoutUser } = useAuthStore.getState();

    if (status !== 'authorized' || !token) {
      return config;
    }

    if (isTokenExpiringSoon(token)) {
      if (isRefreshing) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const { token: newToken } = useAuthStore.getState();
        config.headers.Authorization = `Bearer ${newToken}`;
        return config;
      }

      isRefreshing = true;

      try {
        const { data } = await api.get<{ accessToken: string }>(
          `${import.meta.env.VITE_API_URL}/auth/renew-token`,
          {
            withCredentials: true,
          }
        );

        if (data.accessToken) {
          useAuthStore.getState().setAccessToken(data);
          config.headers.Authorization = `Bearer ${data.accessToken}`;
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message ?? 'Sesión expirada', {
            position: 'top-center',
            className: 'justify-center',
          });
          setTimeout(() => logoutUser(), 1000);
        }
      } finally {
        setTimeout(() => {
          isRefreshing = false;
        }, 500);
      }
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
};
