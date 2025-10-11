/* eslint-disable @typescript-eslint/no-floating-promises */

import { NavLink } from 'react-router-dom';
import type { IconType } from 'react-icons';

import { SheetClose } from '@/shared/components/ui/sheet';

interface Props {
  href: string;
  Icon: IconType;
  title: string;
  subTitle: string;
}

export const SidebarDrawerItem = ({ href, Icon, title, subTitle }: Props): JSX.Element => {
  return (
    <SheetClose asChild>
      <NavLink key={href} to={href} end className='w-[220px]'>
        <div className='pr-1'>
          <Icon className='text-[28px] text-slate-300' />
        </div>
        <div className='flex flex-col space-y-1'>
          <span className='text-[17px] xl:text-xl font-bold leading-5 text-white'>{title}</span>
          <span className='text-sm lg:text-[15px] hidden md:block text-white'>{subTitle}</span>
        </div>
      </NavLink>
    </SheetClose>
  );
};
