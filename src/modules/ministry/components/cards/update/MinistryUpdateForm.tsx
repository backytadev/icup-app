/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { CalendarIcon } from 'lucide-react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import {
  MinistryServiceTime,
  MinistryServiceTimeNames,
} from '@/modules/ministry/enums/ministry-service-time.enum';
import { getSimplePastors } from '@/modules/pastor/services/pastor.service';
import { ministryFormSchema } from '@/modules/ministry/validations/ministry-form-schema';
import { type MinistryResponse } from '@/modules/ministry/interfaces/ministry-response.interface';
import { MinistryFormSkeleton } from '@/modules/ministry/components/cards/update/MinistryFormSkeleton';
import { AlertUpdateRelationMinistry } from '@/modules/ministry/components/alerts/AlertUpdateRelationMinistry';

import { useMinistryUpdateEffects } from '@/modules/ministry/hooks/useMinistryUpdateEffects';
import { useMinistryUpdateMutation } from '@/modules/ministry/hooks/useMinistryUpdateMutation';
import { useMinistryUpdateSubmitButtonLogic } from '@/modules/ministry/hooks/useMinistryUpdateSubmitButtonLogic';

import { cn } from '@/shared/lib/utils';
import { getFullNames } from '@/shared/helpers/get-full-names.helper';

import { CountryNames } from '@/shared/enums/country.enum';
import { ProvinceNames } from '@/shared/enums/province.enum';
import { DistrictNames } from '@/shared/enums/district.enum';
import { DepartmentNames } from '@/shared/enums/department.enum';
import { UrbanSectorNames } from '@/shared/enums/urban-sector.enum';

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
  SelectTrigger,
  SelectContent,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Calendar } from '@/shared/components/ui/calendar';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { MinistryType, MinistryTypeNames } from '@/modules/ministry/enums/ministry-type.enum';

interface MinistryFormUpdateProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: MinistryResponse | undefined;
}

export const MinistryUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: MinistryFormUpdateProps): JSX.Element => {
  //* States
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isInputTheirPastorOpen, setIsInputTheirPastorOpen] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);
  const [isInputFoundingDateOpen, setIsInputFoundingDateOpen] = useState<boolean>(false);

  const [changedId, setChangedId] = useState(data?.theirPastor?.id);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  //* Hooks (external libraries)
  const { pathname } = useLocation();

  //* Form
  const form = useForm<z.infer<typeof ministryFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(ministryFormSchema),
    defaultValues: {
      ministryType: '',
      customMinistryName: '',
      email: '',
      foundingDate: undefined,
      serviceTimes: [],
      phoneNumber: '',
      country: '',
      department: '',
      province: '',
      district: '',
      urbanSector: '',
      address: '',
      referenceAddress: '',
      recordStatus: '',
      theirPastor: '',
    },
  });

  //* Watchers
  const district = form.watch('district');

  //* Effects
  useEffect(() => {
    if (data && data?.theirPastor?.id !== changedId) {
      setTimeout(() => {
        setIsAlertDialogOpen(true);
      }, 100);
    }
  }, [changedId]);

  //* Helpers
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(district);
  const districtsValidation = validateDistrictsAllowedByModule(pathname);

  //* Custom hooks
  useMinistryUpdateEffects({
    id,
    data,
    setIsLoadingData,
    ministryUpdateForm: form,
  });

  useMinistryUpdateSubmitButtonLogic({
    ministryUpdateForm: form,
    isInputDisabled,
    setIsSubmitButtonDisabled,
    setIsMessageErrorDisabled,
  });

  const ministryUpdateMutation = useMinistryUpdateMutation({
    dialogClose,
    scrollToTop,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  //* Queries
  const pastorsQuery = useQuery({
    queryKey: ['pastors', id],
    queryFn: () => getSimplePastors({ isSimpleQuery: true }),
    retry: false,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof ministryFormSchema>): void => {
    ministryUpdateMutation.mutate({ id, formData });
  };

  return (
    <Tabs
      defaultValue='general-info'
      className='w-auto -mt-8 sm:w-[520px] md:w-[680px] lg:w-[990px] xl:w-[1100px]'
    >
      <h2 className='text-center leading-7 text-orange-500 pb-2 font-bold text-[24px] sm:text-[26px] md:text-[28px]'>
        Modificar información del Ministerio
      </h2>

      <TabsContent value='general-info'>
        <Card className='w-full'>
          {isLoadingData && <MinistryFormSkeleton />}

          {!isLoadingData && (
            <CardContent className='py-3 px-4'>
              <div className='italic dark:text-slate-300 text-slate-500 font-bold text-[16.5px] md:text-[18px] pl-0 mb-4 md:pl-4'>
                Ministerio: {data?.customMinistryName} ~{' '}
                {MinistryTypeNames[data?.ministryType as MinistryType]}
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className='w-full flex flex-col md:grid md:grid-cols-2 gap-x-10 gap-y-5 px-2 sm:px-12'
                >
                  <div className='col-start-1 col-end-2'>
                    <FormField
                      control={form.control}
                      name='ministryType'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-3 hidden'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Tipo de ministerio
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Selecciona el tipo de ministerio para este registro.
                            </FormDescription>
                            <Select disabled onValueChange={field.onChange} value={field.value}>
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
                              Nombre
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asigna un nombre personalizado al ministerio.
                            </FormDescription>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                className='text-[14px]'
                                disabled={isInputDisabled}
                                placeholder='Ejem: Jóvenes en Acción'
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
                        <FormItem className='mt-2'>
                          <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                            Fecha de fundación
                          </FormLabel>
                          <FormDescription className='text-[13.5px] md:text-[14px]'>
                            Asigna la fecha de fundación del ministerio.
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
                                disabled={(date) =>
                                  date > new Date() || date < new Date('1900-01-01')
                                }
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
                          <div className='mt-2'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Horarios
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Selecciona los horarios de culto o de servicio que tendrá el
                              ministerio.
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
                                                  field.value?.filter(
                                                    (value) => value !== serviceTime
                                                  ) ?? []);

                                            field.onChange(updatedServiceTimes);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className='text-[14px] font-medium'>
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
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              E-mail
                              <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                                Opcional
                              </span>
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asigna un e-mail al ministerio.
                            </FormDescription>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                className='text-[14px]'
                                disabled={isInputDisabled}
                                placeholder='Ejem: ministerio.juvenil@example.com'
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
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Número de teléfono
                              <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                                Opcional
                              </span>
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asigne un número telefónico que tendrá el ministerio.
                            </FormDescription>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                className='text-[14px]'
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
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              País
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asigna el país al que pertenece el ministerio.
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
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Departamento
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asigna el departamento al que pertenece el ministerio.
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
                  </div>

                  <div className='col-start-2 col-end-3'>
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
                              Asigna la provincia a la que pertenece el ministerio.
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
                          <FormItem className='mt-3'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Distrito
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asigna el distrito al que pertenece el ministerio.
                            </FormDescription>
                            <Select
                              disabled={isInputDisabled}
                              onValueChange={field.onChange}
                              onOpenChange={() => {
                                form.resetField('urbanSector', {
                                  defaultValue: '',
                                });
                              }}
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
                      name='urbanSector'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Sector Urbano
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asigna el sector urbano al que pertenece el ministerio.
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
                                    className={`text-[14px] ${(urbanSectorsValidation?.urbanSectorsDataResult?.includes(value) ?? !district) ? 'hidden' : ''}`}
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
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Dirección
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asigna la dirección del ministerio.
                            </FormDescription>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                className='text-[14px]'
                                disabled={isInputDisabled}
                                placeholder='Ej: Av. Central 123 - Mz.A Lt.3'
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
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Referencia de dirección
                            </FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Textarea
                                disabled={isInputDisabled}
                                placeholder='Comentarios sobre la ubicación de referencia de la iglesia...'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        );
                      }}
                    />

                    <AlertUpdateRelationMinistry
                      data={data}
                      changedId={changedId}
                      setChangedId={setChangedId}
                      isAlertDialogOpen={isAlertDialogOpen}
                      setIsAlertDialogOpen={setIsAlertDialogOpen}
                      copastorUpdateForm={form}
                      pastorsQuery={pastorsQuery}
                    />

                    <FormField
                      control={form.control}
                      name='theirPastor'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-3'>
                            <FormLabel className='text-[14px] md:text-[15px] font-bold'>
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
                                      ? `${pastorsQuery?.data?.find((pastor) => pastor.id === field.value)?.member?.firstNames} ${pastorsQuery?.data?.find((pastor) => pastor.id === field.value)?.member?.lastNames}`
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
                                        {pastorsQuery?.data?.map((pastor) => (
                                          <CommandItem
                                            className='text-[14px]'
                                            value={getFullNames({
                                              firstNames: pastor?.member?.firstNames ?? '',
                                              lastNames: pastor?.member?.lastNames ?? '',
                                            })}
                                            key={pastor.id}
                                            onSelect={() => {
                                              form.setValue('theirPastor', pastor.id);
                                              setChangedId(pastor.id);
                                              setIsInputTheirPastorOpen(false);
                                            }}
                                          >
                                            {`${pastor?.member?.firstNames} ${pastor?.member?.lastNames}`}
                                            <CheckIcon
                                              className={cn(
                                                'ml-auto h-4 w-4',
                                                pastor?.id === field.value
                                                  ? 'opacity-100'
                                                  : 'opacity-0'
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

                    <FormField
                      control={form.control}
                      name='recordStatus'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>Estado</FormLabel>
                            <Select
                              disabled={isInputDisabled}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl className='text-[14px]'>
                                <SelectTrigger>
                                  {field.value === 'active' ? (
                                    <SelectValue placeholder='Activo' />
                                  ) : (
                                    <SelectValue placeholder='Inactivo' />
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem className='text-[14px]' value='active'>
                                  Activo
                                </SelectItem>
                                <SelectItem className='text-[14px]' value='inactive'>
                                  Inactivo
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {form.getValues('recordStatus') === 'active' && (
                              <FormDescription className='pl-2 text-[12.5px] xl:text-[13px] font-bold'>
                                *El registro esta <span className='text-green-500'>Activo</span>,
                                para colocarla como <span className='text-red-500'>Inactivo</span>{' '}
                                debe inactivar el registro desde el modulo{' '}
                                <span className='font-bold text-red-500'>
                                  <a
                                    target='_blank'
                                    href='/ministries/inactivate'
                                    className='text-red-500 hover:text-red-600 underline font-bold transition-colors'
                                  >
                                    Inactivar Ministerio.
                                  </a>
                                </span>
                              </FormDescription>
                            )}
                            {form.getValues('recordStatus') === 'inactive' && (
                              <FormDescription className='pl-2 text-[12.5px] xl:text-[13px] font-bold'>
                                * El registro esta <span className='text-red-500 '>Inactivo</span>,
                                puede modificar el estado eligiendo otra opción.
                              </FormDescription>
                            )}
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  {isMessageErrorDisabled ? (
                    <p className='-mb-5 mt-4 md:mt-0 md:-mb-3 md:row-start-2 md:row-end-3 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                      ❌ Datos incompletos, completa todos los campos para guardar el registro.
                    </p>
                  ) : (
                    <p className='-mt-3 order-last md:-mt-3 md:row-start-4 md:row-end-5 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                      ¡Campos completados correctamente! <br /> Para finalizar por favor guarde los
                      cambios.
                    </p>
                  )}

                  <div className='mt-2 md:mt-1 md:col-start-1 md:col-end-3 md:row-start-3 md:row-end-4 w-full md:w-[20rem] md:m-auto'>
                    <Button
                      disabled={isSubmitButtonDisabled}
                      type='submit'
                      className={cn(
                        'w-full text-[14px]',
                        ministryUpdateMutation?.isPending &&
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
                      {ministryUpdateMutation?.isPending ? 'Procesando...' : 'Guardar cambios'}
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
