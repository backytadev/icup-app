import { memo } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type UseQueryResult } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { CalendarIcon } from 'lucide-react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import {
  MinistryServiceTime,
  MinistryServiceTimeNames,
} from '@/modules/ministry/enums/ministry-service-time.enum';
import { MinistryTypeNames } from '@/modules/ministry/enums/ministry-type.enum';
import { type MinistryFormData, type MinistryResponse } from '@/modules/ministry/types';
import { AlertUpdateRelationMinistry } from '@/modules/ministry/components/alerts/AlertUpdateRelationMinistry';

import { type PastorResponse } from '@/modules/pastor/interfaces/pastor-response.interface';

import { cn } from '@/shared/lib/utils';
import { getFullNames } from '@/shared/helpers/get-full-names.helper';

import { CountryNames } from '@/shared/enums/country.enum';
import { DistrictNames } from '@/shared/enums/district.enum';
import { ProvinceNames } from '@/shared/enums/province.enum';
import { DepartmentNames } from '@/shared/enums/department.enum';
import { UrbanSectorNames } from '@/shared/enums/urban-sector.enum';

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

type FormMode = 'create' | 'update';

//* Hoisted static JSX - prevents recreation on every render
const FormDivider = memo(() => (
  <div className='border-t border-slate-200 dark:border-slate-700/50 my-5' />
));
FormDivider.displayName = 'FormDivider';

//* Section header component - memoized
const SectionHeader = memo(({ title }: { title: string }) => (
  <div className='mb-4'>
    <span className='text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-inter'>
      {title}
    </span>
  </div>
));
SectionHeader.displayName = 'SectionHeader';

//* Pre-computed arrays to avoid Object.entries on every render
const countryEntries = Object.entries(CountryNames);
const departmentEntries = Object.entries(DepartmentNames);
const provinceEntries = Object.entries(ProvinceNames);
const districtEntries = Object.entries(DistrictNames);
const urbanSectorEntries = Object.entries(UrbanSectorNames);
const ministryTypeEntries = Object.entries(MinistryTypeNames);
const serviceTimeValues = Object.values(MinistryServiceTime);

interface MinistryFormFieldsProps {
  mode: FormMode;
  form: UseFormReturn<MinistryFormData>;
  data?: MinistryResponse;
  isInputDisabled: boolean;
  isSubmitButtonDisabled: boolean;
  isFormValid: boolean;
  isPending: boolean;
  isInputTheirPastorOpen: boolean;
  setIsInputTheirPastorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInputFoundingDateOpen: boolean;
  setIsInputFoundingDateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pastorsData: PastorResponse[] | undefined;
  district: string;
  districtsValidation: { districtsDataResult: string[] | undefined } | undefined;
  urbanSectorsValidation: { urbanSectorsDataResult: string[] | undefined } | undefined;
  handleSubmit: (formData: MinistryFormData) => void;
  //* Alert dialog props (optional - only for update mode)
  changedPastorId?: string | undefined;
  setChangedPastorId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  isAlertDialogOpen?: boolean;
  setIsAlertDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  pastorsQuery?: UseQueryResult<PastorResponse[], Error>;
}

const formConfig = {
  create: {
    submitButtonText: 'Registrar Ministerio',
    submitButtonPendingText: 'Procesando...',
    successMessage: 'Campos completados. Puedes registrar el ministerio.',
    buttonGradient: 'from-emerald-500 to-teal-500',
    buttonHoverGradient: 'hover:from-emerald-600 hover:to-teal-600',
    buttonShadow: 'hover:shadow-emerald-500/20',
    pendingGradient: 'from-emerald-600 to-teal-600',
  },
  update: {
    submitButtonText: 'Guardar Cambios',
    submitButtonPendingText: 'Procesando...',
    successMessage: 'Campos completados. Puedes guardar los cambios.',
    buttonGradient: 'from-amber-500 to-orange-500',
    buttonHoverGradient: 'hover:from-amber-600 hover:to-orange-600',
    buttonShadow: 'hover:shadow-amber-500/20',
    pendingGradient: 'from-emerald-500 to-teal-500',
  },
};

export const MinistryFormFields = ({
  mode,
  form,
  data,
  isInputDisabled,
  isSubmitButtonDisabled,
  isFormValid,
  isPending,
  isInputTheirPastorOpen,
  setIsInputTheirPastorOpen,
  isInputFoundingDateOpen,
  setIsInputFoundingDateOpen,
  pastorsData,
  district,
  districtsValidation,
  urbanSectorsValidation,
  handleSubmit,
  //* Alert dialog props
  changedPastorId,
  setChangedPastorId,
  isAlertDialogOpen,
  setIsAlertDialogOpen,
  pastorsQuery,
}: MinistryFormFieldsProps): JSX.Element => {
  const config = formConfig[mode];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='p-5 md:p-6'>
        {/* Sección: Información General */}
        <div className='mb-6'>
          <SectionHeader title='Información General' />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
            <FormField
              control={form.control}
              name='ministryType'
              render={({ field }) => (
                <FormItem className={mode === 'update' ? 'hidden' : ''}>
                  <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Tipo de Ministerio
                  </FormLabel>
                  <FormDescription className='text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
                    Selecciona el tipo de ministerio.
                  </FormDescription>
                  <Select
                    disabled={isInputDisabled || mode === 'update'}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='text-[13px] md:text-[14px] font-inter'>
                        {field.value ? (
                          <SelectValue placeholder='Selecciona el tipo' />
                        ) : (
                          'Selecciona el tipo'
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ministryTypeEntries.map(([key, value]) => (
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
              name='customMinistryName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Nombre Personalizado
                  </FormLabel>
                  <FormDescription className='text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
                    Nombre del ministerio.
                  </FormDescription>
                  <FormControl>
                    <Input
                      className='text-[13px] md:text-[14px] font-inter'
                      disabled={isInputDisabled}
                      placeholder='Ejem: Jóvenes en Acción para Cristo'
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
                    Fecha en que se fundó el ministerio.
                  </FormDescription>
                  <Popover open={isInputFoundingDateOpen} onOpenChange={setIsInputFoundingDateOpen}>
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
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
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
                    Horarios de Servicio
                  </FormLabel>
                  <FormDescription className='text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
                    Selecciona los horarios disponibles.
                  </FormDescription>
                  <div className='flex flex-wrap gap-x-4 gap-y-2 mt-2'>
                    {serviceTimeValues.map((serviceTime) => (
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
                                  const updatedServiceTimes = checked
                                    ? [...(field.value ?? []), serviceTime]
                                    : field.value?.filter((value) => value !== serviceTime) ?? [];
                                  field.onChange(updatedServiceTimes);
                                }}
                              />
                            </FormControl>
                            <FormLabel className='text-[12px] md:text-[13px] font-medium text-slate-600 dark:text-slate-400 font-inter cursor-pointer'>
                              {MinistryServiceTimeNames[serviceTime]}
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

        <FormDivider />

        {/* Sección: Contacto */}
        <div className='mb-6'>
          <SectionHeader title='Información de Contacto' />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Correo Electrónico
                    <span className='ml-2 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full'>
                      Opcional
                    </span>
                  </FormLabel>
                  <FormDescription className='text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
                    Email de contacto del ministerio.
                  </FormDescription>
                  <FormControl>
                    <Input
                      className='text-[13px] md:text-[14px] font-inter'
                      disabled={isInputDisabled}
                      placeholder='Ejem: ministerio.juvenil@gmail.com'
                      type='email'
                      autoComplete='email'
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
                    <span className='ml-2 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full'>
                      Opcional
                    </span>
                  </FormLabel>
                  <FormDescription className='text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
                    Teléfono de contacto.
                  </FormDescription>
                  <FormControl>
                    <Input
                      className='text-[13px] md:text-[14px] font-inter'
                      disabled={isInputDisabled}
                      placeholder='Ejem: +51 999-999-999'
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

        <FormDivider />

        {/* Sección: Ubicación */}
        <div className='mb-6'>
          <SectionHeader title='Ubicación' />

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4'>
            <FormField
              control={form.control}
              name='country'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    País
                  </FormLabel>
                  <Select disabled={isInputDisabled} onValueChange={field.onChange} value={field.value}>
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
                      {countryEntries.map(([key, value]) => (
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
                  <Select disabled={isInputDisabled} onValueChange={field.onChange} value={field.value}>
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
                      {departmentEntries.map(([key, value]) => (
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
                  <Select disabled={isInputDisabled} onValueChange={field.onChange} value={field.value}>
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
                      {provinceEntries.map(([key, value]) => (
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
                      if (mode === 'update') {
                        form.resetField('urbanSector', { defaultValue: '' });
                      }
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
                      {districtEntries.map(([key, value]) => (
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
                  <Select disabled={isInputDisabled} onValueChange={field.onChange} value={field.value}>
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
                      {urbanSectorEntries.map(([key, value]) => (
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

        <FormDivider />

        {/* Sección: Relaciones */}
        <div className='mb-6'>
          <SectionHeader title='Relaciones' />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
            <FormField
              control={form.control}
              name='theirPastor'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Pastor
                  </FormLabel>
                  <FormDescription className='text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
                    Selecciona el Pastor responsable.
                  </FormDescription>
                  <Popover open={isInputTheirPastorOpen} onOpenChange={setIsInputTheirPastorOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={isInputDisabled}
                          variant='outline'
                          role='combobox'
                          className={cn(
                            'w-full justify-between text-[13px] md:text-[14px] font-inter'
                          )}
                        >
                          {field.value
                            ? `${pastorsData?.find((pastor) => pastor.id === field.value)?.member?.firstNames} ${pastorsData?.find((pastor) => pastor.id === field.value)?.member?.lastNames}`
                            : 'Buscar pastor...'}
                          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align='center' className='w-auto px-4 py-2'>
                      <Command>
                        {pastorsData?.length && pastorsData?.length > 0 ? (
                          <>
                            <CommandInput
                              placeholder='Buscar pastor...'
                              className='h-9 text-[13px]'
                            />
                            <CommandEmpty>Pastor no encontrado.</CommandEmpty>
                            <CommandGroup className='max-h-[200px] h-auto'>
                              {pastorsData?.map((pastor) => (
                                <CommandItem
                                  className='text-[13px]'
                                  value={getFullNames({
                                    firstNames: pastor?.member?.firstNames ?? '',
                                    lastNames: pastor?.member?.lastNames ?? '',
                                  })}
                                  key={pastor.id}
                                  onSelect={() => {
                                    form.setValue('theirPastor', pastor?.id, {
                                      shouldValidate: true,
                                    });
                                    if (mode === 'update' && setChangedPastorId) {
                                      setChangedPastorId(pastor?.id);
                                    }
                                    setIsInputTheirPastorOpen(false);
                                  }}
                                >
                                  {`${pastor?.member?.firstNames} ${pastor?.member?.lastNames}`}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      pastor.id === field.value ? 'opacity-100' : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </>
                        ) : (
                          <p className='text-[13px] font-medium text-red-500 text-center py-2'>
                            No hay pastores disponibles.
                          </p>
                        )}
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage className='text-[12px]' />
                </FormItem>
              )}
            />

            {/* Alert Dialog for Pastor Change */}
            {mode === 'update' && isAlertDialogOpen !== undefined && setIsAlertDialogOpen && pastorsQuery && setChangedPastorId && (
              <AlertUpdateRelationMinistry
                data={data}
                isAlertDialogOpen={isAlertDialogOpen}
                setIsAlertDialogOpen={setIsAlertDialogOpen}
                pastorsQuery={pastorsQuery}
                ministryUpdateForm={form}
                setChangedId={setChangedPastorId}
                changedId={changedPastorId}
              />
            )}


            {mode === 'update' ? (
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
                    {form.getValues('recordStatus') === 'active' ? (
                      <FormDescription className='text-[11px] md:text-[12px] text-slate-500 dark:text-slate-400 font-inter mt-2'>
                        El registro está{' '}
                        <span className='text-emerald-600 dark:text-emerald-400 font-semibold'>
                          Activo
                        </span>
                        . Para inactivarlo, use el módulo de{' '}
                        <span className='text-red-500 font-semibold'>Inactivar Ministerio</span>.
                      </FormDescription>
                    ) : null}
                    {form.getValues('recordStatus') === 'inactive' ? (
                      <FormDescription className='text-[11px] md:text-[12px] text-slate-500 dark:text-slate-400 font-inter mt-2'>
                        El registro está{' '}
                        <span className='text-red-500 font-semibold'>Inactivo</span>. Puede cambiar
                        el estado seleccionando otra opción.
                      </FormDescription>
                    ) : null}
                    <FormMessage className='text-[12px]' />
                  </FormItem>
                )}
              />
            ) : null}
          </div>
        </div>

        <FormDivider />

        {/* Footer: Messages and Submit Button */}
        <div className='flex flex-col items-center gap-4'>
          {!isFormValid ? (
            <p className='text-center text-[12px] md:text-[13px] font-medium text-red-500 font-inter px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30'>
              Datos incompletos. Completa todos los campos requeridos.
            </p>
          ) : (
            <p className='text-center text-[12px] md:text-[13px] font-medium text-emerald-600 dark:text-emerald-400 font-inter px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30'>
              {config.successMessage}
            </p>
          )}

          <Button
            disabled={isSubmitButtonDisabled}
            type='submit'
            className={cn(
              'w-full md:w-[280px] text-[13px] md:text-[14px] font-semibold font-inter',
              `bg-gradient-to-r ${config.buttonGradient} text-white`,
              config.buttonHoverGradient,
              `shadow-sm hover:shadow-md ${config.buttonShadow}`,
              'transition-all duration-200',
              isPending && `bg-gradient-to-r ${config.pendingGradient} hover:${config.pendingGradient}`
            )}
          >
            {isPending ? (
              <span className='flex items-center gap-2'>
                <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                {config.submitButtonPendingText}
              </span>
            ) : (
              config.submitButtonText
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
