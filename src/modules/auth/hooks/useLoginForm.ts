import { useEffect, useState, useCallback } from 'react';

import { type z } from 'zod';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuthStore } from '@/stores/auth/auth.store';
import { loginSchema } from '@/modules/auth/validations/login-schema';

type LoginFormData = z.infer<typeof loginSchema>;

interface UseLoginFormReturn {
  form: UseFormReturn<LoginFormData>;
  isInputDisabled: boolean;
  isRateLimited: boolean;
  countdown: number;
  handleSubmit: (values: LoginFormData) => Promise<void>;
  handleInputClick: () => void;
}

export const useLoginForm = (): UseLoginFormReturn => {
  const loginUser = useAuthStore((state) => state.loginUser);
  const navigate = useNavigate();

  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [statusCode, setStatusCode] = useState(401);
  const [countdown, setCountdown] = useState(60);

  const form = useForm<LoginFormData>({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Rate limiting countdown effect
  useEffect(() => {
    if (statusCode === 429) {
      setIsInputDisabled(true);

      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        setCountdown(60);
        setIsInputDisabled(false);
        setStatusCode(401);
        toast.success('Límite de tiempo completado. Ya puede volver a intentarlo.', {
          position: 'top-right',
        });
      }, 60000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [statusCode]);

  const handleSubmit = useCallback(
    async (values: LoginFormData): Promise<void> => {
      try {
        await loginUser(values.email, values.password, values.email);
        navigate('/dashboard');
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error?.response?.status === 401) {
            toast.error(error?.response?.data?.message, {
              position: 'top-right',
            });

            setTimeout(() => {
              if (Object.keys(form.formState.errors).length === 0) {
                setIsInputDisabled(false);
              }
            }, 1000);
          }

          if (error?.response?.status === 429) {
            toast.warning(error?.response?.data?.message, {
              position: 'top-right',
            });
            setStatusCode(error?.response?.status);
          }

          return;
        }

        throw new Error('No se pudo autenticar.');
      }
    },
    [loginUser, navigate, form.formState.errors]
  );

  const handleInputClick = useCallback(() => {
    setTimeout(() => {
      if (Object.keys(form.formState.errors).length === 0) {
        setIsInputDisabled(true);
      }
    }, 100);
  }, [form.formState.errors]);

  return {
    form,
    isInputDisabled,
    isRateLimited: statusCode === 429,
    countdown,
    handleSubmit,
    handleInputClick,
  };
};
