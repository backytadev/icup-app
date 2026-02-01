import { useState, useCallback, useMemo, useRef } from 'react';
import { GiArchiveRegister } from 'react-icons/gi';

import { useMinistryStore, selectTermSearchData } from '@/modules/ministry/store/ministry.store';
import { MinistryUpdateForm } from '@/modules/ministry/components';
import { FormModal } from '@/shared/components/modal';

interface MinistryUpdateCardProps {
  idRow: string;
}

export const MinistryUpdateCard = ({ idRow }: MinistryUpdateCardProps): JSX.Element => {
  //* States
  const termSearchData = useMinistryStore(selectTermSearchData);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const topRef = useRef<HTMLDivElement>(null);

  //* Functions
  const currentMinistry = useMemo(
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
      <MinistryUpdateForm
        id={idRow}
        data={currentMinistry}
        dialogClose={handleClose}
        scrollToTop={handleScrollToTop}
      />
    </FormModal>
  );
};
