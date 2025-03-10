/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';
import { FcDataBackup, FcDataConfiguration, FcDeleteDatabase } from 'react-icons/fc';

import { CurrencyType } from '@/modules/offering/shared/enums/currency-type.enum';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { metricsFormSchema } from '@/modules/metrics/validations/metrics-form-schema';
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

interface Props {
  churchId: string | undefined;
}

export const OfferingComparativeAnalysisCardByIncomeAndExpenses = ({
  churchId,
}: Props): JSX.Element => {
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
    queryKey: ['income-and-expenses-comparative-by-year', { ...searchParams, church: churchId }],
    queryFn: () =>
      getIncomeAndExpensesComparativeByYear({
        searchType: MetricSearchType.IncomeAndExpensesComparativeByYear,
        year: searchParams?.year ?? year,
        currency: searchParams?.currency ?? currency,
        order: RecordOrder.Ascending,
        church: churchId ?? '',
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
    <Card className='bg-slate-50/40 dark:bg-slate-900/40 flex flex-col col-start-1 col-end-3 h-[33.2rem] sm:h-[34.8rem] md:h-[35.3rem] lg:h-[37.3rem] m-0 border-slate-200 dark:border-slate-800'>
      <CardHeader className='z-10 flex flex-col sm:flex-row items-center justify-between px-4 py-2.5'>
        <div className='flex flex-col items-center sm:items-start'>
          <CardTitle className='font-bold text-[22px] sm:text-[25px] md:text-[28px] 2xl:text-[30px]'>
            Ingresos Vs Salidas
          </CardTitle>
          <CardDescription className='sm:ml-[2px] sm:text-left text-center text-[14px] md:text-[16px] italic'>
            (No se considera las ofrendas de Terreno Iglesia).
          </CardDescription>
        </div>
        <Form {...form}>
          <form className='flex'>
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

      {!incomeAndExpensesComparativeByYear?.data?.length && !searchParams ? (
        <CardContent className='h-full px-2 sm:px-4 py-0'>
          <div className='text-blue-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-[27rem] sm:h-full -mt-6'>
            <FcDataBackup className='text-[8rem] pb-2' />
            <p className='font-medium text-[15px] md:text-[16px]'>Consultando datos....</p>
          </div>
        </CardContent>
      ) : (
        <CardContent className='h-full px-2 sm:px-4 py-0'>
          {incomeAndExpensesComparativeByYear?.isFetching &&
            (!incomeAndExpensesComparativeByYear?.data ||
              incomeAndExpensesComparativeByYear?.data?.length === 0) &&
            year && (
              <div className='text-blue-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-[27rem] sm:h-full -mt-6'>
                <FcDataBackup className='text-[8rem] pb-2' />
                <p className='font-medium text-[15px] md:text-[16px]'>Consultando datos....</p>
              </div>
            )}
          {!!incomeAndExpensesComparativeByYear?.data?.length && searchParams && (
            <div className='flex flex-col gap-2'>
              <ChartContainer
                config={chartConfig}
                className={cn(
                  'w-full h-[200px] sm:h-[233px] md:h-[233px] lg:h-[250px] xl:h-[250px]'
                )}
              >
                <AreaChart
                  accessibilityLayer
                  data={incomeAndExpensesComparativeByYear?.data}
                  margin={{ top: 5, right: 5, left: -15, bottom: 10 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey='month'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className='text-[12.5px] md:text-[14px]'
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis type='number' className='text-[12.5px] md:text-[14px]' />

                  <ChartTooltip
                    cursor={false}
                    content={IncomeAndExpensesComparativeTooltipContent as any}
                  />

                  <ChartLegend
                    content={<ChartLegendContent className='ml-8 text-[13px] md:text-[14px]' />}
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
                className={cn(
                  'w-full h-[200px] sm:h-[233px] md:h-[233px] lg:h-[250px] xl:h-[250px]'
                )}
              >
                <AreaChart
                  accessibilityLayer
                  data={incomeAndExpensesComparativeByYear?.data}
                  margin={{ top: 5, right: 5, left: -20, bottom: 10 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey='month'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className='text-[12.5px] md:text-[14px]'
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis type='number' className='text-[12.5px] md:text-[14px]' />

                  <ChartTooltip
                    cursor={false}
                    content={IncomeAndExpensesComparativeTooltipContent as any}
                  />

                  <ChartLegend
                    content={<ChartLegendContent className='ml-8 text-[13px] md:text-[14px]' />}
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
          )}
          {!year && !incomeAndExpensesComparativeByYear?.data?.length && (
            <div className='text-emerald-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-full -mt-6'>
              <FcDataConfiguration className='text-[8rem] pb-2' />
              <p>Esperando parámetros de consulta...</p>
            </div>
          )}
          {!incomeAndExpensesComparativeByYear?.isFetching &&
            (!incomeAndExpensesComparativeByYear?.data ||
              incomeAndExpensesComparativeByYear?.data?.length === 0) &&
            year && (
              <div className='text-red-500 flex flex-col justify-center items-center h-full -mt-6'>
                <FcDeleteDatabase className='text-[8rem] pb-2' />
                <p className='font-medium text-[15px] md:text-[16px]'>
                  No hay datos disponibles para mostrar.
                </p>
              </div>
            )}
        </CardContent>
      )}
    </Card>
  );
};
