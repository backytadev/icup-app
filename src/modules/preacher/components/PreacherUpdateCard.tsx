import { useRef, useState, useCallback, useMemo } from 'react';

import { usePreacherStore, selectSearchData } from '@/modules/preacher/store';
import { PreacherUpdateForm } from '@/modules/preacher/components/forms/PreacherUpdateForm';

import { Button } from '@/shared/components/ui/button';
import { FormModal } from '@/shared/components/modal';
import { Pencil } from 'lucide-react';

interface PreacherUpdateCardProps {
  idRow: string;
}

export const PreacherUpdateCard = ({ idRow }: PreacherUpdateCardProps): JSX.Element => {
  //* States
  const topRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchData = usePreacherStore(selectSearchData);

  //* Functions
  const currentPreacher = useMemo(
    () => searchData?.find((data) => data?.id === idRow),
    [searchData, idRow]
  );

  const handleContainerClose = useCallback((): void => {
    setIsOpen(false);
  }, []);

  const handleContainerScroll = useCallback((): void => {
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
      <PreacherUpdateForm
        id={idRow}
        data={currentPreacher}
        dialogClose={handleContainerClose}
        scrollToTop={handleContainerScroll}
      />
    </FormModal>
  );
};
