import { ComposedChart, Bar, CartesianGrid, Area, XAxis, YAxis } from 'recharts';

import { TbCalendarStats } from 'react-icons/tb';

import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { getMembersByBirthMonth } from '@/modules/metrics/services/member-metrics.service';
import { useMetricsQuery } from '@/modules/metrics/hooks';
import { MetricCard } from '@/modules/metrics/components/shared/MetricCard';
import { MembersByBirthMonthTooltipContent } from '@/modules/metrics/components/member/tooltips/components/MembersByBirthMonthTooltipContent';

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
  membersCount: {
    label: 'N° Miembros',
    color: '#4391ee',
  },
  averageAge: {
    label: 'Edad Prom.',
    color: '#2662D9',
  },
} satisfies ChartConfig;

export const MemberAnalysisCardByBirthMonth = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  //* Queries
  const { data, isLoading, isEmpty } = useMetricsQuery({
    queryKey: ['members-by-birth-month', activeChurchId],
    queryFn: () =>
      getMembersByBirthMonth({
        searchType: MetricSearchType.MembersByBirthMonth,
        year: String(new Date().getFullYear()),
        order: RecordOrder.Ascending,
        church: activeChurchId ?? '',
      }),
    activeChurchId,
  });

  return (
    <MetricCard
      title={
        <>
          <span>Mes de Nacimiento</span>
          <Badge
            variant='active'
            className='mt-1 text-white text-[11px] md:text-[11px] py-0.3 md:py-0.35 tracking-wide'
          >
            Activos
          </Badge>
        </>
      }
      icon={<TbCalendarStats className='w-5 h-5 text-blue-600 dark:text-blue-400' />}
      isLoading={isLoading}
      isEmpty={isEmpty}
      className='col-start-2 col-end-3'
    >
      <ChartContainer
        config={chartConfig}
        className={cn(
          'w-full h-[240px] sm:h-[270px] md:h-[310px] xl:h-[320px]'
        )}
      >
        <ComposedChart
          accessibilityLayer
          data={data}
          margin={{ top: 5, right: 5, left: -35, bottom: 10 }}
        >
          <CartesianGrid vertical={false} strokeDasharray='3 3' className='stroke-slate-200 dark:stroke-slate-700' />

          <XAxis
            dataKey='month'
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => value.slice(0, 3)}
            className='text-xs fill-slate-500 dark:fill-slate-400'
          />
          <YAxis type='number' tickLine={false} axisLine={false} className='text-xs fill-slate-500 dark:fill-slate-400' />

          <ChartTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} content={MembersByBirthMonthTooltipContent as any} />

          <ChartLegend
            content={<ChartLegendContent className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs' />}
          />

          <Bar dataKey='membersCount' fill='var(--color-membersCount)' radius={4} />
          <Area
            dataKey='averageAge'
            type='linear'
            fill='var(--color-averageAge)'
            fillOpacity={0.4}
            stroke='var(--color-averageAge)'
          />
        </ComposedChart>
      </ChartContainer>
    </MetricCard>
  );
};
