/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import type * as z from 'zod';
import { Toaster } from 'sonner';
import { cn } from '@/shared/lib/utils';
import { useForm } from 'react-hook-form';

import { FaEyeSlash, FaEye } from 'react-icons/fa';

import { zodResolver } from '@hookform/resolvers/zod';

import { userFormSchema } from '@/modules/user/validations/user-form-schema';
import { UserRole, UserRoleNames } from '@/modules/user/enums/user-role.enum';

import { useUserCreationMutation } from '@/modules/user/hooks/useUserCreationMutation';
import { useUserCreationSubmitButtonLogic } from '@/modules/user/hooks/useUserCreationSubmitButtonLogic';

import { GenderNames } from '@/shared/enums/gender.enum';
import { PageTitle } from '@/shared/components/page-header/PageTitle';
import { PageSubTitle } from '@/shared/components/page-header/PageSubTitle';

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/shared/components/ui/form';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';

export const UserCreatePage = (): JSX.Element => {
  //* States
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);

  const [isMessageErrorRolesDisabled, setIsMessageErrorRolesDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);
  const [isMessageErrorPasswordDisabled, setIsMessageErrorPasswordDisabled] =
    useState<boolean>(true);

  //* Form
  const form = useForm<z.infer<typeof userFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstNames: '',
      lastNames: '',
      gender: '',
      email: '',
      password: '',
      passwordConfirm: '',
      roles: [],
    },
  });

  //* Password handler
  const toggleShowPassword = (): void => {
    setShowPassword(!showPassword);
  };

  const toggleShowPasswordConfirm = (): void => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  //* Effects
  useEffect(() => {
    document.title = 'Modulo Usuario - IcupApp';
  }, []);

  //* Custom hooks
  useUserCreationSubmitButtonLogic({
    userCreationForm: form,
    setIsSubmitButtonDisabled,
    setIsMessageErrorDisabled,
    setIsMessageErrorPasswordDisabled,
    setIsMessageErrorRolesDisabled,
    isInputDisabled,
  });

  const userCreationMutation = useUserCreationMutation({
    userCreationForm: form,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof userFormSchema>): void => {
    userCreationMutation.mutate({
      firstNames: formData.firstNames,
      lastNames: formData.lastNames,
      gender: formData.gender,
      email: formData.email,
      password: formData.password,
      roles: formData.roles,
    });
  };

  return (
    <div className='animate-fadeInPage'>
      <PageTitle className='text-user-color'>Modulo Usuario</PageTitle>

      <PageSubTitle
        subTitle='Crear un nuevo usuario'
        description='Por favor llena los siguientes datos para crear un nuevo usuario.'
      />

      <div className='flex min-h-full flex-col items-center justify-between px-6 py-4 sm:px-10 sm:py-6 2xl:px-36 2xl:py-10'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='max-w-md w-full flex flex-col gap-4'
          >
            <FormField
              control={form.control}
              name='firstNames'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                      Nombres
                    </FormLabel>
                    <FormControl className='text-[14px] md:text-[14px]'>
                      <Input
                        disabled={isInputDisabled}
                        placeholder='Nombres del usuario'
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-[13px]' />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name='lastNames'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                      Apellidos
                    </FormLabel>
                    <FormControl className='text-[14px] md:text-[14px]'>
                      <Input
                        disabled={isInputDisabled}
                        placeholder='Apellidos del usuario'
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-[13px]' />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name='gender'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Género</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isInputDisabled}
                    >
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <SelectTrigger>
                          {field.value ? (
                            <SelectValue placeholder='Selecciona el tipo de género' />
                          ) : (
                            'Selecciona el tipo de género'
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(GenderNames).map(([key, value]) => (
                          <SelectItem className={`text-[14px]`} key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className='text-[13px]' />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                      Correo Electrónico
                    </FormLabel>
                    <FormControl className='text-[14px] md:text-[14px]'>
                      <Input
                        disabled={isInputDisabled}
                        placeholder='Dirección de correo electrónico'
                        type='email'
                        autoComplete='username'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-[13px]' />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                      Contraseña
                    </FormLabel>
                    <FormControl className='text-[14px] md:text-[14px]'>
                      <div className='relative'>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Contraseña'
                          autoComplete='new-password'
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                        />
                        <button
                          className='absolute right-2 top-3 z-10'
                          type='button'
                          onClick={toggleShowPassword}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
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
              name='passwordConfirm'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                      Confirmar Contraseña
                    </FormLabel>
                    <FormControl className='text-[14px] md:text-[14px]'>
                      <div className='relative'>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Confirmar contraseña'
                          autoComplete='new-password'
                          type={showPasswordConfirm ? 'text' : 'password'}
                          {...field}
                        />
                        <button
                          className='absolute right-2 top-3 z-10'
                          type='button'
                          onClick={toggleShowPasswordConfirm}
                        >
                          {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className='text-[13px]' />

                    {(form.formState.errors.password || form.formState.errors.passwordConfirm) && (
                      <div className='text-red-500 font-medium text-[13.5px] md:text-[13.5px]'>
                        <ul className='pl-2'>
                          <li className='pl-2'>✅ Al menos un dígito.</li>
                          <li className='pl-2'>✅ No espacios en blanco.</li>
                          <li className='pl-2'>✅ Al menos 1 carácter especial.</li>
                          <li className='pl-2'>✅ Mínimo 8 caracteres y máximo 15 caracteres.</li>
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

            <FormField
              control={form.control}
              name='roles'
              render={() => (
                <FormItem>
                  <div className='mb-4'>
                    <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Roles</FormLabel>
                    <FormDescription className='text-[13.5px] md:text-[14px]'>
                      Seleccione los roles de acceso que tendrá el usuario.
                    </FormDescription>
                  </div>
                  {Object.values(UserRole).map((role) => (
                    <FormField
                      key={role}
                      control={form.control}
                      name='roles'
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={role}
                            className='flex flex-row items-center space-x-2 space-y-0'
                          >
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Checkbox
                                disabled={isInputDisabled}
                                checked={field.value?.includes(role)}
                                onCheckedChange={(checked) => {
                                  let updatedRoles: UserRole[] = [];
                                  checked
                                    ? (updatedRoles = field.value ? [...field.value, role] : [role])
                                    : (updatedRoles =
                                        field.value?.filter((value) => value !== role) ?? []);

                                  field.onChange(updatedRoles);
                                }}
                              />
                            </FormControl>
                            <FormLabel className='text-[14px] font-medium cursor-pointer'>
                              {UserRoleNames[role]}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />
            {isMessageErrorDisabled ? (
              <p className='-mb-4 md:-mb-3 md:row-start-4 md:row-end-5 md:col-start-1 md:col-end-3 mx-auto md:w-[100%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                ❌ Datos incompletos, completa todos los campos para crear el registro.
              </p>
            ) : isMessageErrorPasswordDisabled ? (
              <p className='-mb-4 md:-mb-3 md:row-start-4 md:row-end-5 md:col-start-1 md:col-end-3 mx-auto md:w-[100%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                ❌ Las contraseñas deben coincidir.
              </p>
            ) : isMessageErrorRolesDisabled ? (
              <p className='-mb-4 md:-mb-3 md:row-start-4 md:row-end-5 md:col-start-1 md:col-end-3 mx-auto md:w-[100%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                ❌ Debes elegir al menos un rol para el usuario.
              </p>
            ) : (
              <p className='-mt-3 order-last md:-mt-3 md:row-start-5 md:row-end-6 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                ¡Campos completados correctamente! <br />
              </p>
            )}

            <div className='mt-2 col-start-1 col-end-3 row-start-2 row-end-3 w-full md:w-[20rem] md:m-auto'>
              <Toaster position='top-center' richColors />
              <Button
                disabled={isSubmitButtonDisabled}
                type='submit'
                className={cn('w-full text-[14px]')}
                onClick={() => {
                  setTimeout(() => {
                    if (Object.keys(form.formState.errors).length === 0) {
                      setIsSubmitButtonDisabled(true);
                      setIsInputDisabled(true);
                    }
                  }, 100);
                }}
              >
                Registrar Usuario
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UserCreatePage;
