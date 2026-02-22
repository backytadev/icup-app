import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import { TbCoin } from 'react-icons/tb';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { metricsFormSchema } from '@/modules/metrics/schemas/metrics-form-schema';
import { getComparativeOfferingIncomeByType } from '@/modules/metrics/services/offering-comparative-metrics.service';
import { ComparativeOfferingIncomeByTypeTooltipContent } from '@/modules/metrics/components/financial-balance-comparative/tooltips/components/ComparativeOfferingIncomeByTypeTooltipContent';
import { MetricCard } from '@/modules/metrics/components/shared/MetricCard';

import {
  OfferingIncomeCreationType,
  OfferingIncomeCreationTypeNames,
} from '@/modules/offering/income/enums/offering-income-creation-type.enum';
import {
  OfferingIncomeCreationSubType,
  OfferingIncomeCreationSubTypeNames,
} from '@/modules/offering/income/enums/offering-income-creation-sub-type.enum';

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
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';
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
  type?: string;
  year?: string;
}

interface ResultDataOptions {
  month: string;
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

const combinedArray = [
  ...Object.entries(OfferingIncomeCreationSubTypeNames).map(([key, value]) => ({ key, value })),
  ...Object.entries(OfferingIncomeCreationTypeNames).map(([key, value]) => ({ key, value })),
];

export const ComparativeOfferingIncomeAnalysisCardByType = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  //* States
  const [isInputSearchTypeOpen, setIsInputSearchTypeOpen] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<SearchParamsOptions | undefined>(undefined);
  const [mappedData, setMappedData] = useState<ResultDataOptions[]>();

  //* Form
  const form = useForm<z.infer<typeof metricsFormSchema>>({
    resolver: zodResolver(metricsFormSchema),
    mode: 'onChange',
    defaultValues: {
      type: OfferingIncomeCreationSubType.SundayService,
      year: new Date().getFullYear().toString(),
    },
  });

  //* Helpers
  const years = generateYearOptions(2021);

  //* Watchers
  const year = form.watch('year');
  const type = form.watch('type');

  //* Queries
  const comparativeOfferingIncomeByType = useQuery({
    queryKey: ['comparative-offering-income-by-type', { ...searchParams, church: activeChurchId }],
    queryFn: async () => {
      return await getComparativeOfferingIncomeByType({
        searchType: MetricSearchType.ComparativeOfferingIncomeByType,
        metricType: searchParams?.type ?? type,
        year: searchParams?.year ?? year,
        church: activeChurchId ?? '',
        order: RecordOrder.Descending,
      });
    },
    retry: false,
    enabled: !!searchParams?.year && !!searchParams?.type && !!activeChurchId,
  });

  //* Effects
  useEffect(() => {
    setSearchParams({ year, type });
  }, [comparativeOfferingIncomeByType?.data, year]);

  useEffect(() => {
    if (comparativeOfferingIncomeByType?.data) {
      const transformedData = comparativeOfferingIncomeByType?.data.map((offering) => {
        const totalGeneral = comparativeOfferingIncomeByType.data
          .map((item) => item.totalAmount)
          .reduce((acc, item) => acc + item, 0);

        return {
          month: offering.month,
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

    if (!comparativeOfferingIncomeByType?.data) {
      setMappedData([]);
    }
  }, [comparativeOfferingIncomeByType?.data]);

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof metricsFormSchema>): void => {
    setSearchParams(formData);
  };

  const isFetchingData = !searchParams || (comparativeOfferingIncomeByType?.isFetching && !mappedData?.length);
  const isEmptyData = !isFetchingData && !mappedData?.length;

  return (
    <MetricCard
      className='col-start-1 col-end-3'
      title={
        <>
          Ingresos de Ofrenda
          {!!mappedData?.length && (
            <Badge variant='active' className='mt-1 text-white text-[11px] py-0.3 tracking-wide'>
              Activos
            </Badge>
          )}
        </>
      }
      description='Detallado (Acumulado por sub-tipo, mes y año).'
      icon={<TbCoin className='w-5 h-5 text-green-600 dark:text-green-400' />}
      isFetching={isFetchingData}
      isEmpty={isEmptyData}
      headerAction={
        <Form {...form}>
          <form className='flex'>
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
                              ? combinedArray.find((type) => type.key === field.value)?.value
                              : 'Elige un tipo'}
                            <CaretSortIcon className='h-4 w-4 shrink-0' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align='center' className='w-auto px-4 py-2'>
                        <Command className='w-[10rem]'>
                          <CommandInput placeholder='Busque un tipo' className='h-9 text-[14px] md:text-[14px]' />
                          <CommandEmpty>Tipo no encontrado.</CommandEmpty>
                          <CommandGroup className='max-h-[100px] h-auto'>
                            {combinedArray.map(
                              (type) =>
                                type.key !== OfferingIncomeCreationType.Offering && (
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
      <ChartContainer config={chartConfig} className='w-full h-[240px] sm:h-[270px] md:h-[310px] xl:h-[320px]'>
        <BarChart accessibilityLayer data={mappedData} margin={{ top: 5, right: 5, left: -20, bottom: 10 }}>
          <CartesianGrid vertical={false} strokeDasharray='3 3' className='stroke-slate-200 dark:stroke-slate-700' />
          <XAxis
            dataKey='month'
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            className='text-xs fill-slate-500 dark:fill-slate-400'
          />
          <YAxis tickLine={false} axisLine={false} className='text-xs fill-slate-500 dark:fill-slate-400' />
          <ChartTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} content={ComparativeOfferingIncomeByTypeTooltipContent as any} />
          <ChartLegend content={<ChartLegendContent className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs' />} />
          <Bar dataKey='accumulatedOfferingPEN' stackId='type' fill='var(--color-accumulatedOfferingPEN)' radius={[2, 2, 2, 2]} />
          <Bar dataKey='accumulatedOfferingEUR' stackId='type' fill='var(--color-accumulatedOfferingEUR)' radius={[2, 2, 0, 0]} />
          <Bar dataKey='accumulatedOfferingUSD' stackId='type' fill='var(--color-accumulatedOfferingUSD)' radius={[2, 2, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </MetricCard>
  );
};
