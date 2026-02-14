import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

import {
  MinistrySearchType,
  MinistrySearchTypeNames,
} from '@/modules/ministry/enums/ministry-search-type.enum';
import {
  SubTypeNamesMinistrySearchByLastNames,
  SubTypeNamesMinistrySearchByFullNames,
  SubTypeNamesMinistrySearchByFirstNames,
} from '@/modules/ministry/enums/ministry-search-sub-type.enum';
import {
  MinistrySearchNamesByMinistryType,
  MinistrySearchNamesByRecordStatus,
} from '@/modules/ministry/enums/ministry-search-select-option.enum';

import { RecordOrder, RecordOrderNames } from '@/shared/enums/record-order.enum';
import { ministrySearchByTermFormSchema } from '@/modules/ministry/schemas/ministry-search-by-term-form-schema';
import { type MinistrySearchFormByTerm } from '@/modules/ministry/types';

import { firstNamesFormatter, lastNamesFormatter } from '@/shared/helpers/names-formatter.helper';
import { dateFormatterTermToTimestamp } from '@/shared/helpers/date-formatter-to-timestamp.helper';

import { getSimpleChurches } from '@/modules/church/services/church.service';

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
import { Calendar } from '@/shared/components/ui/calendar';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

interface SearchByTermFormProps {
  onSearch: (params: MinistrySearchFormByTerm, formData: MinistrySearchFormByTerm) => void;
  excludeSearchTypes?: MinistrySearchType[];
}

export const SearchByTermForm = ({ onSearch, excludeSearchTypes = [] }: SearchByTermFormProps): JSX.Element => {
  const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState<boolean>(true);

  const form = useForm<z.infer<typeof ministrySearchByTermFormSchema>>({
    resolver: zodResolver(ministrySearchByTermFormSchema),
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

  //* Queries
  const churchesQuery = useQuery({
    queryKey: ['churches'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

  //* Effects
  useEffect(() => {
    if (all) form.setValue('limit', '10');
  }, [all, form]);

  useEffect(() => {
    setIsDisabledSubmitButton(!limit || !order);
  }, [limit, order]);

  useEffect(() => {
    form.setValue('searchSubType', undefined);
  }, [searchType, form]);

  useEffect(() => {
    if (churchesQuery.data?.length) {
      form.setValue('churchId', churchesQuery.data[0].id);
    }
  }, [churchesQuery.data, form]);

  const handleSubmit = (formData: z.infer<typeof ministrySearchByTermFormSchema>): void => {
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

    onSearch(searchParams, formData);
    setIsDisabledSubmitButton(true);
    form.reset();
    setIsDisabledSubmitButton(false);
  };

  const getInputLabel = (): string => {
    switch (searchType) {
      case MinistrySearchType.MinistryCustomName:
        return 'Nombre de Ministerio';
      case MinistrySearchType.Department:
        return 'Departamento';
      case MinistrySearchType.Province:
        return 'Provincia';
      case MinistrySearchType.District:
        return 'Distrito';
      case MinistrySearchType.UrbanSector:
        return 'Sector Urbano';
      case MinistrySearchType.Address:
        return 'Dirección';
      default:
        return 'Término';
    }
  };

  const getInputPlaceholder = (): string => {
    switch (searchType) {
      case MinistrySearchType.MinistryCustomName:
        return 'Ej: Jóvenes Unidos para Cristo';
      case MinistrySearchType.Department:
        return 'Ej: Lima, Ayacucho, Puno...';
      case MinistrySearchType.Province:
        return 'Ej: Huaraz, Lima, Huamanga...';
      case MinistrySearchType.District:
        return 'Ej: Independencia, Los Olivos, SJL...';
      case MinistrySearchType.UrbanSector:
        return 'Ej: Payet, Tahuantinsuyo, La Pascana...';
      case MinistrySearchType.Address:
        return 'Ej: Jr. Pardo 123, Av.Central 555...';
      default:
        return 'Escribe lo que deseas buscar...';
    }
  };

  const showInputField =
    searchType === MinistrySearchType.MinistryCustomName ||
    searchType === MinistrySearchType.Department ||
    searchType === MinistrySearchType.Province ||
    searchType === MinistrySearchType.District ||
    searchType === MinistrySearchType.UrbanSector ||
    searchType === MinistrySearchType.Address;

  const showSubTypeField =
    searchType === MinistrySearchType.FirstNames ||
    searchType === MinistrySearchType.LastNames ||
    searchType === MinistrySearchType.FullNames;

  const showFirstNamesField =
    searchType === MinistrySearchType.FirstNames || searchType === MinistrySearchType.FullNames;

  const showLastNamesField =
    searchType === MinistrySearchType.LastNames || searchType === MinistrySearchType.FullNames;

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
                  {Object.entries(MinistrySearchTypeNames)
                    .filter(([key]) => !excludeSearchTypes.includes(key as MinistrySearchType))
                    .map(([key, value]) => (
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
                    form.resetField('dateTerm', { keepError: true });
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
                      searchType === MinistrySearchType.FirstNames
                        ? SubTypeNamesMinistrySearchByFirstNames
                        : searchType === MinistrySearchType.LastNames
                          ? SubTypeNamesMinistrySearchByLastNames
                          : SubTypeNamesMinistrySearchByFullNames
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

        {/* Date Term (conditional) */}
        {searchType === MinistrySearchType.FoundingDate && (
          <FormField
            control={form.control}
            name='dateTerm'
            render={({ field }) => (
              <FormItem
                className='opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
              >
                <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                  Fecha de Fundación
                </FormLabel>
                <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                  Buscar por fecha o rango
                </FormDescription>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full h-11 text-left font-normal justify-center text-sm',
                          'transition-all duration-200',
                          'hover:bg-slate-50 dark:hover:bg-slate-800',
                          !field.value && 'text-slate-400'
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
                          <span>Elige una fecha</span>
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

        {/* Select Term - Record Status (conditional) */}
        {searchType === MinistrySearchType.RecordStatus && (
          <FormField
            control={form.control}
            name='selectTerm'
            render={({ field }) => (
              <FormItem
                className='opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
              >
                <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                  Estado de Registro
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
                    {Object.entries(MinistrySearchNamesByRecordStatus).map(([key, value]) => (
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

        {/* Select Term - Ministry Type (conditional) */}
        {searchType === MinistrySearchType.MinistryType && (
          <FormField
            control={form.control}
            name='selectTerm'
            render={({ field }) => (
              <FormItem
                className='opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
              >
                <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                  Tipo de Ministerio
                </FormLabel>
                <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                  Selecciona un tipo de ministerio
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
                    {Object.entries(MinistrySearchNamesByMinistryType).map(([key, value]) => (
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

        {/* Church */}
        <FormField
          control={form.control}
          name='churchId'
          render={({ field }) => (
            <FormItem
              className='opacity-0 animate-slide-in-up'
              style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}
            >
              <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                Iglesia
                <span className='ml-2 inline-block bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-[10px] font-medium px-1.5 py-0.5 rounded'>
                  Opcional
                </span>
              </FormLabel>
              <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                Selecciona una iglesia
              </FormDescription>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || churchesQuery?.data?.[0]?.id}
                value={field.value}
              >
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
                  {churchesQuery?.data?.map((church) => (
                    <SelectItem className='text-sm' key={church.id} value={church.id}>
                      {church.abbreviatedChurchName}
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
