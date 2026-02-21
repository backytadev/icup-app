import { useMemo } from 'react';

import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';

import { TbHeart } from 'react-icons/tb';

import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { getMembersByMaritalStatus } from '@/modules/metrics/services/member-metrics.service';
import { useMetricsQuery } from '@/modules/metrics/hooks';
import { MetricCard } from '@/modules/metrics/components/shared/MetricCard';

import { cn } from '@/shared/lib/utils';
import { RecordOrder } from '@/shared/enums/record-order.enum';

import {
  ChartTooltip,
  ChartContainer,
  type ChartConfig,
  ChartTooltipContent,
} from '@/shared/components/ui/chart';
import { Badge } from '@/shared/components/ui/badge';

const chartConfig = {
  membersCount: {
    label: 'N° miembros',
  },
  single: {
    label: 'Soltero(a)',
    color: '#0088FE',
  },
  married: {
    label: 'Casado(a)',
    color: '#00C49F',
  },
  windowed: {
    label: 'Viudo(a)',
    color: '#FFBB28',
  },
  divorced: {
    label: 'Divorciado(a)',
    color: '#FF8042',
  },
  other: {
    label: 'Otro',
    color: '#b431ff',
  },
} satisfies ChartConfig;

interface ResultDataOptions {
  maritalStatus: string;
  membersCount: number;
  fill: string;
}

export const MemberAnalysisCardByMaritalStatus = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  //* Queries
  const { data, isLoading, isEmpty } = useMetricsQuery({
    queryKey: ['members-by-marital-status', activeChurchId],
    queryFn: () =>
      getMembersByMaritalStatus({
        searchType: MetricSearchType.MembersByMaritalStatus,
        year: String(new Date().getFullYear()),
        order: RecordOrder.Ascending,
        church: activeChurchId ?? '',
      }),
    activeChurchId,
  });

  //* Mapped data
  const mappedData = useMemo<ResultDataOptions[]>(() => {
    if (!data) return [];
    return Object.entries(data).map(([maritalStatus, membersCount]) => ({
      maritalStatus,
      membersCount: membersCount as number,
      fill: `var(--color-${maritalStatus})`,
    }));
  }, [data]);

  return (
    <MetricCard
      title={
        <>
          <span>Estado civil</span>
          <Badge
            variant='active'
            className='mt-1 text-[11px] text-white md:text-[11px] py-0.3 md:py-0.35 tracking-wide'
          >
            Activos
          </Badge>
        </>
      }
      icon={<TbHeart className='w-5 h-5 text-amber-600 dark:text-amber-400' />}
      // subTitle={church?.abbreviatedChurchName}
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
        <BarChart
          accessibilityLayer
          data={mappedData}
          layout='vertical'
          margin={{ top: 5, right: 5, left: 38, bottom: 10 }}
          className='-ml-3 md:ml-0'
        >
          <CartesianGrid horizontal={false} strokeDasharray='3 3' className='stroke-slate-200 dark:stroke-slate-700' />
          <YAxis
            dataKey='maritalStatus'
            type='category'
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            className='text-xs fill-slate-500 dark:fill-slate-400'
            tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
          />
          <XAxis dataKey='membersCount' type='number' hide />

          <ChartTooltip
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            content={<ChartTooltipContent className='text-[13.5px] md:text-[13.5px]' />}
          />

          <Bar dataKey='membersCount' layout='vertical' radius={5}></Bar>
        </BarChart>
      </ChartContainer>
    </MetricCard>
  );
};
