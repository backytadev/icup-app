import { useEffect, useState } from 'react';

import CountUp from 'react-countup';
import { PieChart, Pie } from 'recharts';
import { GiCardExchange } from 'react-icons/gi';

import { Badge } from '@/shared/components/ui/badge';
import { ChartContainer, type ChartConfig } from '@/shared/components/ui/chart';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

import { RecordOrder } from '@/shared/enums/record-order.enum';

import { MetricSearchType } from '@/modules/metrics/enums/metrics-search-type.enum';
import { getOfferingComparativeProportion as getOfferingExpensesAndOfferingIncomeByProportion } from '@/modules/metrics/services/offering-comparative-metrics.service';
import { useMetricsQuery } from '@/modules/metrics/hooks';
import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

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


export const OfferingExpensesAndOfferingIncomeComparativeProportionCard = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);
  //* States
  const [mappedOfferingIncomeRecords, setMappedOfferingIncomeRecords] =
    useState<MappedDataOptions[]>();
  const [mappedOfferingExpensesRecords, setMappedOfferingExpensesRecords] =
    useState<MappedDataOptions[]>();

  //* Queries
  const { data } = useMetricsQuery({
    queryKey: ['offering-expenses-and-offering-income-by-proportion', activeChurchId],
    queryFn: () =>
      getOfferingExpensesAndOfferingIncomeByProportion({
        searchType: MetricSearchType.OfferingExpensesAndOfferingIncomeByProportion,
        year: String(new Date().getFullYear()),
        order: RecordOrder.Ascending,
        church: activeChurchId ?? '',
      }),
    activeChurchId,
  });

  //* Effects
  useEffect(() => {
    const newData = {
      countOfferingIncomeRecords: data?.offeringIncomeRecordsCount,
      countOfferingExpensesRecords: data?.offeringExpenseRecordsCount,
    };

    if (data) {
      const activeOfferingsIncomeTransformedData = Object.keys(newData).map((_, index) => {
        return {
          name: index === 0 ? 'active' : 'inactive',
          value: index === 0 ? data.offeringIncomeRecordsCount : data.offeringExpenseRecordsCount,
          fill: index === 0 ? 'var(--color-active)' : 'var(--color-inactive)',
        };
      });

      const inactiveOfferingsIncomeTransformedData = Object.keys(newData).map((_, index) => {
        return {
          name: index === 0 ? 'inactive' : 'active',
          value: index === 0 ? data.offeringIncomeRecordsCount : data.offeringExpenseRecordsCount,
          fill: index === 0 ? 'var(--color-inactive)' : 'var(--color-active)',
        };
      });

      setMappedOfferingIncomeRecords(activeOfferingsIncomeTransformedData);
      setMappedOfferingExpensesRecords(inactiveOfferingsIncomeTransformedData);
    }
  }, [data]);

  return (
    <div className='w-full grid gap-6 xl:flex xl:gap-10 justify-center items-center px-5'>
      <Card className='w-[270px] md:w-[300px] mx-auto xl:mx-0 cursor-default border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow duration-300'>
        <CardHeader className='py-[12px]'>
          <div className='flex justify-center gap-4'>
            <div className='flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0'>
              <GiCardExchange className='text-[3rem] text-blue-500' />
            </div>
            <div className='flex flex-col gap-2 items-top justify-center'>
              <CardTitle className='text-center text-[3rem] md:text-[3rem] lg:text-[3.2rem] xl:text-[3.5rem] font-extrabold font-outfit leading-10 text-slate-800 dark:text-slate-100'>
                {<CountUp end={Number(data?.totalOfferingRecordsCount)} start={0} duration={4} />}
              </CardTitle>
              <div className='text-sm font-semibold font-inter text-center text-slate-600 dark:text-slate-400'>
                Total Registros
                <Badge
                  variant='active'
                  className='mt-1 text-white text-[11px] md:text-[11px] py-0.3 md:py-0.35 tracking-wide'
                >
                  Activos
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className='flex flex-col justify-center items-center sm:flex-row gap-6 sm:gap-4 md:gap-8 xl:gap-10'>
        {/* Offering Income Records */}
        <Card className='w-[270px] md:w-[300px] cursor-default border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow duration-300'>
          <CardHeader className='py-5'>
            <div className='flex justify-center gap-4 h-[5rem] relative'>
              <span className='absolute -top-3 left-12 md:left-14 font-bold font-outfit text-[15px] md:text-[15px] text-slate-700 dark:text-slate-300'>
                {(() => {
                  const activeOfferingsIncome = data?.offeringIncomeRecordsCount ?? 0;
                  const inactiveOfferingsIncome = data?.offeringExpenseRecordsCount ?? 0;
                  const totalOfferingsIncome = activeOfferingsIncome + inactiveOfferingsIncome;

                  return totalOfferingsIncome > 0 ? (
                    <CountUp
                      end={Number(
                        ((activeOfferingsIncome / totalOfferingsIncome) * 100).toFixed(0)
                      )}
                      start={0}
                      duration={4}
                    />
                  ) : (
                    0
                  );
                })()}
                %
              </span>

              <ChartContainer config={chartConfigActive} className='w-[55%] h-[130%]'>
                <PieChart>
                  <Pie data={mappedOfferingIncomeRecords} dataKey='value' nameKey='name'></Pie>
                </PieChart>
              </ChartContainer>

              <div className='flex flex-col items-center justify-center'>
                <CardDescription className='text-sm font-semibold font-inter text-center text-slate-500 dark:text-slate-400'>
                  Tasa de registros <span className='text-green-500'>Ingresos</span>
                </CardDescription>
                <CardTitle className='text-center text-[2.2rem] xl:text-[2.5rem] font-extrabold font-outfit leading-10 text-slate-800 dark:text-slate-100'>
                  {
                    <CountUp
                      end={Number(data?.offeringIncomeRecordsCount)}
                      start={0}
                      duration={4}
                    />
                  }
                </CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Offering Expense Records */}
        <Card className='w-[270px] md:w-[300px] cursor-default border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow duration-300'>
          <CardHeader className='py-5'>
            <div className='flex justify-center gap-4 h-[5rem] relative'>
              <span className='absolute -top-3 left-12 md:left-14 font-bold font-outfit text-[15px] md:text-[15px] text-slate-700 dark:text-slate-300'>
                {(() => {
                  const activeOfferingsIncome = data?.offeringIncomeRecordsCount ?? 0;
                  const inactiveOfferingsIncome = data?.offeringExpenseRecordsCount ?? 0;
                  const totalOfferingsIncome = activeOfferingsIncome + inactiveOfferingsIncome;

                  return totalOfferingsIncome > 0 ? (
                    <CountUp
                      end={Number(
                        ((inactiveOfferingsIncome / totalOfferingsIncome) * 100).toFixed(0)
                      )}
                      start={0}
                      duration={4}
                    />
                  ) : (
                    0
                  );
                })()}
                %
              </span>

              <ChartContainer config={chartConfigInactive} className='w-[55%] h-[130%]'>
                <PieChart>
                  <Pie data={mappedOfferingExpensesRecords} dataKey='value' nameKey='name'></Pie>
                </PieChart>
              </ChartContainer>
              <div className='flex flex-col items-center justify-center'>
                <CardDescription className='text-sm font-semibold font-inter text-center text-slate-500 dark:text-slate-400'>
                  Tasa de registros <span className='text-red-500'>Salidas</span>
                </CardDescription>
                <CardTitle className='text-center text-[2.2rem] xl:text-[2.5rem] font-extrabold font-outfit leading-10 text-slate-800 dark:text-slate-100'>
                  {
                    <CountUp
                      end={Number(data?.offeringExpenseRecordsCount)}
                      start={0}
                      duration={4}
                    />
                  }
                </CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};
