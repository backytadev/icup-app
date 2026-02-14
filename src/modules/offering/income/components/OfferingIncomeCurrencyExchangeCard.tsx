import { useState, useCallback, useMemo, useRef } from 'react';

import { ArrowLeftRight } from 'lucide-react';

import { useOfferingIncomeStore, selectSearchData } from '@/modules/offering/income/stores/offering-income.store';
import { OfferingIncomeCurrencyExchangeForm } from '@/modules/offering/income/components/forms';

import { FormModal } from '@/shared/components/modal';
import { Button } from '@/shared/components/ui/button';

interface OfferingIncomeCurrencyExchangeCardProps {
  idRow: string;
}

export const OfferingIncomeCurrencyExchangeCard = ({
  idRow,
}: OfferingIncomeCurrencyExchangeCardProps): JSX.Element => {
  //* States
  const searchData = useOfferingIncomeStore(selectSearchData);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const topRef = useRef<HTMLDivElement>(null);

  //* Functions
  const currentOfferingIncome = useMemo(
    () => searchData?.find((data) => data?.id === idRow),
    [searchData, idRow]
  );

  const handleClose = useCallback((): void => {
    setIsOpen(false);
  }, []);

  const handleScrollToTop = useCallback((): void => {
    if (topRef.current !== null) {
      topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <FormModal
      open={isOpen}
      onOpenChange={setIsOpen}
      maxWidth='lg'
      trigger={
        <Button
          variant='ghost'
          className='h-8 w-8 p-0 text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:text-teal-300 dark:hover:bg-teal-900/20 transition-colors'
        >
          <ArrowLeftRight className='h-4 w-4' />
        </Button>
      }
    >
      <OfferingIncomeCurrencyExchangeForm
        id={idRow}
        data={currentOfferingIncome}
        dialogClose={handleClose}
        scrollToTop={handleScrollToTop}
      />
    </FormModal>
  );
};
