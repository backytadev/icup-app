import { useRef, useState, useCallback } from 'react';

import { ImKey2 } from 'react-icons/im';
import { useMediaQuery } from '@react-hook/media-query';

import { UserPasswordUpdateForm } from '@/modules/user/components/cards/update/UserPasswordUpdateForm';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';

interface UserPasswordUpdateCardProps {
  idRow: string;
}

export const UserPasswordUpdateCard = ({ idRow }: UserPasswordUpdateCardProps): JSX.Element => {
  //* States
  const [isOpen, setIsOpen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  //* Library hooks
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleContainerClose = useCallback((): void => {
    setIsOpen(false);
  }, []);

  const handleContainerScroll = useCallback((): void => {
    if (topRef.current !== null) {
      topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant='outline'
            className='mt-2 py-2 px-1 h-[2rem] bg-purple-400 text-white hover:bg-purple-500 hover:text-purple-950  dark:text-purple-950 dark:hover:bg-purple-500 dark:hover:text-white'
          >
            <ImKey2 className='w-8 h-[1.6rem]' />
          </Button>
        </DialogTrigger>

        <DialogContent
          ref={topRef}
          className='md:max-w-[540px] lg:max-w-[500px] xl:max-w-[600px] w-full max-h-full justify-center pt-[0.9rem] pb-[1.3rem] overflow-x-hidden overflow-y-auto'
        >
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <UserPasswordUpdateForm
            id={idRow}
            dialogClose={handleContainerClose}
            scrollToTop={handleContainerScroll}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='mt-2 py-2 px-1 h-[2rem] bg-purple-400 text-white hover:bg-purple-500 hover:text-purple-950  dark:text-purple-950 dark:hover:bg-purple-500 dark:hover:text-white'
        >
          <ImKey2 className='w-8 h-[1.6rem]' />
        </Button>
      </DialogTrigger>

      <DialogContent
        ref={topRef}
        className='max-w-auto sm:max-w-[490px] w-full max-h-full justify-center pt-6 pb-4 px-6 md:px-8  overflow-y-auto overflow-x-hidden'
      >
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
        <UserPasswordUpdateForm
          id={idRow}
          dialogClose={handleContainerClose}
          scrollToTop={handleContainerScroll}
        />
      </DialogContent>
    </Dialog>
  );
};
