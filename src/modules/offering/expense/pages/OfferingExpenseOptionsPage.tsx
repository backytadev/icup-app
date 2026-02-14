import { useEffect } from 'react';

import { FaSearch } from 'react-icons/fa';
import { GiExpense } from 'react-icons/gi';
import { FcClearFilters } from 'react-icons/fc';
import { FcSupport } from 'react-icons/fc';
import { RiDeleteBin2Fill } from 'react-icons/ri';

import { useAuthStore } from '@/stores/auth/auth.store';
import { UserRole } from '@/modules/user/enums/user-role.enum';

import { GiReceiveMoney } from 'react-icons/gi';

import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';
import { ModuleOptionCard } from '@/shared/components/page-header/ModuleOptionCard';

export const OfferingExpenseOptionsPage = (): JSX.Element => {
  const user = useAuthStore((state) => state.user);

  const allowedFullAccessRoles = [UserRole.SuperUser, UserRole.TreasurerUser];
  const userRoles = user?.roles ?? [];

  const hasFullAccess = userRoles.some((role) => allowedFullAccessRoles.includes(role as UserRole));

  useEffect(() => {
    document.title = 'Modulo Ofrenda - IcupApp';
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8'>
        <ModuleHeader
          title='Modulo de Salida'
          titleColor='red'
          description='Administra y gestiona los registros de salida de ofrendas en el sistema.'
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

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-6'>
          <ModuleOptionCard
            to='/offerings/expenses/create'
            icon={<GiExpense />}
            title='Registrar Salida'
            description='Crear nuevo registro de salida de una ofrenda.'
            color='green'
            disabled={!hasFullAccess}
            delay='0.2s'
          />

          <ModuleOptionCard
            to='/offerings/expenses/general-search'
            icon={<FaSearch />}
            title='Consultar Salidas'
            description='Consultar registros de salida de ofrendas en general.'
            color='blue'
            delay='0.25s'
          />

          <ModuleOptionCard
            to='/offerings/expenses/search-by-term'
            icon={<FcClearFilters />}
            title='Buscar por Filtros'
            description='Consultar registros de salida de ofrendas por filtros.'
            color='sky'
            delay='0.3s'
          />

          <ModuleOptionCard
            to='/offerings/expenses/update'
            icon={<FcSupport />}
            title='Actualizar Salida'
            description='Actualizar registro de salida de una ofrenda.'
            color='orange'
            disabled={!hasFullAccess}
            delay='0.35s'
          />

          <ModuleOptionCard
            to='/offerings/expenses/inactivate'
            icon={<RiDeleteBin2Fill />}
            title='Inactivar Salida'
            description='Inactivar registro de salida de una ofrenda.'
            color='red'
            disabled={!hasFullAccess}
            delay='0.4s'
          />
        </div>

        <footer className='pt-6 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Modulo de Salida - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default OfferingExpenseOptionsPage;
