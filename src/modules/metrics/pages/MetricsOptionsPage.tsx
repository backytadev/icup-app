/* eslint-disable @typescript-eslint/no-floating-promises */

import { useEffect } from 'react';

import { NavLink } from 'react-router-dom';
import { GiExpense } from 'react-icons/gi';
import { FaBalanceScale } from 'react-icons/fa';
import { FcConferenceCall, FcDonate, FcHome, FcRefresh } from 'react-icons/fc';

import { WhiteCard } from '@/shared/components/cards/WhiteCard';

export const MetricsOptionsPage = (): JSX.Element => {
  useEffect(() => {
    document.title = 'Modulo Métricas - IcupApp';
  }, []);

  return (
    <div className='animate-fadeIn'>
      <h1 className='text-center pb-2 pt-3 md:pt-2 md:pb-2 font-sans text-2xl sm:text-3xl font-bold text-emerald-500 text-[2rem] sm:text-[2.4rem] md:text-[2.6rem] lg:text-5xl xl:text-5xl'>
        Modulo Métricas
      </h1>
      <p className='text-center font-sans text-[15px] sm:text-md md:text-[15px] font-bold px-4 pb-4 lg:text-base xl:text-lg'>
        Bienvenido, por favor elige una opción.
      </p>
      <hr className='p-[0.015rem] bg-slate-500' />

      <div className='w-full pt-6 pb-10 px-[2rem] sm:px-[7rem] md:px-[4rem] lg:px-[3rem] xl:px-[3rem] 2xl:px-[4rem] grid gap-8 md:gap-6 2xl:gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 lg:grid-rows-3 2xl:grid-rows-3 h-auto 2xl:h-[58rem]'>
        <NavLink
          key='/metrics/member'
          to='/metrics/member'
          end
          className='row-start-1 row-end-2 md:row-start-1 md:row-end-2 md:col-start-1 md:col-end-2 lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2 xl:row-start-1 xl:row-end-2 xl:col-start-1 xl:col-end-2 2xl:row-start-1 2xl:row-end-4 2xl:col-start-1 2xl:col-end-2'
        >
          <WhiteCard className='h-[12rem] md:h-[11rem]' centered>
            <FcConferenceCall className='text-[4rem] sm:text-[5rem] md:text-[6rem]' />
            <h2 className='text-sky-500 font-bold text-[22px] sm:text-2xl lg:text-3xl xl:text-4xl'>
              Métricas de Miembro
            </h2>
            <p className='font-bold text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px]'>
              Gráficos estadísticos y métricas de miembros
            </p>
          </WhiteCard>
        </NavLink>

        <NavLink
          key='/metrics/family-group'
          to='/metrics/family-group'
          end
          className='row-start-2 row-end-3 lg:row-start-3 lg:row-end-4 lg:col-start-1 lg:col-end-2 xl:row-start-1 xl:row-end-3 xl:col-start-2 xl:col-end-3 2xl:row-start-1 2xl:row-end-4 2xl:col-start-2 2xl:col-end-3'
        >
          <WhiteCard className='h-[12rem] md:h-[11rem]' centered>
            <FcHome className='text-[4.5rem] sm:text-[5rem] md:text-[6rem]' />
            <h2 className='text-orange-500 font-bold text-[22px] sm:text-2xl lg:text-3xl xl:text-4xl'>
              Métricas de Grupo Familiar
            </h2>
            <p className='font-bold text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px]'>
              Gráficos estadísticos y métricas de grupos familiares
            </p>
          </WhiteCard>
        </NavLink>

        <NavLink
          key='/metrics/offering-income'
          to='/metrics/offering-income'
          end
          className='row-start-3 row-end-4 lg:row-start-1 lg:row-end-2 lg:col-start-2 lg:col-end-3 xl:row-start-3 xl:row-end-4 xl:col-start-2 xl:col-end-3 2xl:row-start-1 2xl:row-end-3 2xl:col-start-3 2xl:col-end-4'
        >
          <WhiteCard className='h-[12rem] md:h-[11rem]' centered>
            <FcDonate className='text-[4.5rem] sm:text-[5rem] md:text-[6rem]' />
            <h2 className='text-green-500 font-bold text-[22px] sm:text-2xl lg:text-3xl xl:text-4xl'>
              Métricas de Ofrenda (Ingreso)
            </h2>
            <p className='font-bold text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px]'>
              Gráficos estadísticos y métricas de ofrendas
            </p>
          </WhiteCard>
        </NavLink>

        <NavLink
          key='/metrics/offering-expense'
          to='/metrics/offering-expense'
          end
          className='row-start-4 row-end-5 lg:h-full lg:row-start-2 lg:row-end-3 lg:col-start-2 lg:col-end-3 xl:row-start-2 xl:row-end-3 xl:col-start-1 xl:col-end-2 2xl:row-start-1 2xl:row-end-3 2xl:col-start-4 2xl:col-end-5'
        >
          <WhiteCard className='h-[12rem] md:h-[11rem]' centered>
            <GiExpense className='text-[5rem] sm:text-[5rem] md:text-[6.5rem] text-amber-500' />
            <h2 className='text-red-500 font-bold text-[22px] sm:text-2xl lg:text-3xl xl:text-4xl'>
              Métricas de Ofrenda (Salida)
            </h2>
            <p className='font-bold text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px]'>
              Gráficos estadísticos y métricas de ofrendas
            </p>
          </WhiteCard>
        </NavLink>

        <NavLink
          key='/metrics/offering-comparative'
          to='/metrics/offering-comparative'
          end
          className='row-start-5 row-end-6 lg:row-start-3 lg:row-end-4 lg:col-start-2 lg:col-end-3 xl:row-start-3 xl:row-end-4 xl:col-start-1 xl:col-end-2 2xl:row-start-3 2xl:row-end-4 2xl:col-start-3 2xl:col-end-5'
        >
          <WhiteCard className='h-[15rem] md:h-[12rem] 2xl:gap-y-2' centered>
            <div className='flex'>
              <FcRefresh className='text-[3.5rem] sm:text-[5rem] md:text-[5.5rem]' />
              <FaBalanceScale className='text-[3.5rem] sm:text-[5rem] md:text-[5.5rem] text-[#1565C0] xl:text-[6rem]' />
            </div>
            <h2 className='text-blue-500 font-bold text-[22px] sm:text-2xl lg:text-3xl xl:text-4xl'>
              <span className='block'>Métricas de Ofrenda</span>
              <span>(Comparativas y Balance Financiero)</span>
            </h2>
            <p className='font-bold text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px]'>
              Gráficos estadísticos comparativos y balance financiero de ofrendas
            </p>
          </WhiteCard>
        </NavLink>
      </div>
    </div>
  );
};

export default MetricsOptionsPage;
