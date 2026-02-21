import { useState } from 'react';

import { cn } from '@/shared/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Card } from '@/shared/components/ui/card';
import { getIncomeDetailByType } from '@/modules/metrics/services/offering-comparative-metrics.service';
import { OfferingIncomeCreationTypeNames } from '@/modules/offering/income/enums/offering-income-creation-type.enum';
import { OfferingIncomeCreationSubTypeNames } from '@/modules/offering/income/enums/offering-income-creation-sub-type.enum';
import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

interface IncomeSummaryCardProps {
  year?: string;
  startMonth?: string;
  endMonth?: string;
  currency?: string;
  data: {
    label: string;
    amount: number;
    pen: number;
    usd: number;
    eur: number;
  };
}

const combinedArray = [
  ...Object.entries(OfferingIncomeCreationSubTypeNames).map(([key, value]) => ({ key, value })),
  ...Object.entries(OfferingIncomeCreationTypeNames).map(([key, value]) => ({ key, value })),
];

const getKeyBySpanishValue = (label: string): string | undefined => {
  return combinedArray.find((item) => item.value.trim() === label.trim())?.key;
};

export const IncomeSummaryCard = ({
  year,
  startMonth,
  endMonth,
  data,
}: IncomeSummaryCardProps) => {
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  const [open, setOpen] = useState<boolean>(false);

  const offeringType = getKeyBySpanishValue(data.label) ?? '';

  //* Query
  const getIncomeDetailByTypeQuery = useQuery({
    queryKey: ['income-detail-by-type', startMonth, endMonth, offeringType, activeChurchId],
    queryFn: () =>
      getIncomeDetailByType({
        churchId: activeChurchId ?? '',
        year: year ?? '',
        startMonth: startMonth ?? '',
        endMonth: endMonth ?? '',
        type: offeringType ?? '',
      }),
    retry: false,
    enabled: false,
  });

  const handleSearch = async (): Promise<void> => {
    setOpen(true);
    await getIncomeDetailByTypeQuery.refetch();
  };

  return (
    <>
      <Card
        onClick={handleSearch}
        className={cn(
          'rounded-2xl p-4 sm:p-5 md:p-6 transition-all duration-300 cursor-pointer',
          'bg-white dark:bg-slate-900',
          'border border-slate-300 dark:border-slate-700',
          'hover:scale-[1.015] hover:shadow-2xl shadow-lg dark:shadow-xl'
        )}
      >
        <div className='flex items-start justify-between gap-4 mb-6'>
          <div className='flex-1 min-w-0'>
            <p className='text-[13px] uppercase tracking-wide text-slate-500 dark:text-slate-400'>
              Resumen
            </p>

            <h2 className='text-2xl 2xl:text-[35px] font-bold text-slate-800 dark:text-slate-100 break-words leading-tight'>
              {data.label}
            </h2>
          </div>

          <div className='flex-shrink-0 h-11 w-11 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center border border-green-200 dark:border-green-800'>
            <ArrowUpRight className='h-6 w-6 text-green-600 dark:text-green-400' />
          </div>
        </div>

        <div className='space-y-5'>
          {data.pen > 0 && (
            <div className='flex flex-col gap-1'>
              <span className='text-sm 2xl:text-xl text-slate-600 dark:text-slate-400 font-medium'>
                Soles (PEN)
              </span>
              <span className='text-3xl 2xl:text-[45px] font-extrabold text-green-600 dark:text-green-400'>
                {data.pen.toLocaleString('es-PE')}
              </span>
            </div>
          )}

          {data.usd > 0 && (
            <div className='flex flex-col gap-1'>
              <span className='text-sm 2xl:text-lg text-slate-600 dark:text-slate-400 font-medium'>
                Dólares (USD)
              </span>
              <span className='text-2xl 2xl:text-[32px] font-bold text-slate-800 dark:text-slate-200'>
                {data.usd.toLocaleString('en-US')}
              </span>
            </div>
          )}

          {data.eur > 0 && (
            <div className='flex flex-col gap-1'>
              <span className='text-sm 2xl:text-lg text-slate-600 dark:text-slate-400 font-medium'>
                Euros (EUR)
              </span>
              <span className='text-2xl 2xl:text-[32px] font-bold text-slate-800 dark:text-slate-200'>
                {data.eur.toLocaleString('de-DE')}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            'w-[90vw] h-[80vh] md:w-[80vw] md:max-w-[80vw] xl:w-[60vw] xl:max-w-[60vw] lg:h-[60vh] overflow-y-auto py-6 px-8 md:p-10 rounded-2xl',
            'bg-white dark:bg-slate-900',
            'border border-slate-300 dark:border-slate-700',
            'shadow-2xl'
          )}
        >
          <DialogHeader>
            <DialogTitle className='text-3xl md:text-4xl 2xl:text-5xl font-bold text-slate-800 dark:text-slate-100'>
              <span className='block md:hidden'>
                Detalle mensual
                <br />
                <span className='text-green-600 dark:text-green-400'>{data.label}</span>
              </span>

              <span className='hidden md:inline'>
                Detalle mensual —{' '}
                <span className='text-green-600 dark:text-green-400'>{data.label}</span>
              </span>
            </DialogTitle>

            <DialogDescription className='text-xl md:text-2xl 2xl:text-3xl text-slate-600 dark:text-slate-400 mt-2'>
              Información detallada desde{' '}
              <strong>{getIncomeDetailByTypeQuery.data?.[0]?.month}</strong> hasta{' '}
              <strong>{getIncomeDetailByTypeQuery.data?.at(-1)?.month}</strong>.
            </DialogDescription>
          </DialogHeader>

          {getIncomeDetailByTypeQuery.isLoading && (
            <div className='flex justify-center items-center py-20'>
              <p className='text-xl md:text-2xl 2xl:text-4xl text-slate-500'>Cargando datos...</p>
            </div>
          )}

          {!getIncomeDetailByTypeQuery.isLoading &&
            getIncomeDetailByTypeQuery.data?.length === 0 && (
              <div className='flex justify-center items-center py-20'>
                <p className='text-2xl text-slate-500'>No hay datos disponibles.</p>
              </div>
            )}

          <div className='flex justify-center items-start mt-10 w-full'>
            <div className='w-full max-w-7xl grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-10'>
              {getIncomeDetailByTypeQuery?.data?.map((item: any) => (
                <div
                  key={item.month}
                  className={cn(
                    'rounded-2xl p-8 transition-all duration-300d',
                    'bg-slate-50 dark:bg-slate-800/40',
                    'border border-slate-200 dark:border-slate-700',
                    'hover:shadow-xl hover:scale-[1.01]'
                  )}
                >
                  <p className='text-3xl lg:text-4xl 2xl:text-[40px] font-extrabold text-slate-800 dark:text-slate-100 mb-6'>
                    {item.month}
                  </p>

                  <div className='mb-8'>
                    <p className='text-xl 2xl:text-3xl text-slate-600 dark:text-slate-400'>
                      Soles (PEN)
                    </p>

                    <p className='text-4xl md:text-5xl 2xl:text-6xl font-extrabold text-green-600 dark:text-green-400 mt-1'>
                      {item.accumulatedOfferingPEN.toLocaleString('es-PE')}
                    </p>
                  </div>

                  {item.accumulatedOfferingUSD > 0 && (
                    <div className='mb-6'>
                      <p className='text-lg 2xl:text-xl text-slate-600 dark:text-slate-400'>
                        Dólares (USD)
                      </p>

                      <p className='text-3xl 2xl:text-4xl font-bold text-slate-800 dark:text-slate-100 mt-1'>
                        {item.accumulatedOfferingUSD.toLocaleString('es-PE')}
                      </p>
                    </div>
                  )}

                  {item.accumulatedOfferingEUR > 0 && (
                    <div className='mb-6'>
                      <p className='text-lg 2xl:text-xl text-slate-600 dark:text-slate-400'>
                        Euros (EUR)
                      </p>

                      <p className='text-3xl 2xl:text-4xl font-bold text-slate-800 dark:text-slate-100 mt-1'>
                        {item.accumulatedOfferingEUR.toLocaleString('es-PE')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
