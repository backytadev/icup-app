import { TbChartBar } from 'react-icons/tb';
import { toZonedTime, format as formatZonedTime } from 'date-fns-tz';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { formatDateToLimaDayMonthYear } from '@/shared/helpers/format-date-to-lima';
import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import { useDashboardQuery } from '@/modules/dashboard/hooks';
import { DashboardCard } from '@/modules/dashboard/components/shared';
import { DashboardSearchType } from '@/modules/dashboard/enums/dashboard-search-type.enum';
import { getOfferingsForBarChartByTerm } from '@/modules/dashboard/services/dashboard.service';
import { LastSundaysOfferingsTooltipContent } from '@/modules/dashboard/components/cards/charts/LastSundaysOfferingsTooltipContent';

import {
  ChartLegend,
  ChartTooltip,
  ChartContainer,
  type ChartConfig,
  ChartLegendContent,
} from '@/shared/components/ui/chart';

const chartConfig = {
  dayPEN: {
    label: 'Día PEN',
    color: '#F09330',
  },
  afternoonPEN: {
    label: 'Tarde PEN',
    color: '#0284C7',
  },
  dayUSD: {
    label: 'Día USD',
    color: '#4CAF50',
  },
  afternoonUSD: {
    label: 'Tarde USD',
    color: '#E23670',
  },
  dayEUR: {
    label: 'Día EUR',
    color: '#8E44AD',
  },
  afternoonEUR: {
    label: 'Tarde EUR',
    color: '#edc505',
  },
} satisfies ChartConfig;

export const LastSundayOfferingsCard = (): JSX.Element => {
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  const { data, isLoading, isFetching, isEmpty } = useDashboardQuery({
    queryKey: ['last-sundays-offerings', activeChurchId],
    queryFn: () => {
      const timeZone = 'America/Lima';
      const now = new Date();
      const zonedDate = toZonedTime(now, timeZone);

      return getOfferingsForBarChartByTerm({
        searchType: DashboardSearchType.LastSundaysOfferings,
        churchId: activeChurchId ?? '',
        date: formatZonedTime(zonedDate, 'yyyy-MM-dd HH:mm:ss', { timeZone }),
        limit: '14',
        order: RecordOrder.Descending,
      });
    },
    churchId: activeChurchId ?? undefined,
  });

  return (
    <DashboardCard
      title='Ofrendas Dominicales'
      description={`Últimas ofrendas dominicales (${new Date().getFullYear()})`}
      icon={<TbChartBar className='w-5 h-5 text-blue-600 dark:text-blue-400' />}

      isLoading={isLoading || (!data && isFetching)}
      isEmpty={isEmpty}
      emptyVariant='chart'
      emptyMessage='No hay datos de ofrendas dominicales para mostrar.'
      className='col-span-1 xl:col-span-3 row-span-1'
      contentClassName='h-[280px] sm:h-[300px] md:h-[320px] lg:h-[340px]'
    >
      {data && data.length > 0 && (
        <ChartContainer config={chartConfig} className='w-full h-full'>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ top: 5, right: 5, left: -28, bottom: 10 }}
          >
            <CartesianGrid vertical strokeDasharray='3 3' className='stroke-slate-200 dark:stroke-slate-700' />
            <XAxis
              dataKey='date'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => formatDateToLimaDayMonthYear(value)}
              className='text-xs fill-slate-500 dark:fill-slate-400'
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className='text-xs fill-slate-500 dark:fill-slate-400'
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              content={LastSundaysOfferingsTooltipContent as any}
            />

            <ChartLegend
              content={
                <ChartLegendContent className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs' />
              }
            />

            <Bar
              dataKey='dayPEN'
              name={chartConfig.dayPEN.label}
              stackId='day'
              fill='var(--color-dayPEN)'
              radius={[2, 2, 2, 2]}
            />
            <Bar
              dataKey='dayEUR'
              name={chartConfig.dayEUR.label}
              stackId='day'
              fill='var(--color-dayEUR)'
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey='dayUSD'
              name={chartConfig.dayUSD.label}
              stackId='day'
              fill='var(--color-dayUSD)'
              radius={[2, 2, 0, 0]}
            />

            <Bar
              dataKey='afternoonPEN'
              name={chartConfig.afternoonPEN.label}
              stackId='afternoon'
              fill='var(--color-afternoonPEN)'
              radius={[2, 2, 2, 2]}
            />
            <Bar
              dataKey='afternoonEUR'
              name={chartConfig.afternoonEUR.label}
              stackId='afternoon'
              fill='var(--color-afternoonEUR)'
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey='afternoonUSD'
              name={chartConfig.afternoonUSD.label}
              stackId='afternoon'
              fill='var(--color-afternoonUSD)'
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      )}
    </DashboardCard>
  );
};
