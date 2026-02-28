/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { FiHome, FiMapPin } from 'react-icons/fi';

import { type FamilyGroupResponse } from '@/modules/family-group/types';
import { FamilyGroupServiceTime, FamilyGroupServiceTimeNames } from '@/modules/family-group/enums';
import {
  type FamilyGroupInactivationReason,
  FamilyGroupInactivationReasonNames,
} from '@/modules/family-group/enums/family-group-inactivation-reason.enum';
import {
  type FamilyGroupInactivationCategory,
  FamilyGroupInactivationCategoryNames,
} from '@/modules/family-group/enums/family-group-inactivation-category.enum';

import { cn } from '@/shared/lib/utils';
import { RecordStatus } from '@/shared/enums/record-status.enum';
import { formatDateToLimaDayMonthYear } from '@/shared/helpers/format-date-to-lima';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';
import { PopoverDataCard, type AllowedTypes } from '@/shared/components/cards/PopoverDataCard';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

interface FamilyGroupTabsCardProps {
  id: string;
  data: FamilyGroupResponse | undefined;
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
      moduleName={'Grupo Familiar'}
      firstValue={firstValue}
      secondValue={secondValue}
    />
  </div>
);

export const FamilyGroupTabsCard = ({ data, id }: FamilyGroupTabsCardProps): JSX.Element => {
  //* Effects
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/family-groups/search/${id}/view`;
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
      <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900 px-4 py-4 md:px-6'>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-1.5 flex-wrap'>
              <StatusBadge isActive={isActive} />
            </div>
            <h2 className='text-base md:text-xl font-bold text-white font-outfit line-clamp-2 break-words'>
              {data?.familyGroupName ?? 'Sin nombre'}
            </h2>
            <p className='text-blue-100/80 text-[12px] md:text-[13px] font-inter mt-0.5 truncate'>
              {data?.familyGroupCode ?? '-'} · Zona: {data?.theirZone?.zoneName ?? '-'}
            </p>
          </div>

          <div className='flex-shrink-0 p-2 md:p-2.5 bg-white/10 rounded-lg'>
            <FiHome className='w-5 h-5 md:w-6 md:h-6 text-white/90' />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue='general-info' className='w-full'>
        <TabsList className='w-full h-auto grid grid-cols-3 rounded-none bg-slate-100 dark:bg-slate-800/80 border-x border-slate-200/80 dark:border-slate-700/50 p-0'>
          <TabsTrigger
            value='general-info'
            className='text-[13px] md:text-[14px] font-inter font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 rounded-none py-2.5'
          >
            Información General
          </TabsTrigger>
          <TabsTrigger
            value='ecclesiastical-info'
            className='text-[13px] md:text-[14px] font-inter font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 rounded-none py-2.5'
          >
            Info Eclesiástica
          </TabsTrigger>
          <TabsTrigger
            value='contact-info'
            className='text-[13px] md:text-[14px] font-inter font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 rounded-none py-2.5'
          >
            Contacto
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: General */}
        <TabsContent value='general-info' className='mt-0'>
          <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
            <div className='p-4 md:p-5 space-y-5'>
              {/* Info básica */}
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                <InfoField label='Nombre' value={data?.familyGroupName ?? '-'} />
                <InfoField label='Código' value={data?.familyGroupCode ?? '-'} />
                <InfoField label='Número' value={data?.familyGroupNumber ?? '-'} />
                <InfoField
                  label='Horario de culto'
                  value={
                    FamilyGroupServiceTimeNames[data?.serviceTime as FamilyGroupServiceTime] ?? '-'
                  }
                />
                <InfoField label='Zona' value={data?.theirZone?.zoneName ?? '-'} />
              </div>

              {/* Divider - Membresía */}
              <div className='border-t border-slate-200 dark:border-slate-700/50 pt-4'>
                <span className='text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-inter'>
                  Membresía
                </span>
              </div>

              {/* Stats */}
              <div className='grid grid-cols-1 gap-2 max-w-[200px]'>
                <StatCard
                  label='Discípulos'
                  count={data?.disciples?.length}
                  popoverData={data?.disciples}
                  popoverTitle='Discípulos'
                  firstValue='firstNames'
                  secondValue='lastNames'
                />
              </div>

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
                  value={data?.createdAt ? formatDateToLimaDayMonthYear(data?.createdAt) : '-'}
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
                  value={data?.updatedAt ? formatDateToLimaDayMonthYear(data?.updatedAt) : '-'}
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
                        FamilyGroupInactivationCategoryNames[
                          data?.inactivationCategory as FamilyGroupInactivationCategory
                        ] ?? '-'
                      }
                      valueClassName='text-red-600 dark:text-red-400'
                    />
                    <InfoField
                      label='Motivo'
                      value={
                        FamilyGroupInactivationReasonNames[
                          data?.inactivationReason as FamilyGroupInactivationReason
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

        {/* Tab 2: Ecclesiastical */}
        <TabsContent value='ecclesiastical-info' className='mt-0 w-auto md:w-[680px]'>
          <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
            <div className='p-4 md:p-5 space-y-5'>
              {/* Relaciones eclesiásticas */}
              <div className='grid grid-cols-2 gap-4'>
                <InfoField
                  label='Iglesia'
                  value={
                    data?.theirChurch?.id ? data?.theirChurch?.abbreviatedChurchName : 'Sin asignar'
                  }
                />
                <InfoField
                  label='Pastor'
                  value={
                    data?.theirPastor?.id
                      ? `${data?.theirPastor?.firstNames} ${data?.theirPastor?.lastNames}`
                      : 'Sin asignar'
                  }
                />
                <InfoField
                  label='Co-Pastor'
                  value={
                    data?.theirCopastor?.id
                      ? `${data?.theirCopastor?.firstNames} ${data?.theirCopastor?.lastNames}`
                      : 'Sin asignar'
                  }
                />
                <InfoField
                  label='Supervisor'
                  value={
                    data?.theirSupervisor?.id
                      ? `${data?.theirSupervisor?.firstNames} ${data?.theirSupervisor?.lastNames}`
                      : 'Sin asignar'
                  }
                />
                <InfoField
                  label='Zona'
                  value={data?.theirZone?.id ? data?.theirZone?.zoneName : 'Sin asignar'}
                />
                <InfoField
                  label='Predicador'
                  value={
                    data?.theirPreacher?.id
                      ? `${data?.theirPreacher?.firstNames} ${data?.theirPreacher?.lastNames}`
                      : 'Sin asignar'
                  }
                />
              </div>

              {/* Family group location block */}
              <div className='p-3 rounded-lg bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/30'>
                <div className='flex items-start gap-2.5'>
                  <div className='p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30 mt-0.5'>
                    <FiMapPin className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                  </div>
                  <div className='flex-1'>
                    <span className='text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-inter'>
                      Grupo Familiar
                    </span>
                    <p className='text-[14px] font-medium text-slate-700 dark:text-slate-200 font-inter mt-0.5'>
                      {data?.familyGroupName ?? '-'} ({data?.familyGroupCode ?? '-'})
                    </p>
                    <p className='text-[12px] text-slate-500 dark:text-slate-400 font-inter mt-0.5'>
                      {data?.district ?? '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className='flex items-center justify-between p-3 rounded-lg bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/30'>
                <span className='text-[12px] font-semibold text-slate-600 dark:text-slate-300 font-inter'>
                  Estado del Registro
                </span>
                <StatusBadge isActive={isActive} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Contact */}
        <TabsContent value='contact-info' className='mt-0 w-auto md:w-[680px]'>
          <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
            <div className='p-4 md:p-5 space-y-5'>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                <InfoField label='País' value={data?.country ?? '-'} />
                <InfoField label='Departamento' value={data?.department ?? '-'} />
                <InfoField label='Provincia' value={data?.province ?? '-'} />
                <InfoField label='Distrito' value={data?.district ?? '-'} />
                <InfoField label='Sector Urbano' value={data?.urbanSector ?? '-'} />
                <InfoField label='Dirección' value={data?.address ?? '-'} />
              </div>

              {data?.referenceAddress && (
                <div className='p-3 rounded-lg bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/30'>
                  <span className='text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-inter'>
                    Referencia de Dirección
                  </span>
                  <p className='text-[14px] font-medium text-slate-700 dark:text-slate-200 font-inter mt-1'>
                    {data.referenceAddress}
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
