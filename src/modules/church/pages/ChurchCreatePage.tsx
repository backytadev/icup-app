/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import type * as z from 'zod';
import { Toaster } from 'sonner';
import { useForm } from 'react-hook-form';

import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { CalendarIcon } from 'lucide-react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import {
  ChurchServiceTime,
  ChurchServiceTimeNames,
} from '@/modules/church/enums/church-service-time.enum';
import { getMainChurch } from '@/modules/church/services/church.service';
import { churchFormSchema } from '@/modules/church/validations/church-form-schema';

import { useChurchCreationMutation } from '@/modules/church/hooks/useChurchCreationMutation';
import { useChurchCreationSubmitButtonLogic } from '@/modules/church/hooks/useChurchCreationSubmitButtonLogic';

import { cn } from '@/shared/lib/utils';
import { PageTitle } from '@/shared/components/page-header/PageTitle';
import { PageSubTitle } from '@/shared/components/page-header/PageSubTitle';

import { DistrictNames } from '@/shared/enums/district.enum';
import { Country, CountryNames } from '@/shared/enums/country.enum';
import { UrbanSectorNames } from '@/shared/enums/urban-sector.enum';
import { Province, ProvinceNames } from '@/shared/enums/province.enum';
import { Department, DepartmentNames } from '@/shared/enums/department.enum';

import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

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
  SelectContent,
  SelectTrigger,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Calendar } from '@/shared/components/ui/calendar';
import { Textarea } from '@/shared/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

export const ChurchCreatePage = (): JSX.Element => {
  //* States
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isInputMainChurchOpen, setIsInputMainChurchOpen] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);
  const [isInputFoundingDateOpen, setIsInputFoundingDateOpen] = useState<boolean>(false);

  //* Hooks (external libraries)
  const { pathname } = useLocation();

  //* Form
  const form = useForm<z.infer<typeof churchFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(churchFormSchema),
    defaultValues: {
      churchName: '',
      abbreviatedChurchName: '',
      isAnexe: false,
      email: '',
      phoneNumber: '',
      country: Country.Perú,
      department: Department.Lima,
      province: Province.Lima,
      district: '',
      urbanSector: '',
      address: '',
      serviceTimes: [],
      referenceAddress: '',
      theirMainChurch: '',
    },
  });

  //* Watchers
  const isAnexe = form.watch('isAnexe');
  const district = form.watch('district');

  //* Effects
  useEffect(() => {
    form.resetField('urbanSector', {
      keepError: true,
    });
  }, [district]);

  useEffect(() => {
    form.resetField('theirMainChurch', {
      keepError: true,
    });
  }, [isAnexe]);

  useEffect(() => {
    document.title = 'Modulo Iglesia - IcupApp';
  }, []);

  //* Helpers
  const districtsValidation = validateDistrictsAllowedByModule(pathname);
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(district);

  //* Custom hooks
  useChurchCreationSubmitButtonLogic({
    churchCreationForm: form,
    isInputDisabled,
    setIsSubmitButtonDisabled,
    setIsMessageErrorDisabled,
  });

  const churchCreationMutation = useChurchCreationMutation({
    churchCreationForm: form,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  //* Queries
  const { data } = useQuery({
    queryKey: ['mainChurch'],
    queryFn: getMainChurch,
    retry: false,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof churchFormSchema>): void => {
    churchCreationMutation.mutate(formData);
  };

  return (
    <div className='animate-fadeInPage'>
      <PageTitle className='text-slate-500 dark:text-slate-400'>Modulo Iglesia</PageTitle>

      <PageSubTitle
        subTitle='Crear una nueva iglesia'
        description='Por favor llena los siguientes datos para crear una nueva iglesia.'
      />

      <div className='flex flex-col items-center pb-8 px-5 py-4 sm:px-12 sm:py-4 2xl:px-[5rem] 2xl:py-8 max-h-full'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='w-full flex flex-col md:grid grid-cols-2 gap-x-10 gap-y-4'
          >
            <div className='col-start-1 col-end-2'>
              <FormField
                control={form.control}
                name='churchName'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Nombre
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Asigna una nombre a la nueva iglesia.
                      </FormDescription>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          className='text-[14px] md:text-[14px]'
                          disabled={isInputDisabled}
                          placeholder='Ejem: Iglesia Cristiana Unidos en su Presencia - Roca Fuerte'
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
                name='abbreviatedChurchName'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Nombre abreviado
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Asigna una abreviación de nombre a la nueva iglesia.
                      </FormDescription>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          className='text-[14px] md:text-[14px]'
                          disabled={isInputDisabled}
                          placeholder='Ejem: ICUP - Roca Fuerte'
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
                name='foundingDate'
                render={({ field }) => (
                  <FormItem className='mt-3'>
                    <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                      Fecha de fundación
                    </FormLabel>
                    <FormDescription className='text-[13.5px] md:text-[14px]'>
                      Asigna la fecha de fundación de la nueva iglesia.
                    </FormDescription>
                    <Popover
                      open={isInputFoundingDateOpen}
                      onOpenChange={setIsInputFoundingDateOpen}
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
                              <span className='text-[14px] md:text-[14px]'>
                                Selecciona la fecha de fundación
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
                            setIsInputFoundingDateOpen(false);
                          }}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage className='text-[13px]' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='serviceTimes'
                render={() => (
                  <FormItem>
                    <div className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Horarios
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Selecciona los horarios de culto que tendrá la nueva iglesia.
                      </FormDescription>
                    </div>
                    <div className='flex flex-wrap space-x-5 space-y-1'>
                      {Object.values(ChurchServiceTime).map((serviceTime) => (
                        <FormField
                          key={serviceTime}
                          control={form.control}
                          name='serviceTimes'
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={serviceTime}
                                className='text-[14px] flex items-center space-x-2 space-y-0'
                              >
                                <FormControl className='grid'>
                                  <Checkbox
                                    disabled={isInputDisabled}
                                    checked={field.value?.includes(serviceTime)}
                                    onCheckedChange={(checked) => {
                                      let updatedServiceTimes: ChurchServiceTime[] = [];
                                      checked
                                        ? (updatedServiceTimes = field.value
                                            ? [...field.value, serviceTime]
                                            : [serviceTime])
                                        : (updatedServiceTimes =
                                            field.value?.filter((value) => value !== serviceTime) ??
                                            []);

                                      field.onChange(updatedServiceTimes);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className='text-[14px] md:text-[14px] font-medium cursor-pointer'>
                                  {ChurchServiceTimeNames[serviceTime]}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage className='text-[13px]' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        E-mail
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Asigna un e-mail a la nueva iglesia.
                      </FormDescription>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          className='text-[14px] md:text-[14px]'
                          disabled={isInputDisabled}
                          placeholder='Ejem: iglesia.rocafuerte@gmail.com'
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
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Número de teléfono
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Asigna un número telefónico a la nueva iglesia.
                      </FormDescription>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          className='text-[14px] md:text-[14px]'
                          disabled={isInputDisabled}
                          placeholder='Ejem: +51 999-999-999'
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
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>País</FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Asigna el país al que pertenece la nueva iglesia.
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
                            <SelectItem
                              className={`text-[14px] md:text-[14px]`}
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
            </div>

            <div className='-mt-3 md:mt-0 col-start-2 col-end-3'>
              <FormField
                control={form.control}
                name='department'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Departamento
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Asigna el departamento al que pertenece la nueva iglesia.
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
                            <SelectItem
                              className={`text-[14px] md:text-[14px]`}
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
                name='province'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Provincia
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Asigna la provincia a la que pertenece la nueva iglesia.
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
                            <SelectItem
                              className={`text-[14px] md:text-[14px]`}
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
                name='district'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Distrito
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Asigna el distrito al que pertenece la iglesia.
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
                              className={`text-[14px] md:text-[14px] ${districtsValidation?.districtsDataResult?.includes(value) ? 'hidden' : ''}`}
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
                name='urbanSector'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3 md:mt-5'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Sector Urbano
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Asigna el sector urbano al que pertenece la nueva iglesia.
                      </FormDescription>
                      <Select
                        disabled={isInputDisabled}
                        onValueChange={field.onChange}
                        value={field.value}
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
                              className={`text-[14px] md:text-[14px] ${(urbanSectorsValidation?.urbanSectorsDataResult?.includes(value) ?? !district) ? 'hidden' : ''}`}
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
                name='address'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3 md:mt-5'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Dirección
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Asigna la dirección de la nueva iglesia.
                      </FormDescription>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          className='text-[14px] md:text-[14px]'
                          disabled={isInputDisabled}
                          placeholder='Ejem: Av. Central 123 - Mz.A Lt.3'
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
                    <FormItem className='mt-3 md:mt-5'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Referencia de dirección
                      </FormLabel>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Textarea
                          className='text-[14px] md:text-[14px]'
                          disabled={isInputDisabled}
                          placeholder='Comentarios de referencia sobre la ubicación de la iglesia...'
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
                name='isAnexe'
                render={({ field }) => (
                  <FormItem className='flex flex-row gap-2 items-end mt-3 px-1 py-3 h-[2.5rem]'>
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
                      <FormLabel className='text-[14px] md:text-[14px] cursor-pointer'>
                        ¿Esta iglesia sera un anexo?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {isAnexe && (
                <FormField
                  control={form.control}
                  name='theirMainChurch'
                  render={({ field }) => {
                    return (
                      <FormItem className='mt-3'>
                        <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                          Iglesia Principal
                        </FormLabel>
                        <FormDescription className='text-[13.5px] md:text-[14px]'>
                          Asigna una iglesia principal para este anexo.
                        </FormDescription>
                        <Popover
                          open={isInputMainChurchOpen}
                          onOpenChange={setIsInputMainChurchOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Button
                                disabled={isInputDisabled}
                                variant='outline'
                                role='combobox'
                                className={cn('text-[14px] md:text-[14px] w-full justify-between')}
                              >
                                {field.value
                                  ? data?.find((church) => church.id === field.value)
                                      ?.abbreviatedChurchName
                                  : 'Busque y seleccione una iglesia'}
                                <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align='center' className='w-auto px-4 py-2'>
                            <Command>
                              {data?.length && data?.length > 0 ? (
                                <>
                                  <CommandInput
                                    placeholder='Busque una iglesia'
                                    className='h-9 text-[14px] md:text-[14px]'
                                  />
                                  <CommandEmpty>Iglesia no encontrada.</CommandEmpty>
                                  <CommandGroup className='max-h-[200px] h-auto'>
                                    {data?.map((church) => (
                                      <CommandItem
                                        className='text-[14px] md:text-[14px]'
                                        value={church?.abbreviatedChurchName}
                                        key={church?.id}
                                        onSelect={() => {
                                          form.setValue('theirMainChurch', church?.id);
                                          setIsInputMainChurchOpen(false);
                                        }}
                                      >
                                        {church?.abbreviatedChurchName}
                                        <CheckIcon
                                          className={cn(
                                            'ml-auto h-4 w-4',
                                            church.id === field.value ? 'opacity-100' : 'opacity-0'
                                          )}
                                        />
                                      </CommandItem>
                                    ))}

                                    {data?.length === 0 && (
                                      <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                        ❌No hay iglesias disponibles.
                                      </p>
                                    )}
                                  </CommandGroup>
                                </>
                              ) : (
                                data?.length === 0 && (
                                  <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                    ❌Iglesia Central no disponible.
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
              <p className='-mb-5 mt-2 md:-mb-2 md:row-start-2 md:row-end-3 md:col-start-1 md:col-end-3 mx-auto md:w-[100%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                ❌ Datos incompletos, completa todos los campos para crear el registro.
              </p>
            ) : (
              <p className='-mt-2 order-last md:-mt-2 md:row-start-4 md:row-end-5 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                ¡Campos completados correctamente! <br />
              </p>
            )}

            <div className='mt-2 md:mt-1 md:col-start-1 md:col-end-3 md:row-start-3 md:row-end-4 w-full md:w-[20rem] md:m-auto'>
              <Toaster position='top-center' richColors />
              <Button
                disabled={isSubmitButtonDisabled}
                type='submit'
                className={cn(
                  'w-full text-[14px]',
                  churchCreationMutation?.isPending &&
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
                {churchCreationMutation?.isPending ? 'Procesando...' : 'Registrar Iglesia'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChurchCreatePage;
