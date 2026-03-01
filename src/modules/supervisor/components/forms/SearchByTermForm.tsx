import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/shared/lib/utils';

import {
  SupervisorSearchType,
  SupervisorSearchTypeNames,
} from '@/modules/supervisor/enums/supervisor-search-type.enum';
import {
  SubTypeNamesSupervisorSearchByFirstNames,
  SubTypeNamesSupervisorSearchByLastNames,
  SubTypeNamesSupervisorSearchByFullNames,
} from '@/modules/supervisor/enums/supervisor-search-sub-type.num';
import {
  SupervisorSearchNamesByGender,
  SupervisorSearchNamesByBirthMonth,
  SupervisorSearchNamesByRecordStatus,
  SupervisorSearchNamesByMaritalStatus,
} from '@/modules/supervisor/enums/supervisor-search-select-option.enum';

import { supervisorSearchByTermFormSchema } from '@/modules/supervisor/schemas';
import { type SupervisorSearchFormByTerm } from '@/modules/supervisor/types';

import { RecordOrder, RecordOrderNames } from '@/shared/enums/record-order.enum';
import { firstNamesFormatter, lastNamesFormatter } from '@/shared/helpers/names-formatter.helper';
import { dateFormatterTermToTimestamp } from '@/shared/helpers/date-formatter-to-timestamp.helper';

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
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Calendar } from '@/shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

interface SearchByTermFormProps {
  onSearch: (params: SupervisorSearchFormByTerm, formData: SupervisorSearchFormByTerm) => void;
}

export const SearchByTermForm = ({ onSearch }: SearchByTermFormProps): JSX.Element => {
  const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState<boolean>(true);

  const form = useForm<z.infer<typeof supervisorSearchByTermFormSchema>>({
    resolver: zodResolver(supervisorSearchByTermFormSchema),
    mode: 'onChange',
    defaultValues: {
      searchSubType: '' as any,
      limit: '10',
      inputTerm: '',
      firstNamesTerm: '',
      lastNamesTerm: '',
      selectTerm: '',
      dateTerm: undefined,
      all: false,
      order: RecordOrder.Descending,
    },
  });

  const searchType = form.watch('searchType');
  const limit = form.watch('limit');
  const order = form.watch('order');
  const all = form.watch('all');

  useEffect(() => {
    if (all) form.setValue('limit', '10');
  }, [all, form]);

  useEffect(() => {
    setIsDisabledSubmitButton(!limit || !order);
  }, [limit, order]);

  useEffect(() => {
    form.setValue('searchSubType', undefined);
  }, [searchType, form]);

  const handleSubmit = (formData: z.infer<typeof supervisorSearchByTermFormSchema>): void => {
    let newDateTermTo;
    if (!formData.dateTerm?.to) {
      newDateTermTo = formData.dateTerm?.from;
    }

    const newDateTerm = dateFormatterTermToTimestamp({
      from: formData.dateTerm?.from,
      to: formData.dateTerm?.to ? formData.dateTerm?.to : newDateTermTo,
    });

    const newNamesTerm = firstNamesFormatter(formData?.firstNamesTerm);
    const newLastNamesTerm = lastNamesFormatter(formData?.lastNamesTerm);

    const searchParams = {
      ...formData,
      firstNamesTerm: newNamesTerm,
      lastNamesTerm: newLastNamesTerm,
      dateTerm: newDateTerm as any,
    };

    onSearch(searchParams as SupervisorSearchFormByTerm, formData as SupervisorSearchFormByTerm);
    setIsDisabledSubmitButton(true);
    form.reset();
    setIsDisabledSubmitButton(false);
  };

  const getInputLabel = (): string => {
    switch (searchType) {
      case SupervisorSearchType.OriginCountry:
        return 'País (origen)';
      case SupervisorSearchType.ZoneName:
        return 'Nombre de Zona';
      case SupervisorSearchType.ResidenceCountry:
        return 'País (residencia)';
      case SupervisorSearchType.ResidenceDepartment:
        return 'Departamento (residencia)';
      case SupervisorSearchType.ResidenceProvince:
        return 'Provincia (residencia)';
      case SupervisorSearchType.ResidenceDistrict:
        return 'Distrito (residencia)';
      case SupervisorSearchType.ResidenceUrbanSector:
        return 'Sector Urbano (residencia)';
      case SupervisorSearchType.ResidenceAddress:
        return 'Dirección (residencia)';
      default:
        return 'Término';
    }
  };

  const getInputPlaceholder = (): string => {
    switch (searchType) {
      case SupervisorSearchType.OriginCountry:
        return 'Ej: Colombia, México, Perú...';
      case SupervisorSearchType.ZoneName:
        return 'Ej: Zona Norte, Zona Sur...';
      case SupervisorSearchType.ResidenceCountry:
        return 'Ej: Perú...';
      case SupervisorSearchType.ResidenceDepartment:
        return 'Ej: Lima, Ayacucho, Puno...';
      case SupervisorSearchType.ResidenceProvince:
        return 'Ej: Huaraz, Lima, Huamanga...';
      case SupervisorSearchType.ResidenceDistrict:
        return 'Ej: Independencia, Los Olivos, SJL...';
      case SupervisorSearchType.ResidenceUrbanSector:
        return 'Ej: Payet, Tahuantinsuyo, La Pascana...';
      case SupervisorSearchType.ResidenceAddress:
        return 'Ej: Jr. Pardo 123, Av. Central 555...';
      default:
        return 'Escribe lo que deseas buscar...';
    }
  };

  const showInputField =
    searchType === SupervisorSearchType.OriginCountry ||
    searchType === SupervisorSearchType.ZoneName ||
    searchType === SupervisorSearchType.ResidenceCountry ||
    searchType === SupervisorSearchType.ResidenceDepartment ||
    searchType === SupervisorSearchType.ResidenceProvince ||
    searchType === SupervisorSearchType.ResidenceDistrict ||
    searchType === SupervisorSearchType.ResidenceUrbanSector ||
    searchType === SupervisorSearchType.ResidenceAddress;

  const showSubTypeField =
    searchType === SupervisorSearchType.FirstNames ||
    searchType === SupervisorSearchType.LastNames ||
    searchType === SupervisorSearchType.FullNames;

  const showFirstNamesField =
    searchType === SupervisorSearchType.FirstNames || searchType === SupervisorSearchType.FullNames;

  const showLastNamesField =
    searchType === SupervisorSearchType.LastNames || searchType === SupervisorSearchType.FullNames;

  const showSelectField =
    searchType === SupervisorSearchType.RecordStatus ||
    searchType === SupervisorSearchType.BirthMonth ||
    searchType === SupervisorSearchType.Gender ||
    searchType === SupervisorSearchType.MaritalStatus;

  const getSelectLabel = (): string => {
    switch (searchType) {
      case SupervisorSearchType.Gender:
        return 'Género';
      case SupervisorSearchType.BirthMonth:
        return 'Mes de nacimiento';
      case SupervisorSearchType.MaritalStatus:
        return 'Estado civil';
      default:
        return 'Estado de registro';
    }
  };

  const getSelectOptions = (): Record<string, string> => {
    switch (searchType) {
      case SupervisorSearchType.Gender:
        return SupervisorSearchNamesByGender;
      case SupervisorSearchType.BirthMonth:
        return SupervisorSearchNamesByBirthMonth;
      case SupervisorSearchType.MaritalStatus:
        return SupervisorSearchNamesByMaritalStatus;
      default:
        return SupervisorSearchNamesByRecordStatus;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end'
      >
        {/* Search Type */}
        <FormField
          control={form.control}
          name='searchType'
          render={({ field }) => (
            <FormItem
              className='opacity-0 animate-slide-in-up'
              style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
            >
              <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                Tipo de Búsqueda
              </FormLabel>
              <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                ¿Qué tipo de búsqueda deseas?
              </FormDescription>
              <Select
                onOpenChange={() => {
                  form.resetField('dateTerm', { keepError: true });
                  form.resetField('selectTerm', { keepError: true });
                  form.resetField('inputTerm', { keepError: true });
                  form.resetField('searchSubType', { keepError: true });
                  form.resetField('firstNamesTerm', { keepError: true });
                  form.resetField('lastNamesTerm', { keepError: true });
                }}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className='h-11 text-sm'>
                    <SelectValue placeholder='Selecciona un tipo' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(SupervisorSearchTypeNames).map(([key, value]) => (
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

        {/* Sub Type (conditional) */}
        {showSubTypeField && (
          <FormField
            control={form.control}
            name='searchSubType'
            render={({ field }) => (
              <FormItem
                className='opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
              >
                <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                  Sub-tipo
                </FormLabel>
                <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                  ¿Qué sub-tipo de búsqueda deseas?
                </FormDescription>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  onOpenChange={() => {
                    form.resetField('firstNamesTerm', { defaultValue: '' });
                    form.resetField('lastNamesTerm', { defaultValue: '' });
                    form.resetField('selectTerm', { keepError: true });
                    form.resetField('inputTerm', { keepError: true });
                  }}
                >
                  <FormControl>
                    <SelectTrigger className='h-11 text-sm'>
                      {field.value ? (
                        <SelectValue placeholder='Selecciona un sub-tipo' />
                      ) : (
                        'Elige un sub-tipo'
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(
                      searchType === SupervisorSearchType.FirstNames
                        ? SubTypeNamesSupervisorSearchByFirstNames
                        : searchType === SupervisorSearchType.LastNames
                          ? SubTypeNamesSupervisorSearchByLastNames
                          : SubTypeNamesSupervisorSearchByFullNames
                    ).map(([key, value]) => (
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
        )}

        {/* Input Term (conditional) */}
        {showInputField && (
          <FormField
            control={form.control}
            name='inputTerm'
            render={({ field }) => (
              <FormItem
                className='opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
              >
                <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                  {getInputLabel()}
                </FormLabel>
                <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                  Escribe lo que deseas buscar
                </FormDescription>
                <FormControl>
                  <Input
                    className={cn(
                      'h-11 text-sm',
                      'transition-all duration-200',
                      'focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500'
                    )}
                    placeholder={getInputPlaceholder()}
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs font-inter' />
              </FormItem>
            )}
          />
        )}

        {/* Date Term (conditional - BirthDate) */}
        {searchType === SupervisorSearchType.BirthDate && (
          <FormField
            control={form.control}
            name='dateTerm'
            render={({ field }) => (
              <FormItem
                className='opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
              >
                <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                  Fecha de Nacimiento
                </FormLabel>
                <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                  Buscar por fecha o rango de fechas
                </FormDescription>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className={cn(
                          'h-11 w-full text-sm text-left font-normal justify-start',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {field?.value?.from ? (
                          field?.value.to ? (
                            <>
                              {format(field?.value.from, 'LLL dd, y', { locale: es })} -{' '}
                              {format(field?.value.to, 'LLL dd, y', { locale: es })}
                            </>
                          ) : (
                            format(field?.value.from, 'LLL dd, y', { locale: es })
                          )
                        ) : (
                          <span className='text-sm'>Elige una fecha</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      initialFocus
                      mode='range'
                      selected={field.value}
                      onSelect={field.onChange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className='text-xs font-inter' />
              </FormItem>
            )}
          />
        )}

        {/* Select Term (conditional) */}
        {showSelectField && (
          <FormField
            control={form.control}
            name='selectTerm'
            render={({ field }) => (
              <FormItem
                className='opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
              >
                <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                  {getSelectLabel()}
                </FormLabel>
                <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                  Selecciona una opción
                </FormDescription>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger className='h-11 text-sm'>
                      {field.value ? (
                        <SelectValue placeholder='Elige una opción' />
                      ) : (
                        'Elige una opción'
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(getSelectOptions()).map(([key, value]) => (
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
        )}

        {/* First Names (conditional) */}
        {showFirstNamesField && (
          <FormField
            control={form.control}
            name='firstNamesTerm'
            render={({ field }) => (
              <FormItem
                className='opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
              >
                <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                  Nombres
                </FormLabel>
                <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                  Escribe los nombres que deseas buscar
                </FormDescription>
                <FormControl>
                  <Input
                    className={cn(
                      'h-11 text-sm',
                      'transition-all duration-200',
                      'focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500'
                    )}
                    placeholder='Ej: Rolando Martin...'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs font-inter' />
              </FormItem>
            )}
          />
        )}

        {/* Last Names (conditional) */}
        {showLastNamesField && (
          <FormField
            control={form.control}
            name='lastNamesTerm'
            render={({ field }) => (
              <FormItem
                className='opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
              >
                <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                  Apellidos
                </FormLabel>
                <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                  Escribe los apellidos que deseas buscar
                </FormDescription>
                <FormControl>
                  <Input
                    className={cn(
                      'h-11 text-sm',
                      'transition-all duration-200',
                      'focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500'
                    )}
                    placeholder='Ej: Sanchez Torres...'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs font-inter' />
              </FormItem>
            )}
          />
        )}

        {/* Limit & All */}
        <div
          className='space-y-2 opacity-0 animate-slide-in-up'
          style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
        >
          <FormField
            control={form.control}
            name='limit'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                  Límite
                </FormLabel>
                <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                  ¿Cuántos registros necesitas?
                </FormDescription>
                <div className='flex gap-3'>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.getValues('all')}
                      className={cn(
                        'h-11 text-sm flex-1',
                        'transition-all duration-200',
                        'focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500'
                      )}
                      value={form.getValues('all') ? '-' : field.value || ''}
                      placeholder='Ej: 10'
                    />
                  </FormControl>
                  <FormField
                    control={form.control}
                    name='all'
                    render={({ field: allField }) => (
                      <FormItem className='flex items-center gap-2 p-3 h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'>
                        <FormControl>
                          <Checkbox
                            disabled={!form.getValues('limit') || !!form.formState.errors.limit}
                            checked={allField?.value}
                            onCheckedChange={(checked) => allField.onChange(checked)}
                            className='data-[state=checked]:bg-slate-700 data-[state=checked]:border-slate-700'
                          />
                        </FormControl>
                        <FormLabel className='text-sm font-medium cursor-pointer text-slate-600 dark:text-slate-400 !mt-0'>
                          Todos
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <FormMessage className='text-xs font-inter' />
              </FormItem>
            )}
          />
        </div>

        {/* Order */}
        <FormField
          control={form.control}
          name='order'
          render={({ field }) => (
            <FormItem
              className='opacity-0 animate-slide-in-up'
              style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
            >
              <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                Orden
              </FormLabel>
              <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                Tipo de ordenamiento
              </FormDescription>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className='h-11 text-sm'>
                    {field.value ? (
                      <SelectValue placeholder='Selecciona un tipo de orden' />
                    ) : (
                      'Selecciona un tipo de orden'
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(RecordOrderNames).map(([key, value]) => (
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

        {/* Submit Button */}
        <div
          className={cn(
            'flex items-end opacity-0 animate-slide-in-up',
            !searchType && 'md:col-span-2 lg:col-span-1'
          )}
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          <Button
            disabled={isDisabledSubmitButton}
            type='submit'
            className={cn(
              'h-11 px-8 w-full font-semibold font-inter text-sm',
              'transition-all duration-300',
              'bg-gradient-to-r from-emerald-500 to-teal-600',
              'hover:from-emerald-600 hover:to-teal-700',
              'hover:shadow-lg hover:shadow-emerald-500/25',
              'hover:scale-[1.02]',
              'active:scale-[0.98]'
            )}
          >
            Buscar
          </Button>
        </div>
      </form>
    </Form>
  );
};
