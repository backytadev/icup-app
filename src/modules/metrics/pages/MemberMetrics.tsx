import { useEffect } from 'react';

import { FaPeopleRoof } from 'react-icons/fa6';
import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';
import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

import { MemberReportFormCard } from '@/modules/metrics/components/member/reports/MemberReportFormCard';

import { MemberProportionCard } from '@/modules/metrics/components/member/charts/MemberProportionCard';
import { MemberAnalysisCardByCategory } from '@/modules/metrics/components/member/charts/MemberAnalysisCardByCategory';
import { MemberAnalysisCardByBirthMonth } from '@/modules/metrics/components/member/charts/MemberAnalysisCardByBirthMonth';
import { MemberAnalysisCardByRecordStatus } from '@/modules/metrics/components/member/charts/MemberAnalysisCardByRecordStatus';
import { MemberAnalysisCardByRoleAndGender } from '@/modules/metrics/components/member/charts/MemberAnalysisCardByRoleAndGender';
import { MemberAnalysisCardByMaritalStatus } from '@/modules/metrics/components/member/charts/MemberAnalysisCardByMaritalStatus';
import { DiscipleAnalysisCardByZoneAndGender } from '@/modules/metrics/components/member/charts/DiscipleAnalysisCardByZoneAndGender';
import { PreacherAnalysisCardByZoneAndGender } from '@/modules/metrics/components/member/charts/PreacherAnalysisCardByZoneAndGender';
import { MemberFluctuationAnalysisCardByYear } from '@/modules/metrics/components/member/charts/MemberFluctuationAnalysisCardByYear';
import { MemberAnalysisCardByCategoryAndGender } from '@/modules/metrics/components/member/charts/MemberAnalysisCardByCategoryAndGender';
import { MemberAnalysisCardByDistrictAndGender } from '@/modules/metrics/components/member/charts/MemberAnalysisCardByDistrictAndGender';

export const MemberMetrics = (): JSX.Element => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  useEffect(() => {
    document.title = 'Modulo Métricas - IcupApp';
  }, []);

  return (
    <div className='animate-fadeInPage max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
      <ModuleHeader
        title='Métricas de Miembro'
        description='Indicadores, comparativas y estadísticas de miembros.'
        titleColor='cyan'
        badge='Membresía'
        badgeColor='cyan'
        icon={FaPeopleRoof}
        accentColor='cyan'
      />

      <MemberProportionCard />

      <div className='flex justify-center gap-4 items-center mt-6'>
        <MemberReportFormCard />
      </div>

      {activeChurchId && (
        <div className='mt-6 px-2 pb-10 sm:pb-10 md:px-6 xl:pb-14 flex flex-col xl:grid xl:grid-cols-2 gap-8 h-auto'>
          <MemberFluctuationAnalysisCardByYear />
          <MemberAnalysisCardByBirthMonth />
          <MemberAnalysisCardByCategory />
          <MemberAnalysisCardByCategoryAndGender />
          <MemberAnalysisCardByRoleAndGender />
          <MemberAnalysisCardByMaritalStatus />
          <DiscipleAnalysisCardByZoneAndGender />
          <PreacherAnalysisCardByZoneAndGender />
          <MemberAnalysisCardByDistrictAndGender />
          <MemberAnalysisCardByRecordStatus />
        </div>
      )}

      <footer className='pt-4 pb-2 text-center'>
        <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
          Modulo Métricas - ICUP App &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default MemberMetrics;
