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

import { MinistryTypeNames } from '@/modules/ministry/enums/ministry-type.enum';
import { ministryFormSchema } from '@/modules/ministry/validations/ministry-form-schema';

import { useMinistryCreationMutation } from '@/modules/ministry/hooks/useMinistryCreationMutation';
import { useMinistryCreationSubmitButtonLogic } from '@/modules/ministry/hooks/useMinistryCreationSubmitButtonLogic';

import { cn } from '@/shared/lib/utils';
import { PageTitle } from '@/shared/components/page-header/PageTitle';
import { PageSubTitle } from '@/shared/components/page-header/PageSubTitle';

import {
  MinistryServiceTime,
  MinistryServiceTimeNames,
} from '@/modules/ministry/enums/ministry-service-time.enum';
import { DistrictNames } from '@/shared/enums/district.enum';
import { Country, CountryNames } from '@/shared/enums/country.enum';
import { UrbanSectorNames } from '@/shared/enums/urban-sector.enum';
import { Province, ProvinceNames } from '@/shared/enums/province.enum';
import { Department, DepartmentNames } from '@/shared/enums/department.enum';

import { getFullNames } from '@/shared/helpers/get-full-names.helper';
import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

import { getSimplePastors } from '@/modules/pastor/services/pastor.service';

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

export const MinistryCreatePage = (): JSX.Element => {
  //* States
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);
  const [isInputTheirPastorOpen, setIsInputTheirPastorOpen] = useState<boolean>(false);
  const [isInputFoundingDateOpen, setIsInputFoundingDateOpen] = useState<boolean>(false);

  //* Hooks (external libraries)
  const { pathname } = useLocation();

  //* Form
  const form = useForm<z.infer<typeof ministryFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(ministryFormSchema),
    defaultValues: {
      customMinistryName: '',
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
      theirPastor: '',
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
    document.title = 'Modulo Ministerio - IcupApp';
  }, []);

  //* Helpers
  const districtsValidation = validateDistrictsAllowedByModule(pathname);
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(district);

  //* Custom hooks
  useMinistryCreationSubmitButtonLogic({
    ministryCreationForm: form,
    isInputDisabled,
    setIsSubmitButtonDisabled,
    setIsMessageErrorDisabled,
  });

  const ministryCreationMutation = useMinistryCreationMutation({
    ministryCreationForm: form,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  //* Queries
  const { data } = useQuery({
    queryKey: ['pastors'],
    queryFn: () => getSimplePastors({ isSimpleQuery: true }),
    retry: false,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof ministryFormSchema>): void => {
    ministryCreationMutation.mutate(formData);
  };

  return (
    <div className='animate-fadeInPage'>
      <PageTitle className='text-amber-500 dark:text-amber-400'>Modulo Ministerio</PageTitle>

      <PageSubTitle
        subTitle='Crear un nuevo ministerio'
        description='Por favor llena los siguientes datos para crear un nuevo ministerio.'
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
                name='ministryType'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Tipo de ministerio
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Selecciona el tipo de ministerio para este registro.
                      </FormDescription>
                      <Select
                        disabled={isInputDisabled}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona el tipo de ministerio' />
                            ) : (
                              'Selecciona el tipo de ministerio'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(MinistryTypeNames).map(([key, value]) => (
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
                name='customMinistryName'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Nombre personalizado
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Asigna un nombre personalizado al nuevo ministerio.
                      </FormDescription>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          className='text-[14px] md:text-[14px]'
                          disabled={isInputDisabled}
                          placeholder='Ejem: Jóvenes en Acción para Cristo'
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
                      Asigna la fecha de fundación del nuevo ministerio.
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
                        Selecciona los horarios de culto o de servicio que tendrá el ministerio.
                      </FormDescription>
                    </div>
                    <div className='flex flex-wrap space-x-5 space-y-1'>
                      {Object.values(MinistryServiceTime).map((serviceTime) => (
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
                                      let updatedServiceTimes: MinistryServiceTime[] = [];
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
                                  {MinistryServiceTimeNames[serviceTime]}
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
                      <FormLabel className='text-[14px] font-medium'>
                        E-mail
                        <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                          Opcional
                        </span>
                      </FormLabel>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Ejem: ministerio.juvenil@gmail.com'
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
                name='country'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>País</FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Asigna el país al que pertenece el nuevo ministerio.
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
                        Asigna el departamento al que pertenece el nuevo ministerio.
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
                        Asigna la provincia al que pertenece el nuevo ministerio.
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
                        Asigna el distrito al que pertenece el nuevo ministerio.
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
                        Asigna el sector urbano al que pertenece el nuevo ministerio.
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
                        Asigna la dirección del nuevo ministerio.
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
                          placeholder='Comentarios de referencia sobre la ubicación del ministerio...'
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
                name='theirPastor'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14.5px] md:text-[15px] font-bold'>
                        Pastor
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Asigna el Pastor responsable para este Ministerio.
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
                                'w-full justify-between overflow-hidden',
                                !field.value && 'text-slate-500 font-normal text-[14px]'
                              )}
                            >
                              {field.value
                                ? `${data?.find((pastor) => pastor.id === field.value)?.member?.firstNames} ${data?.find((pastor) => pastor.id === field.value)?.member?.lastNames}`
                                : 'Busque y seleccione un pastor'}
                              <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align='center' className='w-auto px-4 py-2'>
                          <Command>
                            {data?.length && data?.length > 0 ? (
                              <>
                                <CommandInput
                                  placeholder='Busque un pastor'
                                  className='h-9 text-[14px]'
                                />
                                <CommandEmpty>Pastor no encontrado.</CommandEmpty>
                                <CommandGroup className='max-h-[200px] h-auto'>
                                  {data?.map((pastor) => (
                                    <CommandItem
                                      className='text-[14px]'
                                      value={getFullNames({
                                        firstNames: pastor.member?.firstNames ?? '',
                                        lastNames: pastor.member?.lastNames ?? '',
                                      })}
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
                              data?.length === 0 && (
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
                  ministryCreationMutation?.isPending &&
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
                {ministryCreationMutation?.isPending ? 'Procesando...' : 'Registrar Ministerio'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default MinistryCreatePage;
