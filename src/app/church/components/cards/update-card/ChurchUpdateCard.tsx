import { useRef, useState } from 'react';

import { useMediaQuery } from '@react-hook/media-query';
import { GiArchiveRegister } from 'react-icons/gi';

import { useChurchStore } from '@/stores/church';

import { ChurchFormUpdate } from '@/app/church/components';

import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/components/ui/dialog';

interface ChurchUpdateCardProps {
  idRow: string;
}

export const ChurchUpdateCard = ({ idRow }: ChurchUpdateCardProps): JSX.Element => {
  //* States
  const dataSearchByTermResponse = useChurchStore((state) => state.dataSearchByTermResponse);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const topRef = useRef<HTMLDivElement>(null);

  //* Hooks (external libraries)
  const isDesktop = useMediaQuery('(min-width: 768px)');

  //* Functions
  const currentChurch = dataSearchByTermResponse?.find((data) => data.id === idRow);

  const handleContainerClose = (): void => {
    setIsOpen(false);
  };

  const handleContainerScroll = (): void => {
    if (topRef.current !== null) {
      topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          className='md:max-w-[740px] lg:max-w-[1050px] xl:max-w-[1160px] w-full max-h-full justify-center pt-[0.9rem] pb-[1.3rem] overflow-x-hidden overflow-y-auto'
        >
          <ChurchFormUpdate
            id={idRow}
            data={currentChurch}
            onSubmit={handleContainerClose}
            onScroll={handleContainerScroll}
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
          className='mt-2 py-2 px-1 h-[2rem] bg-orange-400 text-white hover:bg-orange-500 hover:text-orange-950  dark:text-orange-950 dark:hover:bg-orange-500 dark:hover:text-white'
        >
          <GiArchiveRegister className='w-8 h-[1.65rem]' />
        </Button>
      </DialogTrigger>

      <DialogContent
        ref={topRef}
        className='max-w-auto sm:max-w-[590px] w-full max-h-full justify-center pt-6 pb-4 px-8 overflow-y-auto overflow-x-hidden'
      >
        <ChurchFormUpdate
          id={idRow}
          data={currentChurch}
          onSubmit={handleContainerClose}
          onScroll={handleContainerScroll}
        />
      </DialogContent>
    </Dialog>
  );
};
