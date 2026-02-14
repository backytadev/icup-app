import { useState } from 'react';

import { KeyRound } from 'lucide-react';

import { UserPasswordUpdateForm } from '@/modules/user/components/forms';

import { ResponsiveModal } from '@/shared/components/modal';
import { Button } from '@/shared/components/ui/button';

interface UserPasswordUpdateCardProps {
  idRow: string;
}

export const UserPasswordUpdateCard = ({ idRow }: UserPasswordUpdateCardProps): JSX.Element => {
  //* States
  const [open, setOpen] = useState<boolean>(false);

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
      maxWidth='md'
      trigger={
        <Button
          variant='ghost'
          className='h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/20'
        >
          <KeyRound className='h-4 w-4' />
        </Button>
      }
    >
      <UserPasswordUpdateForm
        id={idRow}
        dialogClose={() => setOpen(false)}
        scrollToTop={() => { }}
      />
    </ResponsiveModal>
  );
};
