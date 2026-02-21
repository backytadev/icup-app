import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Bar, XAxis, YAxis, CartesianGrid, BarChart } from 'recharts';
import { FcDataBackup } from 'react-icons/fc';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { metricsFormSchema } from '@/modules/metrics/schemas/metrics-form-schema';
import { getGeneralComparativeOfferingIncome } from '@/modules/metrics/services/offering-comparative-metrics.service';
import { GeneralComparativeOfferingIncomeTooltipContent } from '@/modules/metrics/components/financial-balance-comparative/tooltips/components/GeneralComparativeOfferingIncomeTooltipContent';

import { cn } from '@/shared/lib/utils';
import { months } from '@/shared/data/months-data';
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
  ChartTooltip,
  ChartLegend,
  ChartContainer,
  type ChartConfig,
  ChartLegendContent,
} from '@/shared/components/ui/chart';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/shared/components/ui/card';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

const chartConfig = {
  accumulatedOfferingPEN: {
    label: 'Ofrenda PEN',
    color: '#029012',
  },
  accumulatedOfferingUSD: {
    label: 'Ofrenda USD',
    color: '#813cb4',
  },
  accumulatedOfferingEUR: {
    label: 'Ofrenda EUR',
    color: '#279fb3',
  },
} satisfies ChartConfig;

interface SearchParamsOptions {
  startMonth?: string;
  endMonth?: string;
  year?: string;
}

interface ResultDataOptions {
  type: string;
  subType: string | null;
  accumulatedOfferingPEN: number;
  accumulatedOfferingUSD: number;
  accumulatedOfferingEUR: number;
  church: {
    isAnexe: boolean;
    abbreviatedChurchName: string;
  };
  totalAmount: number;
  totalPercentage: string;
}


export const GeneralComparativeOfferingIncomeAnalysisCard = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);
  //* States
  const [isInputSearchStartMonthOpen, setIsInputSearchStartMonthOpen] = useState<boolean>(false);
  const [isInputSearchEndMonthOpen, setIsInputSearchEndMonthOpen] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<SearchParamsOptions | undefined>(undefined);
  const [mappedData, setMappedData] = useState<ResultDataOptions[]>();

  //* Form
  const form = useForm<z.infer<typeof metricsFormSchema>>({
    resolver: zodResolver(metricsFormSchema),
    mode: 'onChange',
    defaultValues: {
      startMonth: 'january',
      endMonth: format(new Date(), 'MMMM').toLowerCase(),
      year: new Date().getFullYear().toString(),
    },
  });

  //* Helpers
  const years = generateYearOptions(2021);

  //* Watchers
  const year = form.watch('year');
  const startMonth = form.watch('startMonth');
  const endMonth = form.watch('endMonth');

  //* Queries
  const generalComparativeOfferingIncome = useQuery({
    queryKey: ['general-comparative-offering-income', { ...searchParams, church: activeChurchId }],
    queryFn: async () => {
      return await getGeneralComparativeOfferingIncome({
        searchType: MetricSearchType.GeneralComparativeOfferingIncome,
        startMonth: searchParams?.startMonth ?? startMonth,
        endMonth: searchParams?.endMonth ?? endMonth,
        year: searchParams?.year ?? year,
        church: activeChurchId ?? '',
        order: RecordOrder.Ascending,
      });
    },
    retry: false,
    enabled: !!searchParams?.year && !!searchParams?.startMonth && !!searchParams?.endMonth,
  });

  //* Effects
  // Default value
  useEffect(() => {
    setSearchParams({ year, startMonth, endMonth });
  }, [generalComparativeOfferingIncome?.data, year]);

  // Set data
  useEffect(() => {
    if (generalComparativeOfferingIncome?.data) {
      const transformedData = generalComparativeOfferingIncome?.data.map((offering) => {
        const totalGeneral = generalComparativeOfferingIncome.data
          .map((item) => item.totalAmount)
          .reduce((acc, item) => acc + item, 0);

        return {
          type: offering.type,
          subType: offering.subType,
          accumulatedOfferingPEN: offering.accumulatedOfferingPEN,
          accumulatedOfferingUSD: offering.accumulatedOfferingUSD,
          accumulatedOfferingEUR: offering.accumulatedOfferingEUR,
          church: {
            isAnexe: offering.church.isAnexe,
            abbreviatedChurchName: offering.church.abbreviatedChurchName,
          },
          totalAmount: offering.totalAmount,
          totalPercentage: ((offering.totalAmount / totalGeneral) * 100).toFixed(1),
        };
      });

      setMappedData(transformedData);
    }

    if (!generalComparativeOfferingIncome?.data) {
      setMappedData([]);
    }
  }, [generalComparativeOfferingIncome?.data]);

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof metricsFormSchema>): void => {
    setSearchParams(formData);
  };

  return (
    <Card className='overflow-hidden border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col col-start-1 col-end-3'>
      <CardHeader className='flex flex-col sm:flex-row items-start justify-between space-y-0 pb-3 pt-4 px-4 md:px-5'>
        <div className='flex flex-col items-start'>
          <CardTitle className='flex items-center gap-2 text-base md:text-lg font-semibold font-outfit text-slate-800 dark:text-slate-100'>
            Ingresos de Ofrenda
          </CardTitle>
          <CardDescription className='text-sm text-slate-500 dark:text-slate-400 font-inter'>
            General (Acumulado por sub-tipo, rango de meses y año).
          </CardDescription>
        </div>
        <Form {...form}>
          <form className='flex flex-shrink-0 mx-auto sm:m-0 pt-2 sm:pt-0'>
            <FormField
              control={form.control}
              name='startMonth'
              render={({ field }) => {
                return (
                  <FormItem className='md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2'>
                    <Popover
                      open={isInputSearchStartMonthOpen}
                      onOpenChange={(e) => {
                        setIsInputSearchStartMonthOpen(e);
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
                                  form.setValue('startMonth', month.value);
                                  startMonth &&
                                    endMonth &&
                                    year &&
                                    form.handleSubmit(handleSubmit)();
                                  setIsInputSearchStartMonthOpen(false);
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
              name='endMonth'
              render={({ field }) => {
                return (
                  <FormItem className='md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2'>
                    <Popover
                      open={isInputSearchEndMonthOpen}
                      onOpenChange={(e) => {
                        setIsInputSearchEndMonthOpen(e);
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
                                  form.setValue('endMonth', month.value);
                                  setIsInputSearchEndMonthOpen(false);
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
        {!searchParams || (generalComparativeOfferingIncome?.isFetching && !mappedData?.length) ? (
          <div className='flex flex-col items-center justify-center py-8'>
            <FcDataBackup className='text-[4rem] mb-2' />
            <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>Consultando datos...</p>
          </div>
        ) : !!mappedData?.length ? (
          <ChartContainer
            config={chartConfig}
            className='w-full h-[240px] sm:h-[270px] md:h-[310px] xl:h-[320px]'
          >
            <BarChart
              accessibilityLayer
              data={mappedData}
              margin={{ top: 5, right: 5, left: -15, bottom: 10 }}
            >
              <CartesianGrid vertical={false} strokeDasharray='3 3' className='stroke-slate-200 dark:stroke-slate-700' />
              <XAxis
                dataKey='subType'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                className='text-xs fill-slate-500 dark:fill-slate-400'
                tickFormatter={(value) => {
                  const [firstWord, secondWord] = value.split(' ');
                  return secondWord ? `${firstWord} ${secondWord.charAt(0)}.` : firstWord;
                }}
              />

              <YAxis tickLine={false} axisLine={false} className='text-xs fill-slate-500 dark:fill-slate-400' />
              <ChartTooltip
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                content={GeneralComparativeOfferingIncomeTooltipContent as any}
              />

              <ChartLegend
                content={
                  <ChartLegendContent className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs' />
                }
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
        ) : (
          <EmptyState variant='chart' className='py-4' />
        )}
      </CardContent>
    </Card>
  );
};
