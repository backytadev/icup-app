import { useEffect } from 'react';

import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import { OfferingExpenseProportionCard } from '@/modules/metrics/components/offering-expense/charts/OfferingExpenseProportionCard';
import { OfferingExpenseReportFormCard } from '@/modules/metrics/components/offering-expense/reports/OfferingExpenseReportFormCard';
import { OfferingExpenseAnalysisCardByOthersExpenses } from '@/modules/metrics/components/offering-expense/charts/OfferingExpenseAnalysisCardByOtherExpenses';
import { OfferingExpenseAnalysisCardBySuppliesExpenses } from '@/modules/metrics/components/offering-expense/charts/OfferingExpenseAnalysisCardBySuppliesExpenses';
import { OfferingExpenseAnalysisCardByExpensesAdjustment } from '@/modules/metrics/components/offering-expense/charts/OfferingExpenseAnalysisCardByExpensesAdjustment';
import { OfferingExpenseAnalysisCardByDecorationExpenses } from '@/modules/metrics/components/offering-expense/charts/OfferingExpenseAnalysisCardByDecorationExpenses';
import { OfferingExpenseAnalysisCardByOperationalExpenses } from '@/modules/metrics/components/offering-expense/charts/OfferingExpenseAnalysisCardByOperationalExpenses';
import { OfferingExpenseAnalysisCardByPlaningEventsExpenses } from '@/modules/metrics/components/offering-expense/charts/OfferingExpenseAnalysisCardByPlaningEventsExpenses';
import { OfferingExpenseAnalysisCardByMaintenanceAndRepairExpenses } from '@/modules/metrics/components/offering-expense/charts/OfferingExpenseAnalysisCardByMaintenanceAndRepairExpenses';
import { OfferingExpenseAnalysisCardByEquipmentAndTechnologyExpenses } from '@/modules/metrics/components/offering-expense/charts/OfferingExpenseAnalysisCardByEquipmentAndTechnologyExpenses';
import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';
import { GiPayMoney } from 'react-icons/gi';

export const OfferingExpenseMetrics = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  useEffect(() => {
    document.title = 'Modulo Métricas - IcupApp';
  }, []);

  return (
    <div className='animate-fadeInPage max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
      <ModuleHeader
        title='Métricas de Ofrendas (Gastos)'
        description='Análisis, comparativas e indicadores de los salidas de ofrenda.'
        titleColor='red'
        badge='Ofrendas'
        badgeColor='red'
        icon={GiPayMoney}
        accentColor='red'
      />

      <OfferingExpenseProportionCard />

      <div className='flex justify-center gap-4 items-center mt-6'>
        <OfferingExpenseReportFormCard />
      </div>

      {activeChurchId && (
        <div className='mt-6 px-2 pb-10 sm:pb-10 md:px-6 xl:pb-14 flex flex-col gap-8 h-auto'>
          <OfferingExpenseAnalysisCardByOperationalExpenses />
          <OfferingExpenseAnalysisCardByMaintenanceAndRepairExpenses />
          <OfferingExpenseAnalysisCardByDecorationExpenses />
          <OfferingExpenseAnalysisCardByEquipmentAndTechnologyExpenses />
          <OfferingExpenseAnalysisCardBySuppliesExpenses />
          <OfferingExpenseAnalysisCardByPlaningEventsExpenses />
          <OfferingExpenseAnalysisCardByOthersExpenses />
          <OfferingExpenseAnalysisCardByExpensesAdjustment />
        </div>
      )}
    </div>
  );
};

export default OfferingExpenseMetrics;
