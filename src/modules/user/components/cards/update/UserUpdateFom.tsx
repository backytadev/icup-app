/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useState } from 'react';

import { type z } from 'zod';
import { toast } from 'sonner';
import { CheckIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon } from '@radix-ui/react-icons';

import { useUserUpdateEffects } from '@/modules/user/hooks/useUserUpdateEffects';
import { useUserUpdateMutation } from '@/modules/user/hooks/useUserUpdateMutation';
import { useUserUpdateSubmitButtonLogic } from '@/modules/user/hooks/useUserUpdateSubmitButtonLogic';

import { userFormSchema } from '@/modules/user/validations/user-form-schema';
import { type UserResponse } from '@/modules/user/interfaces/user-response.interface';
import { UserFormSkeleton } from '@/modules/user/components/cards/update/UserFormSkeleton';

import { UserRoleNames, UserRole } from '@/modules/user/enums/user-role.enum';
import { MinistryType, MinistryTypeNames } from '@/modules/ministry/enums/ministry-type.enum';

import { cn } from '@/shared/lib/utils';
import { GenderNames } from '@/shared/enums/gender.enum';

import { getSimpleChurches } from '@/modules/church/services/church.service';
import { getSimpleMinistries } from '@/modules/ministry/services/ministry.service';

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
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
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

interface UserFormUpdateProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: UserResponse | undefined;
}

export const UserUpdateForm = ({
  id,
  dialogClose,
  scrollToTop,
  data,
}: UserFormUpdateProps): JSX.Element => {
  //* States
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);
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
      roles: [],
      ministries: [],
      churches: [],
      recordStatus: '',
    },
  });

  //* Watchers
  const roles = form.watch('roles');

  //* Custom hooks
  useUserUpdateEffects({
    id,
    data,
    setIsLoadingData,
    userUpdateForm: form as any,
  });

  useUserUpdateSubmitButtonLogic({
    userUpdateForm: form as any,
    setIsSubmitButtonDisabled,
    setIsMessageErrorDisabled,
    isInputDisabled,
  });

  const userUpdateMutation = useUserUpdateMutation({
    dialogClose,
    scrollToTop,
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
    setIsInputDisabled(true);
    setIsSubmitButtonDisabled(true);

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

      setIsInputDisabled(false);
      setIsSubmitButtonDisabled(false);
      return;
    }

    if (roles.includes(UserRole.MinistryUser)) formData.churches = [];
    else formData.ministries = [];

    userUpdateMutation.mutate({
      id,
      formData: {
        firstNames: formData.firstNames,
        lastNames: formData.lastNames,
        userName: formData.userName,
        gender: formData.gender,
        email: formData.email,
        roles: formData.roles,
        ministries: formData.ministries ?? [],
        churches: formData.churches ?? [],
        recordStatus: formData.recordStatus,
      },
    });
  };

  return (
    <Tabs
      defaultValue='general-info'
      className='w-auto sm:w-[520px] md:w-[680px] lg:w-[830px] xl:w-[930px] -mt-8'
    >
      <h2 className='text-center leading-7 text-orange-500 pb-2 font-bold text-[24px] sm:text-[26px] md:text-[28px]'>
        Modificar información del Usuario
      </h2>

      <TabsContent value='general-info' className='overflow-y-auto'>
        <Card className='w-full'>
          {isLoadingData && <UserFormSkeleton />}

          {!isLoadingData && (
            <CardContent className='py-4 px-4'>
              <div className='dark:text-slate-300 text-slate-500 font-bold text-[16.5px] md:text-[18px] mb-4 pl-0 md:pl-4'>
                Usuario: {data?.firstNames} {data?.lastNames}
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className='w-full flex flex-col md:grid gap-x-10 gap-y-3 md:gap-y-5 px-2 sm:px-10'
                >
                  <FormField
                    control={form.control}
                    name='firstNames'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                          Nombres
                        </FormLabel>
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
                        <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                          Género
                        </FormLabel>
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
                        <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                          Usuario
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isInputDisabled}
                            placeholder='Nombre de usuario'
                            {...field}
                          />
                        </FormControl>
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
                                          Busque y seleccione ministerios
                                        </span>
                                      )}

                                      {selected?.map((id) => {
                                        const ministry = queryMinistries?.data?.find(
                                          (x) => x.id === id
                                        );
                                        if (!ministry) return null;

                                        return (
                                          <span
                                            key={id}
                                            className='text-xs bg-muted px-2 py-0.5 rounded-full border flex items-center gap-1 max-w-[10rem] truncate'
                                          >
                                            {
                                              MinistryTypeNames[
                                                ministry.ministryType as MinistryType
                                              ]
                                            }
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
                                      <CommandInput
                                        placeholder='Buscar ministerio'
                                        className='h-9'
                                      />
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

                  <div className='flex flex-col'>
                    <FormField
                      control={form.control}
                      name='recordStatus'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>Estado</FormLabel>
                            <Select disabled={isInputDisabled} onValueChange={field.onChange}>
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <SelectTrigger>
                                  {field.value === 'active' ? (
                                    <SelectValue placeholder='Activo' />
                                  ) : (
                                    <SelectValue placeholder='Inactivo' />
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem className='text-[13px] md:text-[14px]' value='active'>
                                  Activo
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {form.getValues('recordStatus') === 'active' && (
                              <FormDescription className='pl-2 text-[12.5px] xl:text-[13px] font-bold'>
                                *El registro esta <span className='text-green-500'>Activo</span>,
                                para colocar nuevamente como{' '}
                                <span className='text-red-500'>inactivo</span> inactivar el registro
                                desde el modulo{' '}
                                <span className='font-bold text-red-500'>Inactivar Usuario.</span>
                              </FormDescription>
                            )}
                            {form.getValues('recordStatus') === 'inactive' && (
                              <FormDescription className='pl-2 text-[12.5px] xl:text-[13px] font-bold'>
                                * El registro esta <span className='text-red-500'>inactivo</span>,
                                puede modificar el estado eligiendo otra opción.
                              </FormDescription>
                            )}
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='roles'
                    render={() => (
                      <FormItem className='md:col-start-1 md:col-end-2 md:row-start-4 md:row-end-5 mb-3 md:mb-0'>
                        <div className='mb-4'>
                          <FormLabel className='text-[14px] sm:text-[15px] lg:text-[17px] font-bold'>
                            Roles
                          </FormLabel>
                          <FormDescription className='text-slate-600 font-medium text-sm lg:text-[15px]'>
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
                                  className='flex flex-row items-center space-x-3 space-y-0'
                                >
                                  <FormControl className='text-[14px] md:text-[14px]'>
                                    <Checkbox
                                      disabled={isInputDisabled}
                                      checked={field.value?.includes(role)}
                                      onCheckedChange={(checked) => {
                                        let updatedRoles: UserRole[] = [];
                                        checked
                                          ? (updatedRoles = field.value
                                              ? [...field.value, role]
                                              : [role])
                                          : (updatedRoles =
                                              field.value?.filter((value) => value !== role) ?? []);

                                        field.onChange(updatedRoles);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className='text-sm lg:text-[15px] font-normal'>
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
                    <p className='-mb-2 md:-mb-3 md:row-start-4 md:row-end-5 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                      ❌ Datos incompletos, completa todos los campos para guardar el registro.
                    </p>
                  ) : (
                    <p className='-mt-1 order-last md:-mt-3 md:row-start-5 md:row-end-6 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                      ¡Campos completados correctamente! <br /> Para finalizar por favor guarde los
                      cambios.
                    </p>
                  )}

                  <div className='w-full md:w-[20rem] md:mx-auto col-start-1 col-end-3 text-sm md:text-md xl:text-base'>
                    <Button
                      disabled={isSubmitButtonDisabled}
                      type='submit'
                      className={cn(
                        'w-full text-[14px]',
                        userUpdateMutation?.isPending &&
                          'bg-emerald-500 hover:bg-emerald-500 disabled:opacity-100 disabled:md:text-[15px] text-white'
                      )}
                    >
                      {userUpdateMutation?.isPending ? 'Procesando...' : 'Guardar cambios'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  );
};
