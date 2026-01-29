import { useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { CalendarIcon } from 'lucide-react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { ChurchServiceTime, ChurchServiceTimeNames } from '@/modules/church/enums';
import { getMainChurch } from '@/modules/church/services/church.service';
import { churchFormSchema } from '@/modules/church/schemas';
import { type ChurchResponse } from '@/modules/church/types';
import { ChurchFormSkeleton } from '@/modules/church/components';

import {
  useChurchUpdateEffects,
  useChurchUpdateMutation,
  useChurchUpdateSubmitButtonLogic,
} from '@/modules/church/hooks';

import { cn } from '@/shared/lib/utils';

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
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

interface ChurchFormUpdateProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: ChurchResponse | undefined;
}

export const ChurchUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: ChurchFormUpdateProps): JSX.Element => {
  //* States
  const [isLoadingData, setIsLoadingData] = useState(true);
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
      email: '',
      foundingDate: undefined,
      serviceTimes: [],
      isAnexe: false,
      phoneNumber: '',
      country: '',
      department: '',
      province: '',
      district: '',
      urbanSector: '',
      address: '',
      referenceAddress: '',
      recordStatus: '',
      theirMainChurch: '',
    },
  });

  //* Watchers
  const isAnexe = form.watch('isAnexe');
  const district = form.watch('district');

  //* Helpers
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(district);
  const districtsValidation = validateDistrictsAllowedByModule(pathname);

  //* Custom hooks
  useChurchUpdateEffects({
    id,
    data,
    setIsLoadingData,
    churchUpdateForm: form,
  });

  useChurchUpdateSubmitButtonLogic({
    churchUpdateForm: form,
    isInputDisabled,
    setIsSubmitButtonDisabled,
    setIsMessageErrorDisabled,
  });

  const churchUpdateMutation = useChurchUpdateMutation({
    dialogClose,
    scrollToTop,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  //* Queries
  const mainChurchQuery = useQuery({
    queryKey: ['mainChurch', id],
    queryFn: getMainChurch,
    retry: false,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof churchFormSchema>): void => {
    churchUpdateMutation.mutate({ id, formData });
  };

  return (
    <div className='w-full max-w-[1120px] mx-auto'>
      {isLoadingData ? (
        <ChurchFormSkeleton />
      ) : (
        <div className='w-full'>
          {/* Header */}
          <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 dark:from-amber-600 dark:via-orange-600 dark:to-orange-700 px-6 py-5'>
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-2 mb-1'>
                <span className='px-2.5 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter'>
                  Actualización
                </span>
                <span className='px-2.5 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter'>
                  {data?.isAnexe ? 'Anexo' : 'Iglesia Central'}
                </span>
              </div>
              <h2 className='text-xl md:text-2xl font-bold text-white font-outfit leading-tight'>
                Modificar Iglesia
              </h2>
              <p className='text-white/80 text-[13px] md:text-[14px] font-inter'>
                {data?.abbreviatedChurchName} - {data?.district}
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='p-5 md:p-6'
              >
                {/* Sección: Información General */}
                <div className='mb-6'>
                  <div className='mb-4'>
                    <span className='text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-inter'>
                      Información General
                    </span>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
                    <FormField
                      control={form.control}
                      name='churchName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                            Nombre de la Iglesia
                          </FormLabel>
                          <FormDescription className='text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
                            Nombre completo de la iglesia.
                          </FormDescription>
                          <FormControl>
                            <Input
                              className='text-[13px] md:text-[14px] font-inter'
                              disabled={isInputDisabled}
                              placeholder='Ejem: Iglesia Cristiana Unidos en su Presencia'
                              type='text'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className='text-[12px]' />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='abbreviatedChurchName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                            Nombre Abreviado
                          </FormLabel>
                          <FormDescription className='text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
                            Abreviación del nombre.
                          </FormDescription>
                          <FormControl>
                            <Input
                              className='text-[13px] md:text-[14px] font-inter'
                              disabled={isInputDisabled}
                              placeholder='Ejem: ICUP - Roca Fuerte'
                              type='text'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className='text-[12px]' />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='foundingDate'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                            Fecha de Fundación
                          </FormLabel>
                          <FormDescription className='text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
                            Fecha en que se fundó la iglesia.
                          </FormDescription>
                          <Popover
                            open={isInputFoundingDateOpen}
                            onOpenChange={setIsInputFoundingDateOpen}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  disabled={isInputDisabled}
                                  variant='outline'
                                  className={cn(
                                    'w-full pl-3 text-left font-normal text-[13px] md:text-[14px] font-inter',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'LLL dd, y', { locale: es })
                                  ) : (
                                    <span>Selecciona la fecha</span>
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
                          <FormMessage className='text-[12px]' />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='serviceTimes'
                      render={() => (
                        <FormItem>
                          <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                            Horarios de Culto
                          </FormLabel>
                          <FormDescription className='text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
                            Selecciona los horarios disponibles.
                          </FormDescription>
                          <div className='flex flex-wrap gap-x-4 gap-y-2 mt-2'>
                            {Object.values(ChurchServiceTime).map((serviceTime) => (
                              <FormField
                                key={serviceTime}
                                control={form.control}
                                name='serviceTimes'
                                render={({ field }) => (
                                  <FormItem
                                    key={serviceTime}
                                    className='flex items-center space-x-2 space-y-0'
                                  >
                                    <FormControl>
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
                                              field.value?.filter(
                                                (value) => value !== serviceTime
                                              ) ?? []);
                                          field.onChange(updatedServiceTimes);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className='text-[12px] md:text-[13px] font-medium text-slate-600 dark:text-slate-400 font-inter cursor-pointer'>
                                      {ChurchServiceTimeNames[serviceTime]}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage className='text-[12px]' />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className='border-t border-slate-200 dark:border-slate-700/50 my-5'></div>

                {/* Sección: Contacto */}
                <div className='mb-6'>
                  <div className='mb-4'>
                    <span className='text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-inter'>
                      Información de Contacto
                    </span>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                            Correo Electrónico
                          </FormLabel>
                          <FormDescription className='text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
                            Email de contacto de la iglesia.
                          </FormDescription>
                          <FormControl>
                            <Input
                              className='text-[13px] md:text-[14px] font-inter'
                              disabled={isInputDisabled}
                              placeholder='Ejem: iglesia.central@example.com'
                              type='email'
                              autoComplete='username'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className='text-[12px]' />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='phoneNumber'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                            Número de Teléfono
                          </FormLabel>
                          <FormDescription className='text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
                            Teléfono de contacto.
                          </FormDescription>
                          <FormControl>
                            <Input
                              className='text-[13px] md:text-[14px] font-inter'
                              disabled={isInputDisabled}
                              placeholder='Ejem: +51 999 999 999'
                              type='text'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className='text-[12px]' />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className='border-t border-slate-200 dark:border-slate-700/50 my-5'></div>

                {/* Sección: Ubicación */}
                <div className='mb-6'>
                  <div className='mb-4'>
                    <span className='text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-inter'>
                      Ubicación
                    </span>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4'>
                    <FormField
                      control={form.control}
                      name='country'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                            País
                          </FormLabel>
                          <Select
                            disabled={isInputDisabled}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className='text-[13px] md:text-[14px] font-inter'>
                                {field.value ? (
                                  <SelectValue placeholder='Selecciona el país' />
                                ) : (
                                  'Selecciona el país'
                                )}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(CountryNames).map(([key, value]) => (
                                <SelectItem className='text-[13px]' key={key} value={key}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className='text-[12px]' />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='department'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                            Departamento
                          </FormLabel>
                          <Select
                            disabled={isInputDisabled}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className='text-[13px] md:text-[14px] font-inter'>
                                {field.value ? (
                                  <SelectValue placeholder='Selecciona el departamento' />
                                ) : (
                                  'Selecciona el departamento'
                                )}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(DepartmentNames).map(([key, value]) => (
                                <SelectItem className='text-[13px]' key={key} value={key}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className='text-[12px]' />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='province'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                            Provincia
                          </FormLabel>
                          <Select
                            disabled={isInputDisabled}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className='text-[13px] md:text-[14px] font-inter'>
                                {field.value ? (
                                  <SelectValue placeholder='Selecciona la provincia' />
                                ) : (
                                  'Selecciona la provincia'
                                )}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(ProvinceNames).map(([key, value]) => (
                                <SelectItem className='text-[13px]' key={key} value={key}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className='text-[12px]' />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='district'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                            Distrito
                          </FormLabel>
                          <Select
                            disabled={isInputDisabled}
                            onValueChange={field.onChange}
                            onOpenChange={() => {
                              form.resetField('urbanSector', { defaultValue: '' });
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className='text-[13px] md:text-[14px] font-inter'>
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
                                  className={`text-[13px] ${districtsValidation?.districtsDataResult?.includes(value) ? 'hidden' : ''}`}
                                  key={key}
                                  value={key}
                                >
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className='text-[12px]' />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='urbanSector'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                            Sector Urbano
                          </FormLabel>
                          <Select
                            disabled={isInputDisabled}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className='text-[13px] md:text-[14px] font-inter'>
                                {field.value ? (
                                  <SelectValue placeholder='Selecciona el sector' />
                                ) : (
                                  'Selecciona el sector'
                                )}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(UrbanSectorNames).map(([key, value]) => (
                                <SelectItem
                                  className={`text-[13px] ${(urbanSectorsValidation?.urbanSectorsDataResult?.includes(value) ?? !district) ? 'hidden' : ''}`}
                                  key={key}
                                  value={key}
                                >
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className='text-[12px]' />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='address'
                      render={({ field }) => (
                        <FormItem className='md:col-span-2 lg:col-span-1'>
                          <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                            Dirección
                          </FormLabel>
                          <FormControl>
                            <Input
                              className='text-[13px] md:text-[14px] font-inter'
                              disabled={isInputDisabled}
                              placeholder='Ej: Av. Central 123 - Mz.A Lt.3'
                              type='text'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className='text-[12px]' />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='referenceAddress'
                      render={({ field }) => (
                        <FormItem className='md:col-span-2 lg:col-span-3'>
                          <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                            Referencia de Dirección
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className='text-[13px] md:text-[14px] font-inter resize-none'
                              disabled={isInputDisabled}
                              placeholder='Comentarios sobre la ubicación de referencia...'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className='text-[12px]' />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className='border-t border-slate-200 dark:border-slate-700/50 my-5'></div>

                {/* Sección: Configuración */}
                <div className='mb-6'>
                  <div className='mb-4'>
                    <span className='text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-inter'>
                      Configuración
                    </span>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
                    <div className='space-y-4'>
                      <FormField
                        control={form.control}
                        name='isAnexe'
                        render={({ field }) => (
                          <FormItem className='flex flex-row items-center gap-3 p-3 rounded-lg bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/30'>
                            <FormControl>
                              <Checkbox
                                disabled={isInputDisabled}
                                checked={field?.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  form.resetField('theirMainChurch', { keepError: true });
                                }}
                              />
                            </FormControl>
                            <div className='space-y-0.5'>
                              <FormLabel className='text-[13px] md:text-[14px] font-medium text-slate-700 dark:text-slate-300 font-inter cursor-pointer'>
                                ¿Esta iglesia es un anexo?
                              </FormLabel>
                              <FormDescription className='text-[11px] md:text-[12px] text-slate-500 dark:text-slate-400 font-inter'>
                                Marca esta opción si depende de una iglesia principal.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {isAnexe && (
                        <FormField
                          control={form.control}
                          name='theirMainChurch'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                                Iglesia Principal
                              </FormLabel>
                              <FormDescription className='text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
                                Selecciona la iglesia principal de este anexo.
                              </FormDescription>
                              <Popover
                                open={isInputMainChurchOpen}
                                onOpenChange={setIsInputMainChurchOpen}
                              >
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      value={field.value}
                                      disabled={isInputDisabled}
                                      variant='outline'
                                      role='combobox'
                                      className={cn(
                                        'w-full justify-between text-[13px] md:text-[14px] font-inter'
                                      )}
                                    >
                                      {field.value
                                        ? mainChurchQuery?.data?.find(
                                          (church) => church.id === field.value
                                        )?.abbreviatedChurchName
                                        : 'Buscar iglesia...'}
                                      <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent align='center' className='w-auto px-4 py-2'>
                                  <Command>
                                    {mainChurchQuery?.data?.length &&
                                      mainChurchQuery?.data?.length > 0 ? (
                                      <>
                                        <CommandInput
                                          placeholder='Buscar iglesia...'
                                          className='h-9 text-[13px]'
                                        />
                                        <CommandEmpty>Iglesia no encontrada.</CommandEmpty>
                                        <CommandGroup className='max-h-[200px] h-auto'>
                                          {mainChurchQuery?.data?.map((church) => (
                                            <CommandItem
                                              className='text-[13px]'
                                              value={church.abbreviatedChurchName}
                                              key={church.id}
                                              onSelect={() => {
                                                form.setValue('theirMainChurch', church?.id);
                                                setIsInputMainChurchOpen(false);
                                              }}
                                            >
                                              {church.abbreviatedChurchName}
                                              <CheckIcon
                                                className={cn(
                                                  'ml-auto h-4 w-4',
                                                  church.id === field.value
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                                )}
                                              />
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </>
                                    ) : (
                                      mainChurchQuery?.data?.length === 0 && (
                                        <p className='text-[13px] font-medium text-red-500 text-center py-2'>
                                          Iglesia Central no disponible.
                                        </p>
                                      )
                                    )}
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              <FormMessage className='text-[12px]' />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name='recordStatus'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                            Estado del Registro
                          </FormLabel>
                          <Select
                            disabled={isInputDisabled}
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className='text-[13px] md:text-[14px] font-inter'>
                                {field.value === 'active' ? (
                                  <SelectValue placeholder='Activo' />
                                ) : (
                                  <SelectValue placeholder='Inactivo' />
                                )}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem className='text-[13px]' value='active'>
                                Activo
                              </SelectItem>
                              <SelectItem className='text-[13px]' value='inactive'>
                                Inactivo
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {form.getValues('recordStatus') === 'active' && (
                            <FormDescription className='text-[11px] md:text-[12px] text-slate-500 dark:text-slate-400 font-inter mt-2'>
                              El registro está{' '}
                              <span className='text-emerald-600 dark:text-emerald-400 font-semibold'>
                                Activo
                              </span>
                              . Para inactivarlo, use el módulo de{' '}
                              <span className='text-red-500 font-semibold'>Inactivar Iglesia</span>.
                            </FormDescription>
                          )}
                          {form.getValues('recordStatus') === 'inactive' && (
                            <FormDescription className='text-[11px] md:text-[12px] text-slate-500 dark:text-slate-400 font-inter mt-2'>
                              El registro está{' '}
                              <span className='text-red-500 font-semibold'>Inactivo</span>. Puede
                              cambiar el estado seleccionando otra opción.
                            </FormDescription>
                          )}
                          <FormMessage className='text-[12px]' />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className='border-t border-slate-200 dark:border-slate-700/50 my-5'></div>

                {/* Footer: Messages and Submit Button */}
                <div className='flex flex-col items-center gap-4'>
                  {isMessageErrorDisabled ? (
                    <p className='text-center text-[12px] md:text-[13px] font-medium text-red-500 font-inter px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30'>
                      Datos incompletos. Completa todos los campos requeridos.
                    </p>
                  ) : (
                    <p className='text-center text-[12px] md:text-[13px] font-medium text-emerald-600 dark:text-emerald-400 font-inter px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30'>
                      Campos completados. Puedes guardar los cambios.
                    </p>
                  )}

                  <Button
                    disabled={isSubmitButtonDisabled}
                    type='submit'
                    className={cn(
                      'w-full md:w-[280px] text-[13px] md:text-[14px] font-semibold font-inter',
                      'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
                      'hover:from-amber-600 hover:to-orange-600',
                      'shadow-sm hover:shadow-md hover:shadow-amber-500/20',
                      'transition-all duration-200',
                      churchUpdateMutation?.isPending &&
                      'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-500'
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
                    {churchUpdateMutation?.isPending ? 'Procesando...' : 'Guardar Cambios'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};
