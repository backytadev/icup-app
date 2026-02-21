import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Bar, XAxis, YAxis, CartesianGrid, BarChart } from 'recharts';
import { TbBook2 } from 'react-icons/tb';

import { cn } from '@/shared/lib/utils';

import { months } from '@/shared/data/months-data';
import { RecordOrder } from '@/shared/enums/record-order.enum';
import { generateYearOptions } from '@/shared/helpers/generate-year-options.helper';
import { formatDateToLimaDayMonthYear } from '@/shared/helpers/format-date-to-lima';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { metricsFormSchema } from '@/modules/metrics/schemas/metrics-form-schema';
import { getOfferingIncomeBySundaySchool } from '@/modules/metrics/services/offering-income-metrics.service';
import { OfferingIncomeBySundaySchoolTooltipContent } from '@/modules/metrics/components/offering-income/tooltips/components/OfferingIncomeBySundaySchoolTooltipContent';
import { MetricCard } from '@/modules/metrics/components/shared/MetricCard';

import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from '@/shared/components/ui/command';
import {
  ChartLegend,
  ChartTooltip,
  ChartContainer,
  type ChartConfig,
  ChartLegendContent,
} from '@/shared/components/ui/chart';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';

const chartConfig = {
  dayPEN: {
    label: 'Día PEN',
    color: '#FF7043',
  },
  afternoonPEN: {
    label: 'Tarde PEN',
    color: '#4CAF50',
  },
  dayUSD: {
    label: 'Día USD',
    color: '#42A5F5',
  },
  afternoonUSD: {
    label: 'Tarde USD',
    color: '#AB47BC',
  },
  dayEUR: {
    label: 'Día EUR',
    color: '#FFCA28',
  },
  afternoonEUR: {
    label: 'Tarde EUR',
    color: '#7E57C2',
  },
  accumulatedOfferingPEN: {
    label: 'Ofrenda PEN',
    color: '#16A085',
  },
  accumulatedOfferingUSD: {
    label: 'Ofrenda USD',
    color: '#FF5733 ',
  },
  accumulatedOfferingEUR: {
    label: 'Ofrenda EUR',
    color: '#8DFF33 ',
  },
} satisfies ChartConfig;

interface SearchParamsOptions {
  month?: string;
  year?: string;
}

export const OfferingIncomeAnalysisCardBySundaySchool = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  //* States
  const [isInputSearchMonthOpen, setIsInputSearchMonthOpen] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<SearchParamsOptions | undefined>(undefined);

  //* Form
  const form = useForm<z.infer<typeof metricsFormSchema>>({
    resolver: zodResolver(metricsFormSchema),
    mode: 'onChange',
    defaultValues: {
      month: format(new Date(), 'MMMM').toLowerCase(),
      year: new Date().getFullYear().toString(),
    },
  });

  //* Helpers
  const years = generateYearOptions(2025);

  //* Watchers
  const year = form.watch('year');
  const month = form.watch('month');

  //* Queries
  const offeringIncomeBySundaySchool = useQuery({
    queryKey: ['offering-income-by-sunday-school', { ...searchParams, church: activeChurchId }],
    queryFn: () => {
      return getOfferingIncomeBySundaySchool({
        searchType: MetricSearchType.OfferingIncomeBySundaySchool,
        month: searchParams?.month ?? month,
        year: searchParams?.year ?? year,
        isSingleMonth: true,
        order: RecordOrder.Ascending,
        church: activeChurchId ?? '',
      });
    },
    retry: false,
    enabled: !!searchParams?.year && !!searchParams?.month && !!activeChurchId,
  });

  //* Effects
  useEffect(() => {
    setSearchParams({ year, month });
  }, [offeringIncomeBySundaySchool?.data, year]);

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof metricsFormSchema>): void => {
    setSearchParams(formData);
  };

  const isFetchingData =
    !searchParams || (offeringIncomeBySundaySchool?.isFetching && !offeringIncomeBySundaySchool?.data?.length);
  const isEmptyData = !isFetchingData && !offeringIncomeBySundaySchool?.data?.length;

  return (
    <MetricCard
      className='col-start-1 col-end-3'
      title={
        <>
          Escuela Dominical
          {!!offeringIncomeBySundaySchool?.data?.length && (
            <Badge variant='active' className='mt-1 text-white text-[11px] py-0.3 tracking-wide'>
              Activos
            </Badge>
          )}
        </>
      }
      description='Ofrendas escuela dominical día y tarde.'
      icon={<TbBook2 className='w-5 h-5 text-blue-600 dark:text-blue-400' />}
      isFetching={isFetchingData}
      isEmpty={isEmptyData}
      headerAction={
        <Form {...form}>
          <form className='flex'>
            <FormField
              control={form.control}
              name='month'
              render={({ field }) => {
                return (
                  <FormItem className='md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2'>
                    <Popover
                      open={isInputSearchMonthOpen}
                      onOpenChange={(e) => {
                        setIsInputSearchMonthOpen(e);
                        form.resetField('year', {
                          defaultValue: '',
                        });
                      }}
                    >
                      <PopoverTrigger asChild>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Button
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'justify-between text-[14px] md:text-[14px] w-full text-center px-2',
                              !field.value && 'text-slate-500 dark:text-slate-200 font-normal px-4'
                            )}
                          >
                            {field.value
                              ? months.find((month) => month.value === field.value)?.label
                              : 'Mes'}
                            <CaretSortIcon className='h-4 w-4 shrink-0' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align='center' className='w-auto px-4 py-2'>
                        <Command className='w-[10rem]'>
                          <CommandInput
                            placeholder='Busque un mes'
                            className='h-9 text-[14px] md:text-[14px]'
                          />
                          <CommandEmpty>Mes no encontrado.</CommandEmpty>
                          <CommandGroup className='max-h-[100px] h-auto'>
                            {months.map((month) => (
                              <CommandItem
                                className='text-[14px] md:text-[14px]'
                                value={month.label}
                                key={month.value}
                                onSelect={() => {
                                  form.setValue('month', month.value);
                                  setIsInputSearchMonthOpen(false);
                                }}
                              >
                                {month.label}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    month.value === field.value ? 'opacity-100' : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
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
              name='year'
              render={({ field }) => {
                return (
                  <FormItem className='flex justify-start gap-5 items-center'>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.handleSubmit(handleSubmit)();
                      }}
                      value={field.value}
                    >
                      <FormControl className='text-[14px] md:text-[14px] w-[4.8rem] font-medium'>
                        <SelectTrigger>
                          {field.value ? <SelectValue placeholder='Año' /> : 'Año'}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className={cn(years.length >= 3 ? 'h-[8rem]' : 'h-auto')}>
                        {Object.values(years).map(({ label, value }) => (
                          <SelectItem className='text-[14px]' key={value} value={label}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className='text-[13px]' />
                  </FormItem>
                );
              }}
            />
          </form>
        </Form>
      }
    >
      <ChartContainer
        config={chartConfig}
        className='w-full h-[240px] sm:h-[270px] md:h-[310px] xl:h-[320px]'
      >
        <BarChart
          accessibilityLayer
          data={offeringIncomeBySundaySchool?.data}
          margin={{ top: 5, right: 5, left: -25, bottom: 10 }}
        >
          <CartesianGrid vertical={false} strokeDasharray='3 3' className='stroke-slate-200 dark:stroke-slate-700' />
          <XAxis
            dataKey='date'
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => formatDateToLimaDayMonthYear(value)}
            className='text-xs fill-slate-500 dark:fill-slate-400'
          />
          <YAxis tickLine={false} axisLine={false} className='text-xs fill-slate-500 dark:fill-slate-400' />
          <ChartTooltip
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            content={OfferingIncomeBySundaySchoolTooltipContent as any}
          />
          <ChartLegend
            content={
              <ChartLegendContent className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs' />
            }
          />
          <Bar
            dataKey='dayPEN'
            name={chartConfig.dayPEN.label}
            stackId='day'
            fill='var(--color-dayPEN)'
            radius={[2, 2, 2, 2]}
          />
          <Bar
            dataKey='dayEUR'
            name={chartConfig.dayEUR.label}
            stackId='day'
            fill='var(--color-dayEUR)'
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey='dayUSD'
            name={chartConfig.dayUSD.label}
            stackId='day'
            fill='var(--color-dayUSD)'
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey='afternoonPEN'
            name={chartConfig.afternoonPEN.label}
            stackId='afternoon'
            fill='var(--color-afternoonPEN)'
            radius={[2, 2, 2, 2]}
          />
          <Bar
            dataKey='afternoonEUR'
            name={chartConfig.afternoonEUR.label}
            stackId='afternoon'
            fill='var(--color-afternoonEUR)'
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey='afternoonUSD'
            name={chartConfig.afternoonUSD.label}
            stackId='afternoon'
            fill='var(--color-afternoonUSD)'
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey='accumulatedOfferingPEN'
            stackId='offering'
            fill='var(--color-accumulatedOfferingPEN)'
            radius={[2, 2, 2, 2]}
          />
          <Bar
            dataKey='accumulatedOfferingEUR'
            stackId='offering'
            fill='var(--color-accumulatedOfferingEUR)'
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey='accumulatedOfferingUSD'
            stackId='offering'
            fill='var(--color-accumulatedOfferingUSD)'
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </MetricCard>
  );
};
