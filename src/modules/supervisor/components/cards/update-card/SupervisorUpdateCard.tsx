import { useRef, useState, useCallback, useMemo } from 'react';

import { GiArchiveRegister } from 'react-icons/gi';
import { useMediaQuery } from '@react-hook/media-query';

import { useSupervisorStore } from '@/stores/supervisor';

import { SupervisorUpdateForm } from '@/modules/supervisor/components';

import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/components/ui/dialog';

interface SupervisorUpdateCardProps {
  idRow: string;
}

export const SupervisorUpdateCard = ({ idRow }: SupervisorUpdateCardProps): JSX.Element => {
  //* States
  const topRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dataSearchByTermResponse = useSupervisorStore((state) => state.dataSearchByTermResponse);

  //* Hooks (external libraries)
  const isDesktop = useMediaQuery('(min-width: 768px)');

  //* Functions
  const currentSupervisor = useMemo(
    () => dataSearchByTermResponse?.find((data) => data?.id === idRow),
    [dataSearchByTermResponse, idRow]
  );

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
            className='mt-2 py-2 px-1 h-[2rem] bg-orange-400 text-white hover:bg-orange-500 hover:text-orange-950  dark:text-orange-950 dark:hover:bg-orange-500 dark:hover:text-white'
          >
            <GiArchiveRegister className='w-8 h-[1.65rem]' />
          </Button>
        </DialogTrigger>

        <DialogContent
          ref={topRef}
          className='md:max-w-[740px] lg:max-w-[1050px] xl:max-w-[1160px] w-full max-h-full justify-center pt-[0.9rem] pb-[1.3rem] overflow-x-hidden overflow-y-auto'
        >
          <SupervisorUpdateForm
            id={idRow}
            data={currentSupervisor}
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
          className='mt-2 py-2 px-1 h-[2rem] bg-orange-400 text-white hover:bg-orange-500 hover:text-orange-950  dark:text-orange-950 dark:hover:bg-orange-500 dark:hover:text-white'
        >
          <GiArchiveRegister className='w-8 h-[1.65rem]' />
        </Button>
      </DialogTrigger>

      <DialogContent
        ref={topRef}
        className='max-w-auto sm:max-w-[590px] w-full max-h-full justify-center pt-6 pb-4 px-8 overflow-y-auto overflow-x-hidden'
      >
        <SupervisorUpdateForm
          id={idRow}
          data={currentSupervisor}
          dialogClose={handleContainerClose}
          scrollToTop={handleContainerScroll}
        />
      </DialogContent>
    </Dialog>
  );
};
