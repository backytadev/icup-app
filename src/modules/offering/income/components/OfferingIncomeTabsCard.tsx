import { useEffect } from 'react';

import { cn } from '@/shared/lib/utils';
import { FileText, DollarSign } from 'lucide-react';

import {
  type OfferingIncomeCreationShiftType,
  OfferingIncomeCreationShiftTypeNames,
} from '@/modules/offering/income/enums/offering-income-creation-shift-type.enum';
import { MemberType, MemberTypeNames } from '@/modules/offering/income/enums/member-type.enum';
import { OfferingIncomeCreationType, OfferingIncomeCreationTypeNames } from '@/modules/offering/income/enums/offering-income-creation-type.enum';
import {
  OfferingIncomeCreationSubType,
  OfferingIncomeCreationSubTypeNames,
} from '@/modules/offering/income/enums/offering-income-creation-sub-type.enum';
import {
  OfferingIncomeCreationCategory,
  OfferingIncomeCreationCategoryNames,
} from '@/modules/offering/income/enums/offering-income-creation-category.enum';

import {
  formatDateToLimaTime,
  formatDateToLimaDayMonthYear,
} from '@/shared/helpers/format-date-to-lima';
import { RecordStatus } from '@/shared/enums/record-status.enum';
import { GenderNames, type Gender } from '@/shared/enums/gender.enum';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';
import { type OfferingIncomeResponse } from '@/modules/offering/income/interfaces/offering-income-response.interface';

import { CurrencyType, CurrencyTypeNames } from '@/modules/offering/shared/enums/currency-type.enum';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

interface OfferingIncomeTabsCardProps {
  id: string;
  data: OfferingIncomeResponse | undefined;
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

export const OfferingIncomeTabsCard = ({ data, id }: OfferingIncomeTabsCardProps): JSX.Element => {
  //* Effects
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);

      if (url.pathname === '/offerings/income/search')
        url.pathname = `/offerings/income/search/${id}/view`;

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
      <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 dark:from-emerald-800 dark:via-emerald-900 dark:to-teal-900 px-4 py-4 md:px-6'>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-1.5 flex-wrap'>
              <span className='px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-100 rounded font-inter'>
                Ingreso
              </span>
              <StatusBadge isActive={isActive} />
            </div>
            <h2 className='text-base md:text-xl font-bold text-white font-outfit line-clamp-2 break-words'>
              {OfferingIncomeCreationTypeNames[data?.type as OfferingIncomeCreationType ?? ''] ?? 'Ofrenda de Ingreso'}
            </h2>
            <p className='text-emerald-100/80 text-[12px] md:text-[13px] font-inter mt-0.5 truncate'>
              {OfferingIncomeCreationSubTypeNames[data?.subType as OfferingIncomeCreationSubType] ??
                '-'}{' '}
              • Código: {data?.receiptCode ?? '-'}
            </p>
          </div>

          <div className='flex-shrink-0 p-2 md:p-2.5 bg-white/10 rounded-lg'>
            <DollarSign className='w-5 h-5 md:w-6 md:h-6 text-white/90' />
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
                <InfoField
                  label='Tipo'
                  value={
                    OfferingIncomeCreationTypeNames[(data?.type as OfferingIncomeCreationType) ?? ''] ?? '-'
                  }
                />
                <InfoField
                  label='Sub-tipo'
                  value={
                    OfferingIncomeCreationSubTypeNames[data?.subType as OfferingIncomeCreationSubType] ?? '-'
                  }
                />
                <InfoField
                  label='Categoría'
                  value={
                    OfferingIncomeCreationCategoryNames[data?.category as OfferingIncomeCreationCategory] ?? '-'
                  }
                />
                {data?.shift && (
                  <InfoField
                    label='Turno'
                    value={
                      OfferingIncomeCreationShiftTypeNames[
                      data?.shift as OfferingIncomeCreationShiftType
                      ] ?? '-'
                    }
                  />
                )}
                <InfoField
                  label='Monto'
                  value={data?.amount ? `${data?.amount}` : '-'}
                  valueClassName='text-emerald-600 dark:text-emerald-400 font-semibold'
                />
                <InfoField
                  label='Divisa'
                  value={CurrencyTypeNames[data?.currency as CurrencyType ?? ''] ?? '-'}
                />
                <InfoField
                  label='Fecha'
                  value={data?.date ? formatDateToLimaDayMonthYear(data?.date) : '-'}
                />
              </div>

              {/* Recibo */}
              <div className='space-y-3'>
                <InfoField
                  label='Código de recibo'
                  value={data?.receiptCode ?? '-'}
                />

                {/* Archivos multimedia */}
                <div>
                  <span className='block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-inter mb-2'>
                    Archivos multimedia
                  </span>
                  <div className='p-3 rounded-lg bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/30'>
                    {data?.imageUrls?.length !== undefined && data?.imageUrls?.length > 0 ? (
                      <ul className='space-y-2'>
                        {data?.imageUrls?.map((image, index) => (
                          <li key={image}>
                            <a
                              className='flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors'
                              href={image}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              <FileText className='w-4 h-4 shrink-0' />
                              <span className='text-[13px] font-medium underline underline-offset-2 truncate'>
                                {data?.receiptCode ?? `Boleta ${index + 1}`}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className='text-[13px] text-red-500 dark:text-red-400'>
                        No hay imágenes adjuntadas.
                      </p>
                    )}
                  </div>
                </div>

                {/* Observaciones */}
                <InfoField
                  label={
                    data?.category === OfferingIncomeCreationCategory.ExternalDonation
                      ? 'Observaciones / Descripción'
                      : 'Detalles / Observaciones'
                  }
                  value={
                    data?.comments ? (
                      <span className='whitespace-pre-wrap'>{data?.comments}</span>
                    ) : (
                      '-'
                    )
                  }
                />
              </div>

              {/* Divider - Información del aportante */}
              {(data?.category === OfferingIncomeCreationCategory.ExternalDonation ||
                data?.category === OfferingIncomeCreationCategory.InternalDonation ||
                data?.subType === OfferingIncomeCreationSubType.FamilyGroup ||
                data?.subType === OfferingIncomeCreationSubType.ZonalFasting ||
                data?.subType === OfferingIncomeCreationSubType.ZonalVigil ||
                data?.subType === OfferingIncomeCreationSubType.ZonalEvangelism ||
                data?.subType === OfferingIncomeCreationSubType.ZonalUnitedService) && (
                  <>
                    <div className='border-t border-slate-200 dark:border-slate-700/50 pt-4'>
                      <span className='text-[11px] font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider font-inter'>
                        Información del aportante
                      </span>
                    </div>

                    {/* Donante externo */}
                    {data?.externalDonor?.id && (
                      <div className='p-3 rounded-lg bg-violet-50/50 dark:bg-violet-900/10 border border-violet-200/50 dark:border-violet-800/30'>
                        <span className='block text-[11px] font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-400 font-inter mb-2'>
                          Datos del donante
                        </span>
                        <div className='grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] md:text-[14px]'>
                          <p className='text-slate-700 dark:text-slate-300'>
                            <span className='font-semibold'>Nombres:</span>{' '}
                            {data?.externalDonor?.firstNames}
                          </p>
                          <p className='text-slate-700 dark:text-slate-300'>
                            <span className='font-semibold'>Apellidos:</span>{' '}
                            {data?.externalDonor?.lastNames}
                          </p>
                          <p className='text-slate-700 dark:text-slate-300'>
                            <span className='font-semibold'>Género:</span>{' '}
                            {GenderNames[data?.externalDonor?.gender as Gender] ?? 'Anónimo'}
                          </p>
                          <p className='text-slate-700 dark:text-slate-300'>
                            <span className='font-semibold'>F. Nacimiento:</span>{' '}
                            {formatDateToLimaDayMonthYear(data?.externalDonor?.birthDate) ===
                              '01/01/1900'
                              ? 'Anónimo'
                              : formatDateToLimaDayMonthYear(data?.externalDonor?.birthDate)}
                          </p>
                          <p className='text-slate-700 dark:text-slate-300'>
                            <span className='font-semibold'>País de origen:</span>{' '}
                            {data?.externalDonor?.originCountry ?? 'Anónimo'}
                          </p>
                          <p className='text-slate-700 dark:text-slate-300'>
                            <span className='font-semibold'>E-mail:</span>{' '}
                            {data?.externalDonor?.email ?? 'Anónimo'}
                          </p>
                          <p className='text-slate-700 dark:text-slate-300'>
                            <span className='font-semibold'>Teléfono:</span>{' '}
                            {data?.externalDonor?.phoneNumber ?? 'Anónimo'}
                          </p>
                          <p className='text-slate-700 dark:text-slate-300'>
                            <span className='font-semibold'>País de residencia:</span>{' '}
                            {data?.externalDonor?.residenceCountry ?? 'Anónimo'}
                          </p>
                          <p className='text-slate-700 dark:text-slate-300'>
                            <span className='font-semibold'>Ciudad de residencia:</span>{' '}
                            {data?.externalDonor?.residenceCity ?? 'Anónimo'}
                          </p>
                          <p className='text-slate-700 dark:text-slate-300'>
                            <span className='font-semibold'>Código Postal:</span>{' '}
                            {data?.externalDonor?.postalCode ?? 'Anónimo'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Miembro interno */}
                    {data?.memberType && data?.memberType !== MemberType.ExternalDonor && (
                      <div className='grid grid-cols-2 gap-4'>
                        <InfoField
                          label='Tipo de Miembro'
                          value={MemberTypeNames[data?.memberType as MemberType] ?? '-'}
                        />
                        <InfoField
                          label='Miembro'
                          value={
                            data?.disciple?.firstNames
                              ? `${data?.disciple?.firstNames} ${data?.disciple?.lastNames}`
                              : data?.preacher?.firstNames
                                ? `${data?.preacher?.firstNames} ${data?.preacher?.lastNames}`
                                : data?.supervisor?.firstNames
                                  ? `${data?.supervisor?.firstNames} ${data?.supervisor?.lastNames}`
                                  : data?.copastor?.firstNames
                                    ? `${data?.copastor?.firstNames} ${data?.copastor?.lastNames}`
                                    : data?.pastor?.firstNames
                                      ? `${data?.pastor?.firstNames} ${data?.pastor?.lastNames}`
                                      : '-'
                          }
                        />
                      </div>
                    )}

                    {/* Zona */}
                    {data?.zone?.id && (
                      <InfoField
                        label='Zona'
                        value={
                          <>
                            <p className='mb-1'>
                              <span className='font-medium'>Nombre y distrito:</span>{' '}
                              {data?.zone?.zoneName} - {data?.zone?.district}
                            </p>
                            <p>
                              <span className='font-medium'>Supervisor:</span>{' '}
                              {data?.zone?.supervisorFirstNames} {data?.zone?.supervisorLastNames}
                            </p>
                          </>
                        }
                      />
                    )}

                    {/* Grupo Familiar */}
                    {data?.familyGroup?.id && (
                      <InfoField
                        label='Grupo Familiar'
                        value={
                          <>
                            <p className='mb-1'>
                              <span className='font-medium'>Nombre y código:</span>{' '}
                              {data?.familyGroup?.familyGroupName}{' '}
                              {`(${data?.familyGroup?.familyGroupCode})`} ~{' '}
                              {data?.familyGroup?.urbanSector}
                            </p>
                            <p>
                              <span className='font-medium'>Predicador(a):</span>{' '}
                              {data?.familyGroup?.preacherFirstNames}{' '}
                              {data?.familyGroup?.preacherLastNames}
                            </p>
                          </>
                        }
                      />
                    )}
                  </>
                )}

              {/* Divider - Información de pertenencia */}
              <div className='border-t border-slate-200 dark:border-slate-700/50 pt-4'>
                <span className='text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-inter'>
                  Información de pertenencia
                </span>
              </div>

              {/* Iglesia */}
              {data?.church?.id && (
                <InfoField
                  label='Iglesia'
                  value={`${data?.church?.abbreviatedChurchName} - ${data?.church?.district}`}
                />
              )}

              {/* Divider - Información del registro */}
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
                  value={
                    data?.createdAt
                      ? `${formatDateToLimaDayMonthYear(data?.createdAt)} - ${formatDateToLimaTime(data?.createdAt)}`
                      : '-'
                  }
                  className='col-span-2 md:col-span-1'
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
                  value={
                    data?.updatedAt
                      ? `${formatDateToLimaDayMonthYear(data?.updatedAt)} - ${formatDateToLimaTime(data?.updatedAt)}`
                      : '-'
                  }
                  className='col-span-2 md:col-span-1'
                />
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
      </Tabs>
    </div>
  );
};
