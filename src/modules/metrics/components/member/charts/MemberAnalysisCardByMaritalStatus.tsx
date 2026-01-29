/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { FcDataBackup, FcDeleteDatabase } from 'react-icons/fc';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';

import { getSimpleChurches } from '@/modules/church/services/church.service';
import { type ChurchResponse } from '@/modules/church/types';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { getMembersByMaritalStatus } from '@/modules/metrics/services/member-metrics.service';

import { cn } from '@/shared/lib/utils';
import { RecordOrder } from '@/shared/enums/record-order.enum';

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

interface Props {
  churchId: string | undefined;
}

export const MemberAnalysisCardByMaritalStatus = ({ churchId }: Props): JSX.Element => {
  //* States
  const [mappedData, setMappedData] = useState<ResultDataOptions[]>();
  const [church, setChurch] = useState<ChurchResponse>();

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
    <Card className='bg-slate-50/40 dark:bg-slate-900/40 flex flex-col col-start-2 col-end-3 h-[22rem] md:h-[25rem] lg:h-[25rem] 2xl:h-[26rem] m-0 border-slate-200 dark:border-slate-800'>
      <CardTitle className='flex justify-center items-center gap-2.5 px-4 py-2.5 text-center font-bold text-[22px] sm:text-[25px] md:text-[28px] 2xl:text-[30px]'>
        <span className='ml-12 md:ml-20'>Estado civil</span>
        <Badge
          variant='active'
          className='mt-1 text-[11px] text-white md:text-[11px] py-0.3 md:py-0.35 tracking-wide'
        >
          Activos
        </Badge>
      </CardTitle>
      <span className='-mt-3 -ml-8 text-[14px] md:text-[14px] pl-3 text-center font-medium text-slate-500 dark:text-slate-400'>
        {church?.abbreviatedChurchName}
      </span>

      {!mappedData?.length ? (
        <CardContent className='h-full px-2 sm:px-4 py-0'>
          <div className='text-blue-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-full -mt-6'>
            <FcDataBackup className='text-[6rem] pb-2' />
            <p className='font-medium text-[15px] md:text-[16px]'>Consultando datos....</p>
          </div>
        </CardContent>
      ) : (
        <CardContent className='h-full px-2 sm:px-4 py-0'>
          {membersByMaritalStatusQuery?.isFetching && !mappedData?.length && (
            <div className='text-blue-500 text-[14px] md:text-lg flex flex-col justify-center items-center h-full -mt-6'>
              <FcDataBackup className='text-[6rem] pb-2' />
              <p className='font-medium text-[15px] md:text-[16px]'>Consultando datos....</p>
            </div>
          )}
          {mappedData?.length && (
            <ChartContainer
              config={chartConfig}
              className={cn(
                'w-full h-[290px] sm:h-[290px] md:h-[330px] lg:h-[330px] xl:h-[330px] 2xl:h-[345px]'
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
                  className='text-[12.5px] md:text-[14px]'
                  tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                />
                <XAxis dataKey='membersCount' type='number' hide />

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent className='text-[13.5px] md:text-[13.5px]' />}
                />

                <Bar dataKey='membersCount' layout='vertical' radius={5}></Bar>
              </BarChart>
            </ChartContainer>
          )}
          {!membersByMaritalStatusQuery?.isFetching && !mappedData?.length && (
            <div className='text-red-500 flex flex-col justify-center items-center h-full -mt-6'>
              <FcDeleteDatabase className='text-[6rem] pb-2' />
              <p className='font-medium text-[15px] md:text-[16px]'>
                No hay datos disponibles para mostrar.
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
