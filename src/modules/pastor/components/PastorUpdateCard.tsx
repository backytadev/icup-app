import { useState, useCallback, useMemo, useRef } from 'react';

import { PastorUpdateForm } from '@/modules/pastor/components/forms/PastorUpdateForm';
import { usePastorStore, selectSearchData } from '@/modules/pastor/store';

import { FormModal } from '@/shared/components/modal';
import { Button } from '@/shared/components/ui/button';
import { Pencil } from 'lucide-react';

interface PastorUpdateCardProps {
  idRow: string;
}

export const PastorUpdateCard = ({ idRow }: PastorUpdateCardProps): JSX.Element => {
  //* States
  const searchData = usePastorStore(selectSearchData);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const topRef = useRef<HTMLDivElement>(null);

  //* Functions
  const currentPastor = useMemo(
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
      maxWidth='2xl'
      trigger={
        <Button
          variant='ghost'
          className='h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/20'
        >
          <Pencil className='h-4 w-4' />
        </Button>
      }
    >
      <PastorUpdateForm
        id={idRow}
        data={currentPastor}
        dialogClose={handleClose}
        scrollToTop={handleScrollToTop}
      />
    </FormModal>
  );
};
