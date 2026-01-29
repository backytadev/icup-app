import { useState, useCallback, useMemo, useRef } from 'react';
import { GiArchiveRegister } from 'react-icons/gi';

import { useChurchStore, selectTermSearchData } from '@/modules/church/store';
import { ChurchUpdateForm } from '@/modules/church/components';
import { FormModal } from '@/shared/components/modal';

interface ChurchUpdateCardProps {
  idRow: string;
}

export const ChurchUpdateCard = ({ idRow }: ChurchUpdateCardProps): JSX.Element => {
  //* States
  const termSearchData = useChurchStore(selectTermSearchData);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const topRef = useRef<HTMLDivElement>(null);

  //* Functions
  const currentChurch = useMemo(
    () => termSearchData?.find((data) => data?.id === idRow),
    [termSearchData, idRow]
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
      triggerIcon={<GiArchiveRegister className='w-8 h-[1.65rem]' />}
      maxWidth='2xl'
    >
      <ChurchUpdateForm
        id={idRow}
        data={currentChurch}
        dialogClose={handleClose}
        scrollToTop={handleScrollToTop}
      />
    </FormModal>
  );
};
