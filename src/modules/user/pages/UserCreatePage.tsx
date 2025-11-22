/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import type * as z from 'zod';
import { toast, Toaster } from 'sonner';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

import { CheckIcon } from 'lucide-react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { CaretSortIcon } from '@radix-ui/react-icons';

import { zodResolver } from '@hookform/resolvers/zod';

import { getSimpleChurches } from '@/modules/church/services/church.service';
import { getSimpleMinistries } from '@/modules/ministry/services/ministry.service';

import { userFormSchema } from '@/modules/user/validations/user-form-schema';
import { UserRole, UserRoleNames } from '@/modules/user/enums/user-role.enum';
import { MinistryType, MinistryTypeNames } from '@/modules/ministry/enums/ministry-type.enum';

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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/shared/components/ui/command';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

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
  const [isInputTheirChurchesOpen, setIsInputTheirChurchesOpen] = useState<boolean>(false);
  const [isInputTheirMinistriesOpen, setIsInputTheirMinistriesOpen] = useState<boolean>(false);

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
      churches: [],
      ministries: [],
    },
  });

  //* Watchers
  const roles = form.watch('roles');

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

  useEffect(() => {
    if (!roles) return;

    form.setValue('churches', []);
    form.setValue('ministries', []);
  }, [roles]);

  //* Custom hooks
  useUserCreationSubmitButtonLogic({
    userCreationForm: form as any,
    setIsSubmitButtonDisabled,
    setIsMessageErrorDisabled,
    setIsMessageErrorPasswordDisabled,
    setIsMessageErrorRolesDisabled,
    isInputDisabled,
  });

  const userCreationMutation = useUserCreationMutation({
    userCreationForm: form as any,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  //* Queries
  const queryChurches = useQuery({
    queryKey: ['churches'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

  const queryMinistries = useQuery({
    queryKey: ['ministries'],
    queryFn: () => getSimpleMinistries({ isSimpleQuery: true }),
    retry: false,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof userFormSchema>): void => {
    setIsSubmitButtonDisabled(true);
    setIsInputDisabled(true);

    const hasMinistryUser = formData.roles.includes(UserRole.MinistryUser);

    const hasOtherRoles = formData.roles.some((role) =>
      [UserRole.AdminUser, UserRole.SuperUser, UserRole.TreasurerUser, UserRole.User].includes(role)
    );

    if (hasMinistryUser && hasOtherRoles) {
      toast.error(
        'El rol de Ministerio no puede combinarse con roles de Administrador o Superusuario.',
        {
          position: 'top-center',
          className: 'justify-center text-center font-semibold',
        }
      );

      setIsSubmitButtonDisabled(false);
      setIsInputDisabled(false);

      return;
    }

    userCreationMutation.mutate({
      firstNames: formData.firstNames,
      lastNames: formData.lastNames,
      gender: formData.gender,
      userName: formData.userName,
      email: formData.email,
      password: formData.password,
      roles: formData.roles,
      churches: formData.churches ?? [],
      ministries: formData.ministries ?? [],
    });
  };

  return (
    <div className='animate-fadeInPage'>
      <PageTitle className='text-user-color'>Modulo Usuario</PageTitle>
      <PageSubTitle
        subTitle='Crear un nuevo usuario'
        description='Por favor llena los siguientes datos para crear un nuevo usuario.'
      />

      <div className='flex min-h-full flex-col items-center justify-between px-6 py-4 sm:px-24 sm:py-6 2xl:px-64 2xl:py-10'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'
          >
            <FormField
              control={form.control}
              name='firstNames'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Nombres</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isInputDisabled}
                      placeholder='Nombres del usuario'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='lastNames'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                    Apellidos
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isInputDisabled}
                      placeholder='Apellidos del usuario'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='gender'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Género</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isInputDisabled}
                  >
                    <FormControl>
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
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                    Correo Electrónico
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isInputDisabled}
                      placeholder='Dirección de correo electrónico'
                      type='email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='userName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Usuario</FormLabel>
                  <FormControl>
                    <Input disabled={isInputDisabled} placeholder='Nombre de usuario' {...field} />
                  </FormControl>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                    Contraseña
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        disabled={isInputDisabled}
                        placeholder='Contraseña'
                        autoComplete='new-password'
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                      />
                      <button
                        className='absolute right-2 top-3'
                        type='button'
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='passwordConfirm'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                    Confirmar Contraseña
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        disabled={isInputDisabled}
                        placeholder='Confirmar contraseña'
                        autoComplete='new-password'
                        type={showPasswordConfirm ? 'text' : 'password'}
                        {...field}
                      />
                      <button
                        className='absolute right-2 top-3'
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
              )}
            />

            <FormField
              control={form.control}
              name='roles'
              render={() => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Roles</FormLabel>
                  <FormDescription className='text-[13px] md:text-[14px]'>
                    Seleccione los roles
                  </FormDescription>

                  <div className='flex flex-col md:flex-row md:flex-wrap gap-4'>
                    {Object.values(UserRole).map((role) => (
                      <FormField
                        key={role}
                        control={form.control}
                        name='roles'
                        render={({ field }) => (
                          <FormItem className='flex flex-row items-center space-x-2 -space-y-1'>
                            <FormControl>
                              <Checkbox
                                disabled={isInputDisabled}
                                checked={field.value?.includes(role)}
                                onCheckedChange={(checked) => {
                                  let updated: UserRole[] = [];
                                  checked
                                    ? (updated = field.value ? [...field.value, role] : [role])
                                    : (updated =
                                        field.value?.filter((value) => value !== role) ?? []);

                                  field.onChange(updated);
                                }}
                              />
                            </FormControl>
                            <FormLabel className='text-[14px] cursor-pointer'>
                              {UserRoleNames[role]}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            {roles.length > 0 && !roles.includes(UserRole.MinistryUser) && (
              <FormField
                control={form.control}
                name='churches'
                render={({ field }) => {
                  const selected = field.value || [];

                  const toggle = (id: string) => {
                    if (selected.includes(id)) {
                      form.setValue(
                        'churches',
                        selected.filter((v) => v !== id)
                      );
                    } else {
                      form.setValue('churches', [...selected, id]);
                    }
                  };

                  return (
                    <FormItem>
                      <FormLabel className='text-[14.5px] md:text-[15px] font-bold'>
                        Iglesias
                      </FormLabel>
                      <Popover
                        open={isInputTheirChurchesOpen}
                        onOpenChange={setIsInputTheirChurchesOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              disabled={isInputDisabled}
                              className='w-full justify-between overflow-hidden'
                            >
                              <div className='flex flex-wrap gap-1'>
                                {selected.length === 0 && (
                                  <span className='text-slate-500'>
                                    Busque y seleccione iglesias
                                  </span>
                                )}

                                {selected?.map((id) => {
                                  const ch = queryChurches?.data?.find((x) => x.id === id);
                                  if (!ch) return null;

                                  return (
                                    <span
                                      key={id}
                                      className='text-xs bg-muted px-2 py-0.5 rounded-full border flex items-center gap-1 max-w-[10rem] truncate'
                                    >
                                      {ch.abbreviatedChurchName}
                                    </span>
                                  );
                                })}
                              </div>

                              <CaretSortIcon className='ml-2 h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>

                        <PopoverContent align='center' className='w-auto px-4 py-2'>
                          <Command>
                            {queryChurches?.data?.length ? (
                              <>
                                <CommandInput placeholder='Buscar iglesia' className='h-9' />
                                <CommandEmpty>Iglesia no encontrada.</CommandEmpty>

                                <CommandGroup className='max-h-[200px] overflow-auto'>
                                  {queryChurches?.data?.map((church) => {
                                    const checked = selected.includes(church.id);

                                    return (
                                      <CommandItem
                                        key={church.id}
                                        onSelect={() => toggle(church.id)}
                                        className='cursor-pointer'
                                      >
                                        <div className='flex items-center gap-2 w-full'>
                                          <input type='checkbox' readOnly checked={checked} />
                                          <span className='flex-1'>
                                            {church.abbreviatedChurchName}
                                          </span>
                                          {checked && <CheckIcon className='h-4 w-4' />}
                                        </div>
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </>
                            ) : (
                              <p className='text-red-500 text-center'>
                                ❌ No hay iglesias disponibles.
                              </p>
                            )}
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  );
                }}
              />
            )}

            {roles.length > 0 && roles.includes(UserRole.MinistryUser) && (
              <FormField
                control={form.control}
                name='ministries'
                render={({ field }) => {
                  const selected = field.value || [];

                  const toggle = (id: string) => {
                    if (selected.includes(id)) {
                      form.setValue(
                        'ministries',
                        selected.filter((v) => v !== id)
                      );
                    } else {
                      form.setValue('ministries', [...selected, id]);
                    }
                  };

                  return (
                    <FormItem>
                      <FormLabel className='text-[14.5px] md:text-[15px] font-bold'>
                        Ministerios
                      </FormLabel>
                      <Popover
                        open={isInputTheirMinistriesOpen}
                        onOpenChange={setIsInputTheirMinistriesOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              disabled={isInputDisabled}
                              className='w-full justify-between overflow-hidden'
                            >
                              <div className='flex flex-wrap gap-1'>
                                {selected.length === 0 && (
                                  <span className='text-slate-500'>
                                    Busque y seleccione iglesias
                                  </span>
                                )}

                                {selected?.map((id) => {
                                  const ministry = queryMinistries?.data?.find((x) => x.id === id);
                                  if (!ministry) return null;

                                  return (
                                    <span
                                      key={id}
                                      className='text-xs bg-muted px-2 py-0.5 rounded-full border flex items-center gap-1 max-w-[10rem] truncate'
                                    >
                                      {MinistryTypeNames[ministry.ministryType as MinistryType]}
                                    </span>
                                  );
                                })}
                              </div>

                              <CaretSortIcon className='ml-2 h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>

                        <PopoverContent align='center' className='w-auto px-4 py-2'>
                          <Command>
                            {queryMinistries?.data?.length ? (
                              <>
                                <CommandInput placeholder='Buscar Ministerio' className='h-9' />
                                <CommandEmpty>Ministerio no encontrada.</CommandEmpty>

                                <CommandGroup className='max-h-[200px] overflow-auto'>
                                  {queryMinistries?.data?.map((ministry) => {
                                    const checked = selected.includes(ministry.id);

                                    return (
                                      <CommandItem
                                        key={ministry.id}
                                        onSelect={() => toggle(ministry.id)}
                                        className='cursor-pointer'
                                      >
                                        <div className='flex items-center gap-2 w-full'>
                                          <input type='checkbox' readOnly checked={checked} />
                                          <span className='flex-1'>
                                            {
                                              MinistryTypeNames[
                                                ministry.ministryType as MinistryType
                                              ]
                                            }
                                          </span>
                                          {checked && <CheckIcon className='h-4 w-4' />}
                                        </div>
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </>
                            ) : (
                              <p className='text-red-500 text-center'>
                                ❌ No hay iglesias disponibles.
                              </p>
                            )}
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  );
                }}
              />
            )}

            <div className='md:col-span-2 text-center'>
              {isMessageErrorDisabled ? (
                <p className='text-red-500 text-[13px] font-bold'>
                  ❌ Datos incompletos, completa todos los campos para crear el registro.
                </p>
              ) : isMessageErrorPasswordDisabled ? (
                <p className='text-red-500 text-[13px] font-bold'>
                  ❌ Las contraseñas deben coincidir.
                </p>
              ) : isMessageErrorRolesDisabled ? (
                <p className='text-red-500 text-[13px] font-bold'>
                  ❌ Debes elegir al menos un rol.
                </p>
              ) : (
                <p className='text-green-500 text-[13px] font-bold'>
                  ¡Campos completados correctamente!
                </p>
              )}
            </div>

            {/* Botón de enviar */}
            <div className='md:col-span-2 w-full'>
              <Toaster position='top-center' richColors />
              <Button
                disabled={isSubmitButtonDisabled}
                type='submit'
                className='w-full text-[14px]'
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
