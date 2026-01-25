import { useState } from 'react';
import './sidebar.css';

import { ChevronDown, ChevronRight } from 'lucide-react';
import { FcConferenceCall, FcExport } from 'react-icons/fc';

import { cn } from '@/shared/lib/utils';
import { menuItems } from '@/shared/data/menu-items-data';
import { useAuthStore } from '@/stores/auth/auth.store';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

import { ToggleLayout } from '@/core/theme/ToggleLayout';
import { ToggleNavBar } from '@/core/theme/ToggleNavBar';
import { SidebarTooltip } from '@/core/layout/sidebar/SidebarTooltip';
import { SidebarDrawer } from '@/core/layout/sidebar/SidebarDrawer';
import { SidebarCompactItem } from '@/core/layout/sidebar/SidebarCompactItem';

export const SidebarCompact = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const userInfo = useAuthStore((state) => state.user);

  const filteredItems = menuItems.filter((item) =>
    item.allowedRoles.some((role) => userInfo?.roles?.includes(role))
  );

  const membershipPaths = [
    '/churches',
    '/pastors',
    '/copastors',
    '/supervisors',
    '/preachers',
    '/family-groups',
    '/disciples',
    '/zones',
    '/ministries',
  ];

  const membershipItems = filteredItems.filter((i) => membershipPaths.includes(i.href));
  const otherItems = filteredItems.filter((i) => !membershipPaths.includes(i.href));

  return (
    <div className='bg-slate-900 h-[5.3rem] md:h-auto md:min-h-screen z-10 text-slate-300 w-full md:w-[7.5rem] flex flex-col'>

      {/* Header */}
      <div className='flex justify-between items-center md:flex-col md:pt-2 md:pb-4 md:px-2 md:gap-6'>
        <div id='logo' className='my-4 md:m-0 px-0 md:pt-4'>
      
          <a
            href='/dashboard'
            className='inline-flex gap-x-5 items-center md:mt-0 pl-4 pr-3 md:py-4 md:px-0 md:flex md:flex-col-reverse md:gap-3'
          >
            <h1 className='text-[1.8rem] pl-0 md:-ml-3 md:text-[1.8rem] font-bold font-dancing-script italic text-white'>
              ICUP <span className='md:hidden'> - </span>
              <span className='md:block text-[1.8rem] md:text-[1.8rem] md:text-center leading-3'>
                ADMIN
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

        <div className='flex gap-3 pr-1'>
          <ToggleNavBar />
          <SidebarDrawer />
        </div>
      </div>

      {/* Menu principal */}
      <nav id='menu' className='w-full px-8 py-4 md:flex md:flex-col gap-y-[1rem] hidden'>
        <div className='flex flex-col gap-y-1 justify-center items-left'>
          {otherItems.map((item) =>
            item.href === '/dashboard' ? (
              <SidebarTooltip key={item.href} item={item}>
                <SidebarCompactItem
                  key={item.href}
                  href={item.href}
                  title={item.title}
                  Icon={item.Icon}
                />
              </SidebarTooltip>
            ) : null
          )}

          {membershipItems.length > 0 && (
            <div className='w-full'>
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setOpen(!open)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200',
                        open
                          ? 'bg-slate-700 text-white shadow-md'
                          : 'hover:bg-slate-200 dark:hover:bg-slate-800 hover:shadow-md'
                      )}
                    >
                      <div className='flex'>
                        <FcConferenceCall className='text-[1.9rem] -ml-1.5' />

                        <div className='flex items-center justify-center ml-1'>
                          {open ? (
                            <ChevronDown className='w-4 h-4 text-slate-400 transition-transform duration-300' />
                          ) : (
                            <ChevronRight className='w-4 h-4 text-slate-400 transition-transform duration-300' />
                          )}
                        </div>
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side='right'>
                    <p>Membresía</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div
                className={cn(
                  'overflow-hidden transition-all duration-300 pl-2 border-l border-slate-700',
                  open ? 'max-h-[600px] mt-1' : 'max-h-0'
                )}
              >
                <div className='flex flex-col gap-y-1 mt-1'>
                  {membershipItems.map((sub) => (
                    <SidebarTooltip key={sub.href} item={sub}>
                      <SidebarCompactItem
                        href={sub.href}
                        title={sub.title}
                        subTitle={sub.subTitle}
                        Icon={sub.Icon}
                      />
                    </SidebarTooltip>
                  ))}
                </div>
              </div>
            </div>
          )}

          {otherItems.map((item) =>
            item.href === '/offerings' ? (
              <SidebarTooltip key={item.href} item={item}>
                <SidebarCompactItem
                  key={item.href}
                  href={item.href}
                  title={item.title}
                  Icon={item.Icon}
                />
              </SidebarTooltip>
            ) : item.href === '/users' || item.href === '/metrics' ? (
              <SidebarTooltip key={item.href} item={item}>
                <SidebarCompactItem href={item.href} title={item.title} Icon={item.Icon} />
              </SidebarTooltip>
            ) : null
          )}
        </div>

        {/* Logout */}
        <a onClick={logoutUser} className='cursor-pointer mt-1'>
          <FcExport className='text-2xl md:text-3xl m-auto' />
        </a>
      </nav>

      <div className="hidden md:flex pb-4 justify-center items-center mt-24">
        <ToggleLayout />
      </div>
    </div>
  );
};
