/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import type * as z from 'zod';
import { Toaster } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { getSimplePastors } from '@/modules/pastor/services/pastor.service';
import { getSimpleCopastors } from '@/modules/copastor/services/copastor.service';

import { supervisorFormSchema } from '@/modules/supervisor/validations/supervisor-form-schema';

import { useSupervisorCreationMutation } from '@/modules/supervisor/hooks/useSupervisorCreationMutation';
import { useSupervisorCreationSubmitButtonLogic } from '@/modules/supervisor/hooks/useSupervisorCreationSubmitButtonLogic';

import { cn } from '@/shared/lib/utils';

import { PageTitle } from '@/shared/components/page/PageTitle';
import { useRoleValidationByPath } from '@/shared/hooks/useRoleValidationByPath';

import { getFullNames } from '@/shared/helpers/get-full-names.helper';
import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

import { GenderNames } from '@/shared/enums/gender.enum';
import { DistrictNames } from '@/shared/enums/district.enum';
import { UrbanSectorNames } from '@/shared/enums/urban-sector.enum';
import { Country, CountryNames } from '@/shared/enums/country.enum';
import { Province, ProvinceNames } from '@/shared/enums/province.enum';
import { MaritalStatusNames } from '@/shared/enums/marital-status.enum';
import { Department, DepartmentNames } from '@/shared/enums/department.enum';
import { MemberRole, MemberRoleNames } from '@/shared/enums/member-role.enum';

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
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Textarea } from '@/shared/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

export const SupervisorCreatePage = (): JSX.Element => {
  //* States
  const [isInputTheirCopastorOpen, setIsInputTheirCopastorOpen] = useState<boolean>(false);
  const [isInputTheirPastorOpen, setIsInputTheirPastorOpen] = useState<boolean>(false);
  const [isInputBirthDateOpen, setIsInputBirthDateOpen] = useState<boolean>(false);
  const [isInputConvertionDateOpen, setIsInputConvertionDateOpen] = useState<boolean>(false);

  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);

  //* Library hooks
  const { pathname } = useLocation();

  //* Form
  const form = useForm<z.infer<typeof supervisorFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(supervisorFormSchema),
    defaultValues: {
      firstNames: '',
      lastNames: '',
      gender: '',
      originCountry: '',
      birthDate: undefined,
      conversionDate: undefined,
      numberChildren: '',
      maritalStatus: '',
      isDirectRelationToPastor: false,
      email: '',
      phoneNumber: '',
      residenceCountry: Country.Perú,
      residenceDepartment: Department.Lima,
      residenceProvince: Province.Lima,
      residenceDistrict: '',
      residenceAddress: '',
      referenceAddress: '',
      roles: [MemberRole.Supervisor],
      theirPastor: '',
    },
  });

  //* Watchers
  const residenceDistrict = form.watch('residenceDistrict');
  const isDirectRelationToPastor = form.watch('isDirectRelationToPastor');

  //* Effects
  useEffect(() => {
    form.resetField('residenceUrbanSector', {
      keepError: true,
    });
  }, [residenceDistrict]);

  useEffect(() => {
    if (isDirectRelationToPastor) {
      form.resetField('theirCopastor', {
        keepError: true,
      });
    }

    if (!isDirectRelationToPastor) {
      form.resetField('theirPastor', {
        keepError: true,
      });
    }
  }, [isDirectRelationToPastor]);

  useEffect(() => {
    document.title = 'Modulo Supervisor - IcupApp';
  }, []);

  //* Helpers
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(residenceDistrict);
  const districtsValidation = validateDistrictsAllowedByModule(pathname);

  //* Custom hooks
  const { disabledRoles } = useRoleValidationByPath({
    path: pathname,
  });

  useSupervisorCreationSubmitButtonLogic({
    supervisorCreationForm: form,
    isInputDisabled,
    setIsMessageErrorDisabled,
    setIsSubmitButtonDisabled,
  });

  const supervisorCreationMutation = useSupervisorCreationMutation({
    supervisorCreationForm: form,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  //* Queries
  const copastorsQuery = useQuery({
    queryKey: ['copastors'],
    queryFn: () => getSimpleCopastors({ isSimpleQuery: true }),
    retry: false,
  });

  const pastorsQuery = useQuery({
    queryKey: ['pastors'],
    queryFn: () => getSimplePastors({ isSimpleQuery: true }),
    retry: false,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof supervisorFormSchema>): void => {
    supervisorCreationMutation.mutate(formData);
  };

  return (
    <div className='animate-fadeInPage'>
      <PageTitle className='text-supervisor-color'>Modulo Supervisor</PageTitle>

      <h2 className='-ml-2 sm:ml-0 text-left whitespace-nowrap pb-[2px] pt-2 px-4 sm:px-5 2xl:px-10 font-sans font-bold text-green-500 text-[1.6rem] sm:text-[1.75rem] md:text-[1.85rem] lg:text-[1.9rem] xl:text-[2.1rem] 2xl:text-4xl'>
        Crear un nuevo supervisor
      </h2>

      <p className='dark:text-slate-300 text-left font-sans font-bold pl-5 pr-6 sm:pl-7 2xl:px-14 text-[13.5px] md:text-[15px] xl:text-base'>
        Por favor llena los siguientes datos para crear un nuevo supervisor.
      </p>

      <div className='flex min-h-screen flex-col items-center justify-between px-6 py-4 sm:px-8 sm:py-6 lg:py-6 xl:px-14 2xl:px-[5rem]'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='w-full flex flex-col gap-y-6 md:grid md:grid-cols-2 md:gap-y-8 md:gap-x-10'
          >
            <div className='sm:col-start-1 sm:col-end-2'>
              <legend className='font-bold text-[16px] md:text-[18px]'>Datos generales</legend>
              <FormField
                control={form.control}
                name='firstNames'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Nombres</FormLabel>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          className='text-[14px]'
                          disabled={isInputDisabled}
                          placeholder='Ejem: Ramiro Ignacio'
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
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Apellidos</FormLabel>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Ejem: Saavedra Ramirez'
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
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Género</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isInputDisabled}
                      >
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona el tipo de Género' />
                            ) : (
                              'Selecciona el tipo de Género'
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
                name='originCountry'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>País de origen</FormLabel>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Ejem:  Colombia, Panama, Ecuador'
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
                name='birthDate'
                render={({ field }) => (
                  <FormItem className='mt-3'>
                    <FormLabel className='text-[14px] font-medium'>Fecha de nacimiento</FormLabel>
                    <Popover open={isInputBirthDateOpen} onOpenChange={setIsInputBirthDateOpen}>
                      <PopoverTrigger asChild>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Button
                            disabled={isInputDisabled}
                            variant={'outline'}
                            className={cn(
                              'text-[14px] w-full pl-3 text-left font-normal',
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
                    <FormDescription className='pl-2 text-blue-600 text-[12.5px] xl:text-[13px] font-bold italic'>
                      * Su fecha de nacimiento se utilizara para calcular su edad.
                    </FormDescription>
                    <FormMessage className='text-[13px]' />
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
                        <FormControl className='text-[14px] md:text-[14px]'>
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
                      <FormMessage className='text-[13px]' />
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
                      <FormLabel className='text-[14px] font-medium'>Nro. de hijos</FormLabel>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input disabled={isInputDisabled} placeholder='Ejem: 2' {...field} />
                      </FormControl>
                      <FormMessage className='text-[13px]' />
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
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Button
                            disabled={isInputDisabled}
                            variant={'outline'}
                            className={cn(
                              'text-[14px] w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'LLL dd, y', { locale: es })
                            ) : (
                              <span className='text-[14px]'>Selecciona la fecha de conversión</span>
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
                    <FormDescription className='pl-2 text-blue-600 text-[12.5px] xl:text-[13px] font-bold italic'>
                      * Fecha en la que el creyente se convirtió.
                    </FormDescription>
                    <FormMessage className='text-[13px]' />
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
                      <FormLabel className='text-[14px] font-medium'>
                        E-mail
                        <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                          Opcional
                        </span>
                      </FormLabel>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Ejem: pedro123@gmail.com'
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
                name='phoneNumber'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>
                        Número de teléfono
                        <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                          Opcional
                        </span>
                      </FormLabel>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Ejem: +51 999 999 999'
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
                name='residenceCountry'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>País</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isInputDisabled}
                      >
                        <FormControl className='text-[14px] md:text-[14px]'>
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
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='residenceDepartment'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Departamento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isInputDisabled}
                      >
                        <FormControl className='text-[14px] md:text-[14px]'>
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
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='residenceProvince'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Provincia</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isInputDisabled}
                      >
                        <FormControl className='text-[14px] md:text-[14px]'>
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
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='residenceDistrict'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Distrito</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isInputDisabled}
                      >
                        <FormControl className='text-[14px] md:text-[14px]'>
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
                              className={`text-[14px] ${districtsValidation?.districtsDataResult?.includes(value) ? 'hidden' : ''}`}
                              key={key}
                              value={key}
                            >
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
                name='residenceUrbanSector'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Sector Urbano</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isInputDisabled}
                      >
                        <FormControl className='text-[14px] md:text-[14px]'>
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
                              className={`text-[14px] ${(urbanSectorsValidation?.urbanSectorsDataResult?.includes(value) ?? !residenceDistrict) ? 'hidden' : ''}`}
                              key={key}
                              value={key}
                            >
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
                name='residenceAddress'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Dirección</FormLabel>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Ejem: Jr. Rosales 111 - Mz.A Lt.14'
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
                name='referenceAddress'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>
                        Referencia de dirección
                      </FormLabel>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Textarea
                          disabled={isInputDisabled}
                          placeholder='Comentarios de referencia sobre la ubicación de la vivienda....'
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
                name='isDirectRelationToPastor'
                render={({ field }) => (
                  <FormItem className='mt-4 flex flex-row gap-2 items-center md:items-end md:mt-3 px-1 py-3 h-[2.5rem]'>
                    <FormControl className='text-[14px] md:text-[14px]'>
                      <Checkbox
                        disabled={isInputDisabled}
                        checked={field?.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                        }}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel className='text-[14px] md:text-[14px]'>
                        ¿Este registro estará relacionado directamente con un pastor?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
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
                      <FormLabel className='font-bold text-[16px] md:text-[18px]'>
                        Roles de Membresía
                      </FormLabel>
                      <FormDescription className='font-medium'>
                        Asigna los roles de membresía correspondientes para este registro.
                      </FormDescription>
                    </div>
                    <div className='grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {Object.values(MemberRole).map(
                        (role) =>
                          (role === MemberRole.Pastor ||
                            role === MemberRole.Copastor ||
                            role === MemberRole.Supervisor ||
                            role === MemberRole.Preacher ||
                            role === MemberRole.Treasurer ||
                            role === MemberRole.Disciple) && (
                            <FormField
                              key={role}
                              control={form.control}
                              name='roles'
                              render={({ field }) => {
                                const isDisabled = disabledRoles?.includes(role) ?? isInputDisabled;
                                return (
                                  <FormItem
                                    key={role}
                                    className='flex flex-row items-center space-x-2 space-y-0'
                                  >
                                    <FormControl className='text-[14px] md:text-[14px]'>
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
                                                field.value?.filter((value) => value !== role) ??
                                                []);

                                          field.onChange(updatedRoles);
                                        }}
                                        className={
                                          isDisabled || isInputDisabled ? 'bg-slate-500' : ''
                                        }
                                      />
                                    </FormControl>
                                    <FormLabel className='text-[14px] cursor-pointer font-normal'>
                                      {MemberRoleNames[role]}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          )
                      )}
                    </div>
                    <FormMessage className='text-[13px]' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='roles'
                render={() => (
                  <FormItem>
                    <div className='mb-3 mt-5'>
                      <FormLabel className='font-bold text-[16px] md:text-[18px]'>
                        Roles Ministeriales
                      </FormLabel>
                      <FormDescription className='font-medium'>
                        Asigna los roles ministeriales correspondientes para este registro.
                      </FormDescription>
                    </div>
                    <div className='grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {Object.values(MemberRole).map(
                        (role) =>
                          role !== MemberRole.Pastor &&
                          role !== MemberRole.Copastor &&
                          role !== MemberRole.Supervisor &&
                          role !== MemberRole.Preacher &&
                          role !== MemberRole.Treasurer &&
                          role !== MemberRole.Disciple &&
                          role !== MemberRole.Presbyter &&
                          role !== MemberRole.KidsMinistryLeader &&
                          role !== MemberRole.DiscipleshipMinistryLeader &&
                          role !== MemberRole.KidsMinistryTeamMember &&
                          role !== MemberRole.YouthMinistryLeader &&
                          role !== MemberRole.YouthMinistryTeamMember &&
                          role !== MemberRole.TechnologyMinistryTeamMember && (
                            <FormField
                              key={role}
                              control={form.control}
                              name='roles'
                              render={({ field }) => {
                                const isDisabled = disabledRoles?.includes(role) ?? isInputDisabled;
                                return (
                                  <FormItem
                                    key={role}
                                    className='flex flex-row items-center space-x-2 space-y-0'
                                  >
                                    <FormControl className='text-[14px] md:text-[14px]'>
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
                                                field.value?.filter((value) => value !== role) ??
                                                []);

                                          field.onChange(updatedRoles);
                                        }}
                                        className={
                                          isDisabled || isInputDisabled ? 'bg-slate-500' : ''
                                        }
                                      />
                                    </FormControl>
                                    <FormLabel className='text-[14px] cursor-pointer font-normal'>
                                      {MemberRoleNames[role]}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          )
                      )}
                    </div>
                    <FormMessage className='text-[13px]' />
                  </FormItem>
                )}
              />
            </div>

            {/* Relations */}

            <div className='sm:col-start-2 sm:col-end-3 sm:row-start-2 sm:row-end-3'>
              <legend className='font-bold col-start-1 col-end-3 text-[16px] md:text-[18px]'>
                Relaciones
              </legend>
              {isDirectRelationToPastor && (
                <FormField
                  control={form.control}
                  name='theirPastor'
                  render={({ field }) => {
                    return (
                      <FormItem className='mt-3'>
                        <FormLabel className='text-[14.5px] md:text-[15px] font-bold'>
                          Pastor
                        </FormLabel>
                        <FormDescription className='text-[13.5px] md:text-[14px]'>
                          Asigna el Pastor responsable para este Supervisor. (enlace directo).
                        </FormDescription>
                        <Popover
                          open={isInputTheirPastorOpen}
                          onOpenChange={setIsInputTheirPastorOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Button
                                disabled={isInputDisabled}
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'text-[14px] w-full justify-between overflow-hidden',
                                  !field.value && 'text-slate-500 font-normal text-[14px]'
                                )}
                              >
                                {field.value
                                  ? `${pastorsQuery.data?.find((pastor) => pastor.id === field.value)?.member?.firstNames} ${pastorsQuery.data?.find((pastor) => pastor.id === field.value)?.member?.lastNames}`
                                  : 'Busque y seleccione un pastor'}
                                <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align='center' className='w-auto px-4 py-2'>
                            <Command>
                              {pastorsQuery?.data?.length && pastorsQuery?.data?.length > 0 ? (
                                <>
                                  <CommandInput
                                    placeholder='Busque un pastor...'
                                    className='h-9 text-[14px]'
                                  />
                                  <CommandEmpty>Pastor no encontrado.</CommandEmpty>
                                  <CommandGroup className='max-h-[200px] h-auto'>
                                    {pastorsQuery.data?.map((pastor) => (
                                      <CommandItem
                                        className='text-[14px]'
                                        value={pastor.id}
                                        key={pastor.id}
                                        onSelect={() => {
                                          form.setValue('theirPastor', pastor?.id);
                                          setIsInputTheirPastorOpen(false);
                                        }}
                                      >
                                        {`${pastor?.member?.firstNames} ${pastor?.member?.lastNames}`}
                                        <CheckIcon
                                          className={cn(
                                            'ml-auto h-4 w-4',
                                            pastor?.id === field.value ? 'opacity-100' : 'opacity-0'
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </>
                              ) : (
                                pastorsQuery?.data?.length === 0 && (
                                  <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                    ❌No hay pastores disponibles.
                                  </p>
                                )
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

              {!isDirectRelationToPastor && (
                <FormField
                  control={form.control}
                  name='theirCopastor'
                  render={({ field }) => {
                    return (
                      <FormItem className='mt-3'>
                        <FormLabel className='text-[14.5px] md:text-[15px] font-bold'>
                          Co-Pastor
                        </FormLabel>
                        <FormDescription className='text-[13.5px] md:text-[14px]'>
                          Asigna el Co-Pastor responsable para este Supervisor.
                        </FormDescription>
                        <Popover
                          open={isInputTheirCopastorOpen}
                          onOpenChange={setIsInputTheirCopastorOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Button
                                disabled={isInputDisabled}
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'text-[14px] w-full justify-between overflow-hidden',
                                  !field.value && 'text-slate-500 font-normal text-[14px]'
                                )}
                              >
                                {field.value
                                  ? `${copastorsQuery.data?.find((copastor) => copastor.id === field.value)?.member?.firstNames} ${copastorsQuery.data?.find((copastor) => copastor.id === field.value)?.member?.lastNames}`
                                  : 'Busque y seleccione un co-pastor'}
                                <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align='center' className='w-auto px-4 py-2'>
                            <Command>
                              {copastorsQuery?.data?.length && copastorsQuery?.data?.length > 0 ? (
                                <>
                                  <CommandInput
                                    placeholder='Busque un co-pastor...'
                                    className='h-9 text-[14px]'
                                  />
                                  <CommandEmpty>Co-Pastor no encontrado.</CommandEmpty>
                                  <CommandGroup className='max-h-[200px] h-auto'>
                                    {copastorsQuery.data?.map((copastor) => (
                                      <CommandItem
                                        className='text-[14px]'
                                        value={getFullNames({
                                          firstNames: copastor.member?.firstNames ?? '',
                                          lastNames: copastor.member?.lastNames ?? '',
                                        })}
                                        key={copastor.id}
                                        onSelect={() => {
                                          form.setValue('theirCopastor', copastor.id);
                                          setIsInputTheirCopastorOpen(false);
                                        }}
                                      >
                                        {`${copastor?.member?.firstNames} ${copastor?.member?.lastNames}`}
                                        <CheckIcon
                                          className={cn(
                                            'ml-auto h-4 w-4',
                                            copastor?.id === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </>
                              ) : (
                                copastorsQuery?.data?.length === 0 && (
                                  <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                    ❌No hay co-pastores disponibles.
                                  </p>
                                )
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
            </div>

            {isMessageErrorDisabled ? (
              <p className='mt-0 -mb-4 md:-mt-5 md:col-start-1 md:col-end-3 md:row-start-3 md:row-end-4 mx-auto md:w-[100%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                ❌ Datos incompletos, completa todos los campos para crear el registro.
              </p>
            ) : (
              <p className='order-last -mt-3 md:-mt-6 md:col-start-1 md:col-end-3 mx-auto md:w-[70%] lg:w-[50%] text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                ¡Campos completados correctamente!
              </p>
            )}

            <div className='md:mt-2 lg:mt-2 col-start-1 col-end-3 row-start-3 row-end-4 w-full md:w-[20rem] md:m-auto'>
              <Toaster position='top-center' richColors />
              <Button
                disabled={isSubmitButtonDisabled}
                type='submit'
                className={cn(
                  'w-full text-[14px]',
                  supervisorCreationMutation?.isPending &&
                    'bg-emerald-500 hover:bg-emerald-500 disabled:opacity-100 disabled:md:text-[15px] text-white'
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
                {supervisorCreationMutation?.isPending ? 'Procesando...' : 'Registrar Supervisor'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SupervisorCreatePage;
