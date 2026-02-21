import { useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bar, YAxis, XAxis, BarChart, CartesianGrid } from 'recharts';

import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import { metricsFormSchema } from '@/modules/metrics/schemas/metrics-form-schema';
import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { getFluctuationMembersByYear } from '@/modules/metrics/services/member-metrics.service';
import { useMetricsQuery } from '@/modules/metrics/hooks';
import { MetricCard } from '@/modules/metrics/components/shared/MetricCard';
import { MembersFluctuationByYearTooltipContent } from '@/modules/metrics/components/member/tooltips/components/MembersFluctuationByYearTooltipContent';

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
import { TbChartBar } from 'react-icons/tb';

const chartConfig = {
  newMembers: {
    label: 'Nuevos',
    color: '#22C55E',
  },
  inactiveMembers: {
    label: 'Bajas',
    color: '#EF4444',
  },
} satisfies ChartConfig;

interface SearchParamsOptions {
  year?: string;
}

export const MemberFluctuationAnalysisCardByYear = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  //* States
  const [searchParams, setSearchParams] = useState<SearchParamsOptions>({
    year: new Date().getFullYear().toString(),
  });

  //* Form
  const form = useForm<z.infer<typeof metricsFormSchema>>({
    resolver: zodResolver(metricsFormSchema),
    mode: 'onChange',
    defaultValues: {
      year: new Date().getFullYear().toString(),
    },
  });

  //* Helpers
  const years = generateYearOptions(2024);

  //* Queries
  const { data, isLoading, isEmpty } = useMetricsQuery({
    queryKey: ['members-fluctuation-by-year', { ...searchParams, church: activeChurchId }],
    queryFn: () =>
      getFluctuationMembersByYear({
        searchType: MetricSearchType.MembersFluctuationByYear,
        year: searchParams.year,
        order: RecordOrder.Ascending,
        church: activeChurchId ?? '',
      }),
    activeChurchId,
  });

  //* Form handler
  function handleSubmit(formData: z.infer<typeof metricsFormSchema>): void {
    setSearchParams(formData);
  }

  return (
    <MetricCard
      title='Fluctuación de Miembros'
      isLoading={isLoading}
      icon={<TbChartBar className='w-5 h-5 text-green-600 dark:text-green-400' />}
      isEmpty={isEmpty}
      className='col-start-1 col-end-2'
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
    >
      <ChartContainer
        config={chartConfig}
        className={cn(
          'w-full h-[240px] sm:h-[270px] md:h-[310px] xl:h-[320px]'
        )}
      >
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 5, right: 5, left: -32, bottom: 10 }}
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
            content={MembersFluctuationByYearTooltipContent as any}
          />

          <ChartLegend
            content={<ChartLegendContent className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs' />}
          />

          <Bar dataKey='newMembers' fill='var(--color-newMembers)' radius={4} />
          <Bar dataKey='inactiveMembers' fill='var(--color-inactiveMembers)' radius={4} />
        </BarChart>
      </ChartContainer>
    </MetricCard>
  );
};
