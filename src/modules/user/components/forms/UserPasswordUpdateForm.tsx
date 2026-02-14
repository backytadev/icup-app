/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import { type z } from 'zod';

import { useForm } from 'react-hook-form';

import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { zodResolver } from '@hookform/resolvers/zod';

import { usePasswordUpdateMutation } from '@/modules/user/hooks/mutations/usePasswordUpdateMutation';

import { userUpdatePasswordFormSchema } from '@/modules/user/schemas/user-password-update-form-schema';

import { cn } from '@/shared/lib/utils';

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

interface UserPasswordUpdateFormProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
}

export const UserPasswordUpdateForm = ({
  id,
  dialogClose,
  scrollToTop,
}: UserPasswordUpdateFormProps): JSX.Element => {
  //* States
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState<boolean>(false);

  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);

  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);
  const [isMessageErrorPasswordDisabled, setIsMessageErrorPasswordDisabled] =
    useState<boolean>(true);

  //* Form
  const form = useForm<z.infer<typeof userUpdatePasswordFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(userUpdatePasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
  });

  //* Password Handler
  const toggleShowCurrentPassword = (): void => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleShowNewPassword = (): void => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowNewPasswordConfirm = (): void => {
    setShowNewPasswordConfirm(!showNewPasswordConfirm);
  };

  //* Effects
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/users/update/${id}/edit-password`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);

  //* Watchers
  const currentPassword = form.watch('currentPassword');
  const newPassword = form.watch('newPassword');
  const newPasswordConfirm = form.watch('newPasswordConfirm');

  //* Submit button logic
  useEffect(() => {
    if (form.formState.errors && Object.values(form.formState.errors).length > 0) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (currentPassword && newPassword && newPasswordConfirm && !isInputDisabled) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
      setIsMessageErrorPasswordDisabled(false);
    }

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (newPassword !== newPasswordConfirm) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorPasswordDisabled(true);
    }
  }, [
    form.formState,
    currentPassword,
    newPassword,
    newPasswordConfirm,
    isInputDisabled,
  ]);

  const passwordUpdateMutation = usePasswordUpdateMutation({
    dialogClose,
    scrollToTop,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof userUpdatePasswordFormSchema>): void => {
    passwordUpdateMutation.mutate({
      id,
      formData: {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      },
    });
  };

  return (
    <div className='w-full -mt-2 md:-mt-5'>
      {/* Header */}
      <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 dark:from-purple-700 dark:via-purple-800 dark:to-indigo-800 px-6 py-5'>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-2 mb-1'>
            <span className='px-2.5 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter'>
              Seguridad
            </span>
          </div>
          <h2 className='text-xl md:text-2xl font-bold text-white font-outfit leading-tight'>
            Modificar Contraseña
          </h2>
          <p className='text-purple-100/80 text-[13px] md:text-[14px] font-inter'>
            Actualiza tu contraseña de acceso
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
        <div className='p-5 md:p-6'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='w-full flex flex-col gap-y-5'
            >
              <FormField
                control={form.control}
                name='currentPassword'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                        Contraseña Actual
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            disabled={isInputDisabled}
                            placeholder='Escribe tu contraseña actual...'
                            type={showCurrentPassword ? 'text' : 'password'}
                            className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                            {...field}
                          />
                          <button
                            className='absolute right-2 top-3 z-10 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            type='button'
                            onClick={toggleShowCurrentPassword}
                          >
                            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className='text-[12px] font-inter' />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='newPassword'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                        Contraseña Nueva
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            disabled={isInputDisabled}
                            placeholder='Escribe tu nueva contraseña...'
                            type={showNewPassword ? 'text' : 'password'}
                            autoComplete='new-password'
                            className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                            {...field}
                          />
                          <button
                            className='absolute right-2 top-3 z-10 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            type='button'
                            onClick={toggleShowNewPassword}
                          >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className='text-[12px] font-inter' />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='newPasswordConfirm'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                        Confirmar Contraseña
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            disabled={isInputDisabled}
                            placeholder='Confirma la nueva contraseña...'
                            type={showNewPasswordConfirm ? 'text' : 'password'}
                            autoComplete='new-password'
                            className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                            {...field}
                          />
                          <button
                            className='absolute right-2 top-3 z-10 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            type='button'
                            onClick={toggleShowNewPasswordConfirm}
                          >
                            {showNewPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className='text-[12px] font-inter' />
                    </FormItem>
                  );
                }}
              />

              {/* Validation Messages */}
              <div className='flex flex-col items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800'>
                {!isMessageErrorPasswordDisabled && (
                  <div className='p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 w-full'>
                    <p className='text-amber-600 dark:text-amber-400 font-medium text-[12px] md:text-[13px] text-center font-inter'>
                      ⚠️ Las contraseñas no coinciden
                    </p>
                  </div>
                )}

                {isMessageErrorDisabled ? (
                  <div className='p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 w-full'>
                    <p className='text-red-600 dark:text-red-400 font-medium text-[12px] md:text-[13px] text-center font-inter'>
                      ❌ Datos incompletos, completa todos los campos
                    </p>
                  </div>
                ) : (
                  <div className='p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 w-full'>
                    <p className='text-emerald-600 dark:text-emerald-400 font-medium text-[12px] md:text-[13px] text-center font-inter'>
                      ✓ ¡Campos completados! Puedes guardar los cambios
                    </p>
                  </div>
                )}

                <Button
                  disabled={isSubmitButtonDisabled}
                  type='submit'
                  className={cn(
                    'w-full h-11 text-[13px] md:text-[14px] font-semibold font-inter',
                    'bg-gradient-to-r from-purple-500 to-indigo-500 text-white',
                    'hover:from-purple-600 hover:to-indigo-600',
                    'shadow-sm hover:shadow-md hover:shadow-purple-500/20',
                    'transition-all duration-200',
                    passwordUpdateMutation?.isPending && 'opacity-90 cursor-wait'
                  )}
                >
                  {passwordUpdateMutation?.isPending ? 'Procesando...' : 'Actualizar contraseña'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
