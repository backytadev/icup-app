import { useEffect } from 'react';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FiCalendar } from 'react-icons/fi';
import { Globe, Image as ImageIcon, Lock, MapPin, Users } from 'lucide-react';

import { type CalendarEventResponse } from '@/modules/calendar-event/types';
import { CalendarEventCategoryNames } from '@/modules/calendar-event/enums/calendar-event-category.enum';
import { CalendarEventStatusNames } from '@/modules/calendar-event/enums/calendar-event-status.enum';
import { CalendarEventTargetGroupNames } from '@/modules/calendar-event/enums/calendar-event-target-group.enum';

import { cn } from '@/shared/lib/utils';
import { RecordStatus } from '@/shared/enums/record-status.enum';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';
import { formatDateToLimaDayMonthYear, formatDateToLimaTime } from '@/shared/helpers/format-date-to-lima';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

interface CalendarEventTabsCardProps {
  id: string;
  data: CalendarEventResponse | undefined;
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
    <p className={cn('text-[14px] md:text-[15px] font-medium text-slate-700 dark:text-slate-200 font-inter', valueClassName)}>
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
        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    )}
  >
    {isActive ? 'Activo' : 'Inactivo'}
  </span>
);

const formatDateTime = (date: Date | undefined): string => {
  if (!date) return '-';
  return format(new Date(date), "dd 'de' MMMM yyyy 'a las' HH:mm", { locale: es });
};

export const CalendarEventTabsCard = ({ id, data }: CalendarEventTabsCardProps): JSX.Element => {
  useEffect(() => {
    const originalUrl = window.location.href;
    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/calendar-events/search/${id}/view`;
      window.history.replaceState({}, '', url);
    }
    return () => { window.history.replaceState({}, '', originalUrl); };
  }, [id]);

  const isActive = data?.recordStatus === RecordStatus.Active;

  const categoryName = data?.category
    ? (CalendarEventCategoryNames[data.category as keyof typeof CalendarEventCategoryNames] ?? data.category)
    : null;

  const statusName = data?.status
    ? (CalendarEventStatusNames[data.status as keyof typeof CalendarEventStatusNames] ?? data.status)
    : null;

  return (
    <div className='w-full max-w-[680px] -mt-2 md:-mt-6'>

      {/* Header */}
      <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-teal-600 via-teal-600 to-cyan-700 dark:from-teal-800 dark:via-teal-800 dark:to-cyan-900 px-4 py-4 md:px-6'>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-1.5 flex-wrap'>
              <span className='px-2 py-0.5 text-[10px] font-semibold bg-teal-500/20 text-teal-100 rounded font-inter uppercase tracking-wider'>
                Evento
              </span>
              {categoryName && (
                <span className='px-2 py-0.5 text-[10px] font-semibold bg-white/10 text-teal-100 rounded font-inter'>
                  {categoryName}
                </span>
              )}
              <StatusBadge isActive={isActive} />
              {data?.isPublic !== undefined && (
                <span className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold',
                  data.isPublic ? 'bg-sky-400/20 text-sky-100' : 'bg-white/10 text-teal-100',
                )}>
                  {data.isPublic ? <><Globe className='w-3 h-3' /> Público</> : <><Lock className='w-3 h-3' /> Privado</>}
                </span>
              )}
            </div>
            <h2 className='text-base md:text-xl font-bold text-white font-outfit line-clamp-2 break-words'>
              {data?.title ?? 'Evento'}
            </h2>
            <p className='text-teal-100/80 text-[12px] md:text-[13px] font-inter mt-0.5 truncate'>
              Código: {data?.id.split('-')[0] ?? '-'}
            </p>
          </div>
          <div className='flex-shrink-0 p-2 md:p-2.5 bg-white/10 rounded-lg'>
            <FiCalendar className='w-5 h-5 md:w-6 md:h-6 text-white' />
          </div>
        </div>
      </div>

      {/* Single tab */}
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

              {/* Datos básicos */}
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                <InfoField label='Categoría' value={categoryName ?? '-'} />
                <InfoField label='Estado del Evento' value={statusName ?? '-'} />
                <InfoField
                  label='Visibilidad'
                  value={
                    data?.isPublic !== undefined ? (
                      <span className={cn(
                        'inline-flex items-center gap-1 text-[13.5px] font-medium',
                        data.isPublic ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400',
                      )}>
                        {data.isPublic
                          ? <><Globe className='w-3.5 h-3.5' /> Público</>
                          : <><Lock className='w-3.5 h-3.5' /> Privado</>}
                      </span>
                    ) : '-'
                  }
                />
              </div>

              {/* Descripción */}
              <InfoField label='Descripción' value={data?.description} />

              {/* Fecha y Hora */}
              <div className='border-t border-slate-200 dark:border-slate-700/50 pt-4'>
                <span className='text-[11px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider font-inter'>
                  Fecha y Hora
                </span>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <InfoField label='Inicio' value={formatDateTime(data?.startDate)} />
                <InfoField
                  label='Fin'
                  value={data?.endDate ? formatDateTime(data.endDate) : 'No definido'}
                />
              </div>

              {/* Grupos Objetivo */}
              <div className='border-t border-slate-200 dark:border-slate-700/50 pt-4'>
                <span className='text-[11px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider font-inter'>
                  Grupos Objetivo
                </span>
              </div>
              <div>
                {data?.targetGroups?.length ? (
                  <div className='flex flex-wrap gap-2'>
                    {data.targetGroups.map((group) => (
                      <span
                        key={group}
                        className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50'
                      >
                        <Users className='w-3 h-3' />
                        {CalendarEventTargetGroupNames[group as keyof typeof CalendarEventTargetGroupNames] ?? group}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className='text-[13.5px] text-slate-500 dark:text-slate-400 font-inter'>Sin grupos asignados</p>
                )}
              </div>

              {/* Ubicación */}
              {(data?.locationName ?? data?.locationReference ?? data?.latitude) && (
                <>
                  <div className='border-t border-slate-200 dark:border-slate-700/50 pt-4'>
                    <span className='text-[11px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider font-inter'>
                      Ubicación
                    </span>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {data?.locationName && (
                      <InfoField label='Nombre del Lugar' value={data.locationName} />
                    )}
                    {data?.locationReference && (
                      <InfoField label='Referencia' value={data.locationReference} />
                    )}
                  </div>
                  {(data?.latitude ?? data?.longitude) && (
                    <div className='p-3 rounded-lg bg-teal-50/80 dark:bg-teal-900/20 border border-teal-200/60 dark:border-teal-800/30'>
                      <div className='flex items-center gap-2.5'>
                        <div className='p-1.5 rounded-md bg-teal-100 dark:bg-teal-900/30'>
                          <MapPin className='w-4 h-4 text-teal-600 dark:text-teal-400' />
                        </div>
                        <div>
                          <span className='text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-inter'>
                            Coordenadas GPS
                          </span>
                          <p className='text-[13.5px] font-medium text-teal-700 dark:text-teal-300 font-mono mt-0.5'>
                            {data?.latitude}, {data?.longitude}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Imágenes del Evento */}
              <div className='border-t border-slate-200 dark:border-slate-700/50 pt-4'>
                <span className='text-[11px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider font-inter'>
                  Imágenes del Evento
                </span>
              </div>
              <div className='p-3 rounded-lg bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/30'>
                {data?.imageUrls?.length ? (
                  <ul className='space-y-2'>
                    {data.imageUrls.map((url, idx) => (
                      <li key={url}>
                        <a
                          href={url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors'
                        >
                          <ImageIcon className='w-4 h-4 shrink-0' />
                          <span className='text-[13px] font-medium underline underline-offset-2 truncate'>
                            Imagen {idx + 1}
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
                  label='Fecha de creación'
                  value={
                    data?.createdAt
                      ? `${formatDateToLimaDayMonthYear(data.createdAt)} - ${formatDateToLimaTime(data.createdAt)}`
                      : '-'
                  }
                  className='col-span-2 md:col-span-1'
                />
                <InfoField
                  label='Actualizado por'
                  value={data?.updatedBy ? getInitialFullNames(data.updatedBy) : '-'}
                />
                <InfoField
                  label='Última actualización'
                  value={
                    data?.updatedAt
                      ? `${formatDateToLimaDayMonthYear(data.updatedAt)} - ${formatDateToLimaTime(data.updatedAt)}`
                      : '-'
                  }
                  className='col-span-2 md:col-span-1'
                />
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
