/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/promise-function-async */

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getSimpleChurches } from '@/modules/church/services/church.service';

import { SelectChurch } from '@/modules/metrics/components/shared/SelectChurch';
import { FinancialBalanceComparativeMetricsSkeleton } from '@/modules/metrics/components/shared/FinancialBalanceComparativeMetricsSkeleton';

import { FinancialBalanceComparativeReportFormCard } from '@/modules/metrics/components/financial-balance-comparative/reports/FinancialBalanceComparativeReportFormCard';
import { GeneralComparativeOfferingIncomeAnalysisCard } from '@/modules/metrics/components/financial-balance-comparative/charts/GeneralComparativeOfferingIncomeAnalysis';
import { GeneralComparativeOfferingExpensesAnalysisCard } from '@/modules/metrics/components/financial-balance-comparative/charts/GeneralComparativeOfferingExpensesAnalysisCard';
import { ComparativeOfferingIncomeAnalysisCardByType } from '@/modules/metrics/components/financial-balance-comparative/charts/ComparativeOfferingIncomeAnalysisCardByType';
import { ComparativeOfferingExpensesAnalysisCardByType } from '@/modules/metrics/components/financial-balance-comparative/charts/ComparativeOfferingExpensesAnalysisCardByType';
import { ComparativeOfferingExpensesAnalysisCardBySubType } from '@/modules/metrics/components/financial-balance-comparative/charts/ComparativeOfferingExpensesAnalysisCardBySubType';
import { OfferingComparativeAnalysisCardByIncomeAndExpenses } from '@/modules/metrics/components/financial-balance-comparative/charts/OfferingComparativeAnalysisCardByIncomeAndExpenses';
import { OfferingExpensesAndOfferingIncomeComparativeProportionCard } from '@/modules/metrics/components/financial-balance-comparative/charts/OfferingExpensesAndOfferingIncomeComparativeProportionCard';

import { ViewFinancialBalanceSummary } from '@/modules/metrics/components/financial-balance-comparative/views/ViewFinancialBalanceSummary';

export const FinancialBalanceComparisonMetrics = (): JSX.Element => {
  //* States
  const [churchId, setChurchId] = useState<string | undefined>(undefined);

  //* Queries
  const { data } = useQuery({
    queryKey: ['churches-for-overall-balance-and-financial-comparative-metrics'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    staleTime: 1000 * 60,
    retry: false,
  });

  //* Effects
  useEffect(() => {
    const church = data?.map((church) => church?.id)[0];
    setChurchId(church);
  }, [data]);

  useEffect(() => {
    document.title = 'Modulo Métricas - IcupApp';
  }, []);

  return (
    <div className='animate-fadeInPage'>
      <h2 className='text-center leading-12 md:leading-none text-amber-500 dark:text-yellow-500 pt-2 md:py-2 xl:pt-3 font-sans font-bold text-[2rem] sm:text-[2.5rem] md:text-[2.5rem] lg:text-[2.8rem] xl:text-5xl'>
        Métricas de Ofrenda
      </h2>
      <p className='text-center text-[15px] md:text-[16px] lg:text-[18px] xl:text-[20px] font-medium'>
        Análisis comparativos y balance financiero de ingresos y salidas de ofrenda
      </p>

      <hr className='p-[0.015rem] bg-slate-500 mt-2 mb-4 w-[90%] mx-auto' />

      <OfferingExpensesAndOfferingIncomeComparativeProportionCard churchId={churchId} />

      <div className='flex justify-center gap-4 items-center mt-6'>
        <SelectChurch data={data} churchId={churchId} setChurchId={setChurchId} />

        <FinancialBalanceComparativeReportFormCard churchId={churchId} />

        <ViewFinancialBalanceSummary churchId={churchId ?? ''} />
      </div>

      {!churchId ? (
        <FinancialBalanceComparativeMetricsSkeleton />
      ) : (
        <div className='mt-6 px-2 pb-10 sm:pb-10 md:px-6 xl:pb-14 flex flex-col xl:grid xl:grid-cols-2 gap-8 h-auto'>
          <OfferingComparativeAnalysisCardByIncomeAndExpenses churchId={churchId} />
          <GeneralComparativeOfferingIncomeAnalysisCard churchId={churchId} />
          <ComparativeOfferingIncomeAnalysisCardByType churchId={churchId} />
          <GeneralComparativeOfferingExpensesAnalysisCard churchId={churchId} />
          <ComparativeOfferingExpensesAnalysisCardByType churchId={churchId} />
          <ComparativeOfferingExpensesAnalysisCardBySubType churchId={churchId} />
        </div>
      )}
    </div>
  );
};

export default FinancialBalanceComparisonMetrics;
