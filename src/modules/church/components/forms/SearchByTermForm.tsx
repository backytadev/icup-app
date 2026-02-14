import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

import {
  ChurchSearchType,
  ChurchSearchTypeNames,
  ChurchSearchNamesByRecordStatus,
} from '@/modules/church/enums';
import { RecordOrder, RecordOrderNames } from '@/shared/enums/record-order.enum';

import { churchSearchByTermFormSchema } from '@/modules/church/schemas';
import { type ChurchSearchFormByTerm } from '@/modules/church/types';

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
import { Calendar } from '@/shared/components/ui/calendar';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

interface SearchByTermFormProps {
  onSearch: (params: ChurchSearchFormByTerm, formData: ChurchSearchFormByTerm) => void;
}

export const SearchByTermForm = ({ onSearch }: SearchByTermFormProps): JSX.Element => {
  const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState<boolean>(true);

  const form = useForm<z.infer<typeof churchSearchByTermFormSchema>>({
    resolver: zodResolver(churchSearchByTermFormSchema),
    mode: 'onChange',
    defaultValues: {
      limit: '10',
      inputTerm: '',
      selectTerm: '',
      dateTerm: undefined,
      all: false,
      order: RecordOrder.Descending,
    },
  });

  const searchType = form.watch('searchType');
  const limit = form.watch('limit');
  const order = form.watch('order');

  useEffect(() => {
    if (form.getValues('all')) {
      form.setValue('limit', '10');
    }
  }, [form.getValues('all'), form]);

  useEffect(() => {
    if (limit !== '' && order !== '') {
      setIsDisabledSubmitButton(false);
    }

    if (limit === '' || order === '') {
      setIsDisabledSubmitButton(true);
    }
  }, [limit, order]);

  const handleSubmit = (formData: z.infer<typeof churchSearchByTermFormSchema>): void => {
    let newDateTermTo;
    if (!formData.dateTerm?.to) {
      newDateTermTo = formData.dateTerm?.from;
    }

    const newDateTerm = dateFormatterTermToTimestamp({
      from: formData.dateTerm?.from,
      to: formData.dateTerm?.to ? formData.dateTerm?.to : newDateTermTo,
    });

    const searchParams = { ...formData, dateTerm: newDateTerm as any };
    onSearch(searchParams, formData);
    setIsDisabledSubmitButton(true);
    form.reset();
    setIsDisabledSubmitButton(false);
  };

  const getInputLabel = (): string => {
    switch (searchType) {
      case ChurchSearchType.ChurchName:
        return 'Nombre de Iglesia';
      case ChurchSearchType.Department:
        return 'Departamento';
      case ChurchSearchType.Province:
        return 'Provincia';
      case ChurchSearchType.District:
        return 'Distrito';
      case ChurchSearchType.UrbanSector:
        return 'Sector Urbano';
      case ChurchSearchType.Address:
        return 'Dirección';
      default:
        return 'Término';
    }
  };

  const showInputField =
    searchType === ChurchSearchType.ChurchName ||
    searchType === ChurchSearchType.Department ||
    searchType === ChurchSearchType.Province ||
    searchType === ChurchSearchType.District ||
    searchType === ChurchSearchType.UrbanSector ||
    searchType === ChurchSearchType.Address;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end'
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
                }}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className='h-11 text-sm'>
                    <SelectValue placeholder='Selecciona un tipo' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(ChurchSearchTypeNames).map(([key, value]) => (
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
                    placeholder='Ejem: Lima, Central, etc...'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs font-inter' />
              </FormItem>
            )}
          />
        )}

        {/* Date Term (conditional) */}
        {searchType === ChurchSearchType.FoundingDate && (
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

        {/* Select Term (conditional) */}
        {searchType === ChurchSearchType.RecordStatus && (
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
                    {Object.entries(ChurchSearchNamesByRecordStatus).map(([key, value]) => (
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
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
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
              style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
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
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
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
