/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { NavLink, useLocation } from 'react-router-dom';

import type { IconType } from 'react-icons';

import { cn } from '@/shared/lib/utils';

interface Props {
  href: string;
  Icon: IconType;
  title: string;
  subTitle: string;
}

export const SidebarCompactItem = ({ href, Icon }: Props): JSX.Element => {
  const { pathname } = useLocation();

  return (
    <NavLink
      key={href}
      to={href}
      end
      className={cn(pathname.startsWith(href) && 'dark:bg-blue-800 bg-blue-600 ')}
    >
      <Icon className='text-[1.7rem] m-auto text-slate-300' />
    </NavLink>
  );
};
