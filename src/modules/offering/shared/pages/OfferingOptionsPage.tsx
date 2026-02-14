import { useEffect } from 'react';

import { TbArrowBigUpLines, TbArrowBigDownLines } from 'react-icons/tb';
import { GiReceiveMoney } from 'react-icons/gi';

import { useAuthStore } from '@/stores/auth/auth.store';
import { UserRole } from '@/modules/user/enums/user-role.enum';

import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';
import { ModuleOptionCard } from '@/shared/components/page-header/ModuleOptionCard';

export const OfferingOptionsPage = (): JSX.Element => {
  const user = useAuthStore((state) => state.user);

  const allowedFullAccessRoles = [UserRole.SuperUser, UserRole.TreasurerUser];
  const allowedPartialAccessRoles = [UserRole.MinistryUser];

  const userRoles = user?.roles ?? [];

  const hasFullAccess = userRoles.some((role) => allowedFullAccessRoles.includes(role as UserRole));
  const hasPartAccess = userRoles.some((role) =>
    allowedPartialAccessRoles.includes(role as UserRole)
  );

  useEffect(() => {
    document.title = 'Modulo Ofrenda - IcupApp';
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8'>
        <ModuleHeader
          title='Modulo Ofrenda'
          description='Administra y gestiona los ingresos y salidas de ofrendas registradas en el sistema.'
          badge='Ofrenda'
          badgeColor='amber'
          icon={GiReceiveMoney}
          accentColor='amber'
        />

        <div
          className='text-center opacity-0 animate-slide-in-up'
          style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
        >
          <p className='text-lg text-slate-600 dark:text-slate-400 font-inter'>
            Selecciona una opcion para continuar
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto'>
          <ModuleOptionCard
            to='/offerings/income'
            icon={<TbArrowBigUpLines />}
            title='Modulo de Ingreso'
            description='Control de ingresos de ofrenda.'
            color='green'
            disabled={!hasFullAccess && !hasPartAccess}
            delay='0.2s'
          />

          <ModuleOptionCard
            to='/offerings/expenses'
            icon={<TbArrowBigDownLines />}
            title='Modulo de Salida'
            description='Control de gastos de ofrenda.'
            color='red'
            disabled={!hasFullAccess}
            delay='0.25s'
          />
        </div>

        <footer className='pt-6 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Modulo Ofrenda - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default OfferingOptionsPage;
