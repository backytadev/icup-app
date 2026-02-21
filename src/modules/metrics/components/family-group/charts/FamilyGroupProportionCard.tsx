import { useEffect, useState } from 'react';

import CountUp from 'react-countup';
import { GiHouse } from 'react-icons/gi';
import { PieChart, Pie } from 'recharts';

import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import { RecordOrder } from '@/shared/enums/record-order.enum';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { useMetricsQuery } from '@/modules/metrics/hooks';
import { getFamilyGroupsProportion } from '@/modules/metrics/services/family-group-metrics.service';

import { ChartContainer, type ChartConfig } from '@/shared/components/ui/chart';
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

export const FamilyGroupProportionCard = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  //* States
  const [activeFamilyGroupsDataMapped, setActiveFamilyGroupsDataMapped] =
    useState<MappedDataOptions[]>();
  const [inactiveFamilyGroupsDataMapped, setInactiveFamilyGroupsDataMapped] =
    useState<MappedDataOptions[]>();

  //* Queries
  const { data } = useMetricsQuery({
    queryKey: ['family-groups-proportion', activeChurchId],
    queryFn: () =>
      getFamilyGroupsProportion({
        searchType: MetricSearchType.FamilyGroupsByProportion,
        year: String(new Date().getFullYear()),
        order: RecordOrder.Ascending,
        church: activeChurchId ?? '',
      }),
    activeChurchId,
  });

  //* Effects
  useEffect(() => {
    const newData = {
      countFamilyGroupsActive: data?.countFamilyGroupsActive,
      countFamilyGroupsInactive: data?.countFamilyGroupsInactive,
    };

    if (data) {
      const activeFamilyGroupsTransformedData = Object.keys(newData).map((_, index) => {
        return {
          name: index === 0 ? 'active' : 'inactive',
          value: index === 0 ? data.countFamilyGroupsActive : data.countFamilyGroupsInactive,
          fill: index === 0 ? 'var(--color-active)' : 'var(--color-inactive)',
        };
      });

      const inactiveFamilyGroupsTransformedData = Object.keys(newData).map((_, index) => {
        return {
          name: index === 0 ? 'inactive' : 'active',
          value: index === 0 ? data.countFamilyGroupsInactive : data.countFamilyGroupsActive,
          fill: index === 0 ? 'var(--color-inactive)' : 'var(--color-active)',
        };
      });

      setActiveFamilyGroupsDataMapped(activeFamilyGroupsTransformedData);
      setInactiveFamilyGroupsDataMapped(inactiveFamilyGroupsTransformedData);
    }
  }, [data]);

  return (
    <div className='grid gap-5 xl:flex xl:gap-6 justify-center px-2'>

      {/* Total Grupos Familiares */}
      <Card className='w-[240px] md:w-[270px] mx-auto xl:mx-0 border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow duration-300'>
        <CardContent className='py-5 px-4 flex flex-row items-center justify-center gap-4 h-full'>
          <div className='p-3 rounded-full bg-orange-50 dark:bg-orange-900/20'>
            <GiHouse className='text-orange-500 text-[3.5rem]' />
          </div>
          <div className='flex flex-col items-center justify-center gap-2'>
            <p className='text-[3rem] font-extrabold font-outfit text-slate-800 dark:text-slate-100 leading-none'>
              <CountUp end={Number(data?.totalCountFamilyGroups)} start={0} duration={4} />
            </p>
            <p className='text-[12px] font-inter text-slate-500 dark:text-slate-400 text-center font-medium'>
              Grupos Fam. totales
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Active + Inactive rate cards */}
      <div className='flex flex-col justify-center items-center sm:flex-row gap-4 md:gap-5'>

        {/* Active Rate */}
        <Card className='w-[240px] md:w-[270px] cursor-default border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow duration-300'>
          <CardContent className='py-5 px-4 flex flex-col gap-3'>
            <div className='flex items-center gap-10'>
              <ChartContainer config={chartConfigActive} className='w-[90px] h-[90px] flex-shrink-0'>
                <PieChart>
                  <Pie data={activeFamilyGroupsDataMapped} dataKey='value' nameKey='name' />
                </PieChart>
              </ChartContainer>
              <div className='flex flex-col items-center'>
                <p className='text-[2.5rem] font-extrabold font-outfit text-slate-800 dark:text-slate-100 leading-none'>
                  <CountUp end={Number(data?.countFamilyGroupsActive)} start={0} duration={4} />
                </p>
                <p className='text-[12px] font-inter text-emerald-500 font-semibold mt-0.5'>Activos</p>
                <p className='text-[1.1rem] font-bold font-outfit text-emerald-500 leading-none mt-1'>
                  {(() => {
                    const activeFamilyGroups = data?.countFamilyGroupsActive ?? 0;
                    const inactiveFamilyGroups = data?.countFamilyGroupsInactive ?? 0;
                    const totalFamilyGroups = activeFamilyGroups + inactiveFamilyGroups;
                    return totalFamilyGroups > 0 ? (
                      <CountUp
                        end={Number(((activeFamilyGroups / totalFamilyGroups) * 100).toFixed(0))}
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
              <ChartContainer config={chartConfigInactive} className='w-[90px] h-[90px] flex-shrink-0'>
                <PieChart>
                  <Pie data={inactiveFamilyGroupsDataMapped} dataKey='value' nameKey='name' />
                </PieChart>
              </ChartContainer>
              <div className='flex flex-col items-center'>
                <p className='text-[2.5rem] font-extrabold font-outfit text-slate-800 dark:text-slate-100 leading-none'>
                  <CountUp end={Number(data?.countFamilyGroupsInactive)} start={0} duration={4} />
                </p>
                <p className='text-[12px] font-inter text-red-500 font-semibold mt-0.5'>Inactivos</p>
                <p className='text-[1.1rem] font-bold font-outfit text-red-500 leading-none mt-1'>
                  {(() => {
                    const activeFamilyGroups = data?.countFamilyGroupsActive ?? 0;
                    const inactiveFamilyGroups = data?.countFamilyGroupsInactive ?? 0;
                    const totalFamilyGroups = activeFamilyGroups + inactiveFamilyGroups;
                    return totalFamilyGroups > 0 ? (
                      <CountUp
                        end={Number(((inactiveFamilyGroups / totalFamilyGroups) * 100).toFixed(0))}
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
