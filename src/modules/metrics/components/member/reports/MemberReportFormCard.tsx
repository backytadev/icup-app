import { useCallback, useState } from 'react';

import { FcFinePrint } from 'react-icons/fc';

import { MemberReportForm } from '@/modules/metrics/components/member/reports/MemberReportForm';

import { ResponsiveModal } from '@/shared/components/modal';
import { Button } from '@/shared/components/ui/button';


export const MemberReportFormCard = (): JSX.Element => {
  //* State
  const [open, setIsOpen] = useState(false);

  //* Functions
  const handleContainerClose = useCallback((): void => {
    setIsOpen(false);
  }, []);

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setIsOpen}
      maxWidth='lg'
      trigger={
        <Button
          variant='outline'
          className='flex items-center gap-2 h-10 px-5 border-amber-200 dark:border-amber-700/40 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 font-inter font-medium text-sm shadow-sm transition-all duration-200'
        >
          <FcFinePrint className='text-xl flex-shrink-0' />
          Generar Reporte PDF
        </Button>
      }
    >
      <MemberReportForm dialogClose={handleContainerClose} />
    </ResponsiveModal>
  );
};
