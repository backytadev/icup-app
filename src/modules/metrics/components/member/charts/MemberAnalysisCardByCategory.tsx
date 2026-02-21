import { useEffect, useMemo, useState } from 'react';

import { Sector, PieChart, Pie, Label } from 'recharts';
import { TbChartDonut } from 'react-icons/tb';

import { type PieSectorDataItem } from 'recharts/types/polar/Pie';

import { cn } from '@/shared/lib/utils';
import { RecordOrder } from '@/shared/enums/record-order.enum';

import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { getMembersByCategory } from '@/modules/metrics/services/member-metrics.service';
import { useMetricsQuery } from '@/modules/metrics/hooks';
import { MetricCard } from '@/modules/metrics/components/shared/MetricCard';
import { MembersByCategoryLegendContent } from '@/modules/metrics/components/member/tooltips/components/MembersByCategoryLegendContent';

import {
  ChartLegend,
  ChartTooltip,
  ChartContainer,
  type ChartConfig,
  ChartTooltipContent,
} from '@/shared/components/ui/chart';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';

const chartConfig = {
  child: {
    label: 'Niños',
    color: '#FF9999',
  },
  teenager: {
    label: 'Adolescentes',
    color: '#FFCC00',
  },
  youth: {
    label: 'Jóvenes',
    color: '#FF6600',
  },
  adult: {
    label: 'Adultos',
    color: '#33CC33',
  },
  middleAged: {
    label: 'Adulto Mayor',
    color: '#3366FF',
  },
  senior: {
    label: 'Ancianos',
    color: '#9900CC',
  },
} satisfies ChartConfig;

interface ResultDataOptions {
  category: string;
  ageRange: string;
  membersCount: number;
  fill: string;
}

export const MemberAnalysisCardByCategory = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  //* States
  const [mappedData, setMappedData] = useState<ResultDataOptions[]>([]);
  const id = 'pie-interactive';
  const INITIALVALUE = 'child';
  const [activeCategory, setActiveCategory] = useState<string>(INITIALVALUE);

  const activeIndex = useMemo(
    () => mappedData?.findIndex((item) => item.category === activeCategory),
    [activeCategory, mappedData]
  );
  const categories = useMemo(() => mappedData?.map((item) => item.category), [mappedData]);

  //* Queries
  const { data, isLoading, isEmpty } = useMetricsQuery({
    queryKey: ['members-by-category', activeChurchId],
    queryFn: () =>
      getMembersByCategory({
        searchType: MetricSearchType.MembersByCategory,
        year: String(new Date().getFullYear()),
        order: RecordOrder.Ascending,
        church: activeChurchId ?? '',
      }),
    activeChurchId,
  });

  //* Effects
  useEffect(() => {
    if (data) {
      const transformedData = Object.entries(data).map(
        ([category, membersCount]) => {
          return {
            ageRange:
              category === 'child'
                ? `(0-12)`
                : category === 'teenager'
                  ? '(13-17)'
                  : category === 'youth'
                    ? '(18-29)'
                    : category === 'adult'
                      ? '(30-59)'
                      : category === 'middleAged'
                        ? '(60-74)'
                        : '(+75)',
            category,
            membersCount,
            fill: `var(--color-${category})`,
          };
        }
      );

      setMappedData(transformedData);
    }
  }, [data]);

  return (
    <MetricCard
      className='col-start-1 col-end-2'
      title={
        <>
          Categoría
          <Badge
            variant='active'
            className='mt-1 text-white text-[11px] md:text-[11px] py-0.3 md:py-0.35 tracking-wide'
          >
            Activos
          </Badge>
        </>
      }
      // description={church?.abbreviatedChurchName}
      icon={<TbChartDonut className='w-5 h-5 text-orange-600 dark:text-orange-400' />}
      isFetching={isLoading || (!mappedData?.length && !isEmpty)}
      isEmpty={isEmpty}
      contentClassName='flex justify-center'
      headerAction={
        mappedData?.length ? (
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger
              className='h-7 w-auto rounded-lg pl-2.5'
              aria-label='Select a value'
            >
              <SelectValue placeholder='Selecciona una categoría' />
            </SelectTrigger>
            <SelectContent align='end' className='rounded-xl'>
              {categories?.map((key) => {
                const config = chartConfig[key as keyof typeof chartConfig];
                if (!config) {
                  return null;
                }

                return (
                  <SelectItem key={key} value={key} className='rounded-lg [&_span]:flex'>
                    <div className='flex text-[13px] items-center gap-2 pr-1.5'>
                      <span
                        className={cn(
                          'flex h-3 w-3 shrink-0 rounded-sm',
                          key === 'child' && 'bg-[#FF9999]',
                          key === 'teenager' && 'bg-[#FFCC00]',
                          key === 'youth' && 'bg-[#FF6600]',
                          key === 'adult' && 'bg-[#33CC33]',
                          key === 'middleAged' && 'bg-[#3366FF]',
                          key === 'senior' && 'bg-[#9900CC]'
                        )}
                      />
                      {config?.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        ) : undefined
      }
    >
      {!!mappedData?.length && (
        <ChartContainer
          id={id}
          config={chartConfig}
          className='mx-auto aspect-square w-full max-w-[280px] md:max-w-[320px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className='text-[14px] md:text-[14px] w-[10rem]'
                  indicator='dot'
                  hideLabel
                />
              }
            />
            <Pie
              data={mappedData}
              dataKey='membersCount'
              nameKey='category'
              innerRadius={70}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 20}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-[45px] md:text-5xl font-bold'
                        >
                          {mappedData?.[activeIndex]?.membersCount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 34}
                          className='fill-muted-foreground text-[14px] md:text-[14px]'
                        >
                          Miembros
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend content={<MembersByCategoryLegendContent as any />} />
          </PieChart>
        </ChartContainer>
      )}
    </MetricCard>
  );
};
