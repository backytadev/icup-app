import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';
import { FcDataBackup } from 'react-icons/fc';

import { CurrencyType } from '@/modules/offering/shared/enums/currency-type.enum';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { metricsFormSchema } from '@/modules/metrics/schemas/metrics-form-schema';
import { getIncomeAndExpensesComparativeByYear } from '@/modules/metrics/services/offering-comparative-metrics.service';
import { IncomeAndExpensesComparativeTooltipContent } from '@/modules/metrics/components/financial-balance-comparative/tooltips/components/IncomeAndExpensesComparativeTooltipContent';

import { cn } from '@/shared/lib/utils';
import { RecordOrder } from '@/shared/enums/record-order.enum';
import { generateYearOptions } from '@/shared/helpers/generate-year-options.helper';

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
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/shared/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

const chartConfig = {
  totalIncome: {
    label: 'Ingresos',
    color: '#4ecb17',
  },
  totalExpenses: {
    label: 'Salidas',
    color: '#ec564b',
  },
} satisfies ChartConfig;

interface SearchParamsOptions {
  year?: string;
  currency?: string;
}


export const OfferingComparativeAnalysisCardByIncomeAndExpenses = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);
  //* States
  const [isInputSearchCurrencyOpen, setIsInputSearchCurrencyOpen] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<SearchParamsOptions | undefined>(undefined);

  //* Form
  const form = useForm<z.infer<typeof metricsFormSchema>>({
    resolver: zodResolver(metricsFormSchema),
    mode: 'onChange',
    defaultValues: {
      currency: CurrencyType.PEN,
      year: new Date().getFullYear().toString(),
    },
  });

  //* Watchers
  const year = form.getValues('year');
  const currency = form.getValues('currency');

  //* Helpers
  const years = generateYearOptions(2021);

  //* Queries
  const incomeAndExpensesComparativeByYear = useQuery({
    queryKey: ['income-and-expenses-comparative-by-year', { ...searchParams, church: activeChurchId }],
    queryFn: () =>
      getIncomeAndExpensesComparativeByYear({
        searchType: MetricSearchType.IncomeAndExpensesComparativeByYear,
        year: searchParams?.year ?? year,
        currency: searchParams?.currency ?? currency,
        order: RecordOrder.Ascending,
        church: activeChurchId ?? '',
      }),
    retry: false,
    enabled: !!searchParams?.currency && !!searchParams?.year,
  });

  //* Effects
  // Default value
  useEffect(() => {
    setSearchParams({ year, currency });
  }, [incomeAndExpensesComparativeByYear?.data, year]);

  //* Form handler
  function handleSubmit(formData: z.infer<typeof metricsFormSchema>): void {
    setSearchParams(formData);
  }

  return (
    <Card className='overflow-hidden border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col col-start-1 col-end-3'>
      <CardHeader className='flex flex-col sm:flex-row items-start justify-between space-y-0 pb-3 pt-4 px-4 md:px-5'>
        <div className='flex flex-col items-start'>
          <CardTitle className='flex items-center gap-2 text-base md:text-lg font-semibold font-outfit text-slate-800 dark:text-slate-100'>
            Ingresos Vs Salidas
          </CardTitle>
          <CardDescription className='text-sm text-slate-500 dark:text-slate-400 font-inter'>
            (No se considera las ofrendas de Terreno Iglesia).
          </CardDescription>
        </div>
        <Form {...form}>
          <form className='flex flex-shrink-0 mx-auto sm:m-0 pt-2 sm:pt-0'>
            <FormField
              control={form.control}
              name='currency'
              render={({ field }) => {
                return (
                  <FormItem className='md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2'>
                    <Popover
                      open={isInputSearchCurrencyOpen}
                      onOpenChange={(e) => {
                        setIsInputSearchCurrencyOpen(e);
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
                              !field.value && 'text-slate-500 dark:text-slate-200 font-normal px-2'
                            )}
                          >
                            {field.value
                              ? Object.values(CurrencyType).find((year) => year === field.value)
                              : 'Divisa'}
                            <CaretSortIcon className='h-4 w-4 shrink-0' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align='center' className='w-auto px-4 py-2'>
                        <Command className='w-[10rem]'>
                          <CommandInput
                            placeholder='Busque un divisa'
                            className='h-9 text-[14px] md:text-[14px]'
                          />
                          <CommandEmpty>Divisa no encontrado.</CommandEmpty>
                          <CommandGroup className='max-h-[100px] h-auto'>
                            {Object.values(CurrencyType).map((currency) => (
                              <CommandItem
                                className='text-[14px] md:text-[14px]'
                                value={currency}
                                key={currency}
                                onSelect={() => {
                                  form.setValue('currency', currency);
                                  setIsInputSearchCurrencyOpen(false);
                                }}
                              >
                                {currency}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    currency === field.value ? 'opacity-100' : 'opacity-0'
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
                          <SelectItem className={`text-[14px]`} key={value} value={label}>
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
      </CardHeader>

      <CardContent className='px-3 md:px-5 pb-4'>
        {!searchParams ||
          (incomeAndExpensesComparativeByYear?.isFetching &&
            !incomeAndExpensesComparativeByYear?.data?.length) ? (
          <div className='flex flex-col items-center justify-center py-8'>
            <FcDataBackup className='text-[4rem] mb-2' />
            <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>Consultando datos...</p>
          </div>
        ) : !!incomeAndExpensesComparativeByYear?.data?.length ? (
          <div className='flex flex-col gap-2'>
            <ChartContainer
              config={chartConfig}
              className='w-full h-[240px] sm:h-[270px] md:h-[310px] xl:h-[320px]'
            >
              <AreaChart
                accessibilityLayer
                data={incomeAndExpensesComparativeByYear?.data}
                margin={{ top: 5, right: 5, left: -15, bottom: 10 }}
              >
                <CartesianGrid vertical={false} strokeDasharray='3 3' className='stroke-slate-200 dark:stroke-slate-700' />
                <XAxis
                  dataKey='month'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className='text-xs fill-slate-500 dark:fill-slate-400'
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis type='number' tickLine={false} axisLine={false} className='text-xs fill-slate-500 dark:fill-slate-400' />

                <ChartTooltip
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  content={IncomeAndExpensesComparativeTooltipContent as any}
                />

                <ChartLegend
                  content={<ChartLegendContent className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs' />}
                />

                <Area
                  dataKey='totalIncome'
                  type='natural'
                  fill='var(--color-totalIncome)'
                  fillOpacity={0.4}
                  stroke='var(--color-totalIncome)'
                />
              </AreaChart>
            </ChartContainer>

            <ChartContainer
              config={chartConfig}
              className='w-full h-[240px] sm:h-[270px] md:h-[310px] xl:h-[320px]'
            >
              <AreaChart
                accessibilityLayer
                data={incomeAndExpensesComparativeByYear?.data}
                margin={{ top: 5, right: 5, left: -20, bottom: 10 }}
              >
                <CartesianGrid vertical={false} strokeDasharray='3 3' className='stroke-slate-200 dark:stroke-slate-700' />
                <XAxis
                  dataKey='month'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className='text-xs fill-slate-500 dark:fill-slate-400'
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis type='number' tickLine={false} axisLine={false} className='text-xs fill-slate-500 dark:fill-slate-400' />

                <ChartTooltip
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  content={IncomeAndExpensesComparativeTooltipContent as any}
                />

                <ChartLegend
                  content={<ChartLegendContent className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs' />}
                />

                <Area
                  dataKey='totalExpenses'
                  type='natural'
                  fill='var(--color-totalExpenses)'
                  fillOpacity={0.4}
                  stroke='var(--color-totalExpenses)'
                />
              </AreaChart>
            </ChartContainer>
          </div>
        ) : (
          <EmptyState variant='chart' className='py-4' />
        )}
      </CardContent>
    </Card>
  );
};
