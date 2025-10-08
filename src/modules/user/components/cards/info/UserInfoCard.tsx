/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useState, useMemo } from 'react';

import { useLocation } from 'react-router-dom';
import { useMediaQuery } from '@react-hook/media-query';
import { BsFillPersonVcardFill } from 'react-icons/bs';

import { cn } from '@/shared/lib/utils';

import { useUserStore } from '@/modules/user/stores/user.store';
import { UserTabsCard } from '@/modules/user/components/cards/info/UserTabsCard';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '@/shared/components/ui/drawer';

interface UserInfoCardProps {
  idRow: string;
}

export const UserInfoCard = ({ idRow }: UserInfoCardProps): JSX.Element => {
  //* States
  const dataSearchGeneralResponse = useUserStore((state) => state.dataSearchGeneralResponse);
  const dataSearchByTermResponse = useUserStore((state) => state.dataSearchByTermResponse);

  const [open, setOpen] = useState<boolean>(false);

  //* Library hooks
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { pathname } = useLocation();

  //* Functions

  const currentUser = useMemo(() => {
    return pathname === '/users/general-search'
      ? dataSearchGeneralResponse?.find((data) => data.id === idRow)
      : dataSearchByTermResponse?.find((data) => data.id === idRow);
  }, [pathname, dataSearchGeneralResponse, dataSearchByTermResponse, idRow]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant='outline'
            className={cn(
              'mt-2 py-2 px-1 h-[2rem] bg-blue-400 text-white hover:bg-blue-500 hover:text-blue-950  dark:text-blue-950 dark:hover:bg-blue-500 dark:hover:text-white'
            )}
          >
            <BsFillPersonVcardFill className='w-8 h-[1.65rem]' />
          </Button>
        </DialogTrigger>

        <DialogContent className='max-w-[690px] w-full justify-center py-6 max-h-full overflow-y-auto overflow-x-hidden'>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <UserTabsCard data={currentUser} id={idRow} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'mt-2 mr-4 py-2 px-1 h-[2rem] bg-blue-400 text-white hover:bg-blue-500 hover:text-blue-950  dark:text-blue-950 dark:hover:bg-blue-500 dark:hover:text-white',
            (pathname === '/users/update-user' || pathname === '/users/inactivate-user') && 'mr-0'
          )}
        >
          <BsFillPersonVcardFill className='w-8 h-[1.65rem]' />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='flex justify-center py-8 px-6 max-h-full overflow-y-auto overflow-x-hidden'>
          <UserTabsCard data={currentUser} id={idRow} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
