import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Bar, XAxis, YAxis, CartesianGrid, BarChart } from 'recharts';
import { TbStar } from 'react-icons/tb';

import { cn } from '@/shared/lib/utils';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { getAbbreviatedFullNames } from '@/shared/helpers/get-full-names.helper';
import { generateYearOptions } from '@/shared/helpers/generate-year-options.helper';

import { months } from '@/modules/metrics/data/months-data';
import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { metricsFormSchema } from '@/modules/metrics/schemas/metrics-form-schema';

import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';
import { getOfferingIncomeBySpecialOffering } from '@/modules/metrics/services/offering-income-metrics.service';
import { OfferingIncomeBySpecialOfferingTooltipContent } from '@/modules/metrics/components/offering-income/tooltips/components/OfferingIncomeBySpecialOfferingTooltipContent';
import { MetricCard } from '@/modules/metrics/components/shared/MetricCard';

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
  accumulatedOfferingPEN: {
    label: 'Ofrenda PEN',
    color: '#8E44AD',
  },
  accumulatedOfferingUSD: {
    label: 'Ofrenda USD',
    color: '#2980B9',
  },
  accumulatedOfferingEUR: {
    label: 'Ofrenda EUR',
    color: '#16A085',
  },
} satisfies ChartConfig;

interface SearchParamsOptions {
  month?: string;
  year?: string;
}

export const OfferingIncomeAnalysisCardBySpecialOffering = (): JSX.Element => {
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
  const offeringIncomeBySpecialOffering = useQuery({
    queryKey: ['offering-income-by-special-offering', { ...searchParams, church: activeChurchId }],
    queryFn: () => {
      return getOfferingIncomeBySpecialOffering({
        searchType: MetricSearchType.OfferingIncomeBySpecialOffering,
        month: searchParams?.month ?? month,
        year: searchParams?.year ?? year,
        isSingleMonth: true,
        church: activeChurchId ?? '',
        order: RecordOrder.Ascending,
      });
    },
    retry: false,
    enabled: !!searchParams?.year && !!searchParams?.month && !!activeChurchId,
  });

  //* Effects
  useEffect(() => {
    setSearchParams({ year, month });
  }, [offeringIncomeBySpecialOffering?.data, year]);

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof metricsFormSchema>): void => {
    setSearchParams(formData);
  };

  const isFetchingData =
    !searchParams || (offeringIncomeBySpecialOffering?.isFetching && !offeringIncomeBySpecialOffering?.data?.length);
  const isEmptyData = !isFetchingData && !offeringIncomeBySpecialOffering?.data?.length;

  return (
    <MetricCard
      className='col-start-1 col-end-2'
      title={
        <>
          Ofrendas Especiales
          {!!offeringIncomeBySpecialOffering?.data?.length && (
            <Badge variant='active' className='mt-1 text-white text-[11px] py-0.3 tracking-wide'>
              Activos
            </Badge>
          )}
        </>
      }
      description='Por miembro donante del mes.'
      icon={<TbStar className='w-5 h-5 text-purple-600 dark:text-purple-400' />}
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
                              'justify-between w-full text-[14px] md:text-[14px] text-center px-2',
                              !field.value && 'text-slate-500 dark:text-slate-200 font-normal px-4'
                            )}
                          >
                            {field.value
                              ? months.find((month) => month.value === field.value)?.label
                              : 'Elige un mes'}
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
                                  month && year && form.handleSubmit(handleSubmit)();
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
          data={offeringIncomeBySpecialOffering?.data}
          margin={{ top: 5, right: 5, left: -25, bottom: 10 }}
        >
          <CartesianGrid vertical={false} strokeDasharray='3 3' className='stroke-slate-200 dark:stroke-slate-700' />
          <XAxis
            dataKey='memberFullName'
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => {
              return value === 'Donaciones Externas'
                ? value
                : getAbbreviatedFullNames({ fullNames: value });
            }}
            className='text-xs fill-slate-500 dark:fill-slate-400'
          />
          <YAxis tickLine={false} axisLine={false} className='text-xs fill-slate-500 dark:fill-slate-400' />
          <ChartTooltip
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            content={OfferingIncomeBySpecialOfferingTooltipContent as any}
          />
          <ChartLegend
            content={
              <ChartLegendContent className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs' />
            }
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
