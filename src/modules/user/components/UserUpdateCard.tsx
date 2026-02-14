import { useState, useCallback, useMemo } from 'react';
import { Pencil } from 'lucide-react';

import { useUserStore, selectSearchData } from '@/modules/user/store';
import { UserUpdateForm } from '@/modules/user/components/forms';
import { FormModal } from '@/shared/components/modal';
import { Button } from '@/shared/components/ui/button';

interface UserUpdateCardProps {
  idRow: string;
}

export const UserUpdateCard = ({ idRow }: UserUpdateCardProps): JSX.Element => {
  //* States
  const searchData = useUserStore(selectSearchData);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  //* Functions
  const currentUser = useMemo(
    () => searchData?.find((data) => data?.id === idRow),
    [searchData, idRow]
  );

  const handleClose = useCallback((): void => {
    setIsOpen(false);
  }, []);

  const handleScrollToTop = useCallback((): void => {
    // FormModal handles scrolling internally
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
      <UserUpdateForm
        id={idRow}
        data={currentUser}
        dialogClose={handleClose}
        scrollToTop={handleScrollToTop}
      />
    </FormModal>
  );
};
