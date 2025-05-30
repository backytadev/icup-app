/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { useCallback, useRef, useState } from 'react';

import { FcFinePrint } from 'react-icons/fc';

import { OfferingIncomeReportForm } from '@/modules/metrics/components/offering-income/reports/OfferingIncomeReportForm';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';

interface Props {
  churchId: string | undefined;
}

export const OfferingIncomeReportFormCard = ({ churchId }: Props): JSX.Element => {
  //* State
  const [setOpen, setIsOpen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  //* Functions
  const handleContainerClose = useCallback((): void => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <Dialog open={setOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className='relative inline-block'>
            <Button
              onMouseEnter={() => setTooltipVisible(true)}
              onMouseLeave={() => setTooltipVisible(false)}
              variant='outline'
              className='px-1.5  bg-blue-400 text-white hover:bg-blue-500 hover:text-blue-950  dark:text-blue-950 dark:hover:bg-blue-500 dark:hover:text-white'
            >
              <FcFinePrint className='text-[2rem]' />
            </Button>
            <div
              className={`w-20 py-[1px] border text-[12px] absolute text-center text-white bg-slate-950 rounded-md shadow-lg transition-all duration-300 ease-in-out ${
                tooltipVisible ? 'translate-y-[-8px] opacity-100' : '-z-10 translate-y-2 opacity-0'
              }`}
              style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}
            >
              Reporte PDF
            </div>
          </div>
        </DialogTrigger>

        <DialogContent
          ref={topRef}
          className='md:max-w-[600px] lg:max-w-[600px] xl:max-w-[650px] w-full max-h-full justify-center pt-[0.9rem] pb-[1.3rem] overflow-x-hidden overflow-y-auto'
        >
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <OfferingIncomeReportForm churchId={churchId} dialogClose={handleContainerClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};
