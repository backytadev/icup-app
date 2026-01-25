import { useEffect } from 'react';

import { DashboardHeader } from '@/modules/dashboard/components/shared/DashboardHeader';
import { MembersInfoCard } from '@/modules/dashboard/components/cards/info/LastMembersCard';
import { HousesInfoCard } from '@/modules/dashboard/components/cards/info/TopFamilyGroupsCard';
import { LastSundayOfferingsCard } from '@/modules/dashboard/components/cards/charts/LastSundaysOfferingsCard';
import { TopFamilyGroupsOfferingsCard } from '@/modules/dashboard/components/cards/charts/TopFamilyGroupsOfferingsCard';

export const DashboardPage = (): JSX.Element => {
  useEffect(() => {
    document.title = 'Panel Administrativo - ICUP';
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <div className='max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
        {/* Header */}
        <DashboardHeader />

        {/* Main Grid */}
        <div className='grid grid-cols-1 xl:grid-cols-6 gap-6'>
          {/* Charts Row */}
          <div
            className='xl:col-span-3 opacity-0 animate-slide-in-up'
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
          >
            <LastSundayOfferingsCard />
          </div>

          <div
            className='xl:col-span-3 opacity-0 animate-slide-in-up'
            style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
          >
            <TopFamilyGroupsOfferingsCard />
          </div>

          {/* Info Cards Row */}
          <div
            className='xl:col-span-3 opacity-0 animate-slide-in-up'
            style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
          >
            <MembersInfoCard />
          </div>

          <div
            className='xl:col-span-3 opacity-0 animate-slide-in-up'
            style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}
          >
            <HousesInfoCard />
          </div>
        </div>

        {/* Footer */}
        <footer className='pt-4 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Panel Administrativo ICUP &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardPage;
