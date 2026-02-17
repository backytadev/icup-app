import { useState, useCallback, useMemo } from 'react';
import { Pencil } from 'lucide-react';

import {
  useOfferingExpenseStore,
  selectSearchData,
} from '@/modules/offering/expense/stores/offering-expenses.store';

import { OfferingExpenseFormUpdate } from '@/modules/offering/expense/components';

import { FormModal } from '@/shared/components/modal';
import { Button } from '@/shared/components/ui/button';

interface OfferingExpenseUpdateCardProps {
  idRow: string;
}

export const OfferingExpenseUpdateCard = ({ idRow }: OfferingExpenseUpdateCardProps): JSX.Element => {
  //* States
  const searchData = useOfferingExpenseStore(selectSearchData);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  //* Functions
  const currentOfferingExpense = useMemo(
    () => searchData?.find((data) => data?.id === idRow),
    [searchData, idRow]
  );

  const handleClose = useCallback((): void => {
    setIsOpen(false);
  }, []);

  const handleScrollToTop = useCallback((): void => {
    // FormModal handles scroll internally via topRef
  }, []);

  return (
    <FormModal
      open={isOpen}
      onOpenChange={setIsOpen}
      maxWidth='xl'
      trigger={
        <Button
          variant='ghost'
          className='h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/20'
        >
          <Pencil className='h-4 w-4' />
        </Button>
      }
    >
      <OfferingExpenseFormUpdate
        id={idRow}
        data={currentOfferingExpense}
        dialogClose={handleClose}
        scrollToTop={handleScrollToTop}
      />
    </FormModal>
  );
};
