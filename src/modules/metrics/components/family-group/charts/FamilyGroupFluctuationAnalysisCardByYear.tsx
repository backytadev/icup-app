import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TbChartBar } from 'react-icons/tb';
import { useMediaQuery } from '@react-hook/media-query';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { useMetricsQuery } from '@/modules/metrics/hooks';
import { metricsFormSchema } from '@/modules/metrics/schemas/metrics-form-schema';
import { getFluctuationFamilyGroupsByYear } from '@/modules/metrics/services/family-group-metrics.service';
import { FamilyGroupsFluctuationByYearTooltipContent } from '@/modules/metrics/components/family-group/tooltips/components/FamilyGroupsFluctuationByYearTooltipContent';
import { MetricCard } from '@/modules/metrics/components/shared/MetricCard';

import { cn } from '@/shared/lib/utils';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { generateYearOptions } from '@/shared/helpers/generate-year-options.helper';

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
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';

const chartConfig = {
  newFamilyGroups: {
    label: 'Nuevos',
    color: '#22C55E',
  },
  inactiveFamilyGroups: {
    label: 'Bajas',
    color: '#EF4444',
  },
} satisfies ChartConfig;

interface SearchParamsOptions {
  year?: string;
}

export const FamilyGroupFluctuationAnalysisCardByYear = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  //* States
  const [searchParams, setSearchParams] = useState<SearchParamsOptions | undefined>(undefined);

  //* Media Queries
  const intermediateSM = useMediaQuery('(min-width: 640px)');
  const intermediateLG = useMediaQuery('(min-width: 1280px)');
  const intermediateXL = useMediaQuery('(min-width: 1300px)');
  const intermediate2XL = useMediaQuery('(min-width: 1450px)');

  //* Form
  const form = useForm<z.infer<typeof metricsFormSchema>>({
    resolver: zodResolver(metricsFormSchema),
    mode: 'onChange',
    defaultValues: {
      year: new Date().getFullYear().toString(),
    },
  });

  //* Watchers
  const year = form.getValues('year');

  //* Queries
  const { data, isLoading, isEmpty } = useMetricsQuery({
    queryKey: ['family-groups-fluctuation-by-year', { ...searchParams, church: activeChurchId }],
    queryFn: () =>
      getFluctuationFamilyGroupsByYear({
        searchType: MetricSearchType.FamilyGroupsFluctuationByYear,
        year: searchParams?.year ?? year,
        order: RecordOrder.Ascending,
        church: activeChurchId ?? '',
      }),
    activeChurchId,
  });

  //* Helpers
  const years = generateYearOptions(2025);

  //* Effects
  // Default value
  useEffect(() => {
    setSearchParams({ year });
    form.setValue('year', year);
  }, [data]);

  //* Form handler
  function handleSubmit(formData: z.infer<typeof metricsFormSchema>): void {
    setSearchParams(formData);
  }

  return (
    <MetricCard
      title={
        intermediate2XL ? (
          <span>Fluctuación de Grupos Familiares</span>
        ) : intermediateXL ? (
          <span>Fluctuación de Grupos Familiares</span>
        ) : intermediateLG ? (
          <span>Fluctuación de Grupos Familiares</span>
        ) : intermediateSM ? (
          <span>Fluctuación de Grupos Familiares</span>
        ) : (
          <span>Fluct. de Grupos Familiares</span>
        )
      }
      headerAction={
        <Form {...form}>
          <form>
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
      }
      icon={<TbChartBar className='w-5 h-5 text-green-600 dark:text-green-400' />}
      isLoading={isLoading}
      isEmpty={isEmpty}
      className='col-start-1 col-end-2'
    >
      <ChartContainer
        config={chartConfig}
        className='w-full h-[240px] sm:h-[270px] md:h-[310px] xl:h-[320px]'
      >
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 5, right: 5, left: -35, bottom: 10 }}
        >
          <CartesianGrid vertical={false} strokeDasharray='3 3' className='stroke-slate-200 dark:stroke-slate-700' />
          <XAxis
            dataKey='month'
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
            className='text-xs fill-slate-500 dark:fill-slate-400'
          />

          <YAxis tickLine={false} axisLine={false} className='text-xs fill-slate-500 dark:fill-slate-400' />

          <ChartTooltip
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            content={FamilyGroupsFluctuationByYearTooltipContent as any}
          />

          <ChartLegend
            content={<ChartLegendContent className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs' />}
          />

          <Bar dataKey='newFamilyGroups' fill='var(--color-newFamilyGroups)' radius={4} />
          <Bar
            dataKey='inactiveFamilyGroups'
            fill='var(--color-inactiveFamilyGroups)'
            radius={4}
          />
        </BarChart>
      </ChartContainer>
    </MetricCard>
  );
};
