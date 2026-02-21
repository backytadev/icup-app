import { useCallback, useRef, useState } from 'react';

import { FcFinePrint } from 'react-icons/fc';

import { FinancialBalanceComparativeReportForm } from '@/modules/metrics/components/financial-balance-comparative/reports/FinancialBalanceComparativeReportForm';

import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';


export const FinancialBalanceComparativeReportFormCard = (): JSX.Element => {
  //* State
  const [setOpen, setIsOpen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  //* Functions
  const handleContainerClose = useCallback((): void => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <Dialog open={setOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant='outline'
            className='flex items-center gap-2 h-10 px-5 border-amber-200 dark:border-amber-700/40 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 font-inter font-medium text-sm shadow-sm transition-all duration-200'
          >
            <FcFinePrint className='text-xl flex-shrink-0' />
            Generar Reporte PDF
          </Button>
        </DialogTrigger>

        <DialogContent
          ref={topRef}
          className='md:max-w-[600px] lg:max-w-[600px] xl:max-w-[650px] w-full max-h-full justify-center pt-[0.9rem] pb-[1.3rem] overflow-x-hidden overflow-y-auto'
        >
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <FinancialBalanceComparativeReportForm
            dialogClose={handleContainerClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
