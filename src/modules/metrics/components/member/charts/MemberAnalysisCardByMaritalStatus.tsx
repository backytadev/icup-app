/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { FcDataBackup, FcDeleteDatabase } from 'react-icons/fc';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';

import { MetricSearchType } from '@/modules/metrics/enums';
import { getMembersByMaritalStatus } from '@/modules/metrics/services';

import { cn } from '@/shared/lib/utils';
import { RecordOrder } from '@/shared/enums';

import {
  ChartTooltip,
  ChartContainer,
  type ChartConfig,
  ChartTooltipContent,
} from '@/shared/components/ui/chart';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardTitle } from '@/shared/components/ui/card';

const chartConfig = {
  membersCount: {
    label: 'Miembros',
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

interface Props {
  churchId: string | undefined;
}

export const MemberAnalysisCardByMaritalStatus = ({ churchId }: Props): JSX.Element => {
  //* States
  const [mappedData, setMappedData] = useState<ResultDataOptions[]>();

  //* Queries
  const membersByMaritalStatusQuery = useQuery({
    queryKey: ['members-by-marital-status', churchId],
    queryFn: () =>
      getMembersByMaritalStatus({
        searchType: MetricSearchType.MembersByMaritalStatus,
        year: String(new Date().getFullYear()),
        order: RecordOrder.Ascending,
        church: churchId ?? '',
      }),
  });

  //* Effects
  useEffect(() => {
    if (membersByMaritalStatusQuery?.data) {
      const transformedData = Object.entries(membersByMaritalStatusQuery?.data).map(
        ([maritalStatus, membersCount]) => {
          return {
            maritalStatus,
            membersCount,
            fill: `var(--color-${maritalStatus})`,
          };
        }
      );

      setMappedData(transformedData);
    }
  }, [membersByMaritalStatusQuery?.data]);

  return (
    <Card className='bg-slate-50/40 dark:bg-slate-900/40 flex flex-col col-start-2 col-end-3 h-[22rem] md:h-[28rem] lg:h-[25rem] 2xl:h-[26rem] m-0 border-slate-200 dark:border-slate-800'>
      <CardTitle className='flex justify-center items-center gap-2.5 px-4 py-2.5 text-center font-bold  text-[22px] sm:text-[25px] md:text-[28px] 2xl:text-[30px]'>
        <span className='ml-20'>Estado civil</span>
        <Badge
          variant='active'
          className='mt-1 text-[10px] md:text-[11px] py-0.3 md:py-0.35 tracking-wide'
        >
          Activos
        </Badge>
      </CardTitle>

      {!mappedData?.length ? (
        <CardContent className='h-full pl-3 pr-5 py-0'>
          <div className='text-blue-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-full -mt-6'>
            <FcDataBackup className='text-[6rem] pb-2' />
            <p>Consultando datos....</p>
          </div>
        </CardContent>
      ) : (
        <CardContent className='h-full pl-3 pr-5 py-0'>
          {membersByMaritalStatusQuery?.isFetching && !mappedData?.length && (
            <div className='text-blue-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-full -mt-6'>
              <FcDataBackup className='text-[6rem] pb-2' />
              <p>Consultando datos....</p>
            </div>
          )}
          {mappedData?.length && (
            <ChartContainer
              config={chartConfig}
              className={cn(
                'w-full h-[252px] sm:h-[285px] md:h-[290px] lg:h-[330px] xl:h-[330px] 2xl:h-[345px]'
              )}
            >
              <BarChart
                accessibilityLayer
                data={mappedData}
                layout='vertical'
                margin={{ top: 5, right: 5, left: 38, bottom: 10 }}
                className='-ml-3 md:ml-0'
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey='maritalStatus'
                  type='category'
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  className='text-[12px] md:text-[14px]'
                  tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                />
                <XAxis dataKey='membersCount' type='number' hide />

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent className='text-[12px] md:text-[13px]' />}
                />

                <Bar dataKey='membersCount' layout='vertical' radius={5}></Bar>
              </BarChart>
            </ChartContainer>
          )}
          {!membersByMaritalStatusQuery?.isFetching && !mappedData?.length && (
            <div className='text-red-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-full -mt-6'>
              <FcDeleteDatabase className='text-[6rem] pb-2' />
              <p>No hay datos disponibles para mostrar.</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
