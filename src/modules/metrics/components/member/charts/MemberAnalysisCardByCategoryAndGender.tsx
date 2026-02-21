import { useMemo } from 'react';

import { CartesianGrid, Area, AreaChart, XAxis, YAxis } from 'recharts';

import { TbChartArea } from 'react-icons/tb';

import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { getMembersByCategoryAndGender } from '@/modules/metrics/services/member-metrics.service';
import { useMetricsQuery } from '@/modules/metrics/hooks';
import { MetricCard } from '@/modules/metrics/components/shared/MetricCard';
import { MembersByCategoryAndGenderTooltipContent } from '@/modules/metrics/components/member/tooltips/components/MembersByCategoryAndGenderTooltipContent';

import { cn } from '@/shared/lib/utils';
import { RecordOrder } from '@/shared/enums/record-order.enum';

import {
  ChartLegend,
  ChartTooltip,
  ChartContainer,
  type ChartConfig,
  ChartLegendContent,
} from '@/shared/components/ui/chart';
import { Badge } from '@/shared/components/ui/badge';

const chartConfig = {
  men: {
    label: 'Varones',
    color: '#2662D9',
  },
  women: {
    label: 'Mujeres',
    color: '#E23670',
  },
} satisfies ChartConfig;

interface ResultDataOptions {
  category: string;
  men: number;
  women: number;
  totalPercentage: string;
  church: {
    isAnexe: boolean;
    abbreviatedChurchName: string;
  };
}

export const MemberAnalysisCardByCategoryAndGender = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  //* Queries
  const { data, isLoading, isEmpty } = useMetricsQuery({
    queryKey: ['members-by-category-and-gender', activeChurchId],
    queryFn: () =>
      getMembersByCategoryAndGender({
        searchType: MetricSearchType.MembersByCategoryAndGender,
        year: String(new Date().getFullYear()),
        order: RecordOrder.Ascending,
        church: activeChurchId ?? '',
      }),
    activeChurchId,
  });

  //* Mapped data
  const mappedData = useMemo<ResultDataOptions[]>(() => {
    if (!data) return [];
    return Object.entries(data).map(([category, value]: [string, any]) => {
      const totalMembers: number = Object.values(data).reduce(
        (total: number, item: any) => total + item?.men + item?.women,
        0
      );
      return {
        category:
          category === 'child'
            ? 'Niño'
            : category === 'teenager'
              ? 'Adolescente'
              : category === 'youth'
                ? 'Joven'
                : category === 'adult'
                  ? 'Adulto'
                  : category === 'middleAged'
                    ? 'Adulto Mayor'
                    : 'Anciano',
        men: value?.men,
        women: value?.women,
        church: {
          isAnexe: value?.church?.isAnexe,
          abbreviatedChurchName: value?.church?.abbreviatedChurchName,
        },
        totalPercentage: (((value?.men + value?.women) / totalMembers) * 100).toFixed(1),
      };
    });
  }, [data]);

  return (
    <MetricCard
      title={
        <>
          <span>Categoría y Género</span>
          <Badge
            variant='active'
            className='mt-1 text-white text-[11px] md:text-[11px] py-0.3 md:py-0.35 tracking-wide'
          >
            Activos
          </Badge>
        </>
      }
      icon={<TbChartArea className='w-5 h-5 text-pink-600 dark:text-pink-400' />}
      isLoading={isLoading}
      isEmpty={isEmpty || !mappedData.length}
      className='col-start-2 col-end-3'
    >
      <ChartContainer
        config={chartConfig}
        className={cn(
          'w-full h-[240px] sm:h-[270px] md:h-[310px] xl:h-[320px]'
        )}
      >
        <AreaChart
          accessibilityLayer
          data={mappedData}
          margin={{ top: 5, right: 5, left: -35, bottom: 10 }}
        >
          <CartesianGrid vertical={false} strokeDasharray='3 3' className='stroke-slate-200 dark:stroke-slate-700' />
          <XAxis
            dataKey='category'
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className='text-xs fill-slate-500 dark:fill-slate-400'
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis type='number' tickLine={false} axisLine={false} className='text-xs fill-slate-500 dark:fill-slate-400' />

          <ChartTooltip
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            content={MembersByCategoryAndGenderTooltipContent as any}
          />

          <Area
            dataKey='men'
            type='natural'
            fill='var(--color-men)'
            fillOpacity={0.4}
            stroke='var(--color-men)'
            stackId='men'
          />
          <Area
            dataKey='women'
            type='natural'
            fill='var(--color-women)'
            fillOpacity={0.4}
            stroke='var(--color-women)'
            stackId='women'
          />
          <ChartLegend
            content={<ChartLegendContent className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs' />}
          />
        </AreaChart>
      </ChartContainer>
    </MetricCard>
  );
};
