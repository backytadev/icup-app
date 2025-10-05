/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import type * as z from 'zod';
import { Toaster } from 'sonner';
import { useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/shared/lib/utils';

import { DistrictNames } from '@/shared/enums/district.enum';
import { Country, CountryNames } from '@/shared/enums/country.enum';
import { Province, ProvinceNames } from '@/shared/enums/province.enum';
import { Department, DepartmentNames } from '@/shared/enums/department.enum';

import { PageTitle } from '@/shared/components/page-header/PageTitle';
import { PageSubTitle } from '@/shared/components/page-header/PageSubTitle';

import { zoneFormSchema } from '@/modules/zone/validations/zone-form-schema';
import { getSimpleSupervisors } from '@/modules/supervisor/services/supervisor.service';

import { useZoneCreationMutation } from '@/modules/zone/hooks/useZoneCreationMutation';
import { useZoneCreationSubmitButtonLogic } from '@/modules/zone/hooks/useZoneCreationSubmitButtonLogic';

import { getFullNames } from '@/shared/helpers/get-full-names.helper';
import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/shared/components/ui/form';
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from '@/shared/components/ui/command';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

export const ZoneCreatePage = (): JSX.Element => {
  //* States
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isInputTheirSupervisorOpen, setIsInputTheirSupervisorOpen] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);

  //* Hooks (external libraries)
  const { pathname } = useLocation();

  //* Form
  const form = useForm<z.infer<typeof zoneFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(zoneFormSchema),
    defaultValues: {
      zoneName: '',
      country: Country.Perú,
      department: Department.Lima,
      province: Province.Lima,
      district: '',
      theirSupervisor: '',
    },
  });

  //* Helpers
  const districtsValidation = validateDistrictsAllowedByModule(pathname);

  //* Effects
  useEffect(() => {
    document.title = 'Modulo Zona - IcupApp';
  }, []);

  //* Custom hooks
  useZoneCreationSubmitButtonLogic({
    zoneCreationForm: form,
    isInputDisabled,
    setIsSubmitButtonDisabled,
    setIsMessageErrorDisabled,
  });

  const zoneCreationMutation = useZoneCreationMutation({
    zoneCreationForm: form,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  //* Queries
  const { data } = useQuery({
    queryKey: ['supervisors-for-zone'],
    queryFn: () => getSimpleSupervisors({ isNullZone: true, isSimpleQuery: true }),
    retry: false,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof zoneFormSchema>): void => {
    zoneCreationMutation.mutate(formData);
  };

  return (
    <div className='animate-fadeInPage'>
      <PageTitle className='text-cyan-400 dark:text-cyan-500'>Modulo Zona</PageTitle>

      <PageSubTitle
        subTitle='Crear una nueva zona'
        description='Por favor llena los siguientes datos para crear una nueva zona.'
      />

      <div className='flex min-h-full flex-col items-center justify-between px-6 py-4 sm:px-10 sm:py-6 2xl:px-[5rem] 2xl:py-10'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='max-w-md w-full flex flex-col gap-3 md:gap-4'
          >
            <FormField
              control={form.control}
              name='zoneName'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Nombre</FormLabel>
                    <FormDescription className='text-[13.5px] md:text-[14px]'>
                      Asigna una nombre a la nueva zona.
                    </FormDescription>
                    <FormControl className='text-[14px] md:text-[14px]'>
                      <Input
                        disabled={isInputDisabled}
                        placeholder='Ejem: Jerusalem Alta'
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
              name='country'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>País</FormLabel>
                    <FormDescription className='text-[13.5px] md:text-[14px]'>
                      Asigna el país al que pertenece la nueva zona.
                    </FormDescription>
                    <Select
                      disabled={isInputDisabled}
                      onValueChange={field.onChange}
                      value={field.value}
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
              name='department'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                      Departamento
                    </FormLabel>
                    <FormDescription className='text-[13.5px] md:text-[14px]'>
                      Asigna el departamento al que pertenece la nueva zona.
                    </FormDescription>
                    <Select
                      disabled={isInputDisabled}
                      onValueChange={field.onChange}
                      value={field.value}
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
              name='province'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                      Provincia
                    </FormLabel>
                    <FormDescription className='text-[13.5px] md:text-[14px]'>
                      Asigna la provincia a la que pertenece la nueva zona.
                    </FormDescription>
                    <Select
                      disabled={isInputDisabled}
                      onValueChange={field.onChange}
                      value={field.value}
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
              name='district'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                      Distrito
                    </FormLabel>
                    <FormDescription className='text-[13.5px] md:text-[14px]'>
                      Asigna el distrito al que pertenece la nueva zona.
                    </FormDescription>
                    <Select
                      disabled={isInputDisabled}
                      onValueChange={field.onChange}
                      value={field.value}
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
              name='theirSupervisor'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                      Supervisor
                    </FormLabel>
                    <FormDescription className='text-[13.5px] md:text-[14px]'>
                      Asigna el Supervisor responsable de esta Zona.
                    </FormDescription>
                    <Popover
                      open={isInputTheirSupervisorOpen}
                      onOpenChange={setIsInputTheirSupervisorOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Button
                            disabled={isInputDisabled}
                            variant='outline'
                            role='combobox'
                            className={cn('w-full justify-between ')}
                          >
                            {field.value
                              ? `${data?.find((supervisor) => supervisor.id === field.value)?.member?.firstNames} ${data?.find((supervisor) => supervisor.id === field.value)?.member?.lastNames}`
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
                                placeholder='Busque un supervisor'
                                className='h-9 text-[14px]'
                              />
                              <CommandEmpty>Supervisor no encontrado.</CommandEmpty>
                              <CommandGroup
                                className={cn(
                                  'max-h-[200px] h-auto',
                                  data?.length === 0 && 'w-[340px]'
                                )}
                              >
                                {data?.map((supervisor) => (
                                  <CommandItem
                                    className='text-[14px]'
                                    value={getFullNames({
                                      firstNames: supervisor?.member?.firstNames ?? '',
                                      lastNames: supervisor?.member?.lastNames ?? '',
                                    })}
                                    key={supervisor?.id}
                                    onSelect={() => {
                                      form.setValue('theirSupervisor', supervisor?.id);
                                      setIsInputTheirSupervisorOpen(false);
                                    }}
                                  >
                                    {`${supervisor?.member?.firstNames} ${supervisor?.member?.lastNames}`}
                                    <CheckIcon
                                      className={cn(
                                        'ml-auto h-4 w-4',
                                        supervisor.id === field.value ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </>
                          ) : (
                            (!data || data?.length === 0) && (
                              <p className='text-[13.5px] md:text-[14.5px] w-[20rem] font-medium text-red-500 text-center'>
                                ❌ No se encontró supervisores disponibles, todos están asignados a
                                una zona.
                              </p>
                            )
                          )}
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage className='text-[13px]' />
                    <FormDescription className='text-[12.5px] md:text-[13px] text-blue-500 italic font-medium'>
                      * Si no hay supervisores disponibles o necesitas uno nuevo, debes crearlo en{' '}
                      <Link className='text-green-500 underline' to={'/supervisors/create'}>
                        Crear Supervisor.
                      </Link>
                    </FormDescription>
                  </FormItem>
                );
              }}
            />

            {isMessageErrorDisabled ? (
              <p className='-mb-4 mt-2 md:-mb-2 md:row-start-2 md:row-end-3 md:col-start-1 md:col-end-3 mx-auto md:w-[100%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                ❌ Datos incompletos, completa todos los campos para crear el registro.
              </p>
            ) : (
              <p className='-mt-2 order-last md:-mt-2 md:row-start-4 md:row-end-5 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                ¡Campos completados correctamente! <br />
              </p>
            )}

            <div className='mt-2 w-full md:w-[20rem] md:m-auto'>
              <Toaster position='top-center' richColors />
              <Button
                disabled={isSubmitButtonDisabled}
                type='submit'
                className={cn(
                  'w-full text-[14px]',
                  zoneCreationMutation?.isPending &&
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
                {zoneCreationMutation?.isPending ? 'Procesando...' : 'Registrar Zona'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ZoneCreatePage;
