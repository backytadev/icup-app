import { useRef, useState } from 'react';

import { GiArchiveRegister } from 'react-icons/gi';
import { useMediaQuery } from '@react-hook/media-query';

import { UserUpdateForm } from '@/app/user/components';

import { useUserStore } from '@/stores/user';

import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/components/ui/dialog';

interface UserUpdateCardProps {
  idRow: string;
}

export const UserUpdateCard = ({ idRow }: UserUpdateCardProps): JSX.Element => {
  //* States
  const dataSearchByTermResponse = useUserStore((state) => state.dataSearchByTermResponse);
  const [open, setOpen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  //* Library hooks
  const isDesktop = useMediaQuery('(min-width: 768px)');

  //* Functions
  const currentUser = dataSearchByTermResponse?.find((data) => data.id === idRow);

  const handleContainerClose = (): void => {
    setOpen(false);
  };

  const handleContainerScroll = (): void => {
    if (topRef.current !== null) {
      topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant='outline'
            className='mt-2 py-2 px-1 h-[2rem] bg-orange-400 text-white hover:bg-orange-500 hover:text-orange-950  dark:text-orange-950 dark:hover:bg-orange-500 dark:hover:text-white'
          >
            <GiArchiveRegister className='w-8 h-[1.65rem]' />
          </Button>
        </DialogTrigger>

        <DialogContent
          ref={topRef}
          className='md:max-w-[740px] lg:max-w-[900px] xl:max-w-[1000px] w-full max-h-full justify-center pt-[0.9rem] pb-[1.3rem] overflow-x-hidden overflow-y-auto'
        >
          <UserUpdateForm
            id={idRow}
            data={currentUser}
            onSubmit={handleContainerClose}
            onScroll={handleContainerScroll}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='mt-2 py-2 px-1 h-[2rem] bg-orange-400 text-white hover:bg-orange-500 hover:text-orange-950  dark:text-orange-950 dark:hover:bg-orange-500 dark:hover:text-white'
        >
          <GiArchiveRegister className='w-8 h-[1.65rem]' />
        </Button>
      </DialogTrigger>

      <DialogContent
        ref={topRef}
        className='max-w-auto sm:max-w-[590px] w-full max-h-full justify-center pt-6 pb-4 px-8 overflow-y-auto overflow-x-hidden'
      >
        <UserUpdateForm
          id={idRow}
          data={currentUser}
          onSubmit={handleContainerClose}
          onScroll={handleContainerScroll}
        />
      </DialogContent>
    </Dialog>
  );
};
