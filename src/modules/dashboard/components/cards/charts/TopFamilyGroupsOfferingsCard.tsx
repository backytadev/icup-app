import { TbChartPie } from 'react-icons/tb';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { RecordOrder } from '@/shared/enums/record-order.enum';

import { useChurchSelector, useDashboardQuery } from '@/modules/dashboard/hooks';
import { ChurchSelector, DashboardCard } from '@/modules/dashboard/components/shared';
import { DashboardSearchType } from '@/modules/dashboard/enums/dashboard-search-type.enum';
import { getOfferingsForBarChartByTerm } from '@/modules/dashboard/services/dashboard.service';
import { TopFamilyGroupsTooltipContent } from '@/modules/dashboard/components/cards/charts/TopFamilyGroupsOfferingsTooltipContent';

import {
  ChartLegend,
  ChartTooltip,
  ChartContainer,
  type ChartConfig,
  ChartLegendContent,
} from '@/shared/components/ui/chart';

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

export const TopFamilyGroupsOfferingsCard = (): JSX.Element => {
  const {
    searchParams,
    isPopoverOpen,
    setIsPopoverOpen,
    churchesQuery,
    selectedChurchCode,
    handleChurchSelect,
    form,
  } = useChurchSelector({ queryKey: 'top-family-groups-offerings' });

  const churchId = form.getValues('churchId') ?? searchParams?.churchId;

  const { data, isLoading, isFetching, isEmpty } = useDashboardQuery({
    queryKey: ['top-family-groups-offerings', searchParams],
    queryFn: () =>
      getOfferingsForBarChartByTerm({
        searchType: DashboardSearchType.TopFamilyGroupsOfferings,
        churchId: searchParams?.churchId ?? churchId ?? '',
        year: new Date().getFullYear().toString(),
        order: RecordOrder.Descending,
      }),
    churchId: searchParams?.churchId ?? churchId,
    enabled: !!searchParams,
  });

  return (
    <DashboardCard
      title='Ofrendas - Grupo Familiar'
      description={`Grupos familiares destacados (${new Date().getFullYear()})`}
      icon={<TbChartPie className='w-5 h-5 text-purple-600 dark:text-purple-400' />}
      headerAction={
        <ChurchSelector
          churches={churchesQuery.data}
          selectedChurchId={churchId}
          selectedChurchCode={selectedChurchCode}
          isOpen={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          onSelect={handleChurchSelect}
          isLoading={churchesQuery.isLoading}
        />
      }
      isLoading={isLoading || (!data && isFetching)}
      isEmpty={isEmpty}
      emptyVariant='chart'
      emptyMessage='No hay datos de ofrendas de grupos familiares.'
      className='col-span-1 xl:col-span-3 row-span-1'
      contentClassName='h-[280px] sm:h-[300px] md:h-[320px] lg:h-[340px]'
    >
      {data && data.length > 0 && (
        <ChartContainer config={chartConfig} className='w-full h-full'>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ top: 5, right: 5, left: -25, bottom: 10 }}
          >
            <CartesianGrid vertical strokeDasharray='3 3' className='stroke-slate-200 dark:stroke-slate-700' />
            <XAxis
              dataKey='familyGroup.familyGroupCode'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value?.slice(0, 12) ?? ''}
              className='text-xs fill-slate-500 dark:fill-slate-400'
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className='text-xs fill-slate-500 dark:fill-slate-400'
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              content={TopFamilyGroupsTooltipContent as any}
            />

            <ChartLegend
              content={
                <ChartLegendContent className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs' />
              }
            />

            <Bar
              dataKey='accumulatedOfferingPEN'
              stackId='familyGroup'
              fill='var(--color-accumulatedOfferingPEN)'
              radius={[2, 2, 2, 2]}
            />
            <Bar
              dataKey='accumulatedOfferingEUR'
              stackId='familyGroup'
              fill='var(--color-accumulatedOfferingEUR)'
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey='accumulatedOfferingUSD'
              stackId='familyGroup'
              fill='var(--color-accumulatedOfferingUSD)'
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      )}
    </DashboardCard>
  );
};
