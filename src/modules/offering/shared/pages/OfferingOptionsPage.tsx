/* eslint-disable @typescript-eslint/no-floating-promises */

import { useEffect } from 'react';

import { NavLink } from 'react-router-dom';
import { FcBearish, FcBullish } from 'react-icons/fc';

import { WhiteCard } from '@/shared/components/cards/WhiteCard';

export const OfferingOptionsPage = (): JSX.Element => {
  useEffect(() => {
    document.title = 'Modulo Ofrenda - IcupApp';
  }, []);

  return (
    <div className='animate-fadeIn'>
      <h1 className='text-center pb-2 pt-2 md:pt-2 md:pb-2 font-sans text-2xl sm:text-3xl font-bold text-amber-500 dark:text-offering-color text-[2rem] sm:text-[2.4rem] md:text-[2.6rem] lg:text-5xl xl:text-5xl'>
        Modulo Ofrenda
      </h1>
      <p className='text-center font-sans text-sm sm:text-md md:text-[15px] font-bold px-4 pb-4 lg:text-base xl:text-lg'>
        Bienvenido, por favor elige una opción.
      </p>
      <hr className='p-[0.015rem] bg-slate-500' />

      <div className='w-full h-[35rem] justify-center lg:justify-normal px-8 py-10 flex flex-col gap-10 lg:grid md:gap-8 sm:h-[45rem] md:h-[58rem] lg:h-[58rem]'>
        <NavLink
          key='/offerings/income'
          to='/offerings/income'
          end
          className='row-start-1 row-end-3 col-start-1 col-end-3 h-full'
        >
          <WhiteCard className='h-full sm:h-full gap-2 sm:gap-4 lg:gap-5' centered>
            <FcBullish className='text-[5rem] sm:text-[8rem] md:text-[10rem]' />
            <h2 className='text-green-500 font-bold text-[22px] sm:text-3xl lg:text-4xl'>
              Modulo de Ingreso
            </h2>
            <p className='font-bold text-[14px] sm:text-[16px] lg:text-[17px] leading-6 xl:leading-3'>
              Control de ingresos de ofrenda
            </p>
          </WhiteCard>
        </NavLink>

        <NavLink
          key='/offerings/expenses'
          to='/offerings/expenses'
          end
          className=' row-start-1 row-end-3 col-start-3 col-end-5 h-full'
        >
          <WhiteCard className='h-full sm:h-full gap-2 sm:gap-4 lg:gap-5' centered>
            <FcBearish className='text-[5rem] sm:text-[8rem] lg:text-[10rem]' />
            <h2 className='text-red-500 font-bold text-[22px] sm:text-3xl lg:text-4xl'>
              Modulo de Salida
            </h2>
            <p className='font-bold text-[14px] sm:text-[16px] lg:text-[17px] leading-6 xl:leading-3'>
              Control de gastos de ofrenda
            </p>
          </WhiteCard>
        </NavLink>
      </div>
    </div>
  );
};

export default OfferingOptionsPage;
