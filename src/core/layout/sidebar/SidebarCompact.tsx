import './sidebar.css';

import { FcExport } from 'react-icons/fc';

import { menuItems } from '@/shared/data/menu-items-data';

import { useAuthStore } from '@/stores/auth/auth.store';

import { ToggleNavBar } from '@/core/theme/ToggleNavBar';
import { SidebarTooltip } from '@/core/layout/sidebar/SidebarTooltip';
import { SidebarDrawer } from '@/core/layout/sidebar/SidebarDrawer';
import { SidebarCompactItem } from '@/core/layout/sidebar/SidebarCompactItem';

export const SidebarCompact = (): JSX.Element => {
  const logoutUser = useAuthStore((state) => state.logoutUser);

  return (
    <div className='bg-slate-900  h-[5.3rem] md:h-auto md:min-h-screen z-10 text-slate-300 w-full md:w-[7.5rem]'>
      {/* Header */}
      <div className='flex justify-between items-center md:flex-col md:pt-2 md:pb-4 md:px-2 md:gap-6'>
        {/* Image, Title */}
        <div id='logo' className='my-4 md:m-0 px-0 md:pt-4'>
          <a
            href='/dashboard'
            className='inline-flex gap-x-5 items-center md:mt-0 pl-4 pr-3 md:py-4 md:px-0 md:flex md:flex-col-reverse md:gap-3'
          >
            <h1 className='text-[1.8rem] pl-0 md:-ml-3 md:text-[1.8rem] font-bold font-dancing-script italic text-white'>
              ICUP <span className='md:hidden'> - </span>
              <span className='md:block text-[1.8rem] md:text-[1.8rem] md:text-center leading-3'>
                APP
              </span>
            </h1>
            <span>
              <img
                className='bg-white rounded-full w-[3.5rem] h-[3.5rem] md:w-[4.5rem] md:h-[4.5rem]'
                src='/images/logo.webp'
                alt='logo-iglesia'
              />
            </span>
          </a>
        </div>
        {/* Button */}
        <div className='flex gap-3 pr-1'>
          <ToggleNavBar />
          <SidebarDrawer />
        </div>
      </div>

      {/* Menu Icon Items */}
      <nav id='menu' className='w-full px-8 py-4 md:flex md:flex-col gap-y-[1rem] hidden'>
        <div className='flex flex-col gap-y-1 justify-center items-left'>
          {menuItems.map((item) => (
            <SidebarTooltip key={item.href} item={item}>
              <SidebarCompactItem key={item.href} {...item} />
            </SidebarTooltip>
          ))}
        </div>

        {/* Logout */}
        <a onClick={logoutUser} className='cursor-pointer'>
          <FcExport className='text-2xl md:text-3xl m-auto' />
        </a>
      </nav>
    </div>
  );
};
