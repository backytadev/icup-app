/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { useCallback, useRef, useState } from 'react';

import { HiOutlineClipboardList } from 'react-icons/hi';

import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { OfferingIncomeSummaryTable } from '@/modules/offering/income/components/cards/summary/OfferingIncomeSummaryTable';
import { OfferingIncomeResponse } from '@/modules/offering/income/interfaces/offering-income-response.interface';

interface Props {
  data: OfferingIncomeResponse[] | undefined;
  isDisabled: boolean;
  // churchId: string | undefined;
}

export const OfferingIncomeResumeCard = ({ data, isDisabled }: Props): JSX.Element => {
  //* State
  const [isOpen, setIsOpen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  //* Functions
  const handleContainerClose = useCallback((): void => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className='relative inline-block'>
            <Button
              disabled={isDisabled}
              variant='outline'
              className='px-3 py-3 bg-gray-600 text-white hover:bg-gray-700 hover:text-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white rounded-md transition-colors'
            >
              <span className='flex items-center gap-2'>
                Ver Resumen <HiOutlineClipboardList className='text-2xl' />
              </span>
            </Button>
          </div>
        </DialogTrigger>

        <DialogContent
          ref={topRef}
          className='md:max-w-[700px] lg:max-w-[700px] xl:max-w-[750px] w-full max-h-full justify-center pt-[0.9rem] pb-[1.3rem] overflow-x-hidden overflow-y-auto'
        >
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <OfferingIncomeSummaryTable
            churchId={'0092932312sd'}
            dialogClose={handleContainerClose}
            data={data}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
