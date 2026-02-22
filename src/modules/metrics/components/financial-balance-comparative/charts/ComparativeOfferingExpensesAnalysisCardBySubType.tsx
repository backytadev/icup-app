import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Bar, XAxis, YAxis, CartesianGrid, BarChart } from 'recharts';
import { TbChartBar } from 'react-icons/tb';

import {
  OfferingExpenseSearchType,
  OfferingExpenseSearchTypeNames,
} from '@/modules/offering/expense/enums/offering-expense-search-type.enum';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { metricsFormSchema } from '@/modules/metrics/schemas/metrics-form-schema';
import { getComparativeOfferingExpensesBySubType } from '@/modules/metrics/services/offering-comparative-metrics.service';
import { ComparativeOfferingExpensesBySubTypeTooltipContent } from '@/modules/metrics/components/financial-balance-comparative/tooltips/components/ComparativeOfferingExpensesBySubTypeTooltipContent';
import { MetricCard } from '@/modules/metrics/components/shared/MetricCard';

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
import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

const chartConfig = {
  accumulatedOfferingPEN: {
    label: 'Ofrenda PEN',
    color: '#4682B4',
  },
  accumulatedOfferingUSD: {
    label: 'Ofrenda USD',
    color: '#228B22',
  },
  accumulatedOfferingEUR: {
    label: 'Ofrenda EUR',
    color: '#FF69B4',
  },
} satisfies ChartConfig;

interface SearchParamsOptions {
  type?: string;
  startMonth?: string;
  endMonth?: string;
  year?: string;
}

interface ResultDataOptions {
  subType: string;
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

const transformedArray = [
  ...Object.entries(OfferingExpenseSearchTypeNames).map(([key, value]) => ({ key, value })),
];

export const ComparativeOfferingExpensesAnalysisCardBySubType = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  //* States
  const [isInputSearchTypeOpen, setIsInputSearchTypeOpen] = useState<boolean>(false);
  const [isInputSearchStartMonthOpen, setIsInputSearchStartMonthOpen] = useState<boolean>(false);
  const [isInputSearchEndMonthOpen, setIsInputSearchEndMonthOpen] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<SearchParamsOptions | undefined>(undefined);
  const [mappedData, setMappedData] = useState<ResultDataOptions[]>();

  //* Form
  const form = useForm<z.infer<typeof metricsFormSchema>>({
    resolver: zodResolver(metricsFormSchema),
    mode: 'onChange',
    defaultValues: {
      type: OfferingExpenseSearchType.OperationalExpenses,
      startMonth: 'january',
      endMonth: format(new Date(), 'MMMM').toLowerCase(),
      year: new Date().getFullYear().toString(),
    },
  });

  //* Helpers
  const years = generateYearOptions(2025);

  //* Watchers
  const year = form.watch('year');
  const type = form.watch('type');
  const startMonth = form.watch('startMonth');
  const endMonth = form.watch('endMonth');

  //* Queries
  const comparativeOfferingExpensesBySubType = useQuery({
    queryKey: ['comparative-offering-expenses-by-sub-type', { ...searchParams, church: activeChurchId }],
    queryFn: async () => {
      return await getComparativeOfferingExpensesBySubType({
        searchType: MetricSearchType.ComparativeOfferingExpensesBySubType,
        metricType: searchParams?.type ?? type,
        startMonth: searchParams?.startMonth ?? startMonth,
        endMonth: searchParams?.endMonth ?? endMonth,
        year: searchParams?.year ?? year,
        church: activeChurchId ?? '',
        order: RecordOrder.Ascending,
      });
    },
    retry: false,
    enabled:
      !!searchParams?.type &&
      !!searchParams?.startMonth &&
      !!searchParams?.endMonth &&
      !!searchParams?.year &&
      !!activeChurchId,
  });

  //* Effects
  useEffect(() => {
    setSearchParams({ year, type, startMonth, endMonth });
  }, [comparativeOfferingExpensesBySubType?.data, year]);

  useEffect(() => {
    if (comparativeOfferingExpensesBySubType?.data) {
      const transformedData = comparativeOfferingExpensesBySubType?.data.map((offering) => {
        const totalGeneral = comparativeOfferingExpensesBySubType.data
          .map((item) => item.totalAmount)
          .reduce((acc, item) => acc + item, 0);

        return {
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

    if (!comparativeOfferingExpensesBySubType?.data) {
      setMappedData([]);
    }
  }, [comparativeOfferingExpensesBySubType?.data]);

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof metricsFormSchema>): void => {
    setSearchParams(formData);
  };

  const isFetchingData = !searchParams || (comparativeOfferingExpensesBySubType?.isFetching && !mappedData?.length);
  const isEmptyData = !isFetchingData && !mappedData?.length;

  return (
    <MetricCard
      className='col-start-1 col-end-3'
      title={
        <>
          Salidas de Ofrenda
          {!!mappedData?.length && (
            <Badge variant='active' className='mt-1 text-white text-[11px] py-0.3 tracking-wide'>
              Activos
            </Badge>
          )}
        </>
      }
      description='Detallado (Acumulado por sub-tipo, rango de meses y año).'
      icon={<TbChartBar className='w-5 h-5 text-rose-600 dark:text-rose-400' />}
      isFetching={isFetchingData}
      isEmpty={isEmptyData}
      headerAction={
        <Form {...form}>
          <form className='flex items-center flex-col sm:flex-row gap-1'>
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => {
                return (
                  <FormItem>
                    <Popover
                      open={isInputSearchTypeOpen}
                      onOpenChange={(e) => {
                        setIsInputSearchTypeOpen(e);
                        form.resetField('year', { defaultValue: '' });
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
                              ? transformedArray.find((type) => type.key === field.value)?.value
                              : 'Elige un tipo'}
                            <CaretSortIcon className='h-4 w-4 shrink-0' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align='center' className='w-auto px-4 py-2'>
                        <Command>
                          <CommandInput placeholder='Busque un tipo' className='h-9 text-[14px] md:text-[14px]' />
                          <CommandEmpty>Tipo no encontrado.</CommandEmpty>
                          <CommandGroup className='max-h-[100px] h-auto'>
                            {transformedArray.map(
                              (type) =>
                                type.key !== OfferingExpenseSearchType.ExpensesAdjustment && (
                                  <CommandItem
                                    className='text-[14px] md:text-[14px]'
                                    value={type.value}
                                    key={type.key}
                                    onSelect={() => {
                                      form.setValue('type', type.key);
                                      setIsInputSearchTypeOpen(false);
                                    }}
                                  >
                                    {type.value}
                                    <CheckIcon
                                      className={cn(
                                        'ml-auto h-4 w-4',
                                        type.key === field.value ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                  </CommandItem>
                                )
                            )}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage className='text-[13px]' />
                  </FormItem>
                );
              }}
            />

            <div className='flex'>
              <FormField
                control={form.control}
                name='startMonth'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Popover
                        open={isInputSearchStartMonthOpen}
                        onOpenChange={(e) => {
                          setIsInputSearchStartMonthOpen(e);
                          form.resetField('year', { defaultValue: '' });
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
                                : 'Inicio'}
                              <CaretSortIcon className='h-4 w-4 shrink-0' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align='center' className='w-auto px-4 py-2'>
                          <Command className='w-[10rem]'>
                            <CommandInput placeholder='Busque un mes' className='h-9 text-[14px] md:text-[14px]' />
                            <CommandEmpty>Mes no encontrado.</CommandEmpty>
                            <CommandGroup className='max-h-[100px] h-auto'>
                              {months.map((month) => (
                                <CommandItem
                                  className='text-[14px] md:text-[14px]'
                                  value={month.label}
                                  key={month.value}
                                  onSelect={() => {
                                    form.setValue('startMonth', month.value);
                                    type && startMonth && endMonth && year && form.handleSubmit(handleSubmit)();
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
                    <FormItem>
                      <Popover
                        open={isInputSearchEndMonthOpen}
                        onOpenChange={(e) => {
                          setIsInputSearchEndMonthOpen(e);
                          form.resetField('year', { defaultValue: '' });
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
                                : 'Fin'}
                              <CaretSortIcon className='h-4 w-4 shrink-0' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align='center' className='w-auto px-4 py-2'>
                          <Command className='w-[10rem]'>
                            <CommandInput placeholder='Busque un mes' className='h-9 text-[14px] md:text-[14px]' />
                            <CommandEmpty>Mes no encontrado.</CommandEmpty>
                            <CommandGroup className='max-h-[100px] h-auto'>
                              {months.map((month) => (
                                <CommandItem
                                  className='text-[14px] md:text-[14px]'
                                  value={month.label}
                                  key={month.value}
                                  onSelect={() => {
                                    form.setValue('endMonth', month.value);
                                    type && startMonth && endMonth && year && form.handleSubmit(handleSubmit)();
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
            </div>
          </form>
        </Form>
      }
    >
      <ChartContainer config={chartConfig} className='w-full h-[240px] sm:h-[270px] md:h-[310px] xl:h-[320px]'>
        <BarChart accessibilityLayer data={mappedData} margin={{ top: 5, right: 5, left: -25, bottom: 10 }}>
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
          <ChartTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} content={ComparativeOfferingExpensesBySubTypeTooltipContent as any} />
          <ChartLegend content={<ChartLegendContent className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs' />} />
          <Bar dataKey='accumulatedOfferingPEN' stackId='subType' fill='var(--color-accumulatedOfferingPEN)' radius={[2, 2, 2, 2]} />
          <Bar dataKey='accumulatedOfferingEUR' stackId='subType' fill='var(--color-accumulatedOfferingEUR)' radius={[2, 2, 0, 0]} />
          <Bar dataKey='accumulatedOfferingUSD' stackId='subType' fill='var(--color-accumulatedOfferingUSD)' radius={[2, 2, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </MetricCard>
  );
};
