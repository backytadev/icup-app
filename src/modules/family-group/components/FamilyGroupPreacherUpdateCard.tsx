import { useRef, useState, useCallback, useMemo } from 'react';

import { GiCardExchange } from 'react-icons/gi';

import { useFamilyGroupStore, selectSearchData } from '@/modules/family-group/store';
import { FamilyGroupPreacherExchangeUpdateForm } from '@/modules/family-group/components/forms';

import { Button } from '@/shared/components/ui/button';
import { ResponsiveModal } from '@/shared/components/modal';

interface FamilyGroupPreacherUpdateCardProps {
  idRow: string;
}

export const FamilyGroupPreacherUpdateCard = ({
  idRow,
}: FamilyGroupPreacherUpdateCardProps): JSX.Element => {
  //* States
  const [open, setOpen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const searchData = useFamilyGroupStore(selectSearchData);

  //* Functions
  const currentFamilyGroup = useMemo(
    () => searchData?.find((data) => data?.id === idRow),
    [searchData, idRow]
  );

  const handleContainerClose = useCallback((): void => {
    setOpen(false);
  }, []);

  const handleContainerScroll = useCallback((): void => {
    if (topRef.current !== null) {
      topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
      maxWidth='lg'
      trigger={
        <Button
          variant='ghost'
          className='h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20'
        >
          <GiCardExchange className='h-5 w-5' />
        </Button>
      }
    >
      <FamilyGroupPreacherExchangeUpdateForm
        id={idRow}
        data={currentFamilyGroup}
        dialogClose={handleContainerClose}
        scrollToTop={handleContainerScroll}
      />
    </ResponsiveModal>
  );
};
