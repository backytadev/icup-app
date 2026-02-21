import { useEffect } from 'react';

import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import { ViewFinancialBalanceSummary } from '@/modules/metrics/components/financial-balance-comparative/screens/ViewFinancialBalanceSummary';
import { FinancialBalanceComparativeReportFormCard } from '@/modules/metrics/components/financial-balance-comparative/reports/FinancialBalanceComparativeReportFormCard';
import { GeneralComparativeOfferingIncomeAnalysisCard } from '@/modules/metrics/components/financial-balance-comparative/charts/GeneralComparativeOfferingIncomeAnalysis';
import { GeneralComparativeOfferingExpensesAnalysisCard } from '@/modules/metrics/components/financial-balance-comparative/charts/GeneralComparativeOfferingExpensesAnalysisCard';
import { ComparativeOfferingIncomeAnalysisCardByType } from '@/modules/metrics/components/financial-balance-comparative/charts/ComparativeOfferingIncomeAnalysisCardByType';
import { ComparativeOfferingExpensesAnalysisCardByType } from '@/modules/metrics/components/financial-balance-comparative/charts/ComparativeOfferingExpensesAnalysisCardByType';
import { ComparativeOfferingExpensesAnalysisCardBySubType } from '@/modules/metrics/components/financial-balance-comparative/charts/ComparativeOfferingExpensesAnalysisCardBySubType';
import { OfferingComparativeAnalysisCardByIncomeAndExpenses } from '@/modules/metrics/components/financial-balance-comparative/charts/OfferingComparativeAnalysisCardByIncomeAndExpenses';
import { OfferingExpensesAndOfferingIncomeComparativeProportionCard } from '@/modules/metrics/components/financial-balance-comparative/charts/OfferingExpensesAndOfferingIncomeComparativeProportionCard';
import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';
import { FaBalanceScale } from 'react-icons/fa';

export const FinancialBalanceComparisonMetrics = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  useEffect(() => {
    document.title = 'Modulo Métricas - IcupApp';
  }, []);

  return (
    <div className='animate-fadeInPage max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
      <ModuleHeader
        title='Métricas de Balance Financiero'
        description='Análisis comparativos y balance financiero de ingresos y salidas de ofrenda.'
        titleColor='blue'
        badge='Balance'
        badgeColor='blue'
        icon={FaBalanceScale}
        accentColor='blue'
      />

      <OfferingExpensesAndOfferingIncomeComparativeProportionCard />

      <div className='flex justify-center items-center flex-col md:flex-row gap-2 md:gap-4'>
        <div className='flex justify-center gap-2 items-center mt-6'>
          <FinancialBalanceComparativeReportFormCard />
        </div>

        <ViewFinancialBalanceSummary />
      </div>

      {activeChurchId && (
        <div className='mt-6 px-2 pb-10 sm:pb-10 md:px-6 xl:pb-14 flex flex-col xl:grid xl:grid-cols-2 gap-8 h-auto'>
          <OfferingComparativeAnalysisCardByIncomeAndExpenses />
          <GeneralComparativeOfferingIncomeAnalysisCard />
          <ComparativeOfferingIncomeAnalysisCardByType />
          <GeneralComparativeOfferingExpensesAnalysisCard />
          <ComparativeOfferingExpensesAnalysisCardByType />
          <ComparativeOfferingExpensesAnalysisCardBySubType />
        </div>
      )}
    </div>
  );
};

export default FinancialBalanceComparisonMetrics;
