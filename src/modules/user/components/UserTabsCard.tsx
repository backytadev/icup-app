import { useEffect } from 'react';

import { User } from 'lucide-react';

import { type UserResponse } from '@/modules/user/types/user-response.interface';

import { cn } from '@/shared/lib/utils';

import { formatDateToLimaDayMonthYear } from '@/shared/helpers/format-date-to-lima';
import { RecordStatus } from '@/shared/enums/record-status.enum';
import { type Gender, GenderNames } from '@/shared/enums/gender.enum';
import { PopoverDataCard, type AllowedTypes } from '@/shared/components/cards/PopoverDataCard';
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

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

interface UserTabsCardProps {
  id: string;
  data: UserResponse | undefined;
}

const InfoField = ({
  label,
  value,
  className,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
  valueClassName?: string;
}): JSX.Element => (
  <div className={cn('', className)}>
    <span className='block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-inter mb-1'>
      {label}
    </span>
    <p
      className={cn(
        'text-[14px] md:text-[15px] font-medium text-slate-700 dark:text-slate-200 font-inter',
        valueClassName
      )}
    >
      {value ?? '-'}
    </p>
  </div>
);

const StatusBadge = ({ isActive }: { isActive: boolean }): JSX.Element => (
  <span
    className={cn(
      'inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold font-inter',
      isActive
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    )}
  >
    {isActive ? 'Activo' : 'Inactivo'}
  </span>
);

const StatCard = ({
  label,
  count,
  popoverData,
  popoverTitle,
  firstValue,
  secondValue,
}: {
  label: string;
  count: number | undefined;
  popoverData: AllowedTypes | undefined;
  popoverTitle: string;
  firstValue: string;
  secondValue: string;
}): JSX.Element => (
  <div className='flex flex-col items-center p-2.5 rounded-lg bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/30'>
    <span className='text-lg font-bold text-slate-800 dark:text-slate-100 font-outfit'>
      {count ?? 0}
    </span>
    <span className='text-[10px] font-medium text-slate-500 dark:text-slate-400 font-inter uppercase tracking-wide mb-1'>
      {label}
    </span>
    <PopoverDataCard
      data={popoverData}
      title={popoverTitle}
      moduleName={'Usuario'}
      firstValue={firstValue}
      secondValue={secondValue}
    />
  </div>
);

export const UserTabsCard = ({ data, id }: UserTabsCardProps): JSX.Element => {
  //* Effects
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);

      if (url.pathname === '/users/search') url.pathname = `/users/search/${id}/view`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);

  const isActive = data?.recordStatus === RecordStatus.Active;

  return (
    <div className='w-full max-w-[680px] -mt-2 md:-mt-6'>
      {/* Header */}
      <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 dark:from-amber-600 dark:via-orange-600 dark:to-orange-700 px-4 py-4 md:px-6'>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-1.5 flex-wrap'>
              {data?.roles && data.roles.length > 0 && (
                <span className='px-2 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter'>
                  {data.roles.map((role) => UserRoleNames[role as UserRole]).join(' | ')}
                </span>
              )}
              <StatusBadge isActive={isActive} />
            </div>
            <h2 className='text-base md:text-xl font-bold text-white font-outfit line-clamp-2 break-words'>
              {data?.firstNames} {data?.lastNames}
            </h2>
            <p className='text-orange-100/80 text-[12px] md:text-[13px] font-inter mt-0.5 truncate'>
              {data?.email}
            </p>
          </div>

          <div className='flex-shrink-0 p-2 md:p-2.5 bg-white/10 rounded-lg'>
            <User className='w-5 h-5 md:w-6 md:h-6 text-white/90' />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue='general-info' className='w-full'>
        <TabsList className='w-full h-auto grid grid-cols-1 rounded-none bg-slate-100 dark:bg-slate-800/80 border-x border-slate-200/80 dark:border-slate-700/50 p-0'>
          <TabsTrigger
            value='general-info'
            className='text-[13px] md:text-[14px] font-inter font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 rounded-none py-2.5'
          >
            Información General
          </TabsTrigger>
        </TabsList>

        <TabsContent value='general-info' className='mt-0'>
          <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
            <div className='p-4 md:p-5 space-y-5'>
              {/* Info básica */}
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                <InfoField label='Nombres' value={data?.firstNames} />
                <InfoField label='Apellidos' value={data?.lastNames} />
                <InfoField
                  label='Género'
                  value={data?.gender ? GenderNames[data?.gender as Gender] : '-'}
                />
                <InfoField
                  label='Correo Electrónico'
                  value={data?.email}
                  className='col-span-1 md:col-span-1'
                />
                <InfoField
                  label='Usuario'
                  value={data?.userName}
                  className='col-span-1 md:col-span-1'
                />
              </div>

              {/* Roles */}
              <div>
                <InfoField
                  label='Roles'
                  value={
                    data?.roles && data?.roles.length > 0 ? (
                      <div className='flex flex-wrap gap-1'>
                        {data?.roles.map((role) => (
                          <span
                            key={role}
                            className='px-1.5 py-0.5 text-[11px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded font-inter'
                          >
                            {UserRoleNames[role as UserRole]}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className='text-red-500'>Sin roles</span>
                    )
                  }
                />
              </div>

              {/* Divider - Iglesias y Ministerios */}
              {((data?.churches && data.churches.length > 0 && typeof data.churches[0] !== 'string') ||
                (data?.ministries && data.ministries.length > 0 && typeof data.ministries[0] !== 'string')) && (
                  <>
                    <div className='border-t border-slate-200 dark:border-slate-700/50 pt-4'>
                      <span className='text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-inter'>
                        Iglesias y Ministerios
                      </span>
                    </div>

                    {/* Stats Grid */}
                    <div className='grid grid-cols-2 gap-2'>
                      {data?.churches && data.churches.length > 0 && typeof data.churches[0] !== 'string' && (
                        <StatCard
                          label='Iglesias'
                          count={data?.churches?.length}
                          popoverData={data?.churches as AllowedTypes}
                          popoverTitle='Iglesias'
                          firstValue='abbreviatedChurchName'
                          secondValue='urbanSector'
                        />
                      )}
                      {data?.ministries && data.ministries.length > 0 && typeof data.ministries[0] !== 'string' && (
                        <StatCard
                          label='Ministerios'
                          count={data?.ministries?.length}
                          popoverData={data?.ministries as AllowedTypes}
                          popoverTitle='Ministerios'
                          firstValue='ministryType'
                          secondValue='customMinistryName'
                        />
                      )}
                    </div>
                  </>
                )}

              {/* Divider - Registro */}
              <div className='border-t border-slate-200 dark:border-slate-700/50 pt-4'>
                <span className='text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-inter'>
                  Información de Registro
                </span>
              </div>

              {/* Registro Info */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <InfoField
                  label='Creado por'
                  value={
                    data?.createdBy
                      ? getInitialFullNames({
                        firstNames: data?.createdBy?.firstNames ?? '-',
                        lastNames: data?.createdBy?.lastNames ?? '-',
                      })
                      : '-'
                  }
                />
                <InfoField
                  label='Fecha de creación'
                  value={data?.createdAt ? `${formatDateToLimaDayMonthYear(data?.createdAt)}` : '-'}
                />
                <InfoField
                  label='Actualizado por'
                  value={
                    data?.updatedBy
                      ? getInitialFullNames({
                        firstNames: data?.updatedBy?.firstNames ?? '-',
                        lastNames: data?.updatedBy?.lastNames ?? '-',
                      })
                      : '-'
                  }
                />
                <InfoField
                  label='Última actualización'
                  value={data?.updatedAt ? `${formatDateToLimaDayMonthYear(data?.updatedAt)}` : '-'}
                />
              </div>

              {/* Inactivation info */}
              {data?.inactivationCategory && (
                <>
                  <div className='border-t border-red-200 dark:border-red-900/50 pt-4'>
                    <span className='text-[11px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider font-inter'>
                      Información de Inactivación
                    </span>
                  </div>

                  <div className='grid grid-cols-2 gap-4 p-3 rounded-lg bg-red-50/50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/30'>
                    <InfoField
                      label='Categoría'
                      value={
                        UserInactivationCategoryNames[
                        data?.inactivationCategory as UserInactivationCategory
                        ] ?? '-'
                      }
                      valueClassName='text-red-600 dark:text-red-400'
                    />
                    <InfoField
                      label='Motivo'
                      value={
                        UserInactivationReasonNames[
                        data?.inactivationReason as UserInactivationReason
                        ] ?? '-'
                      }
                      valueClassName='text-red-600 dark:text-red-400'
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
