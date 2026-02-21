import { useMemo } from 'react';

import { Bar, YAxis, XAxis, BarChart, CartesianGrid } from 'recharts';

import { TbActivity } from 'react-icons/tb';

import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import { cn } from '@/shared/lib/utils';
import { RecordOrder } from '@/shared/enums/record-order.enum';
import { MemberRole, MemberRoleNames } from '@/shared/enums/member-role.enum';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { getMembersByRecordStatus } from '@/modules/metrics/services/member-metrics.service';
import { useMetricsQuery } from '@/modules/metrics/hooks';
import { MetricCard } from '@/modules/metrics/components/shared/MetricCard';
import { MembersByRecordStatusTooltipContent } from '@/modules/metrics/components/member/tooltips/components/MembersByRecordStatusTooltipContent';

import {
  ChartLegend,
  ChartTooltip,
  ChartContainer,
  type ChartConfig,
  ChartLegendContent,
} from '@/shared/components/ui/chart';

const chartConfig = {
  active: {
    label: 'Activos',
    color: '#22C55E',
  },
  inactive: {
    label: 'Inactivos',
    color: '#EF4444',
  },
} satisfies ChartConfig;

interface ResultDataOptions {
  role: string;
  active: number;
  inactive: number;
  church: {
    isAnexe: boolean;
    abbreviatedChurchName: string;
  };
}

export const MemberAnalysisCardByRecordStatus = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  //* Queries
  const { data, isLoading, isEmpty } = useMetricsQuery({
    queryKey: ['members-by-record-status', activeChurchId],
    queryFn: () =>
      getMembersByRecordStatus({
        searchType: MetricSearchType.MembersByRecordStatus,
        year: String(new Date().getFullYear()),
        order: RecordOrder.Ascending,
        church: activeChurchId ?? '',
      }),
    activeChurchId,
  });

  //* Mapped data
  const mappedData = useMemo<ResultDataOptions[]>(() => {
    if (!data) return [];
    return Object.entries(data).map(([role, payload]: [string, any]) => ({
      role:
        role === MemberRole.Pastor
          ? MemberRoleNames[role]
          : role === MemberRole.Copastor
            ? MemberRoleNames[role]
            : role === MemberRole.Supervisor
              ? MemberRoleNames[role]
              : role === MemberRole.Preacher
                ? MemberRoleNames[role]
                : MemberRoleNames.disciple,
      active: payload?.active,
      inactive: payload?.inactive,
      church: {
        isAnexe: payload?.church?.isAnexe,
        abbreviatedChurchName: payload?.church?.abbreviatedChurchName,
      },
    }));
  }, [data]);

  return (
    <MetricCard
      title='Estado de Registro'
      icon={<TbActivity className='w-5 h-5 text-emerald-600 dark:text-emerald-400' />}
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
          margin={{ top: 5, right: 5, left: -35, bottom: 10 }}
        >
          <CartesianGrid vertical={false} strokeDasharray='3 3' className='stroke-slate-200 dark:stroke-slate-700' />
          <XAxis
            dataKey='role'
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 8)}
            className='text-xs fill-slate-500 dark:fill-slate-400'
          />

          <YAxis tickLine={false} axisLine={false} className='text-xs fill-slate-500 dark:fill-slate-400' />

          <ChartTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} content={MembersByRecordStatusTooltipContent as any} />

          <ChartLegend
            content={<ChartLegendContent className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs' />}
          />

          <Bar dataKey='active' fill='var(--color-active)' radius={4} />
          <Bar dataKey='inactive' fill='var(--color-inactive)' radius={4} />
        </BarChart>
      </ChartContainer>
    </MetricCard>
  );
};
