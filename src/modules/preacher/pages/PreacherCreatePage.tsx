/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { useEffect, useState } from 'react';

import type * as z from 'zod';
import { Toaster } from 'sonner';
import { useForm } from 'react-hook-form';

import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import {
  usePreacherCreationMutation,
  usePreacherCreationSubmitButtonLogic,
} from '@/modules/preacher/hooks';
import { PageTitle } from '@/shared/components/page';
import { getSimpleSupervisors } from '@/modules/supervisor/services';
import { preacherFormSchema } from '@/modules/preacher/validations';

import { cn } from '@/shared/lib/utils';
import { useRoleValidationByPath } from '@/shared/hooks';

import {
  Country,
  Province,
  Department,
  MemberRole,
  GenderNames,
  CountryNames,
  ProvinceNames,
  DistrictNames,
  DepartmentNames,
  MemberRoleNames,
  UrbanSectorNames,
  MaritalStatusNames,
} from '@/shared/enums';
import {
  getFullNames,
  validateDistrictsAllowedByModule,
  validateUrbanSectorsAllowedByDistrict,
} from '@/shared/helpers';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/shared/components/ui/command';
import {
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Select,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Textarea } from '@/shared/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

export const PreacherCreatePage = (): JSX.Element => {
  //* States
  const [isInputTheirSupervisorOpen, setIsInputTheirSupervisorOpen] = useState<boolean>(false);
  const [isInputBirthDateOpen, setIsInputBirthDateOpen] = useState<boolean>(false);
  const [isInputConvertionDateOpen, setIsInputConvertionDateOpen] = useState<boolean>(false);

  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);

  //* Library hooks
  const { pathname } = useLocation();

  //* Form
  const form = useForm<z.infer<typeof preacherFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(preacherFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: '',
      originCountry: '',
      birthDate: undefined,
      conversionDate: undefined,
      numberChildren: '',
      maritalStatus: '',
      email: '',
      phoneNumber: '',
      country: Country.Peru,
      department: Department.Lima,
      province: Province.Lima,
      district: '',
      address: '',
      referenceAddress: '',
      roles: [MemberRole.Disciple],
      theirCopastor: '',
      theirSupervisor: '',
    },
  });

  //* Watchers
  const district = form.watch('district');

  //* Effects
  useEffect(() => {
    form.resetField('urbanSector', {
      keepError: true,
    });
  }, [district]);

  useEffect(() => {
    document.title = 'Modulo Predicador - IcupApp';
  }, []);

  //* Helpers
  const districtsValidation = validateDistrictsAllowedByModule(pathname);
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(district);

  //* Custom hooks
  const { disabledRoles } = useRoleValidationByPath({
    path: pathname,
    memberRoles: MemberRole,
  });

  usePreacherCreationSubmitButtonLogic({
    preacherCreationForm: form,
    memberRoles: MemberRole,
    isInputDisabled,
    isMessageErrorDisabled,
    setIsMessageErrorDisabled,
    setIsSubmitButtonDisabled,
  });

  const preacherCreationMutation = usePreacherCreationMutation({
    preacherCreationForm: form,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  //* Queries
  const { data } = useQuery({
    queryKey: ['supervisors'],
    queryFn: () => getSimpleSupervisors({ isNullZone: false, isSimpleQuery: true }),
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof preacherFormSchema>): void => {
    preacherCreationMutation.mutate(formData);
  };

  return (
    <div className='animate-fadeInPage'>
      <PageTitle className='text-preacher-color '>Modulo Predicador</PageTitle>

      <h2 className='text-left leading-7 pb-2 pt-3 px-4 sm:px-5 2xl:px-24 font-sans font-bold text-green-500 text-[1.5rem] sm:text-[1.75rem] md:text-[1.85rem] lg:text-[1.9rem] xl:text-[2.1rem] 2xl:text-4xl'>
        Crear un nuevo predicador
      </h2>

      <p className='dark:text-slate-300 text-left font-sans font-bold pl-5 pr-6  sm:pl-7 2xl:px-28 text-[12.5px] md:text-[15px] xl:text-base'>
        Por favor llena los siguientes datos para crear un nuevo predicador.
      </p>

      <div className='flex min-h-screen flex-col items-center justify-between px-6 py-4 sm:px-8 sm:py-6 lg:py-6 xl:px-14 2xl:px-36'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='w-full flex flex-col gap-y-6 md:grid md:grid-cols-2 md:gap-y-8 md:gap-x-10'
          >
            <div className='sm:col-start-1 sm:col-end-2'>
              <legend className='font-bold text-[16px] md:text-[18px]'>Datos generales</legend>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Nombres</FormLabel>
                      <FormControl>
                        <Input
                          className='text-[14px]'
                          disabled={isInputDisabled}
                          placeholder='Ejem: Ramiro Ignacio'
                          type='text'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Apellidos</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Ejem: Saavedra Ramirez'
                          type='text'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Género</FormLabel>
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
                            <SelectItem className={`text-[14px]`} key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='originCountry'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>País de origen</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Ejem:  Colombia, Panama, Ecuador'
                          type='text'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='birthDate'
                render={({ field }) => (
                  <FormItem className='mt-3'>
                    <FormLabel className='text-[14px] font-medium'>Fecha de nacimiento</FormLabel>
                    <Popover open={isInputBirthDateOpen} onOpenChange={setIsInputBirthDateOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={isInputDisabled}
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'LLL dd, y', { locale: es })
                            ) : (
                              <span className='text-[14px]'>Selecciona la fecha de nacimiento</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setIsInputBirthDateOpen(false);
                          }}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className='pl-3 text-blue-600 text-[11.5px] xl:text-[12.5px] font-bold italic'>
                      * Su fecha de nacimiento se utilizara para calcular su edad.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='maritalStatus'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Estado Civil</FormLabel>
                      <Select
                        value={field.value}
                        disabled={isInputDisabled}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona el estado civil' />
                            ) : (
                              'Selecciona el estado civil'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(MaritalStatusNames).map(([key, value]) => (
                            <SelectItem className={`text-[14px]`} key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name='numberChildren'
                render={({ field }) => {
                  return (
                    <FormItem className=' mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Numero de hijos</FormLabel>
                      <FormControl>
                        <Input disabled={isInputDisabled} placeholder='Ejem: 2' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='conversionDate'
                render={({ field }) => (
                  <FormItem className='mt-3'>
                    <FormLabel className='text-[14px] font-medium'>Fecha de conversión</FormLabel>
                    <Popover
                      open={isInputConvertionDateOpen}
                      onOpenChange={setIsInputConvertionDateOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={isInputDisabled}
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'LLL dd, y', { locale: es })
                            ) : (
                              <span className='text-sm md:text-[14px] lg:text-sm'>
                                Selecciona la fecha de conversión
                              </span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setIsInputConvertionDateOpen(false);
                          }}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className='pl-3 text-blue-600 text-[11.5px] xl:text-[12.5px] font-bold italic'>
                      * Fecha en la que el creyente se convirtió.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='sm:col-start-2 sm:col-end-3'>
              <legend className='font-bold text-[16px] md:text-[18px]'>Contacto / Vivienda</legend>

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Ejem: pedro123@gmail.com'
                          type='email'
                          autoComplete='username'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Numero de teléfono</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Ejem: +51 999 999 999'
                          type='text'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='country'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>País</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isInputDisabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona el país' />
                            ) : (
                              'Selecciona el país'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(CountryNames).map(([key, value]) => (
                            <SelectItem className={`text-[14px]`} key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='department'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Departamento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isInputDisabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona el departamento' />
                            ) : (
                              'Selecciona el departamento'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(DepartmentNames).map(([key, value]) => (
                            <SelectItem className={`text-[14px]`} key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='province'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Provincia</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isInputDisabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona la provincia' />
                            ) : (
                              'Selecciona la provincia'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(ProvinceNames).map(([key, value]) => (
                            <SelectItem className={`text-[14px]`} key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='district'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Distrito</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isInputDisabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona el distrito' />
                            ) : (
                              'Selecciona el distrito'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(DistrictNames).map(([key, value]) => (
                            <SelectItem
                              className={`text-[14px] ${districtsValidation?.districtsValidation?.includes(value) ? 'hidden' : ''}`}
                              key={key}
                              value={key}
                            >
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='urbanSector'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Sector Urbano</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isInputDisabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona el sector urbano' />
                            ) : (
                              'Selecciona el sector urbano'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(UrbanSectorNames).map(([key, value]) => (
                            <SelectItem
                              className={`text-[14px] ${urbanSectorsValidation?.disabledUrbanSectors?.includes(value) ?? !district ? 'hidden' : ''}`}
                              key={key}
                              value={key}
                            >
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Dirección</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Ejem: Jr. Rosales 111 - Mz.A Lt.14'
                          type='text'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='referenceAddress'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>
                        Referencia de dirección
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isInputDisabled}
                          placeholder='Comentarios de referencia sobre la ubicación de la vivienda....'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            {/* Roles */}

            <div className='sm:col-start-1 sm:col-end-2 sm:row-start-2 sm:row-end-3 h-auto'>
              <FormField
                control={form.control}
                name='roles'
                render={() => (
                  <FormItem>
                    <div className='mb-3'>
                      <FormLabel className='font-bold text-[16px] md:text-[18px]'>Roles</FormLabel>
                      <FormDescription className='font-medium'>
                        Asigna los roles correspondientes para este registro.
                      </FormDescription>
                    </div>
                    {Object.values(MemberRole).map((role) => (
                      <FormField
                        key={role}
                        control={form.control}
                        name='roles'
                        render={({ field }) => {
                          const isDisabled = disabledRoles?.includes(role) ?? isInputDisabled;
                          return (
                            <FormItem
                              key={role}
                              className='flex flex-row items-start space-x-3 space-y-0'
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(role)}
                                  disabled={isDisabled || isInputDisabled}
                                  onCheckedChange={(checked) => {
                                    let updatedRoles: MemberRole[] = [];
                                    checked
                                      ? (updatedRoles = field.value
                                          ? [...field.value, role]
                                          : [role])
                                      : (updatedRoles =
                                          field.value?.filter((value) => value !== role) ?? []);

                                    field.onChange(updatedRoles);
                                  }}
                                  className={isDisabled || isInputDisabled ? 'bg-slate-500' : ''}
                                />
                              </FormControl>
                              <FormLabel className='text-[14px] font-normal'>
                                {MemberRoleNames[role]}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Relations */}

            <div className='sm:col-start-2 sm:col-end-3 sm:row-start-2 sm:row-end-3'>
              <legend className='font-bold col-start-1 col-end-3 text-[16px] md:text-[18px]'>
                Relaciones
              </legend>

              <FormField
                control={form.control}
                name='theirSupervisor'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14.5px] md:text-[15px] font-bold'>
                        Supervisor
                      </FormLabel>
                      <FormDescription className='text-[14px]'>
                        Asigna el Supervisor responsable para este Predicador.
                      </FormDescription>
                      <Popover
                        open={isInputTheirSupervisorOpen}
                        onOpenChange={setIsInputTheirSupervisorOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              disabled={isInputDisabled}
                              variant='outline'
                              role='combobox'
                              className={cn(
                                'w-full justify-between overflow-hidden',
                                !field.value && 'text-slate-500 font-normal text-[14px]'
                              )}
                            >
                              {field.value
                                ? `${data?.find((supervisor) => supervisor.id === field.value)?.firstName} ${data?.find((supervisor) => supervisor.id === field.value)?.lastName}`
                                : 'Busque y seleccione un supervisor'}
                              <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align='center' className='w-auto px-4 py-2'>
                          <Command>
                            {data?.length && data?.length > 0 ? (
                              <>
                                <CommandInput
                                  placeholder='Busque un supervisor...'
                                  className='h-9 text-[14px]'
                                />
                                <CommandEmpty>Supervisor no encontrado.</CommandEmpty>
                                <CommandGroup className='max-h-[200px] h-auto'>
                                  {data?.map((supervisor) => (
                                    <CommandItem
                                      className='text-[14px]'
                                      value={getFullNames({
                                        firstNames: supervisor.firstName,
                                        lastNames: supervisor.lastName,
                                      })}
                                      key={supervisor.id}
                                      onSelect={() => {
                                        form.setValue('theirSupervisor', supervisor.id);
                                        setIsInputTheirSupervisorOpen(false);
                                      }}
                                    >
                                      {`${supervisor?.firstName} ${supervisor?.lastName}`}
                                      <CheckIcon
                                        className={cn(
                                          'ml-auto h-4 w-4',
                                          supervisor?.id === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </>
                            ) : (
                              data?.length === 0 && (
                                <p className='text-[14.5px] text-red-500 text-center'>
                                  ❌No hay supervisores disponibles.
                                </p>
                              )
                            )}
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            {isMessageErrorDisabled ? (
              <p className='mt-0 -mb-4 md:-mt-5 md:col-start-1 md:col-end-3 md:row-start-3 md:row-end-4 mx-auto md:w-[100%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                ❌ Datos incompletos, completa todos los campos para crear el registro.
              </p>
            ) : (
              <p className='order-last -mt-3 md:-mt-5 md:col-start-1 md:col-end-3 mx-auto md:w-[70%] lg:w-[50%] text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                ¡Campos completados correctamente!
              </p>
            )}

            <div className='md:mt-2 lg:mt-2 col-start-1 col-end-3 row-start-3 row-end-4 w-full md:w-[20rem] md:m-auto'>
              <Toaster position='top-center' richColors />
              <Button
                disabled={isSubmitButtonDisabled}
                type='submit'
                className='w-full text-[14px]'
                onClick={() => {
                  setTimeout(() => {
                    if (Object.keys(form.formState.errors).length === 0) {
                      setIsSubmitButtonDisabled(true);
                      setIsInputDisabled(true);
                    }
                  }, 100);
                }}
              >
                Registrar Predicador
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
