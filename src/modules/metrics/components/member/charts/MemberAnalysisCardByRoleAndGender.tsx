import { useMemo } from 'react';

import { Bar, XAxis, YAxis, CartesianGrid, BarChart } from 'recharts';

import { TbUsers } from 'react-icons/tb';

import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { getMembersByRole } from '@/modules/metrics/services/member-metrics.service';
import { useMetricsQuery } from '@/modules/metrics/hooks';
import { MetricCard } from '@/modules/metrics/components/shared/MetricCard';
import { MembersByRoleAndGenderTooltipContent } from '@/modules/metrics/components/member/tooltips/components/MembersByRoleAndGenderTooltipContent';

import { cn } from '@/shared/lib/utils';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { MemberRole, MemberRoleNames } from '@/shared/enums/member-role.enum';

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
    color: '#00bcdc',
  },
  women: {
    label: 'Mujeres',
    color: '#bb3dff',
  },
} satisfies ChartConfig;

interface ResultDataOptions {
  role: string;
  men: number;
  women: number;
  church: {
    isAnexe: boolean;
    abbreviatedChurchName: string;
  };
  totalPercentage: string;
}

export const MemberAnalysisCardByRoleAndGender = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  //* Queries
  const { data, isLoading, isEmpty } = useMetricsQuery({
    queryKey: ['members-by-role-and-gender', activeChurchId],
    queryFn: () =>
      getMembersByRole({
        searchType: MetricSearchType.MembersByRoleAndGender,
        year: String(new Date().getFullYear()),
        order: RecordOrder.Ascending,
        church: activeChurchId ?? '',
      }),
    activeChurchId,
  });

  //* Mapped data
  const mappedData = useMemo<ResultDataOptions[]>(() => {
    if (!data) return [];
    return Object.entries(data).map(([role, payload]: [string, any]) => {
      const totalMembers: number = Object.values(data).reduce(
        (total: number, item: any) => total + item?.men + item?.women,
        0
      );
      return {
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
        men: payload?.men,
        women: payload?.women,
        church: {
          isAnexe: payload?.church?.isAnexe,
          abbreviatedChurchName: payload?.church?.abbreviatedChurchName,
        },
        totalPercentage: (((payload?.men + payload?.women) / totalMembers) * 100).toFixed(1),
      };
    });
  }, [data]);

  return (
    <MetricCard
      title={
        <>
          <span>Roles Eclesiásticos</span>
          <Badge
            variant='active'
            className='mt-1 text-[11px] text-white md:text-[11px] py-0.3 md:py-0.35 tracking-wide'
          >
            Activos
          </Badge>
        </>
      }
      icon={<TbUsers className='w-5 h-5 text-cyan-600 dark:text-cyan-400' />}
      isLoading={isLoading}
      isEmpty={isEmpty || !mappedData.length}
      className='col-start-1 col-end-2'
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
            tickFormatter={(value) => value.slice(0, 10)}
            className='text-xs fill-slate-500 dark:fill-slate-400'
          />

          <YAxis tickLine={false} axisLine={false} className='text-xs fill-slate-500 dark:fill-slate-400' />
          <ChartTooltip
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            content={MembersByRoleAndGenderTooltipContent as any}
          />

          <ChartLegend
            content={<ChartLegendContent className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs' />}
          />

          <Bar dataKey='men' fill='var(--color-men)' radius={4} />
          <Bar dataKey='women' fill='var(--color-women)' radius={4} />
        </BarChart>
      </ChartContainer>
    </MetricCard>
  );
};
