/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useState } from 'react';

import { cn } from '@/shared/lib/utils';
import { FcConferenceCall, FcExport } from 'react-icons/fc';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { useAuthStore } from '@/stores/auth/auth.store';

import { menuItems } from '@/shared/data/menu-items-data';
import { SidebarDrawerItem } from '@/core/layout/sidebar/SidebarDrawerItem';

import { UserRole, UserRoleNames } from '@/modules/user/enums/user-role.enum';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/shared/components/ui/sheet';

export function SidebarDrawer(): JSX.Element {
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const userNames = useAuthStore((state) => state.user?.firstNames ?? 'No User');
  const userLastNames = useAuthStore((state) => state.user?.lastNames ?? 'No User');
  const gender = useAuthStore((state) => state.user?.gender ?? undefined);
  const roles = useAuthStore((state) => state.user?.roles ?? undefined);
  const userInfo = useAuthStore((state) => state.user ?? undefined);

  const [isOpen, setIsOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [openMembership, setOpenMembership] = useState(false);

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
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button
          id='button'
          type='button'
          className='bg-slate-900 border border-white md:border-none text-white hover:bg-slate-800 hover:text-white px-1 py-0 md:absolute mr-3 md:mr-0 md:left-[5.4rem] md:top-[11rem] md:rounded-full focus:ring-2 focus:ring-white focus:ring-opacity-50'
          aria-controls='mobile-menu'
          aria-expanded='false'
        >
          <svg
            className='block md:hidden h-7 w-7 '
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            aria-hidden='true'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
            />
          </svg>
          <svg
            className='hidden md:block h-7 w-7'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            aria-hidden='true'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M5 12h14M12 5l7 7-7 7'
            />
          </svg>
        </Button>
      </SheetTrigger>

      <SheetContent side={'left'} className='h-full w-[20rem] md:h-full md:w-full md:py-6'>
        <SheetHeader>
          <div id='logo' className='py-1 text-center'>
            <div className='inline-flex gap-x-6 items-center justify-center'>
              <h1 className='text-[1.85rem] font-bold font-dancing-script italic text-white'>
                ICUP - APP
              </h1>
              <span>
                <img
                  className='bg-white rounded-full w-[3rem] h-[3rem] md:w-[4.5rem] md:h-[4.5rem] text-white'
                  src='/images/logo.webp'
                  alt='logo-iglesia'
                />
              </span>
            </div>
            <p className='mt-2 text-[16px] sm:w-[20rem] sm:mx-auto border-b border-slate-700 pb-2 text-white'>
              Panel administrativo, registros y consultas.
            </p>
          </div>

          {/* Profile */}
          <div
            id='profile'
            className='pb-2 md:pb-3 px-6 text-center md:pt-1 border-b-[0.5px] border-slate-600'
          >
            {/* <p className='text-lg text-slate-400'>Bienvenido,</p> */}
            <div className='flex justify-center gap-2 items-center h-auto pb-2'>
              <span>
                {gender === 'male' ? (
                  <Avatar className='p-1 w-12 h-12'>
                    <AvatarImage className='rounded-full' src={'/images/boy.webp'} />
                    <AvatarFallback>UI</AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className='p-1 w-12 h-12'>
                    <AvatarImage className='rounded-full' src={'/images/girl.webp'} />
                    <AvatarFallback>UI</AvatarFallback>
                  </Avatar>
                )}
              </span>
              <span className='text-[16px] font-medium text-white'>{`${userNames} ${userLastNames}`}</span>
            </div>

            {/* Their Roles */}
            <p className='text-[14px] md:text-[15px] ml-6 text-left font-bold text-sky-500'>
              <span>Roles:</span>
              <span className='text-[13px] md:text-[14px] text-white font-medium pl-2 '>
                {roles?.map((role) => UserRoleNames[role]).join(' - ')}
              </span>
            </p>

            {/* Allowed Access */}
            <Collapsible
              open={isOpen}
              onOpenChange={setIsOpen}
              className='text-[15px] ml-6 text-left font-bold text-green-500'
            >
              <div className='flex items-center justify-between'>
                <p className='text-[14px] md:text-[15px]'>Accesos permitidos</p>
                <CollapsibleTrigger asChild>
                  <Button
                    className='hover:text-green-500 focus:bg-slate-800 hover:bg-slate-800'
                    variant='ghost'
                    size='sm'
                  >
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 md:h-5 md:w-5 transition-transform duration-300',
                        isOpen && 'rotate-180'
                      )}
                    />
                    <span className='sr-only'>Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className='space-y-2 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden'>
                <p className='text-[13px] md:text-[14px] ml-2 text-amber-500'>Membresía:</p>
                <ul className='ml-8 font-medium text-white list-disc'>
                  {(roles?.includes(UserRole.AdminUser) || roles?.includes(UserRole.SuperUser)) && (
                    <li className='text-[13px] md:text-[14px]'>
                      Creación, actualización e inactivación.
                    </li>
                  )}
                  <li className='text-[13px] md:text-[14px]'>Búsqueda general y detallada.</li>
                  <li className='text-[13px] md:text-[14px]'>Generación de reportes PDF.</li>
                </ul>

                <p className='text-[13px] md:text-[14px] ml-2 text-amber-500'>Finanzas:</p>
                <ul className='ml-8 font-medium text-white list-disc'>
                  {(roles?.includes(UserRole.AdminUser) ||
                    roles?.includes(UserRole.SuperUser) ||
                    roles?.includes(UserRole.TreasurerUser)) && (
                    <li className='text-[13px] md:text-[14px]'>
                      Creación, actualización e inactivación.
                    </li>
                  )}
                  <li className='text-[13px] md:text-[14px]'>Búsqueda general.</li>
                  <li className='text-[13px] md:text-[14px]'>Búsqueda detallada.</li>
                  <li className='text-[13px] md:text-[14px]'>Generación de reportes.</li>
                </ul>

                {roles?.includes(UserRole.SuperUser) && (
                  <>
                    <p className='text-[13px] md:text-[14px] ml-2 text-amber-500'>Usuarios:</p>
                    <ul className='ml-8 font-medium text-white list-disc'>
                      <li className='text-[13px] md:text-[14px]'>
                        Creación, actualización e inactivación.
                      </li>
                      <li className='text-[13px] md:text-[14px]'>Búsqueda general y detallada.</li>
                      <li className='text-[13px] md:text-[14px]'>Generación de reportes.</li>
                    </ul>
                  </>
                )}
                <p className='text-[13px] md:text-[14px] ml-2 text-amber-500'>
                  Métricas y Estadísticas:
                </p>
                <ul className='ml-8 font-medium text-white list-disc'>
                  <li className='text-[13px] md:text-[14px]'>Visualización de gráficas.</li>
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </SheetHeader>

        <nav id='menu' className='w-full px-10 flex flex-col items-center py-2 gap-y-[.5rem]'>
          <div className='flex flex-col gap-y-1 md:gap-y-0'>
            {otherItems.map((item) =>
              item.href === '/dashboard' ? <SidebarDrawerItem key={item.href} {...item} /> : null
            )}
          </div>

          {membershipItems.length > 0 && (
            <Collapsible
              open={openMembership}
              onOpenChange={setOpenMembership}
              className={cn('w-[225px] text-left', !openMembership && 'collapsible-item')}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-gray-500/40',
                    openMembership
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'hover:bg-slate-800 hover:shadow-md'
                  )}
                >
                  <div className='flex items-center gap-3'>
                    <FcConferenceCall className='text-[1.9rem]' />
                    <div className='flex flex-col items-start'>
                      <p
                        className={cn(
                          'text-[17px] font-bold',
                          openMembership ? 'text-white' : 'text-white'
                        )}
                      >
                        Membresía
                      </p>
                      <p
                        className={cn(
                          'text-[15px] hidden md:block',
                          openMembership ? 'text-white/90' : 'text-white/80'
                        )}
                      >
                        Control Membresía
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    className={cn(
                      'w-4 h-4 transition-transform duration-300',
                      openMembership ? 'rotate-90 text-white' : 'text-slate-500 dark:text-slate-400'
                    )}
                  />
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent className='overflow-hidden pl-5 border-l border-slate-300 dark:border-slate-700 mt-1 transition-all duration-300 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp'>
                <div className='flex flex-col gap-y-1 mt-1'>
                  {membershipItems.map((sub) => (
                    <SidebarDrawerItem
                      key={sub.href}
                      href={sub.href}
                      Icon={sub.Icon}
                      title={sub.title}
                      subTitle={sub.subTitle}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {otherItems.map((item) =>
            item.href === '/offerings' || item.href === '/metrics' || item.href === '/users' ? (
              <SidebarDrawerItem key={item.href} {...item} />
            ) : null
          )}

          {/* Logout */}
          <a onClick={logoutUser} className='flex w-full cursor-pointer text-center justify-center'>
            <FcExport className='text-2xl' />
            <span className='text-[18px] text-red-500 font-bold leading-5'>Salir</span>
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
