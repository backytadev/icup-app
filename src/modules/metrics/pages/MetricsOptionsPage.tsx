import { useEffect } from 'react';

import { GiPayMoney, GiReceiveMoney } from 'react-icons/gi';
import { TbChartBar, TbHome } from 'react-icons/tb';
import { FaBalanceScale } from 'react-icons/fa';
import { FaPeopleRoof } from 'react-icons/fa6';

import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';
import { ModuleOptionCard } from '@/shared/components/page-header/ModuleOptionCard';

export const MetricsOptionsPage = (): JSX.Element => {
  useEffect(() => {
    document.title = 'Modulo Métricas - IcupApp';
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8'>
        <ModuleHeader
          title='Modulo Métricas'
          description='Visualiza gráficos estadísticos y métricas de miembros, grupos familiares y ofrendas registradas en el sistema.'
          badge='Métricas'
          badgeColor='blue'
          icon={TbChartBar}
          accentColor='blue'
        />

        <div
          className='text-center opacity-0 animate-slide-in-up'
          style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
        >
          <p className='text-lg text-slate-600 dark:text-slate-400 font-inter'>
            Selecciona una opcion para continuar
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto'>
          <ModuleOptionCard
            to='/metrics/member'
            icon={<FaPeopleRoof />}
            title='Métricas de Miembro'
            description='Gráficos estadísticos y métricas de miembros.'
            color='sky'
            delay='0.2s'
          />

          <ModuleOptionCard
            to='/metrics/family-group'
            icon={<TbHome />}
            title='Métricas de Grupo Familiar'
            description='Gráficos estadísticos y métricas de grupos familiares.'
            color='orange'
            delay='0.25s'
          />

          <ModuleOptionCard
            to='/metrics/offering-income'
            icon={<GiReceiveMoney />}
            title='Métricas de Ofrenda (Ingreso)'
            description='Gráficos estadísticos y métricas de ofrendas de ingreso.'
            color='green'
            delay='0.3s'
          />

          <ModuleOptionCard
            to='/metrics/offering-expense'
            icon={<GiPayMoney />}
            title='Métricas de Ofrenda (Salida)'
            description='Gráficos estadísticos y métricas de ofrendas de salida.'
            color='red'
            delay='0.35s'
          />

          <div className='sm:col-span-2 lg:col-span-1'>
            <ModuleOptionCard
              to='/metrics/offering-comparative'
              icon={<FaBalanceScale />}
              title='Métricas de Balance Financiero'
              description='Gráficos comparativos y balance financiero de ofrendas.'
              color='blue'
              delay='0.4s'
            />
          </div>
        </div>

        <footer className='pt-6 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Modulo Métricas - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MetricsOptionsPage;
