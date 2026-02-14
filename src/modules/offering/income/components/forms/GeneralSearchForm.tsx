import { useState, useEffect } from 'react';

import { type z } from 'zod';
import { es } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMediaQuery } from '@react-hook/media-query';
import { endOfWeek, format, startOfWeek } from 'date-fns';

import { getSimpleChurches } from '@/modules/church/services/church.service';

import { cn } from '@/shared/lib/utils';
import { RecordOrder, RecordOrderNames } from '@/shared/enums/record-order.enum';
import { type GeneralSearchForm as GeneralSearchFormType } from '@/shared/interfaces/search-general-form.interface';
import { formSearchGeneralSchema } from '@/shared/validations/form-search-general-schema';
import { dateFormatterTermToTimestamp } from '@/shared/helpers/date-formatter-to-timestamp.helper';

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
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

interface Props {
  onSearch: (params: GeneralSearchFormType) => void;
}

export const GeneralSearchForm = ({ onSearch }: Props): JSX.Element => {
  const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState<boolean>(true);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const form = useForm<z.infer<typeof formSearchGeneralSchema>>({
    mode: 'onChange',
    resolver: zodResolver(formSearchGeneralSchema),
    defaultValues: {
      limit: '10',
      offset: '0',
      all: true,
      dateTerm: {
        from: startOfWeek(new Date(), { weekStartsOn: 1 }),
        to: endOfWeek(new Date(), { weekStartsOn: 1 }),
      },
      order: RecordOrder.Descending,
      churchId: '',
    },
  });

  const { limit, offset, order, all } = form.watch();

  const churchesQuery = useQuery({
    queryKey: ['churches-offering-income-search'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

  useEffect(() => {
    if (all) form.setValue('limit', '10');
  }, [all]);

  useEffect(() => {
    setIsDisabledSubmitButton(!limit || !offset || !order);
  }, [limit, offset, order]);

  useEffect(() => {
    if (churchesQuery.data?.length) {
      form.setValue('churchId', churchesQuery.data[0].id);
    }
  }, [churchesQuery.data]);

  function onSubmit(formData: z.infer<typeof formSearchGeneralSchema>): void {
    let newDateTermTo;
    if (!formData.dateTerm?.to) {
      newDateTermTo = formData.dateTerm?.from;
    }

    const newDateTerm = dateFormatterTermToTimestamp({
      from: formData.dateTerm?.from,
      to: formData.dateTerm?.to ? formData.dateTerm?.to : newDateTermTo,
    });

    onSearch({
      ...formData,
      dateTerm: newDateTerm as any,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end mb-4'
      >
        {/* Limit */}
        <FormField
          control={form.control}
          name='limit'
          render={({ field }) => (
            <FormItem
              className='opacity-0 animate-slide-in-up'
              style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
            >
              <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                Limite
              </FormLabel>
              <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                ¿Cuantos registros necesitas?
              </FormDescription>
              <FormControl>
                <Input
                  {...field}
                  disabled={form.getValues('all')}
                  className={cn(
                    'h-11 text-sm',
                    'transition-all duration-200',
                    'focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500'
                  )}
                  value={form.getValues('all') ? '-' : field.value || ''}
                  placeholder='Ej: 10'
                />
              </FormControl>
              <FormMessage className='text-xs font-inter' />
            </FormItem>
          )}
        />

        {/* Offset */}
        <FormField
          control={form.control}
          name='offset'
          render={({ field }) => (
            <FormItem
              className='opacity-0 animate-slide-in-up'
              style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
            >
              <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                Desplazamiento
              </FormLabel>
              <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                ¿Cuantos registros saltar?
              </FormDescription>
              <FormControl>
                <Input
                  {...field}
                  disabled={form.getValues('all')}
                  className={cn(
                    'h-11 text-sm',
                    'transition-all duration-200',
                    'focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500'
                  )}
                  value={form.getValues('all') ? '-' : field?.value || ''}
                  placeholder='Ej: 0'
                />
              </FormControl>
              <FormMessage className='text-xs font-inter' />
            </FormItem>
          )}
        />

        {/* Date Range */}
        <FormField
          control={form.control}
          name='dateTerm'
          render={({ field }) => (
            <FormItem
              className='opacity-0 animate-slide-in-up lg:col-span-2'
              style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
            >
              <FormLabel className='text-sm font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                Fecha
              </FormLabel>
              <FormDescription className='text-xs text-slate-500 dark:text-slate-400'>
                Buscar por fecha o rango de fechas.
              </FormDescription>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full h-11 text-left font-normal justify-center text-sm',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {field?.value?.from ? (
                        field?.value.to ? (
                          <>
                            {format(field?.value.from, 'LLL dd, y', { locale: es })}
                            {' - '}
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
                    numberOfMonths={isDesktop ? 2 : 1}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className='text-xs font-inter' />
            </FormItem>
          )}
        />

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

        {/* Church */}
        <FormField
          control={form.control}
          name='churchId'
          render={({ field }) => (
            <FormItem
              className='opacity-0 animate-slide-in-up'
              style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
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
                      <SelectValue placeholder='Elige una opcion' />
                    ) : (
                      'Elige una opcion'
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

        {/* All Checkbox & Submit */}
        <div
          className='flex items-end gap-4 lg:col-span-2 opacity-0 animate-slide-in-up'
          style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}
        >
          <FormField
            control={form.control}
            name='all'
            render={({ field }) => (
              <FormItem className='flex items-center gap-2 p-3 h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'>
                <FormControl>
                  <Checkbox
                    disabled={
                      !form.getValues('limit') ||
                      !form.getValues('offset') ||
                      !!form.formState.errors.limit
                    }
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
            disabled={isDisabledSubmitButton}
            type='submit'
            className={cn(
              'h-11 px-8 font-semibold font-inter text-sm flex-1',
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
