import { useEffect } from 'react';

import { TbHome } from "react-icons/tb";
import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import { FamilyGroupProportionCard } from '@/modules/metrics/components/family-group/charts/FamilyGroupProportionCard';
import { FamilyGroupReportFormCard } from '@/modules/metrics/components/family-group/reports/FamilyGroupReportFormCard';
import { FamilyGroupAnalysisCardByZone } from '@/modules/metrics/components/family-group/charts/FamilyGroupAnalysisCardByZone';
import { FamilyGroupAnalysisCardByDistrict } from '@/modules/metrics/components/family-group/charts/FamilyGroupAnalysisCardByDistrict';
import { FamilyGroupAnalysisCardByServiceTime } from '@/modules/metrics/components/family-group/charts/FamilyGroupAnalysisCardByServiceTime';
import { FamilyGroupAnalysisCardByRecordStatus } from '@/modules/metrics/components/family-group/charts/FamilyGroupAnalysisCardByRecordStatus';
import { FamilyGroupFluctuationAnalysisCardByYear } from '@/modules/metrics/components/family-group/charts/FamilyGroupFluctuationAnalysisCardByYear';
import { FamilyGroupAnalysisCardByCopastorAndZone } from '@/modules/metrics/components/family-group/charts/FamilyGroupAnalysisCardByCopastorAndZone';
import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';

export const FamilyGroupMetrics = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  useEffect(() => {
    document.title = 'Modulo Métricas - IcupApp';
  }, []);

  return (
    <div className='animate-fadeInPage max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
      <ModuleHeader
        title='Métricas de Grupos Familiares'
        description='Indicadores, comparativas y estadísticas de grupos familiares.'
        titleColor='amber'
        badge='Grupos Familiares'
        badgeColor='amber'
        icon={TbHome}
        accentColor='amber'
      />

      <FamilyGroupProportionCard />

      <div className='flex justify-center gap-4 items-center mt-6'>
        <FamilyGroupReportFormCard />
      </div>

      {activeChurchId && (
        <div className='mt-6 px-2 sm:pb-10 md:px-6 xl:pb-14 flex flex-col xl:grid xl:grid-cols-2 gap-8 h-[155rem] sm:h-auto'>
          <FamilyGroupFluctuationAnalysisCardByYear />
          <FamilyGroupAnalysisCardByZone />
          <FamilyGroupAnalysisCardByCopastorAndZone />
          <FamilyGroupAnalysisCardByDistrict />
          <FamilyGroupAnalysisCardByServiceTime />
          <FamilyGroupAnalysisCardByRecordStatus />
        </div>
      )}
    </div>
  );
};

export default FamilyGroupMetrics;
