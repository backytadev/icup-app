import { useState } from 'react';

import { useMediaQuery } from '@react-hook/media-query';

import { FamilyGroupTabsCard } from '@/modules/family-group/components/cards/info/FamilyGroupTabsCard';
import { type FamilyGroupResponse } from '@/modules/family-group/interfaces/family-group-response.interface';

import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { CardContent } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Drawer, DrawerContent, DrawerTrigger } from '@/shared/components/ui/drawer';

interface Props {
  data: FamilyGroupResponse;
}

export function FamilyGroupInfoItem({ data }: Props): JSX.Element {
  //* States
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <div className='flex justify-between items-center pb-1.5'>
        <CardContent className='flex gap-1 pl-6 py-2'>
          <Avatar className='p-1 h-[50px] w-14'>
            <AvatarImage className='rounded-full' src={'/images/family-group.webp'} />
            <AvatarFallback>FGI</AvatarFallback>
          </Avatar>

          <div className='flex flex-col'>
            <p className='text-sm sm:text-base font-bold'>{data.familyGroupName}</p>
            <div className='p-1'>
              <div className='flex gap-5'>
                <p className='text-[12px] sm:text-[14px] font-normal'>
                  <span className='font-bold'>Código: </span>
                  {data.familyGroupCode}
                </p>
                <p className='text-[12px] sm:text-[14px] font-normal'>
                  <span className='font-bold'>Discípulos: </span> {data.disciples?.length}
                </p>
              </div>
              <p className='text-[12px] sm:text-[14px] font-normal'>
                <span className='font-bold'>Líder:</span>{' '}
                {`${data.theirPreacher?.firstNames} ${data.theirPreacher?.lastNames}`}
              </p>
            </div>
          </div>
        </CardContent>
        <div className='pr-6 pt-2 pb-2'>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className='text-[0.7rem] sm:text-sm w-[6.5rem] sm:w-[8rem] lg:w-[7.8rem] xl:w-[8rem] 2xl:w-[10rem] 2xl:text-md'>
                Ver Grupo Fam.
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-[690px] w-full justify-center py-6 max-h-full overflow-y-auto'>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
              <FamilyGroupTabsCard data={data} id={data.id} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <div className='flex justify-between items-center'>
      <CardContent className='flex gap-1 p-2'>
        <Avatar className='p-1'>
          <AvatarImage className='rounded-full w-12' src={'/images/family-group.webp'} />
          <AvatarFallback>FGI</AvatarFallback>
        </Avatar>

        <div className='flex flex-col'>
          <p className='text-[14px] sm:text-[14px] font-bold'>{data.familyGroupName}</p>
          <div className='p-1'>
            <div className='flex flex-col justify-start'>
              <p className='text-[13px] sm:text-[14px] font-normal'>
                <span className='font-bold'>Código: </span>
                {data.familyGroupCode}
              </p>
              <p className='text-[13px] sm:text-[14px] font-normal'>
                <span className='font-bold'>Discípulos: </span> {data.disciples?.length}
              </p>
            </div>
            <p className='text-[13px] sm:text-[14px] font-normal'>
              <span className='font-bold'>Líder:</span>{' '}
              {`${data.theirPreacher?.firstNames} ${data.theirPreacher?.lastNames}`}
            </p>
          </div>
        </div>
      </CardContent>
      <div className='pl-0 pr-3.5 pt-0 pb-2 sm:p-6 sm:pt-0'>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button className='text-[12.5px] sm:text-sm w-[6.5rem] sm:w-[8rem] lg:w-[7.8rem] xl:w-[8rem] 2xl:w-[10rem] 2xl:text-md'>
              Ver Grupo Fam.
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className='flex justify-center py-8 px-6 max-h-full overflow-y-auto'>
              <FamilyGroupTabsCard data={data} id={data.id} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
