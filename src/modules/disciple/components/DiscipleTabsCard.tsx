import { useEffect } from 'react';
import { FiMapPin, FiUsers } from 'react-icons/fi';

import { cn } from '@/shared/lib/utils';
import { formatDateToLimaDayMonthYear } from '@/shared/helpers/format-date-to-lima';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';

import { type DiscipleResponse } from '@/modules/disciple/types/disciple-response.interface';

import {
  type MemberInactivationCategory,
  MemberInactivationCategoryNames,
} from '@/shared/enums/member-inactivation-category.enum';
import {
  type MemberInactivationReason,
  MemberInactivationReasonNames,
} from '@/shared/enums/member-inactivation-reason.enum';
import { RecordStatus } from '@/shared/enums/record-status.enum';
import { type Gender, GenderNames } from '@/shared/enums/gender.enum';
import { type MemberRole, MemberRoleNames } from '@/shared/enums/member-role.enum';
import { MinistryMemberRole } from '@/modules/ministry/enums/ministry-member-role.enum';
import { type MinistryType, MinistryTypeNames } from '@/modules/ministry/enums/ministry-type.enum';
import { RelationType, RelationTypeModuleNames } from '@/shared/enums/relation-type.enum';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

interface DiscipleTabsCardProps {
  id: string;
  data: DiscipleResponse | undefined;
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

export const DiscipleTabsCard = ({ data, id }: DiscipleTabsCardProps): JSX.Element => {
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/disciples/search/${id}/view`;
      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);

  const isActive = data?.recordStatus === RecordStatus.Active;

  const allMinistryRoles = data?.member.ministries.flatMap((item) => item.ministryRoles);
  const allMinistryTypes = data?.member.ministries.flatMap(
    (item) =>
      `${MinistryTypeNames[item.ministryType as MinistryType]} ~ (${item.churchMinistryName})`
  );

  return (
    <div className='w-full md:min-w-[680px] -mt-2 md:-mt-6'>
      {/* Header */}
      <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 dark:from-blue-800 dark:via-blue-800 dark:to-blue-900 px-4 py-4 md:px-6'>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-1.5 flex-wrap'>
              <span className='px-2 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-100 rounded font-inter uppercase tracking-wider'>
                Discípulo
              </span>
              <StatusBadge isActive={isActive} />
            </div>
            <h2 className='text-base md:text-xl font-bold text-white font-outfit line-clamp-2 break-words'>
              {data?.member?.firstNames} {data?.member?.lastNames}
            </h2>
            <p className='text-blue-100/80 text-[12px] md:text-[13px] font-inter mt-0.5 truncate'>
              Código: {data?.id.split('-')[0] ?? '-'}
            </p>
          </div>

          <div className='flex-shrink-0 p-2 md:p-2.5 bg-white/10 rounded-lg'>
            <FiUsers className='w-5 h-5 md:w-6 md:h-6 text-white' />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue='general-info' className='w-full'>
        <TabsList className='w-full h-auto grid grid-cols-2 rounded-none bg-slate-100 dark:bg-slate-800/80 border-x border-slate-200/80 dark:border-slate-700/50 p-0'>
          <TabsTrigger
            value='general-info'
            className='text-[13px] md:text-[14px] font-inter font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 rounded-none py-2.5'
          >
            Información General
          </TabsTrigger>
          <TabsTrigger
            value='contact-info'
            className='text-[13px] md:text-[14px] font-inter font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 rounded-none py-2.5'
          >
            Contacto y Ubicación
          </TabsTrigger>
        </TabsList>

        {/* Tab: General */}
        <TabsContent value='general-info' className='mt-0'>
          <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
            <div className='p-4 md:p-5 space-y-5'>

              {/* Datos personales */}
              <div className='grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4'>
                <InfoField label='Nombres' value={data?.member?.firstNames} />
                <InfoField label='Apellidos' value={data?.member?.lastNames} />
                <InfoField
                  label='Género'
                  value={GenderNames[data?.member?.gender as Gender] ?? '-'}
                />
                <InfoField label='País Origen' value={data?.member?.originCountry} />
                <InfoField
                  label='Fecha de Nac.'
                  value={
                    data?.member?.birthDate
                      ? formatDateToLimaDayMonthYear(data.member.birthDate)
                      : '-'
                  }
                />
                <InfoField label='Edad' value={data?.member?.age} />
                <InfoField label='Estado Civil' value={data?.member?.maritalStatus} />
                <InfoField label='Nro. Hijos' value={data?.member?.numberChildren} />
                <InfoField
                  label='F. Conversión'
                  value={
                    data?.member?.conversionDate
                      ? formatDateToLimaDayMonthYear(data.member.conversionDate)
                      : '-'
                  }
                />
              </div>

              {/* Información Eclesiástica */}
              <div className='border-t border-slate-200 dark:border-slate-700/50 pt-4'>
                <span className='text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-inter'>
                  Información Eclesiástica
                </span>
                <div className='grid grid-cols-2 gap-4 mt-3'>
                  <InfoField
                    label='Tipo de Relación'
                    value={
                      data?.relationType
                        ? RelationTypeModuleNames['disciple'][data.relationType as RelationType]
                        : '-'
                    }
                  />
                  <InfoField
                    label='Iglesia'
                    value={data?.theirChurch?.abbreviatedChurchName ?? 'Sin asignar'}
                  />
                  <InfoField
                    label='Pastor'
                    value={
                      data?.theirPastor?.id
                        ? `${data.theirPastor.firstNames} ${data.theirPastor.lastNames}`
                        : 'Sin asignar'
                    }
                  />
                  <InfoField
                    label='Co-Pastor'
                    value={
                      data?.theirCopastor?.id
                        ? `${data.theirCopastor.firstNames} ${data.theirCopastor.lastNames}`
                        : 'Sin asignar'
                    }
                  />
                  <InfoField
                    label='Supervisor'
                    value={
                      data?.theirSupervisor?.id
                        ? `${data.theirSupervisor.firstNames} ${data.theirSupervisor.lastNames}`
                        : 'Sin asignar'
                    }
                  />
                  <InfoField
                    label='Zona'
                    value={
                      data?.theirZone?.id
                        ? `${data.theirZone.zoneName} (${data.theirZone.district})`
                        : 'Sin asignar'
                    }
                  />
                  <InfoField
                    label='Predicador'
                    value={
                      data?.theirPreacher?.id
                        ? `${data.theirPreacher.firstNames} ${data.theirPreacher.lastNames}`
                        : 'Sin asignar'
                    }
                  />
                  <InfoField
                    label='Grupo Familiar'
                    value={
                      data?.theirFamilyGroup?.id
                        ? `${data.theirFamilyGroup.familyGroupName} (${data.theirFamilyGroup.familyGroupCode})`
                        : 'Sin asignar'
                    }
                  />
                </div>

                <div className='grid grid-cols-2 gap-4 mt-3'>
                  <div className='space-y-1'>
                    <span className='block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-inter mb-1'>
                      Ministerios
                    </span>
                    <ul className='list-disc pl-4 text-sm text-slate-700 dark:text-slate-300 space-y-1 font-medium'>
                      {allMinistryTypes && allMinistryTypes.length > 0 ? (
                        allMinistryTypes.map((type, idx) => <li key={idx}>{type}</li>)
                      ) : (
                        <li className='list-none font-normal text-slate-500'>Sin ministerios</li>
                      )}
                    </ul>
                  </div>
                  <div className='space-y-1'>
                    <span className='block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-inter mb-1'>
                      Roles Ministeriales
                    </span>
                    <ul className='list-disc pl-4 text-sm text-slate-700 dark:text-slate-300 space-y-1 font-medium'>
                      {allMinistryRoles &&
                      allMinistryRoles.length > 0 &&
                      allMinistryRoles.filter((rol) => MemberRoleNames[rol as MinistryMemberRole])
                        .length > 0 ? (
                        allMinistryRoles
                          .filter((rol) => MemberRoleNames[rol as MinistryMemberRole])
                          .map((rol, idx) => (
                            <li key={idx}>{MemberRoleNames[rol as unknown as MemberRole]}</li>
                          ))
                      ) : (
                        <li className='list-none font-normal text-slate-500'>Sin roles</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Información de Registro */}
              <div className='border-t border-slate-200 dark:border-slate-700/50 pt-4'>
                <span className='text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-inter'>
                  Información de Registro
                </span>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <InfoField
                  label='Creado por'
                  value={data?.createdBy ? getInitialFullNames(data.createdBy) : '-'}
                />
                <InfoField
                  label='Fecha creación'
                  value={data?.createdAt ? formatDateToLimaDayMonthYear(data.createdAt) : '-'}
                />
                <InfoField
                  label='Actualizado por'
                  value={data?.updatedBy ? getInitialFullNames(data.updatedBy) : '-'}
                />
                <InfoField
                  label='Última actualización'
                  value={data?.updatedAt ? formatDateToLimaDayMonthYear(data.updatedAt) : '-'}
                />
              </div>

              {/* Información de Inactivación */}
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
                        MemberInactivationCategoryNames[
                          data.inactivationCategory as MemberInactivationCategory
                        ]
                      }
                      valueClassName='text-red-600 dark:text-red-400'
                    />
                    <InfoField
                      label='Motivo'
                      value={
                        MemberInactivationReasonNames[
                          data.inactivationReason as MemberInactivationReason
                        ]
                      }
                      valueClassName='text-red-600 dark:text-red-400'
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tab: Contacto */}
        <TabsContent value='contact-info' className='mt-0'>
          <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
            <div className='p-4 md:p-5 space-y-4'>

              {/* Contacto */}
              <div className='grid grid-cols-2 md:grid-cols-5 gap-4 pb-4'>
                <InfoField
                  label='Correo Electrónico'
                  value={data?.member?.email}
                  className='col-span-3'
                />
                <InfoField
                  label='Teléfono / Celular'
                  value={data?.member?.phoneNumber}
                  className='col-span-2'
                />
              </div>

              {/* Ubicación */}
              <div className='border-t border-slate-200 dark:border-slate-700/50 pt-4'>
                <span className='text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-inter'>
                  Ubicación de Residencia
                </span>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                <InfoField label='País' value={data?.member?.residenceCountry} />
                <InfoField label='Departamento' value={data?.member?.residenceDepartment} />
                <InfoField label='Provincia' value={data?.member?.residenceProvince} />
                <InfoField label='Distrito' value={data?.member?.residenceDistrict} />
                <InfoField label='Sector Urbano' value={data?.member?.residenceUrbanSector} />
              </div>

              {/* Dirección */}
              <div className='p-3 rounded-lg bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/30'>
                <div className='flex items-start gap-2.5'>
                  <div className='p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30 mt-0.5'>
                    <FiMapPin className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                  </div>
                  <div className='flex-1'>
                    <span className='text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-inter'>
                      Dirección
                    </span>
                    <p className='text-[14px] font-medium text-slate-700 dark:text-slate-200 font-inter mt-0.5'>
                      {data?.member?.residenceAddress ?? '-'}
                    </p>
                    {data?.member?.referenceAddress && (
                      <p className='text-[12px] text-slate-500 dark:text-slate-400 font-inter mt-1'>
                        <span className='font-medium'>Referencia:</span>{' '}
                        {data.member.referenceAddress}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Estado */}
              <div className='flex items-center justify-between p-3 rounded-lg bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/30'>
                <span className='text-[12px] font-semibold text-slate-600 dark:text-slate-300 font-inter'>
                  Estado del Registro
                </span>
                <StatusBadge isActive={isActive} />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
