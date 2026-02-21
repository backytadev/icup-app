import { useEffect } from 'react';

import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import { OfferingIncomeProportionCard } from '@/modules/metrics/components/offering-income/charts/OfferingIncomeProportionCard';
import { OfferingIncomeReportFormCard } from '@/modules/metrics/components/offering-income/reports/OfferingIncomeReportFormCard';
import { OfferingIncomeAnalysisCardByActivities } from '@/modules/metrics/components/offering-income/charts/OfferingIncomeAnalysisCardByActivities';
import { OfferingIncomeAnalysisCardByFamilyGroup } from '@/modules/metrics/components/offering-income/charts/OfferingIncomeAnalysisCardByFamilyGroup';
import { OfferingIncomeAnalysisCardByYouthService } from '@/modules/metrics/components/offering-income/charts/OfferingIncomeAnalysisCardByYouthService';
import { OfferingIncomeAnalysisCardBySundaySchool } from '@/modules/metrics/components/offering-income/charts/OfferingIncomeAnalysisCardBySundaySchool';
import { OfferingIncomeAnalysisCardByChurchGround } from '@/modules/metrics/components/offering-income/charts/OfferingIncomeAnalysisCardByChurchGround';
import { OfferingIncomeAnalysisCardByUnitedService } from '@/modules/metrics/components/offering-income/charts/OfferingIncomeAnalysisCardByUnitedService';
import { OfferingIncomeAnalysisCardBySundayService } from '@/modules/metrics/components/offering-income/charts/OfferingIncomeAnalysisCardBySundayService';
import { OfferingIncomeAnalysisCardByFastingAndVigilAndEvangelism } from '@/modules/metrics/components/offering-income/charts/OfferingIncomeAnalysisCardByFastingAndVigilAndEvangelism';
import { OfferingIncomeAnalysisCardBySpecialOffering } from '@/modules/metrics/components/offering-income/charts/OfferingIncomeAnalysisCardBySpecialOffering';
import { OfferingIncomeAnalysisCardByIncomeAdjustment } from '@/modules/metrics/components/offering-income/charts/OfferingIncomeAnalysisCardByIncomeAdjustment';
import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';
import { GiReceiveMoney } from 'react-icons/gi';

export const OfferingIncomeMetrics = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  useEffect(() => {
    document.title = 'Modulo Métricas - IcupApp';
  }, []);

  return (
    <div className='animate-fadeInPage max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
      <ModuleHeader
        title='Métricas de Ofrendas (Ingresos)'
        description='Análisis, comparativas e indicadores de los ingresos de ofrenda.'
        titleColor='green'
        badge='Ofrendas'
        badgeColor='green'
        icon={GiReceiveMoney}
        accentColor='green'
      />

      <OfferingIncomeProportionCard />

      <div className='flex justify-center gap-4 items-center mt-6'>
        <OfferingIncomeReportFormCard />
      </div>

      {activeChurchId && (
        <div className='mt-6 px-2 pb-10 sm:pb-10 md:px-6 xl:pb-14 flex flex-col xl:grid xl:grid-cols-2 gap-8 h-auto'>
          <OfferingIncomeAnalysisCardBySundayService />
          <OfferingIncomeAnalysisCardByFamilyGroup />
          <OfferingIncomeAnalysisCardBySundaySchool />
          <OfferingIncomeAnalysisCardByFastingAndVigilAndEvangelism />
          <OfferingIncomeAnalysisCardByUnitedService />
          <OfferingIncomeAnalysisCardByYouthService />
          <OfferingIncomeAnalysisCardByChurchGround />
          <OfferingIncomeAnalysisCardByActivities />
          <OfferingIncomeAnalysisCardBySpecialOffering />
          <OfferingIncomeAnalysisCardByIncomeAdjustment />
        </div>
      )}
    </div>
  );
};

export default OfferingIncomeMetrics;
