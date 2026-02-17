import { useEffect } from 'react';

import { cn } from '@/shared/lib/utils';
import { FileText, Receipt } from 'lucide-react';

import { OfferingExpenseSearchType, OfferingExpenseSearchTypeNames } from '@/modules/offering/expense/enums/offering-expense-search-type.enum';
import { OfferingExpenseSearchSubType, OfferingExpenseSearchSubTypeNames } from '@/modules/offering/expense/enums/offering-expense-search-sub-type.enum';

import {
  formatDateToLimaTime,
  formatDateToLimaDayMonthYear,
} from '@/shared/helpers/format-date-to-lima';
import { RecordStatus } from '@/shared/enums/record-status.enum';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';
import { type OfferingExpenseResponse } from '@/modules/offering/expense/interfaces/offering-expense-response.interface';

import { CurrencyType, CurrencyTypeNames } from '@/modules/offering/shared/enums/currency-type.enum';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

interface OfferingExpenseTabsCardProps {
  id: string;
  data: OfferingExpenseResponse | undefined;
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

export const OfferingExpenseTabsCard = ({ data, id }: OfferingExpenseTabsCardProps): JSX.Element => {
  //* Effects
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);

      if (url.pathname === '/offerings/expenses/general-search')
        url.pathname = `/offerings/expenses/general-search/${id}/view`;

      if (url.pathname === '/offerings/expenses/search-by-term')
        url.pathname = `/offerings/expenses/search-by-term/${id}/view`;

      if (url.pathname === '/offerings/expenses/update')
        url.pathname = `/offerings/expenses/update/${id}/view`;

      if (url.pathname === '/offerings/expenses/inactivate')
        url.pathname = `/offerings/expenses/inactivate/${id}/view`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);

  const isActive = data?.recordStatus === RecordStatus.Active;

  return (
    <div className='w-full max-w-[880px] -mt-2 md:-mt-6'>
      {/* Header */}
      <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-orange-600 via-red-600 to-rose-700 dark:from-orange-800 dark:via-red-800 dark:to-rose-900 px-4 py-4 md:px-6'>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-1.5 flex-wrap'>
              <span className='px-2 py-0.5 text-[10px] font-semibold bg-orange-500/20 text-orange-100 rounded font-inter'>
                Gasto
              </span>
              <StatusBadge isActive={isActive} />
            </div>
            <h2 className='text-base md:text-xl font-bold text-white font-outfit line-clamp-2 break-words'>
              {OfferingExpenseSearchTypeNames[(data?.type ?? '') as OfferingExpenseSearchType] ?? 'Salida de Ofrenda'}
            </h2>
            <p className='text-orange-100/80 text-[12px] md:text-[13px] font-inter mt-0.5 truncate'>
              {OfferingExpenseSearchSubTypeNames[(data?.subType ?? '') as OfferingExpenseSearchSubType] ?? '-'}
            </p>
          </div>

          <div className='flex-shrink-0 p-2 md:p-2.5 bg-white/10 rounded-lg'>
            <Receipt className='w-5 h-5 md:w-6 md:h-6 text-white/90' />
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
                  value={OfferingExpenseSearchTypeNames[(data?.type ?? '') as OfferingExpenseSearchType] ?? '-'}
                />
                <InfoField
                  label='Sub-tipo'
                  value={OfferingExpenseSearchSubTypeNames[(data?.subType ?? '') as OfferingExpenseSearchSubType] ?? '-'}
                />
                <InfoField
                  label='Monto'
                  value={data?.amount ? `${data?.amount}` : '-'}
                  valueClassName='text-orange-600 dark:text-orange-400 font-semibold'
                />
                <InfoField
                  label='Divisa'
                  value={CurrencyTypeNames[data?.currency as CurrencyType ?? ''] ?? '-'}
                />
                <InfoField
                  label='Fecha del gasto'
                  value={data?.date ? formatDateToLimaDayMonthYear(data?.date) : '-'}
                  className='col-span-2'
                />
              </div>

              {/* Detalles y archivos */}
              <div className='space-y-3'>
                {/* Observaciones */}
                <InfoField
                  label='Detalles / Observaciones'
                  value={
                    data?.comments ? (
                      <span className='whitespace-pre-wrap'>{data?.comments}</span>
                    ) : (
                      '-'
                    )
                  }
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
                              className='flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors'
                              href={image}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              <FileText className='w-4 h-4 shrink-0' />
                              <span className='text-[13px] font-medium underline underline-offset-2 truncate'>
                                Recibo {index + 1}
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
              </div>

              {/* Divider - Información de pertenencia */}
              <div className='border-t border-slate-200 dark:border-slate-700/50 pt-4'>
                <span className='text-[11px] font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider font-inter'>
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
