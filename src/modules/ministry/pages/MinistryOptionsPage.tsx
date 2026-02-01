import { useEffect } from 'react';

import { MdGroups3 } from 'react-icons/md';
import { FaSearch } from 'react-icons/fa';
import { FaFilter } from 'react-icons/fa6';
import { MdEditDocument } from 'react-icons/md';
import { RiDeleteBin2Fill } from 'react-icons/ri';

import { useAuthStore } from '@/stores/auth/auth.store';
import { UserRole } from '@/modules/user/enums/user-role.enum';

import { MinistryModuleHeader, MinistryOptionCard } from '@/modules/ministry/components';

export const MinistryOptionsPage = (): JSX.Element => {
  const user = useAuthStore((state) => state.user);

  const allowedFullAccessRoles = [UserRole.SuperUser, UserRole.AdminUser];
  const userRoles = user?.roles ?? [];

  const hasFullAccess = userRoles.some((role) => allowedFullAccessRoles.includes(role as UserRole));

  useEffect(() => {
    document.title = 'Modulo Ministerio - IcupApp';
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8'>
        <MinistryModuleHeader
          title='Modulo Ministerio'
          description='Administra y gestiona la información de los ministerios registrados en el sistema.'
        />

        <div
          className='text-center opacity-0 animate-slide-in-up'
          style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
        >
          <p className='text-lg text-slate-600 dark:text-slate-400 font-inter'>
            Selecciona una opción para continuar
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-6'>
          <MinistryOptionCard
            to='/ministries/create'
            icon={<MdGroups3 />}
            title='Registrar Ministerio'
            description='Crear nuevo registro de un ministerio en el sistema.'
            color='green'
            disabled={!hasFullAccess}
            delay='0.2s'
          />

          <MinistryOptionCard
            to='/ministries/general-search'
            icon={<FaSearch />}
            title='Consultar Ministerios'
            description='Consultar registros de ministerios en general.'
            color='blue'
            delay='0.25s'
          />

          <MinistryOptionCard
            to='/ministries/search-by-term'
            icon={<FaFilter />}
            title='Buscar por Filtros'
            description='Consultar registros de ministerios mediante filtros avanzados.'
            color='sky'
            delay='0.3s'
          />

          <MinistryOptionCard
            to='/ministries/update'
            icon={<MdEditDocument />}
            title='Actualizar Ministerio'
            description='Modificar datos del registro de un ministerio.'
            color='orange'
            disabled={!hasFullAccess}
            delay='0.35s'
          />

          <MinistryOptionCard
            to='/ministries/inactivate'
            icon={<RiDeleteBin2Fill />}
            title='Inactivar Ministerio'
            description='Inactivar registro de un ministerio del sistema.'
            color='red'
            disabled={!hasFullAccess}
            delay='0.4s'
          />
        </div>

        <footer className='pt-6 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Modulo Ministerio - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MinistryOptionsPage;
