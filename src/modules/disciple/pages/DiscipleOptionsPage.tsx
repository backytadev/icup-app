/* eslint-disable @typescript-eslint/no-floating-promises */

import { useEffect } from 'react';

import { NavLink } from 'react-router-dom';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import { FcClearFilters, FcSearch, FcSportsMode, FcSupport } from 'react-icons/fc';

import { useAuthStore } from '@/stores/auth/auth.store';
import { WhiteCard } from '@/shared/components/cards/WhiteCard';
import { UserRole } from '@/modules/user/enums/user-role.enum';

export const DiscipleOptionsPage = (): JSX.Element => {
  const user = useAuthStore((state) => state.user);

  const allowedFullAccessRoles = [UserRole.SuperUser, UserRole.AdminUser];
  const userRoles = user?.roles ?? [];

  const hasFullAccess = userRoles.some((role) => allowedFullAccessRoles.includes(role as UserRole));

  useEffect(() => {
    document.title = 'Modulo Discípulo - IcupApp';
  }, []);

  return (
    <div className='animate-fadeIn'>
      <h1 className='text-center pb-2 pt-3 md:pt-2 md:pb-2 font-sans text-2xl sm:text-3xl font-bold text-disciple-color text-[2rem] sm:text-[2.4rem] md:text-[2.6rem] lg:text-5xl xl:text-5xl'>
        Modulo Discípulo
      </h1>
      <p className='text-center font-sans text-[15px] sm:text-md md:text-[15px] font-bold px-4 pb-4 lg:text-base xl:text-lg'>
        Bienvenido, por favor elige una opción.
      </p>
      <hr className='p-[0.015rem] bg-slate-500' />

      <div className='w-full pt-6 pb-10 px-[2rem] sm:px-[7rem] md:px-[4rem] lg:px-[3rem] xl:px-[3rem] 2xl:px-[4rem] grid gap-8 md:gap-6 2xl:gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 lg:grid-rows-3 2xl:grid-rows-3 h-auto lg:h-[58rem] xl:min-h-screen'>
        <NavLink
          key='/disciples/create'
          to={hasFullAccess ? '/disciples/create' : '#'}
          onClick={(e) => {
            if (!hasFullAccess) e.preventDefault();
          }}
          end
          className='row-start-1 row-end-2 md:row-start-1 md:row-end-2 md:col-start-1 md:col-end-2 lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2 xl:row-start-1 xl:row-end-2 xl:col-start-1 xl:col-end-2 2xl:row-start-1 2xl:row-end-4 2xl:col-start-1 2xl:col-end-2'
        >
          <WhiteCard disabled={!hasFullAccess} className='md:h-[11rem]' centered>
            <FcSportsMode className='text-[4rem] sm:text-[5rem] md:text-[6rem]' />
            <h2 className='text-green-500 font-bold text-[22px] sm:text-2xl lg:text-3xl xl:text-4xl'>
              Registrar Discípulo
            </h2>
            <p className='font-bold text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px]'>
              Crear nuevo registro de un discípulo
            </p>
          </WhiteCard>
        </NavLink>

        <NavLink
          key='/disciples/general-search'
          to='/disciples/general-search'
          end
          className='row-start-2 row-end-3 lg:row-start-3 lg:row-end-4 lg:col-start-1 lg:col-end-2 xl:row-start-1 xl:row-end-3 xl:col-start-2 xl:col-end-3 2xl:row-start-1 2xl:row-end-3 2xl:col-start-2 2xl:col-end-3'
        >
          <WhiteCard className='md:h-[11rem]' centered>
            <FcSearch className='text-[4rem] sm:text-[5rem] md:text-[6rem]' />
            <h2 className='text-blue-500 font-bold text-[22px] sm:text-2xl lg:text-3xl xl:text-4xl'>
              Consultar Discípulos
            </h2>
            <p className='font-bold text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px]'>
              Consultar registros de discípulos en general
            </p>
          </WhiteCard>
        </NavLink>

        <NavLink
          key='/disciples/search-by-term'
          to='/disciples/search-by-term'
          end
          className='row-start-3 row-end-4 lg:row-start-1 lg:row-end-2 lg:col-start-2 lg:col-end-3 xl:row-start-2 xl:row-end-3 xl:col-start-1 xl:col-end-2 2xl:row-start-3 2xl:row-end-4 2xl:col-start-2 2xl:col-end-3'
        >
          <WhiteCard className='md:h-[11rem]' centered>
            <FcClearFilters className='text-[4rem] sm:text-[5rem] md:text-[6rem]' />
            <h2 className='text-sky-500 font-bold text-[22px] sm:text-2xl lg:text-3xl xl:text-4xl'>
              Consultar Discípulos
            </h2>
            <p className='font-bold text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px]'>
              Consultar registros de discípulos por filtros
            </p>
          </WhiteCard>
        </NavLink>

        <NavLink
          key='/disciples/update'
          to={hasFullAccess ? '/disciples/update' : '#'}
          onClick={(e) => {
            if (!hasFullAccess) e.preventDefault();
          }}
          end
          className='row-start-4 row-end-5 lg:h-full lg:row-start-2 lg:row-end-3 lg:col-start-2 lg:col-end-3 xl:row-start-3 xl:row-end-4 xl:col-start-1 xl:col-end-2 2xl:row-start-1 2xl:row-end-4 2xl:col-start-3 2xl:col-end-4'
        >
          <WhiteCard disabled={!hasFullAccess} className='md:h-[11rem]' centered>
            <FcSupport className='text-[4rem] sm:text-[5rem] md:text-[6rem]' />
            <h2 className='text-orange-500 font-bold text-[22px] sm:text-2xl lg:text-3xl xl:text-4xl'>
              Actualizar Discípulo
            </h2>
            <p className='font-bold text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px]'>
              Modificar datos del registro de un discípulo
            </p>
          </WhiteCard>
        </NavLink>

        <NavLink
          key='/disciples/inactivate'
          to={hasFullAccess ? '/disciples/inactivate' : '#'}
          onClick={(e) => {
            if (!hasFullAccess) e.preventDefault();
          }}
          end
          className='row-start-5 row-end-6 lg:row-start-3 lg:row-end-4 lg:col-start-2 lg:col-end-3 xl:row-start-3 xl:row-end-4 xl:col-start-2 xl:col-end-3 2xl:row-start-1 2xl:row-end-4 2xl:col-start-4 2xl:col-end-5'
        >
          <WhiteCard disabled={!hasFullAccess} className='md:h-[11rem]' centered>
            <RiDeleteBin2Fill className='text-[4rem] sm:text-[5rem] md:text-[6rem] text-red-500' />
            <h2 className='text-red-500 font-bold text-[22px] sm:text-2xl lg:text-3xl xl:text-4xl'>
              Inactivar Discípulo
            </h2>
            <p className='font-bold text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px]'>
              Inactivar registro de un discípulo.
            </p>
          </WhiteCard>
        </NavLink>
      </div>
    </div>
  );
};

export default DiscipleOptionsPage;
