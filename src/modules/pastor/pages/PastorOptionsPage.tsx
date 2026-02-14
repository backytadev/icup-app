import { useEffect } from 'react';

import { FcPodiumWithSpeaker } from 'react-icons/fc';
import { FaSearch } from 'react-icons/fa';

import { useAuthStore } from '@/stores/auth/auth.store';
import { UserRole } from '@/modules/user/enums/user-role.enum';

import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';
import { ModuleOptionCard } from '@/shared/components/page-header/ModuleOptionCard';

export const PastorOptionsPage = (): JSX.Element => {
  const user = useAuthStore((state) => state.user);

  const allowedFullAccessRoles = [UserRole.SuperUser, UserRole.AdminUser];
  const userRoles = user?.roles ?? [];

  const hasFullAccess = userRoles.some((role) => allowedFullAccessRoles.includes(role as UserRole));

  useEffect(() => {
    document.title = 'Modulo Pastor - IcupApp';
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8'>
        <ModuleHeader
          title='Modulo Pastor'
          description='Administra y gestiona la informacion de los pastores registrados en el sistema.'
          badge='Membresía'
          badgeColor='purple'
          icon={FcPodiumWithSpeaker}
          accentColor='purple'
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
            to='/pastors/create'
            icon={<FcPodiumWithSpeaker />}
            title='Registrar Pastor'
            description='Crear nuevo registro de un pastor en el sistema.'
            color='green'
            disabled={!hasFullAccess}
            delay='0.2s'
          />

          <ModuleOptionCard
            to='/pastors/search'
            icon={<FaSearch />}
            title='Gestionar Pastores'
            description='Buscar, consultar, actualizar e inactivar registros de pastores.'
            color='blue'
            delay='0.25s'
          />
        </div>

        <footer className='pt-6 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Modulo Pastor - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PastorOptionsPage;
