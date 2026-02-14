/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { cn } from '@/shared/lib/utils';

import { RecordStatus } from '@/shared/enums/record-status.enum';
import { type Gender, GenderNames } from '@/shared/enums/gender.enum';

import {
  formatDateToLimaTime,
  formatDateToLimaDayMonthYear,
} from '@/shared/helpers/format-date-to-lima';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';

import {
  type UserInactivationCategory,
  UserInactivationCategoryNames,
} from '@/modules/user/enums/user-inactivation-category.enum';
import {
  type UserInactivationReason,
  UserInactivationReasonNames,
} from '@/modules/user/enums/user-inactivation-reason.enum';
import { type UserRole, UserRoleNames } from '@/modules/user/enums/user-role.enum';

import { type UserResponse } from '@/modules/user/interfaces/user-response.interface';

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

interface UserTabsCardProps {
  id: string;
  data: UserResponse | undefined;
}

export const UserTabsCard = ({ id, data }: UserTabsCardProps): JSX.Element => {
  //* Effects
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);

      if (url.pathname === '/users/general-search')
        url.pathname = `/users/general-search/${id}/view`;

      if (url.pathname === '/users/search-by-term')
        url.pathname = `/users/search-by-term/${id}/view`;

      if (url.pathname === '/users/update') url.pathname = `/users/update/${id}/view`;

      if (url.pathname === '/users/inactivate') url.pathname = `/users/inactivate/${id}/view`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);

  return (
    <Tabs defaultValue='general-info' className='md:-mt-8 w-[650px] md:w-[630px]'>
      <TabsList className='grid w-full px-auto grid-cols-1'>
        <TabsTrigger value='general-info' className='text-[14.5px] md:text-[15px]'>
          General
        </TabsTrigger>
      </TabsList>
      <TabsContent value='general-info'>
        <Card className='w-full'>
          <CardHeader className='text-center pb-4 pt-2'>
            <CardTitle className='text-blue-500 text-[23px] md:text-[28px] font-bold -mb-2'>
              Información General
            </CardTitle>
            <CardDescription className='text-[14px] md:text-[15px]'>
              Información general del usuario.
            </CardDescription>
          </CardHeader>

          <CardContent className='grid grid-cols-3 pl-[2rem] sm:pl-[4rem] sm:pr-[5rem] gap-x-4 gap-y-2 md:gap-x-6 md:gap-y-4 md:pl-[5rem] md:pr-[1rem]'>
            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Nombres</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.firstNames}
              </CardDescription>
            </div>
            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Apellidos</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.lastNames}
              </CardDescription>
            </div>
            <div className='space-y-1'>
              <Label className='text-[14px] md:text-[15px]'>Género</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.gender ? GenderNames[data?.gender as Gender] : '-'}
              </CardDescription>
            </div>
            <div className='space-y-1 col-start-1 cold-end-3 row-start-2 row-end-3 md:row-start-auto md:col-start-auto'>
              <Label className='text-[14px] md:text-[15px]'>Correo Electrónico</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.email}
              </CardDescription>
            </div>
            <div className='space-y-1 col-start-1 col-end-4 row-start-3 row-end-4 md:row-start-2 md:row-end-3 md:col-start-2 md:col-end-4'>
              <Label className='text-[14px] md:text-[15px]'>Roles</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.roles.map((rol) => UserRoleNames[rol as UserRole]).join(' - ')}
              </CardDescription>
            </div>

            <span
              className={cn(
                'pt-1 md:pt-0 col-start-1 col-end-4 row-start-4 row-end-5 md:row-start-auto md:row-end-auto text-[15px] md:text-[16px] font-bold text-yellow-500',
                data?.inactivationCategory && 'col-start-1 col-end-4 row-start-4 row-end-5'
              )}
            >
              Información de registro
            </span>

            <div
              className={cn(
                'space-y-1 flex justify-between items-center row-start-5 row-end-6 col-start-1 col-end-4 md:grid md:col-auto md:row-auto',
                data?.inactivationCategory && 'row-start-5 row-end-6 col-start-1 col-end-4'
              )}
            >
              <Label className='text-[14px] md:text-[15px]'>Creado por</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.createdBy
                  ? getInitialFullNames({
                      firstNames: data?.createdBy?.firstNames ?? '-',
                      lastNames: data?.createdBy?.lastNames ?? '-',
                    })
                  : '-'}
              </CardDescription>
            </div>

            <div
              className={cn(
                'space-y-1 col-start-1 col-end-4 flex justify-between items-center row-start-6 row-end-7 md:grid  md:row-start-4 md:row-end-5 md:col-start-2 md:col-end-4',
                data?.inactivationCategory &&
                  'row-start-6 row-end-7 col-start-1 col-end-4 md:col-start-2 md:col-end-3 md:row-start-4 md:row-end-5'
              )}
            >
              <Label className='text-[14px] md:text-[15px]'>Fecha de creación</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px] text-right md:text-left md:whitespace-nowrap'>
                {data?.createdAt
                  ? `${formatDateToLimaDayMonthYear(data?.createdAt)} - ${formatDateToLimaTime(data?.createdAt)}`
                  : '-'}
              </CardDescription>
            </div>

            <div
              className={cn(
                'space-y-1 col-start-1 col-end-4 flex justify-between items-center row-start-7 row-end-8 md:grid md:row-auto  md:col-start-1 md:col-end-2',
                data?.inactivationCategory && 'row-start-7 row-end-8 col-start-1 col-end-4'
              )}
            >
              <Label className='text-[14px] md:text-[15px]'>Actualizado por</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px]'>
                {data?.updatedBy
                  ? getInitialFullNames({
                      firstNames: data?.updatedBy?.firstNames ?? '-',
                      lastNames: data?.updatedBy?.lastNames ?? '-',
                    })
                  : '-'}
              </CardDescription>
            </div>

            <div
              className={cn(
                'space-y-1 col-start-1 col-end-4 flex justify-between items-center row-start-8 row-end-9 md:grid md:row-start-5 md:row-end-6 md:col-start-2 md:col-end-4',
                data?.inactivationCategory &&
                  'row-start-8 row-end-9 col-start-1 col-end-4 md:row-start-5 md:row-end-6 md:col-start-2 md:col-end-4'
              )}
            >
              <Label className='text-[14px] md:text-[15px]'>Ultima fecha de actualización</Label>
              <CardDescription className='px-2 text-[14px] md:text-[14.5px] text-right md:text-left'>
                {data?.updatedAt
                  ? `${formatDateToLimaDayMonthYear(data?.updatedAt)} - ${formatDateToLimaTime(data?.updatedAt)}`
                  : '-'}
              </CardDescription>
            </div>

            <div
              className={cn(
                'space-y-1 col-start-1 col-end-4 flex justify-between md:justify-center items-center row-start-9 row-end-10 md:grid md:row-start-4 md:row-end-5 md:col-start-3 md:col-end-4',
                data?.inactivationCategory &&
                  'row-start-9 row-end-10 col-start-1 col-end-4 md:col-start-3 md:col-end-4 md:row-start-4 md:row-end-5'
              )}
            >
              <Label className='text-[14px] md:text-[15px]'>Estado</Label>
              <CardDescription
                className={cn(
                  'px-2 text-[14px] md:text-[14.5px] text-green-600 font-bold',
                  data?.recordStatus !== RecordStatus.Active && 'text-red-600'
                )}
              >
                {data?.recordStatus === RecordStatus.Active ? 'Activo' : 'Inactivo'}
              </CardDescription>
            </div>

            {data?.inactivationCategory && (
              <>
                <div className='pt-1 md:pt-0 col-start-1 col-end-4 row-start-10 row-end-11 md:row-start-auto md:row-end-auto text-[15px] md:text-[16px] font-bold text-red-500'>
                  Información de Inactivación
                </div>
                <div className='flex justify-between md:grid items-center space-y-1 col-start-1 col-end-4 row-start-11 row-end-12 md:col-start-auto md:col-end-auto md:row-start-auto md:row-end-auto'>
                  <Label className='text-[14px] md:text-[15px]'>Categoría</Label>
                  <CardDescription className='px-2 text-[14px] md:text-[14.5px] text-right md:text-left'>
                    {UserInactivationCategoryNames[
                      data?.inactivationCategory as UserInactivationCategory
                    ] ?? '-'}
                  </CardDescription>
                </div>

                <div className='flex justify-between md:grid items-center col-start-1 col-end-4 row-start-12 row-end-13 md:col-start-2 md:col-end-4 md:row-start-7 md:row-end-8 space-y-1'>
                  <Label className='text-[14px] md:text-[15px]'>Motivo o Descripción</Label>
                  <CardDescription className='px-2 text-[14px] md:text-[14.5px] text-right md:text-left'>
                    {UserInactivationReasonNames[
                      data?.inactivationReason as UserInactivationReason
                    ] ?? '-'}
                  </CardDescription>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
