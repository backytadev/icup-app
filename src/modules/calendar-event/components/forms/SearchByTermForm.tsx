import { useEffect } from 'react';

import { type z } from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from '@radix-ui/react-icons';
import { useMediaQuery } from '@react-hook/media-query';

import { cn } from '@/shared/lib/utils';
import { RecordOrder, RecordOrderNames } from '@/shared/enums/record-order.enum';
import { dateFormatterTermToTimestamp } from '@/shared/helpers/date-formatter-to-timestamp.helper';
import { calendarEventSearchByTermFormSchema } from '@/modules/calendar-event/schemas/calendar-event-search-by-term-form-schema';
import { type CalendarEventSearchFormByTerm } from '@/modules/calendar-event/types/calendar-event-form-search-by-term.interface';
import {
  CalendarEventSearchType,
  CalendarEventSearchTypeNames,
  CalendarEventCategoryNames,
  CalendarEventStatusNames,
  CalendarEventTargetGroupNames,
} from '@/modules/calendar-event/enums';

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/shared/components/ui/select';
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Calendar } from '@/shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

interface SearchByTermFormProps {
  onSearch: (queryParams: CalendarEventSearchFormByTerm, formData: CalendarEventSearchFormByTerm) => void;
}

export const SearchByTermForm = ({ onSearch }: SearchByTermFormProps): JSX.Element => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const form = useForm<z.infer<typeof calendarEventSearchByTermFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(calendarEventSearchByTermFormSchema),
    defaultValues: {
      searchType: '',
      inputTerm: '',
      selectTerm: '',
      dateTerm: undefined,
      limit: 10,
      offset: 0,
      order: RecordOrder.Descending,
      all: true,
    },
  });

  const searchType = form.watch('searchType');

  useEffect(() => {
    form.setValue('inputTerm', '');
    form.setValue('selectTerm', '');
    form.setValue('dateTerm', undefined);
  }, [searchType, form]);

  const handleSubmit = (formData: z.infer<typeof calendarEventSearchByTermFormSchema>): void => {
    let convertedDateTerm: string | undefined;

    if (formData.dateTerm?.from) {
      const to = formData.dateTerm.to ?? formData.dateTerm.from;
      convertedDateTerm = dateFormatterTermToTimestamp({ from: formData.dateTerm.from, to });
    }

    const queryParams: CalendarEventSearchFormByTerm = {
      searchType: formData.searchType,
      inputTerm: formData.inputTerm,
      selectTerm: formData.selectTerm,
      dateTerm: convertedDateTerm,
      limit: formData.limit,
      offset: formData.offset,
      order: formData.order,
      all: formData.all,
    };
    onSearch(queryParams, formData as any);
  };

  const isInputTerm =
    searchType === CalendarEventSearchType.Title;

  const isSelectTerm =
    searchType === CalendarEventSearchType.Category ||
    searchType === CalendarEventSearchType.TargetGroup ||
    searchType === CalendarEventSearchType.Status;

  const isDateTerm = searchType === CalendarEventSearchType.Date;

  const getSelectOptions = (): Record<string, string> => {
    switch (searchType) {
      case CalendarEventSearchType.Category:
        return CalendarEventCategoryNames;
      case CalendarEventSearchType.TargetGroup:
        return CalendarEventTargetGroupNames;
      case CalendarEventSearchType.Status:
        return CalendarEventStatusNames;
      default:
        return {};
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end'
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
                Tipo de búsqueda
              </FormLabel>
              <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                ¿Por qué criterio deseas buscar?
              </FormDescription>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className='h-11 text-sm'>
                    {field.value ? (
                      <SelectValue placeholder='Selecciona un tipo' />
                    ) : (
                      <span className='text-muted-foreground'>Selecciona un tipo</span>
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(CalendarEventSearchTypeNames).map(([key, value]) => (
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

        {/* Dynamic term input */}
        {isInputTerm && (
          <FormField
            control={form.control}
            name='inputTerm'
            render={({ field }) => (
              <FormItem
                className='opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
              >
                <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                  Término de búsqueda
                </FormLabel>
                <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                  Escribe el término a buscar
                </FormDescription>
                <FormControl>
                  <Input {...field} className='h-11 text-sm' placeholder='Ej: Retiro Anual...' />
                </FormControl>
                <FormMessage className='text-xs font-inter' />
              </FormItem>
            )}
          />
        )}

        {isSelectTerm && (
          <FormField
            control={form.control}
            name='selectTerm'
            render={({ field }) => (
              <FormItem
                className='opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
              >
                <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                  Valor
                </FormLabel>
                <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                  Selecciona una opción
                </FormDescription>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className='h-11 text-sm'>
                      {field.value ? (
                        <SelectValue placeholder='Selecciona una opción' />
                      ) : (
                        <span className='text-muted-foreground'>Selecciona una opción</span>
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

        {isDateTerm && (
          <FormField
            control={form.control}
            name='dateTerm'
            render={({ field }) => (
              <FormItem
                className='opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
              >
                <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                  Fecha
                </FormLabel>
                <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                  Selecciona una fecha o rango de fechas
                </FormDescription>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className={cn(
                          'h-11 w-full pl-3 text-left text-sm font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4 opacity-50' />
                        {field.value?.from ? (
                          field.value.to ? (
                            <>
                              {format(field.value.from, 'LLL dd, y', { locale: es })}
                              {' - '}
                              {format(field.value.to, 'LLL dd, y', { locale: es })}
                            </>
                          ) : (
                            format(field.value.from, 'LLL dd, y', { locale: es })
                          )
                        ) : (
                          <span>Elige una fecha o rango</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      initialFocus
                      mode='range'
                      selected={field.value as any}
                      onSelect={field.onChange}
                      numberOfMonths={isDesktop ? 2 : 1}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className='text-xs font-inter' />
              </FormItem>
            )}
          />
        )}

        {/* Order */}
        <FormField
          control={form.control}
          name='order'
          render={({ field }) => (
            <FormItem
              className='opacity-0 animate-slide-in-up'
              style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
            >
              <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                Orden
              </FormLabel>
              <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                Tipo de ordenamiento
              </FormDescription>
              <Select value={field.value as string} onValueChange={field.onChange}>
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

        {/* All & Submit */}
        <div
          className='flex items-end gap-4 opacity-0 animate-slide-in-up'
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          <FormField
            control={form.control}
            name='all'
            render={({ field }) => (
              <FormItem className='flex items-center gap-2 p-3 h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'>
                <FormControl>
                  <Checkbox
                    checked={field?.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    className='data-[state=checked]:bg-slate-700 data-[state=checked]:border-slate-700'
                  />
                </FormControl>
                <FormLabel className='text-sm font-medium cursor-pointer text-slate-600 dark:text-slate-400 !mt-0'>
                  Todos
                </FormLabel>
              </FormItem>
            )}
          />
          <Button
            disabled={!searchType}
            type='submit'
            className={cn(
              'h-11 px-8 font-semibold font-inter text-sm flex-1',
              'transition-all duration-300',
              'bg-gradient-to-r from-sky-500 to-indigo-500',
              'hover:from-sky-600 hover:to-indigo-600',
              'hover:shadow-lg hover:shadow-sky-500/25'
            )}
          >
            Filtrar
          </Button>
        </div>
      </form>
    </Form>
  );
};
