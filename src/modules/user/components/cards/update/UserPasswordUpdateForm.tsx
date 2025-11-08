/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import { type z } from 'zod';

import { useForm } from 'react-hook-form';

import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { zodResolver } from '@hookform/resolvers/zod';

import { usePasswordUpdateMutation } from '@/modules/user/hooks/usePasswordUpdateMutation';
import { useUserUpdatePasswordSubmitButtonLogic } from '@/modules/user/hooks/useUserUpdatePasswordSubmitButtonLogic';

import { userUpdatePasswordFormSchema } from '@/modules/user/validations/user-password-update-form-schema';

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
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';

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

  //* Custom hooks
  useUserUpdatePasswordSubmitButtonLogic({
    userPasswordUpdateForm: form as any,
    setIsSubmitButtonDisabled,
    setIsMessageErrorDisabled,
    setIsMessageErrorPasswordDisabled,
    isInputDisabled,
  });

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
    <Tabs
      defaultValue='general-info'
      className='w-auto sm:w-[420px] md:w-[480px] lg:w-[440px] xl:w-[530px] -mt-8'
    >
      <h2 className='text-center text-purple-500 font-bold text-[22px] sm:text-[22px] md:text-[26px]'>
        Modificar contraseña
      </h2>

      <TabsContent value='general-info' className='overflow-y-auto'>
        <Card className='w-full'>
          <CardContent className='py-4 px-4'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='w-full flex flex-col gap-x-10 gap-y-3 md:gap-y-5 px-2 sm:px-10'
              >
                <FormField
                  control={form.control}
                  name='currentPassword'
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                          Contraseña Actual
                        </FormLabel>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <div className='relative'>
                            <Input
                              disabled={isInputDisabled}
                              placeholder='Escribe tu contraseña actual...'
                              autoComplete='new-password'
                              type={showCurrentPassword ? 'text' : 'password'}
                              {...field}
                            />
                            <button
                              className='absolute right-2 top-3 z-10'
                              type='button'
                              onClick={toggleShowCurrentPassword}
                            >
                              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className='text-[13px]' />
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
                        <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                          Contraseña Nueva
                        </FormLabel>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <div className='relative'>
                            <Input
                              disabled={isInputDisabled}
                              placeholder='Escribe tu contraseña nueva...'
                              autoComplete='new-password'
                              type={showNewPassword ? 'text' : 'password'}
                              {...field}
                            />
                            <button
                              className='absolute right-2 top-3 z-10'
                              type='button'
                              onClick={toggleShowNewPassword}
                            >
                              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className='text-[13px]' />
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
                        <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                          Confirmar Contraseña Nueva
                        </FormLabel>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <div className='relative'>
                            <Input
                              disabled={isInputDisabled}
                              placeholder='Confirma tu contraseña nueva...'
                              autoComplete='new-password'
                              type={showNewPasswordConfirm ? 'text' : 'password'}
                              {...field}
                            />
                            <button
                              className='absolute right-2 top-3 z-10'
                              type='button'
                              onClick={toggleShowNewPasswordConfirm}
                            >
                              {showNewPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className='text-[13px]' />
                        {(form.formState.errors.newPassword ||
                          form.formState.errors.newPasswordConfirm) && (
                          <div className='text-red-500 font-medium text-[12.5px] md:text-[13px]'>
                            <ul className='pl-2'>
                              <li className='pl-2'>✅ Al menos un dígito.</li>
                              <li className='pl-2'>✅ No espacios en blanco.</li>
                              <li className='pl-2'>✅ Al menos 1 carácter especial.</li>
                              <li className='pl-2'>
                                ✅ Mínimo 8 caracteres y máximo 15 caracteres.
                              </li>
                              <li className='pl-2'>
                                ✅ Al menos una letra mayúscula y al menos una letra minúscula.
                              </li>
                            </ul>
                          </div>
                        )}
                      </FormItem>
                    );
                  }}
                />

                {isMessageErrorDisabled ? (
                  <p className='-mb-2 md:-mb-3 md:row-start-5 md:row-end-6 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                    ❌ Datos incompletos, completa todos los campos para actualizar el registro.
                  </p>
                ) : isMessageErrorPasswordDisabled ? (
                  <p className='-mb-2 md:-mb-3 md:row-start-5 md:row-end-6 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                    ❌ Las contraseñas deben coincidir.
                  </p>
                ) : (
                  <p className='-mt-1 order-last md:-mt-3 md:row-start-6 md:row-end-7 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                    ¡Campos completados correctamente! <br /> Para finalizar por favor guarde los
                    cambios.
                  </p>
                )}

                <div className='w-full mt-1 md:w-[20rem] md:mx-auto col-start-1 col-end-3 text-sm md:text-md xl:text-base'>
                  <Button
                    disabled={isSubmitButtonDisabled}
                    type='submit'
                    className={cn(
                      'w-full text-[14px]',
                      passwordUpdateMutation?.isPending &&
                        'bg-emerald-500 disabled:opacity-100 disabled:md:text-[15px] text-white'
                    )}
                    onClick={() => {
                      setTimeout(() => {
                        if (Object.keys(form.formState.errors).length === 0) {
                          setIsSubmitButtonDisabled(true);
                          setIsInputDisabled(true);
                        }
                      }, 100);
                    }}
                  >
                    {passwordUpdateMutation?.isPending ? 'Procesando...' : 'Guardar cambios'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
