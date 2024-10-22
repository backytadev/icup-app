/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Bar, XAxis, YAxis, CartesianGrid, BarChart } from 'recharts';
import { FcDataBackup, FcDataConfiguration, FcDeleteDatabase } from 'react-icons/fc';

import { cn } from '@/shared/lib/utils';

import { OfferingExpenseChartTooltipContent } from '@/modules/metrics/components/offering-expense/tooltips/components';

import { RecordOrder } from '@/shared/enums';
import { generateYearOptions } from '@/shared/helpers';

import { months } from '@/modules/metrics/data';
import { MetricSearchType } from '@/modules/metrics/enums';
import { metricsFormSchema } from '@/modules/metrics/validations';
import { getSuppliesOfferingExpenses } from '@/modules/metrics/services';

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
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';

const chartConfig = {
  accumulatedOfferingPEN: {
    label: 'Ofrenda PEN',
    color: '#16A085',
  },
  accumulatedOfferingUSD: {
    label: 'Ofrenda USD',
    color: '#8E44AD',
  },
  accumulatedOfferingEUR: {
    label: 'Ofrenda EUR',
    color: '#F1C40F',
  },
} satisfies ChartConfig;

interface SearchParamsOptions {
  month?: string;
  year?: string;
}

interface ResultDataOptions {
  subType: string;
  date: Date;
  accumulatedOfferingPEN: number;
  accumulatedOfferingUSD: number;
  accumulatedOfferingEUR: number;
  church: {
    id: string;
    churchName: string;
  };
  allOfferings: Array<{ offering: number; currency: string; date: string | Date }>;
  totalAmount: number;
  totalPercentage: string;
}

interface Props {
  churchId: string | undefined;
}

export const OfferingExpenseAnalysisCardBySuppliesExpenses = ({ churchId }: Props): JSX.Element => {
  //* States
  const [mappedData, setMappedData] = useState<ResultDataOptions[]>();
  const [isInputSearchYearOpen, setIsInputSearchYearOpen] = useState<boolean>(false);
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
  const years = generateYearOptions();

  //* Watchers
  const year = form.watch('year');
  const month = form.watch('month');

  //* Queries
  const suppliesOfferingExpenses = useQuery({
    queryKey: ['supplies-offering-expenses', { ...searchParams, church: churchId }],
    queryFn: () => {
      return getSuppliesOfferingExpenses({
        searchType: MetricSearchType.SuppliesOfferingExpenses,
        month: searchParams?.month ?? month,
        year: searchParams?.year ?? year,
        church: churchId ?? '',
        order: RecordOrder.Ascending,
      });
    },
    retry: 1,
    enabled: !!searchParams?.year && !!searchParams?.month && !!churchId,
  });

  //* Effects
  // Default value
  useEffect(() => {
    setSearchParams({ year, month });
  }, [suppliesOfferingExpenses?.data, year]);

  // Set data
  useEffect(() => {
    if (suppliesOfferingExpenses?.data) {
      const transformedData = suppliesOfferingExpenses?.data.map((offeringExpense) => {
        const totalGeneral = suppliesOfferingExpenses.data
          .map((item) => item.totalAmount)
          .reduce((acc, item) => acc + item, 0);

        return {
          subType: offeringExpense.subType,
          date: offeringExpense.date,
          accumulatedOfferingPEN: offeringExpense.accumulatedOfferingPEN,
          accumulatedOfferingUSD: offeringExpense.accumulatedOfferingUSD,
          accumulatedOfferingEUR: offeringExpense.accumulatedOfferingEUR,
          church: {
            id: offeringExpense.church.id,
            churchName: offeringExpense.church.churchName,
          },
          allOfferings: offeringExpense.allOfferings,
          totalAmount: offeringExpense.totalAmount,
          totalPercentage: ((offeringExpense.totalAmount / totalGeneral) * 100).toFixed(1),
        };
      });

      setMappedData(transformedData);
    }

    if (!suppliesOfferingExpenses?.data) {
      setMappedData([]);
    }
  }, [suppliesOfferingExpenses?.data]);

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof metricsFormSchema>): void => {
    setSearchParams(formData);
  };

  return (
    <Card className='bg-slate-50/40 dark:bg-slate-900/40 flex flex-col col-start-1 col-end-2 h-[24rem] sm:h-[26rem] md:h-[28rem] lg:h-[30rem] 2xl:h-[30rem] m-0 border-slate-200 dark:border-slate-800'>
      <CardHeader className='z-10 flex flex-col sm:flex-row items-center justify-between px-4 py-2.5'>
        <CardTitle className='flex justify-center items-center gap-2 font-bold text-[22px] sm:text-[25px] md:text-[28px] 2xl:text-[30px]'>
          <span>Gastos Suministros</span>
          {suppliesOfferingExpenses?.data &&
            Object.entries(suppliesOfferingExpenses?.data)?.length > 0 && (
              <Badge
                variant='active'
                className='mt-1 text-[10px] md:text-[11px] py-0.3 md:py-0.35 tracking-wide'
              >
                Activos
              </Badge>
            )}
        </CardTitle>
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
                        <FormControl>
                          <Button
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'justify-between w-full text-[12px] md:text-[14px] text-center px-2',
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
                        <Command>
                          <CommandInput
                            placeholder='Busque un mes...'
                            className='h-9 text-[12px] md:text-[14px]'
                          />
                          <CommandEmpty>Mes no encontrado.</CommandEmpty>
                          <CommandGroup className='max-h-[100px] h-auto'>
                            {months.map((month) => (
                              <CommandItem
                                className='text-[12px] md:text-[14px]'
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
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name='year'
              render={({ field }) => {
                return (
                  <FormItem className='md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2'>
                    <Popover
                      open={isInputSearchYearOpen}
                      onOpenChange={(e) => {
                        setIsInputSearchYearOpen(e);
                        !month &&
                          form.resetField('month', {
                            defaultValue: '',
                          });
                      }}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'justify-between w-full text-center px-2',
                              !field.value && 'text-slate-500 dark:text-slate-200 font-normal px-2'
                            )}
                          >
                            {field.value
                              ? years.find((year) => year.value === field.value)?.label
                              : 'Año'}
                            <CaretSortIcon className='h-4 w-4 shrink-0' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align='center' className='w-auto px-4 py-2'>
                        <Command>
                          <CommandInput
                            placeholder='Busque un año...'
                            className='h-9 text-[12px] md:text-[14px]'
                          />
                          <CommandEmpty>Año no encontrado.</CommandEmpty>
                          <CommandGroup className='max-h-[100px] h-auto'>
                            {years.map((year) => (
                              <CommandItem
                                className='text-[12px] md:text-[14px]'
                                value={year.label}
                                key={year.value}
                                onSelect={() => {
                                  form.setValue('year', year.value);
                                  month && year && form.handleSubmit(handleSubmit)();
                                  setIsInputSearchYearOpen(false);
                                }}
                              >
                                {year.label}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    year.value === field.value ? 'opacity-100' : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </form>
        </Form>
      </CardHeader>

      {!suppliesOfferingExpenses?.data?.length && !searchParams ? (
        <CardContent className='h-full pl-3 pr-6 py-0'>
          <div className='text-blue-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-full -mt-6'>
            <FcDataBackup className='text-[6rem] pb-2' />
            <p>Consultando datos....</p>
          </div>
        </CardContent>
      ) : (
        <CardContent className='h-full pl-3 pr-6 py-0'>
          {suppliesOfferingExpenses?.isFetching &&
            !suppliesOfferingExpenses?.data?.length &&
            year && (
              <div className='text-blue-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-full -mt-6'>
                <FcDataBackup className='text-[6rem] pb-2' />
                <p>Consultando datos....</p>
              </div>
            )}
          {!!mappedData?.length && searchParams && (
            <ChartContainer
              config={chartConfig}
              className={cn(
                'w-full h-[283px] sm:h-[345px] md:h-[380px] lg:h-[410px] xl:h-[410px] 2xl:h-[410px]'
              )}
            >
              <BarChart
                accessibilityLayer
                data={mappedData}
                margin={{ top: 5, right: 5, left: -28, bottom: 10 }}
              >
                <CartesianGrid vertical={true} />
                <XAxis
                  dataKey='subType'
                  tickLine={false}
                  tickMargin={10}
                  axisLine={true}
                  className='text-[12px] sm:text-[14px]'
                />

                <YAxis className='text-[12px] sm:text-[14px]' />
                <ChartTooltip cursor={false} content={OfferingExpenseChartTooltipContent as any} />

                <ChartLegend
                  content={<ChartLegendContent className='ml-10 text-[12px] md:text-[14px]' />}
                />

                <Bar
                  dataKey='accumulatedOfferingPEN'
                  stackId='subType'
                  fill='var(--color-accumulatedOfferingPEN)'
                  radius={[2, 2, 2, 2]}
                />
                <Bar
                  dataKey='accumulatedOfferingEUR'
                  stackId='subType'
                  fill='var(--color-accumulatedOfferingEUR)'
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey='accumulatedOfferingUSD'
                  stackId='subType'
                  fill='var(--color-accumulatedOfferingUSD)'
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}
          {!year && !mappedData?.length && (
            <div className='text-emerald-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-full -mt-6'>
              <FcDataConfiguration className='text-[6rem] pb-2' />
              <p>Esperando parámetros de consulta...</p>
            </div>
          )}
          {!suppliesOfferingExpenses?.isFetching &&
            !suppliesOfferingExpenses?.data?.length &&
            year && (
              <div className='text-red-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-full -mt-6'>
                <FcDeleteDatabase className='text-[6rem] pb-2' />
                <p>No hay datos disponibles para mostrar.</p>
              </div>
            )}
        </CardContent>
      )}
    </Card>
  );
};
