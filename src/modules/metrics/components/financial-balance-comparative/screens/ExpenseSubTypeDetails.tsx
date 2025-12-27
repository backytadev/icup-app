import { useQuery } from '@tanstack/react-query';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { getExpenseDetailBySubType } from '@/modules/metrics/services/offering-comparative-metrics.service';

interface ExpenseSubTypeDetailProps {
  churchId?: string;
  year?: string;
  selectedMonth: string | null;
  offeringType: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ExpenseSubTypeDetails = ({
  churchId,
  year,
  selectedMonth,
  offeringType,
  open,
  setOpen,
}: ExpenseSubTypeDetailProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['expense-detail-by-sub-type', selectedMonth, offeringType, churchId],
    queryFn: () =>
      getExpenseDetailBySubType({
        churchId: churchId!,
        year: year!,
        startMonth: selectedMonth!,
        endMonth: selectedMonth!,
        type: offeringType,
      }),
    enabled: Boolean(open && selectedMonth),
    retry: false,
  });

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='w-[90vw] max-w-5xl p-8'>
        <DialogHeader>
          <DialogTitle className='text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>
            Detalles por sub-tipo
            <span className='mx-2 text-slate-400'>•</span>
            <span className='text-red-600 dark:text-red-400'>{selectedMonth}</span>
          </DialogTitle>

          <DialogDescription className='text-xl'>Información detalla por subtipo</DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className='flex justify-center items-center py-20'>
            <p className='text-xl md:text-2xl 2xl:text-3xl text-slate-500'>Cargando datos...</p>
          </div>
        )}

        {!isLoading && data?.length === 0 && <p className='text-center py-10'>No hay datos</p>}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          {data?.map((item: any) => (
            <div key={item.subType} className='rounded-xl p-6 bg-slate-100 dark:bg-slate-800'>
              <p className='text-3xl font-semibold'>{item.subType}</p>

              <p className='text-4xl font-bold text-red-600 mt-2'>
                S/ {item.accumulatedOfferingPEN.toLocaleString('es-PE')}
              </p>

              {item.accumulatedOfferingUSD > 0 && (
                <p className='text-lg mt-1'>USD {item.accumulatedOfferingUSD}</p>
              )}

              {item.accumulatedOfferingEUR > 0 && (
                <p className='text-lg mt-1'>EUR {item.accumulatedOfferingEUR}</p>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
