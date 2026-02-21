import { PieChart, Pie } from 'recharts';

import { useEffect, useState } from 'react';

import CountUp from 'react-countup';
import { FaPeopleRoof } from 'react-icons/fa6';
import { BsGenderFemale, BsGenderMale } from 'react-icons/bs';

import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import { RecordOrder } from '@/shared/enums/record-order.enum';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { getMembersProportion } from '@/modules/metrics/services/member-metrics.service';
import { useMetricsQuery } from '@/modules/metrics/hooks';

import { type ChartConfig, ChartContainer } from '@/shared/components/ui/chart';
import { Card, CardContent } from '@/shared/components/ui/card';

const chartConfigActive = {
  active: {
    color: '#00C49F',
  },
  inactive: {
    color: '#808080',
  },
} satisfies ChartConfig;

const chartConfigInactive = {
  active: {
    color: '#808080',
  },
  inactive: {
    color: '#fd6c6c',
  },
} satisfies ChartConfig;

interface MappedDataOptions {
  name: string;
  value: number;
  fill: string;
}

export const MemberProportionCard = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  //* States
  const [activeMemberDataMapped, setActiveMemberDataMapped] = useState<MappedDataOptions[]>();
  const [inactiveMemberDataMapped, setInactiveMemberDataMapped] = useState<MappedDataOptions[]>();

  //* Queries
  const { data } = useMetricsQuery({
    queryKey: ['members-proportion', activeChurchId],
    queryFn: () =>
      getMembersProportion({
        searchType: MetricSearchType.MembersByProportion,
        order: RecordOrder.Ascending,
        church: activeChurchId ?? '',
      }),
    activeChurchId,
  });

  //* Effects
  useEffect(() => {
    const newData = {
      countMembersActive: data?.countMembersActive,
      countMembersInactive: data?.countMembersInactive,
    };

    if (data) {
      const activeMemberTransformedData = Object.keys(newData).map((_, index) => {
        return {
          name: index === 0 ? 'active' : 'inactive',
          value: index === 0 ? data.countMembersActive : data.countMembersInactive,
          fill: index === 0 ? 'var(--color-active)' : 'var(--color-inactive)',
        };
      });

      const inactiveMemberTransformedData = Object.keys(newData).map((_, index) => {
        return {
          name: index === 0 ? 'inactive' : 'active',
          value: index === 0 ? data.countMembersInactive : data.countMembersActive,
          fill: index === 0 ? 'var(--color-inactive)' : 'var(--color-active)',
        };
      });

      setActiveMemberDataMapped(activeMemberTransformedData);
      setInactiveMemberDataMapped(inactiveMemberTransformedData);
    }
  }, [data]);

  return (
    <div className='grid gap-5 xl:flex xl:gap-6 justify-center px-2'>

      {/* Fila 1: Género + Total */}
      <div className='flex gap-4 justify-center mx-auto w-[90%] sm:w-auto sm:mx-0'>

        {/* Género */}
        <Card className='w-auto border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow duration-300'>
          <CardContent className='p-4 pt-5 flex flex-col gap-4'>
            <div className='flex flex-col gap-3'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20'>
                  <BsGenderMale className='text-blue-500 text-[1.5rem]' />
                </div>
                <div>
                  <p className='text-[11px] font-inter text-slate-500 dark:text-slate-400'>Varones</p>
                  <p className='text-[1.6rem] font-extrabold font-outfit text-slate-800 dark:text-slate-100 leading-none'>
                    <CountUp end={Number(data?.countMembersMale)} start={0} duration={4} />
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-pink-50 dark:bg-pink-900/20'>
                  <BsGenderFemale className='text-pink-500 text-[1.5rem]' />
                </div>
                <div>
                  <p className='text-[11px] font-inter text-slate-500 dark:text-slate-400'>Mujeres</p>
                  <p className='text-[1.6rem] font-extrabold font-outfit text-slate-800 dark:text-slate-100 leading-none'>
                    <CountUp end={Number(data?.countMembersFemale)} start={0} duration={4} />
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Members */}
        <Card className='w-[240px] md:w-[270px] border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow duration-300'>
          <CardContent className='py-5 px-4 flex flex-row items-center justify-center gap-4 h-full'>
            <div className='p-3 rounded-full bg-sky-50 dark:bg-sky-900/20'>
              <FaPeopleRoof className='text-sky-500 text-[3.5rem]' />
            </div>
            <div className='flex flex-col items-center'>
              <p className='text-[3rem] font-extrabold font-outfit text-slate-800 dark:text-slate-100 leading-none'>
                <CountUp end={Number(data?.totalCountMembers)} start={0} duration={4} />
              </p>
              <p className='text-[12px] font-inter text-slate-500 dark:text-slate-400 text-center font-medium'>
                Miembros totales
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fila 2: Tasa Activos + Tasa Inactivos */}
      <div className='flex flex-col justify-center items-center sm:flex-row gap-4 md:gap-5'>

        {/* Active Rate */}
        <Card className='w-[240px] md:w-[270px] cursor-default border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow duration-300'>
          <CardContent className='py-5 px-4 flex flex-col gap-3'>
            <div className='flex items-center gap-10'>
              <ChartContainer config={chartConfigActive} className='w-[95px] h-[95px] flex-shrink-0'>
                <PieChart>
                  <Pie data={activeMemberDataMapped} dataKey='value' nameKey='name' />
                </PieChart>
              </ChartContainer>
              <div className='flex flex-col justify-center items-center'>
                <p className='text-[2.5rem] font-extrabold font-outfit text-slate-800 dark:text-slate-100 leading-none'>
                  <CountUp end={Number(data?.countMembersActive)} start={0} duration={4} />
                </p>
                <p className='text-[12px] font-inter text-emerald-500 font-semibold mt-0.5'>Activos</p>
                <p className='text-[1.1rem] font-bold font-outfit text-emerald-500 leading-none mt-1'>
                  {(() => {
                    const activeMembers = data?.countMembersActive ?? 0;
                    const inactiveMembers = data?.countMembersInactive ?? 0;
                    const totalMembers = activeMembers + inactiveMembers;
                    return totalMembers > 0 ? (
                      <CountUp
                        end={Number(((activeMembers / totalMembers) * 100).toFixed(0))}
                        start={0}
                        duration={4}
                      />
                    ) : (
                      0
                    );
                  })()}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inactive Rate */}
        <Card className='w-[240px] md:w-[270px] cursor-default border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow duration-300'>
          <CardContent className='py-5 px-4 flex flex-col gap-3'>
            <div className='flex items-center gap-10'>
              <ChartContainer config={chartConfigInactive} className='w-[95px] h-[95px] flex-shrink-0'>
                <PieChart>
                  <Pie data={inactiveMemberDataMapped} dataKey='value' nameKey='name' />
                </PieChart>
              </ChartContainer>
              <div className='flex flex-col justify-center items-center'>
                <p className='text-[2.5rem] font-extrabold font-outfit text-slate-800 dark:text-slate-100 leading-none'>
                  <CountUp end={Number(data?.countMembersInactive)} start={0} duration={4} />
                </p>
                <p className='text-[12px] font-inter text-red-500 font-semibold mt-0.5'>Inactivos</p>
                <p className='text-[1.1rem] font-bold font-outfit text-red-500 leading-none mt-1'>
                  {(() => {
                    const activeMembers = data?.countMembersActive ?? 0;
                    const inactiveMembers = data?.countMembersInactive ?? 0;
                    const totalMembers = activeMembers + inactiveMembers;
                    return totalMembers > 0 ? (
                      <CountUp
                        end={Number(((inactiveMembers / totalMembers) * 100).toFixed(0))}
                        start={0}
                        duration={4}
                      />
                    ) : (
                      0
                    );
                  })()}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
