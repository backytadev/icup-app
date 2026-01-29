/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Sector, PieChart, Pie, Label } from 'recharts';
import { FcDataBackup, FcDeleteDatabase } from 'react-icons/fc';
import { type PieSectorDataItem } from 'recharts/types/polar/Pie';

import { cn } from '@/shared/lib/utils';
import { RecordOrder } from '@/shared/enums/record-order.enum';

import { getSimpleChurches } from '@/modules/church/services/church.service';
import { type ChurchResponse } from '@/modules/church/types';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { getMembersByCategory } from '@/modules/metrics/services/member-metrics.service';
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
import { Card, CardContent, CardTitle } from '@/shared/components/ui/card';

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

interface Props {
  churchId: string | undefined;
}

export const MemberAnalysisCardByCategory = ({ churchId }: Props): JSX.Element => {
  //* States
  const [mappedData, setMappedData] = useState<ResultDataOptions[]>([]);
  const [church, setChurch] = useState<ChurchResponse>();

  const id = 'pie-interactive';
  const INITIALVALUE = 'child';
  const [activeCategory, setActiveCategory] = useState<string>(INITIALVALUE);

  const activeIndex = useMemo(
    () => mappedData?.findIndex((item) => item.category === activeCategory),
    [activeCategory, mappedData]
  );
  const categories = useMemo(() => mappedData?.map((item) => item.category), [mappedData]);

  //* Queries
  const membersByCategoryQuery = useQuery({
    queryKey: ['members-by-category', churchId],
    queryFn: () =>
      getMembersByCategory({
        searchType: MetricSearchType.MembersByCategory,
        year: String(new Date().getFullYear()),
        order: RecordOrder.Ascending,
        church: churchId ?? '',
      }),
    retry: false,
    enabled: !!churchId,
  });

  const { data } = useQuery({
    queryKey: ['churches'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    staleTime: 1000 * 60,
    retry: false,
  });

  useEffect(() => {
    const church = data?.find((church) => church?.id === churchId);
    setChurch(church);
  }, [data, churchId]);

  //* Effects
  useEffect(() => {
    if (membersByCategoryQuery?.data) {
      const transformedData = Object.entries(membersByCategoryQuery?.data).map(
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
  }, [membersByCategoryQuery?.data]);

  return (
    <Card className='bg-slate-50/40 dark:bg-slate-900/40 flex flex-col col-start-1 col-end-2 h-[22rem] md:h-[25rem] lg:h-[25rem] 2xl:h-[26rem] m-0 border-slate-200 dark:border-slate-800'>
      <CardTitle className='flex items-center gap-2.5 justify-center px-4 py-2 text-center font-bold text-[22px] sm:text-[25px] md:text-[28px] 2xl:text-[30px]'>
        <span className='ml-16 md:ml-20'>Categoría</span>
        <Badge
          variant='active'
          className='mt-1 text-white text-[11px] md:text-[11px] py-0.3 md:py-0.35 tracking-wide'
        >
          Activos
        </Badge>
      </CardTitle>
      <span className='-mt-2 text-[14px] md:text-[14px] md:pl-3 text-center font-medium text-slate-500 dark:text-slate-400'>
        {church?.abbreviatedChurchName}
      </span>

      {!mappedData?.length ? (
        <CardContent className='flex flex-1 justify-center pb-0'>
          <div className='text-blue-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-full -mt-6'>
            <FcDataBackup className='text-[6rem] pb-2' />
            <p className='font-medium text-[15px] md:text-[16px]'>Consultando datos....</p>
          </div>
        </CardContent>
      ) : (
        <>
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger
              className='ml-auto h-7 w-auto rounded-lg pl-2.5 mr-5 mb-8 md:mt-1'
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

          <CardContent className='flex flex-1 justify-center pb-0'>
            {membersByCategoryQuery?.isFetching && !mappedData?.length && (
              <div className='text-blue-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-full -mt-6'>
                <FcDataBackup className='text-[6rem] pb-2' />
                <p className='font-medium text-[15px] md:text-[16px]'>Consultando datos....</p>
              </div>
            )}
            {!!mappedData?.length && (
              <ChartContainer
                id={id}
                config={chartConfig}
                className='mx-auto aspect-square w-full max-w-[280px] md:max-w-[345px] -mt-[3.5rem] md:-mt-[4.5rem] lg:-mt-[4.5rem] xl:-mt-[4.5rem] 2xl:-mt-[4rem]'
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
            {!membersByCategoryQuery?.isFetching && !mappedData?.length && (
              <div className='text-red-500 flex flex-col justify-center items-center h-full -mt-6'>
                <FcDeleteDatabase className='text-[6rem] pb-2' />
                <p className='font-medium text-[15px] md:text-[16px]'>
                  No hay datos disponibles para mostrar.
                </p>
              </div>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
};
