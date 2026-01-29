/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { CalendarIcon } from 'lucide-react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import {
  ChurchServiceTime,
  ChurchServiceTimeNames,
} from '@/modules/church/enums/church-service-time.enum';
import { useChurchCreateForm } from '@/modules/church/hooks/useChurchCreateForm';

import { cn } from '@/shared/lib/utils';

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

interface ChurchCreateFormProps {
  className?: string;
}

export const ChurchCreateForm = ({ className }: ChurchCreateFormProps): JSX.Element => {
  const {
    form,
    isInputDisabled,
    isSubmitButtonDisabled,
    isMessageErrorDisabled,
    isInputMainChurchOpen,
    setIsInputMainChurchOpen,
    isInputFoundingDateOpen,
    setIsInputFoundingDateOpen,
    mainChurchData,
    isAnexe,
    district,
    districtsValidation,
    urbanSectorsValidation,
    isPending,
    handleSubmit,
  } = useChurchCreateForm();

  return (
    <div className={cn('w-full', className)}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='w-full flex flex-col md:grid md:grid-cols-2 gap-x-8 gap-y-4'
        >
          {/* Left Column */}
          <div className='space-y-4'>
            {/* Church Name */}
            <FormField
              control={form.control}
              name='churchName'
              render={({ field }) => (
                <FormItem
                  className='opacity-0 animate-slide-in-up'
                  style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
                >
                  <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Nombre de la Iglesia
                  </FormLabel>
                  <FormDescription className='text-[13px] text-slate-500 dark:text-slate-400'>
                    Asigna un nombre a la nueva iglesia.
                  </FormDescription>
                  <FormControl>
                    <Input
                      className={cn(
                        'h-11 text-sm',
                        'transition-all duration-200',
                        'focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500'
                      )}
                      disabled={isInputDisabled}
                      placeholder='Ejem: Iglesia Cristiana Unidos en su Presencia'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-xs font-inter' />
                </FormItem>
              )}
            />

            {/* Abbreviated Name */}
            <FormField
              control={form.control}
              name='abbreviatedChurchName'
              render={({ field }) => (
                <FormItem
                  className='opacity-0 animate-slide-in-up'
                  style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
                >
                  <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Nombre Abreviado
                  </FormLabel>
                  <FormDescription className='text-[13px] text-slate-500 dark:text-slate-400'>
                    Asigna una abreviación de nombre a la nueva iglesia.
                  </FormDescription>
                  <FormControl>
                    <Input
                      className={cn(
                        'h-11 text-sm',
                        'transition-all duration-200',
                        'focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500'
                      )}
                      disabled={isInputDisabled}
                      placeholder='Ejem: ICUP - Roca Fuerte'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-xs font-inter' />
                </FormItem>
              )}
            />

            {/* Founding Date */}
            <FormField
              control={form.control}
              name='foundingDate'
              render={({ field }) => (
                <FormItem
                  className='opacity-0 animate-slide-in-up'
                  style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
                >
                  <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Fecha de Fundación
                  </FormLabel>
                  <FormDescription className='text-[13px] text-slate-500 dark:text-slate-400'>
                    Asigna la fecha de fundación de la nueva iglesia.
                  </FormDescription>
                  <Popover open={isInputFoundingDateOpen} onOpenChange={setIsInputFoundingDateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={isInputDisabled}
                          variant='outline'
                          className={cn(
                            'w-full h-11 pl-3 text-left font-normal text-sm',
                            'transition-all duration-200',
                            'hover:bg-slate-50 dark:hover:bg-slate-800',
                            !field.value && 'text-slate-400'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'LLL dd, y', { locale: es })
                          ) : (
                            <span>Selecciona la fecha de fundación</span>
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
                  <FormMessage className='text-xs font-inter' />
                </FormItem>
              )}
            />

            {/* Service Times */}
            <FormField
              control={form.control}
              name='serviceTimes'
              render={() => (
                <FormItem
                  className='opacity-0 animate-slide-in-up'
                  style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
                >
                  <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Horarios de Culto
                  </FormLabel>
                  <FormDescription className='text-[13px] text-slate-500 dark:text-slate-400'>
                    Selecciona los horarios de culto que tendrá la nueva iglesia.
                  </FormDescription>
                  <div className='flex flex-wrap gap-4 pt-2'>
                    {Object.values(ChurchServiceTime).map((serviceTime) => (
                      <FormField
                        key={serviceTime}
                        control={form.control}
                        name='serviceTimes'
                        render={({ field }) => (
                          <FormItem className='flex items-center space-x-2 space-y-0'>
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
                                className='data-[state=checked]:bg-slate-700 data-[state=checked]:border-slate-700'
                              />
                            </FormControl>
                            <FormLabel className='text-sm font-medium cursor-pointer text-slate-600 dark:text-slate-400'>
                              {ChurchServiceTimeNames[serviceTime]}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage className='text-xs font-inter' />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem
                  className='opacity-0 animate-slide-in-up'
                  style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
                >
                  <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Correo Electrónico
                  </FormLabel>
                  <FormDescription className='text-[13px] text-slate-500 dark:text-slate-400'>
                    Asigna un e-mail a la nueva iglesia.
                  </FormDescription>
                  <FormControl>
                    <Input
                      className={cn(
                        'h-11 text-sm',
                        'transition-all duration-200',
                        'focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500'
                      )}
                      disabled={isInputDisabled}
                      placeholder='Ejem: iglesia.rocafuerte@gmail.com'
                      type='email'
                      autoComplete='email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-xs font-inter' />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem
                  className='opacity-0 animate-slide-in-up'
                  style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}
                >
                  <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Número de Teléfono
                  </FormLabel>
                  <FormDescription className='text-[13px] text-slate-500 dark:text-slate-400'>
                    Asigna un número telefónico a la nueva iglesia.
                  </FormDescription>
                  <FormControl>
                    <Input
                      className={cn(
                        'h-11 text-sm',
                        'transition-all duration-200',
                        'focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500'
                      )}
                      disabled={isInputDisabled}
                      placeholder='Ejem: +51 999-999-999'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-xs font-inter' />
                </FormItem>
              )}
            />

            {/* Country */}
            <FormField
              control={form.control}
              name='country'
              render={({ field }) => (
                <FormItem
                  className='opacity-0 animate-slide-in-up'
                  style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
                >
                  <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    País
                  </FormLabel>
                  <FormDescription className='text-[13px] text-slate-500 dark:text-slate-400'>
                    Asigna el país al que pertenece la nueva iglesia.
                  </FormDescription>
                  <Select disabled={isInputDisabled} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='h-11 text-sm'>
                        {field.value ? (
                          <SelectValue placeholder='Selecciona el país' />
                        ) : (
                          'Selecciona el país'
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(CountryNames).map(([key, value]) => (
                        <SelectItem className='text-sm' key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-xs font-inter' />
                </FormItem>
              )}
            />
          </div>

          {/* Right Column */}
          <div className='space-y-4'>
            {/* Department */}
            <FormField
              control={form.control}
              name='department'
              render={({ field }) => (
                <FormItem
                  className='opacity-0 animate-slide-in-up'
                  style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
                >
                  <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Departamento
                  </FormLabel>
                  <FormDescription className='text-[13px] text-slate-500 dark:text-slate-400'>
                    Asigna el departamento al que pertenece la nueva iglesia.
                  </FormDescription>
                  <Select disabled={isInputDisabled} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='h-11 text-sm'>
                        {field.value ? (
                          <SelectValue placeholder='Selecciona el departamento' />
                        ) : (
                          'Selecciona el departamento'
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(DepartmentNames).map(([key, value]) => (
                        <SelectItem className='text-sm' key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-xs font-inter' />
                </FormItem>
              )}
            />

            {/* Province */}
            <FormField
              control={form.control}
              name='province'
              render={({ field }) => (
                <FormItem
                  className='opacity-0 animate-slide-in-up'
                  style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
                >
                  <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Provincia
                  </FormLabel>
                  <FormDescription className='text-[13px] text-slate-500 dark:text-slate-400'>
                    Asigna la provincia a la que pertenece la nueva iglesia.
                  </FormDescription>
                  <Select disabled={isInputDisabled} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='h-11 text-sm'>
                        {field.value ? (
                          <SelectValue placeholder='Selecciona la provincia' />
                        ) : (
                          'Selecciona la provincia'
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(ProvinceNames).map(([key, value]) => (
                        <SelectItem className='text-sm' key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-xs font-inter' />
                </FormItem>
              )}
            />

            {/* District */}
            <FormField
              control={form.control}
              name='district'
              render={({ field }) => (
                <FormItem
                  className='opacity-0 animate-slide-in-up'
                  style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
                >
                  <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Distrito
                  </FormLabel>
                  <FormDescription className='text-[13px] text-slate-500 dark:text-slate-400'>
                    Asigna el distrito al que pertenece la iglesia.
                  </FormDescription>
                  <Select disabled={isInputDisabled} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='h-11 text-sm'>
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
                          className={cn(
                            'text-sm',
                            districtsValidation?.districtsDataResult?.includes(value) && 'hidden'
                          )}
                          key={key}
                          value={key}
                        >
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-xs font-inter' />
                </FormItem>
              )}
            />

            {/* Urban Sector */}
            <FormField
              control={form.control}
              name='urbanSector'
              render={({ field }) => (
                <FormItem
                  className='opacity-0 animate-slide-in-up'
                  style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
                >
                  <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Sector Urbano
                  </FormLabel>
                  <FormDescription className='text-[13px] text-slate-500 dark:text-slate-400'>
                    Asigna el sector urbano al que pertenece la nueva iglesia.
                  </FormDescription>
                  <Select disabled={isInputDisabled} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='h-11 text-sm'>
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
                          className={cn(
                            'text-sm',
                            (urbanSectorsValidation?.urbanSectorsDataResult?.includes(value) ||
                              !district) &&
                              'hidden'
                          )}
                          key={key}
                          value={key}
                        >
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-xs font-inter' />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem
                  className='opacity-0 animate-slide-in-up'
                  style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
                >
                  <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Dirección
                  </FormLabel>
                  <FormDescription className='text-[13px] text-slate-500 dark:text-slate-400'>
                    Asigna la dirección de la nueva iglesia.
                  </FormDescription>
                  <FormControl>
                    <Input
                      className={cn(
                        'h-11 text-sm',
                        'transition-all duration-200',
                        'focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500'
                      )}
                      disabled={isInputDisabled}
                      placeholder='Ejem: Av. Central 123 - Mz.A Lt.3'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-xs font-inter' />
                </FormItem>
              )}
            />

            {/* Reference Address */}
            <FormField
              control={form.control}
              name='referenceAddress'
              render={({ field }) => (
                <FormItem
                  className='opacity-0 animate-slide-in-up'
                  style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}
                >
                  <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                    Referencia de Dirección
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className={cn(
                        'min-h-[80px] text-sm resize-none',
                        'transition-all duration-200',
                        'focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500'
                      )}
                      disabled={isInputDisabled}
                      placeholder='Comentarios de referencia sobre la ubicación de la iglesia...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-xs font-inter' />
                </FormItem>
              )}
            />

            {/* Is Anexe Checkbox */}
            <FormField
              control={form.control}
              name='isAnexe'
              render={({ field }) => (
                <FormItem
                  className='opacity-0 animate-slide-in-up flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'
                  style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
                >
                  <FormControl>
                    <Checkbox
                      disabled={isInputDisabled}
                      checked={field?.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                      className='data-[state=checked]:bg-slate-700 data-[state=checked]:border-slate-700'
                    />
                  </FormControl>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-sm font-medium cursor-pointer text-slate-700 dark:text-slate-300'>
                      ¿Esta iglesia será un anexo?
                    </FormLabel>
                    <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                      Marca esta opción si la iglesia depende de una iglesia principal.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Main Church (conditional) */}
            {isAnexe && (
              <FormField
                control={form.control}
                name='theirMainChurch'
                render={({ field }) => (
                  <FormItem
                    className='opacity-0 animate-slide-in-up'
                    style={{ animationDelay: '0.45s', animationFillMode: 'forwards' }}
                  >
                    <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                      Iglesia Principal
                    </FormLabel>
                    <FormDescription className='text-[13px] text-slate-500 dark:text-slate-400'>
                      Asigna una iglesia principal para este anexo.
                    </FormDescription>
                    <Popover open={isInputMainChurchOpen} onOpenChange={setIsInputMainChurchOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={isInputDisabled}
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'w-full h-11 justify-between text-sm',
                              'transition-all duration-200',
                              'hover:bg-slate-50 dark:hover:bg-slate-800'
                            )}
                          >
                            {field.value
                              ? mainChurchData?.find((church) => church.id === field.value)
                                  ?.abbreviatedChurchName
                              : 'Busque y seleccione una iglesia'}
                            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align='center' className='w-auto px-4 py-2'>
                        <Command>
                          {mainChurchData?.length && mainChurchData?.length > 0 ? (
                            <>
                              <CommandInput placeholder='Busque una iglesia' className='h-9 text-sm' />
                              <CommandEmpty>Iglesia no encontrada.</CommandEmpty>
                              <CommandGroup className='max-h-[200px] h-auto'>
                                {mainChurchData?.map((church) => (
                                  <CommandItem
                                    className='text-sm'
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
                              </CommandGroup>
                            </>
                          ) : (
                            <p className='text-sm font-medium text-red-500 text-center py-2'>
                              Iglesia Central no disponible.
                            </p>
                          )}
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage className='text-xs font-inter' />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Validation Message */}
          <div className='col-span-2 mt-4'>
            {isMessageErrorDisabled ? (
              <div
                className='p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
              >
                <p className='text-sm font-medium text-red-600 dark:text-red-400 text-center font-inter'>
                  Datos incompletos. Completa todos los campos para crear el registro.
                </p>
              </div>
            ) : (
              <div
                className='p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
              >
                <p className='text-sm font-medium text-emerald-600 dark:text-emerald-400 text-center font-inter'>
                  ¡Campos completados correctamente!
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div
            className='col-span-2 mt-4 opacity-0 animate-slide-in-up'
            style={{ animationDelay: '0.55s', animationFillMode: 'forwards' }}
          >
            <Button
              disabled={isSubmitButtonDisabled}
              type='submit'
              className={cn(
                'w-full md:w-auto md:min-w-[200px] h-12 font-semibold font-inter text-base text-white',
                'transition-all duration-300',
                'mx-auto block',
                !isPending && [
                  'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600',
                  'hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700',
                  'hover:shadow-lg hover:shadow-emerald-500/30',
                  'hover:scale-[1.02]',
                  'active:scale-[0.98]',
                  'dark:from-emerald-600 dark:via-emerald-700 dark:to-teal-700',
                  'dark:hover:from-emerald-500 dark:hover:via-emerald-600 dark:hover:to-teal-600',
                ],
                isPending && ['bg-emerald-600 hover:bg-emerald-600', 'cursor-wait']
              )}
              onClick={() => {
                setTimeout(() => {
                  if (Object.keys(form.formState.errors).length === 0) {
                    // Handled in hook
                  }
                }, 100);
              }}
            >
              {isPending ? (
                <span className='flex items-center gap-2'>
                  <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  Procesando...
                </span>
              ) : (
                'Registrar Iglesia'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
