import { useState, useMemo } from 'react';

import { Eye } from 'lucide-react';

import {
  useOfferingExpenseStore,
  selectSearchData,
} from '@/modules/offering/expense/stores/offering-expenses.store';

import { OfferingExpenseTabsCard } from '@/modules/offering/expense/components';

import { ResponsiveModal } from '@/shared/components/modal';
import { Button } from '@/shared/components/ui/button';

interface OfferingExpenseInfoCardProps {
  idRow: string;
}

export const OfferingExpenseInfoCard = ({ idRow }: OfferingExpenseInfoCardProps): JSX.Element => {
  //* States
  const searchData = useOfferingExpenseStore(selectSearchData);
  const [open, setOpen] = useState<boolean>(false);

  //* Set data
  const currentOfferingExpense = useMemo(() => {
    return searchData?.find((data) => data.id === idRow);
  }, [searchData, idRow]);

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
      triggerVariant='info'
      trigger={
        <Button
          variant='ghost'
          className='h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20'
        >
          <Eye className='h-4 w-4' />
        </Button>
      }
      maxWidth='lg'
    >
      <OfferingExpenseTabsCard data={currentOfferingExpense} id={idRow} />
    </ResponsiveModal>
  );
};
