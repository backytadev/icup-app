import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { Menu, ChevronDown, LogOut, Users, Moon, Sun, Monitor, Settings } from 'lucide-react';
import type { IconType } from 'react-icons';

import { cn } from '@/shared/lib/utils';
import { menuItems } from '@/shared/data/menu-items-data';
import { useAuthStore } from '@/stores/auth/auth.store';
import { useSidebarStore } from '@/stores/sidebar/sidebar.store';
import { useTheme } from '@/core/theme/theme-provider';
import { UserRoleNames } from '@/modules/user/enums/user-role.enum';
import { type MenuItem } from '@/shared/interfaces/menu-item.interface';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/components/ui/sheet';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar';
import { ChurchMinistrySelector } from '@/core/layout/sidebar/ChurchMinistrySelector';

interface MobileNavItemProps {
  href: string;
  Icon: IconType;
  title: string;
  subTitle?: string;
  isNested?: boolean;
  onClose: () => void;
}

const MobileNavItem = ({
  href,
  Icon,
  title,
  isNested = false,
  onClose,
}: MobileNavItemProps): JSX.Element => {
  const { pathname } = useLocation();
  const isActive = pathname.startsWith(href);

  return (
    <NavLink
      to={href}
      onClick={onClose}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl',
        'transition-all duration-200',
        isNested && 'py-2.5 px-3',
        isActive
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
          : 'text-slate-300 hover:bg-white/10 active:bg-white/15'
      )}
    >
      <Icon className={cn('text-2xl', isNested && 'text-xl')} />
      <span className={cn('font-medium', isNested ? 'text-sm' : 'text-base')}>
        {title}
      </span>
    </NavLink>
  );
};

export const SidebarMobile = (): JSX.Element => {
  const { isMobileOpen, setMobileOpen, closeMobile } = useSidebarStore();
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const userInfo = useAuthStore((state) => state.user);
  const { theme, setTheme } = useTheme();

  const [membershipOpen, setMembershipOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const userNames = userInfo?.firstNames ?? 'Usuario';
  const userLastNames = userInfo?.lastNames ?? '';
  const gender = userInfo?.gender;
  const roles = userInfo?.roles ?? [];

  const filteredItems = menuItems.filter((item) =>
    item.allowedRoles.some((role) => userInfo?.roles?.includes(role))
  );

  const membershipPaths = [
    '/pastors',
    '/copastors',
    '/supervisors',
    '/preachers',
    '/family-groups',
    '/disciples',
    '/zones',
  ];

  const settingsPaths = ['/churches', '/ministries', '/users'];

  const membershipItems = filteredItems.filter((i) => membershipPaths.includes(i.href));
  const settingsItems = settingsPaths
    .map((path) => filteredItems.find((i) => i.href === path))
    .filter((item): item is MenuItem => item !== undefined);
  const dashboardItem = filteredItems.find((i) => i.href === '/dashboard');
  const offeringsItem = filteredItems.find((i) => i.href === '/offerings');
  const metricsItem = filteredItems.find((i) => i.href === '/metrics');

  const avatarSrc = gender === 'male' ? '/images/boy.webp' : '/images/girl.webp';

  return (
    <>
      {/* Mobile Header */}
      <header className='md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/50'>
        <div className='flex items-center justify-between px-4 py-3'>
          <a href='/dashboard' className='flex items-center gap-3'>
            <img
              src='/images/logo.webp'
              alt='Logo ADMIN'
              className='w-10 h-10 rounded-full bg-white p-0.5'
            />
            <h1 className='text-xl font-bold font-outfit text-white'>ICUP ADMIN</h1>
          </a>

          <div className='flex items-center gap-2'>
            {/* Theme Toggle Button */}
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className='h-10 w-10 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white'
            >
              {theme === 'dark' ? (
                <Moon className='w-5 h-5' />
              ) : (
                <Sun className='w-5 h-5' />
              )}
            </Button>

            {/* Menu Button */}
            <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-10 w-10 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white'
                >
                  <Menu className='w-6 h-6' />
                </Button>
              </SheetTrigger>

              <SheetContent
                side='left'
                className='w-[275px] p-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-slate-800/50'
              >
                {/* Sheet Header */}
                <div className='p-5 border-b border-slate-800/50'>
                  <div className='flex items-center justify-between mb-4'>
                    <a href='/dashboard' className='flex items-center gap-3'>
                      <img
                        src='/images/logo.webp'
                        alt='Logo ADMIN'
                        className='w-11 h-11 rounded-full bg-white p-0.5'
                      />
                      <div>
                        <h1 className='text-lg font-bold font-outfit text-white'>
                          ICUP ADMIN
                        </h1>
                        <p className='text-xs text-slate-400'>Panel Administrativo</p>
                      </div>
                    </a>
                  </div>

                  {/* User Info */}
                  <div className='flex items-center gap-3 p-3 rounded-xl bg-white/5'>
                    <Avatar className='h-11 w-11 ring-2 ring-blue-500/30'>
                      <AvatarImage src={avatarSrc} />
                      <AvatarFallback className='bg-blue-600 text-white'>
                        {userNames.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-semibold text-white truncate'>
                        {userNames} {userLastNames}
                      </p>
                      <p className='text-xs text-slate-400 truncate'>
                        {roles.map((role) => UserRoleNames[role]).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Church & Ministry Selector */}
                <div className='px-1 pt-3'>
                  <ChurchMinistrySelector isExpanded onSelect={closeMobile} />
                </div>

                {/* Navigation */}
                <nav className='flex-1 p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]'>
                  {/* Dashboard */}
                  {dashboardItem && (
                    <MobileNavItem
                      href={dashboardItem.href}
                      Icon={dashboardItem.Icon}
                      title={dashboardItem.title}
                      onClose={closeMobile}
                    />
                  )}

                  {/* Membership Section */}
                  {membershipItems.length > 0 && (
                    <Collapsible open={membershipOpen} onOpenChange={setMembershipOpen}>
                      <CollapsibleTrigger asChild>
                        <button
                          className={cn(
                            'w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl',
                            'text-slate-300 hover:bg-white/10 active:bg-white/15',
                            'transition-all duration-200',
                            membershipOpen && 'bg-white/5'
                          )}
                        >
                          <div className='flex items-center gap-3'>
                            <Users className='w-6 h-6 text-emerald-400' />
                            <span className='text-base font-medium'>Membresía</span>
                          </div>
                          <ChevronDown
                            className={cn(
                              'w-5 h-5 transition-transform duration-200',
                              membershipOpen && 'rotate-180'
                            )}
                          />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className='pt-1 pl-4 space-y-0.5 border-l border-slate-700/50 ml-7'>
                        {membershipItems.map((item) => (
                          <MobileNavItem
                            key={item.href}
                            href={item.href}
                            Icon={item.Icon}
                            title={item.title}
                            isNested
                            onClose={closeMobile}
                          />
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* Offerings */}
                  {offeringsItem && (
                    <MobileNavItem
                      href={offeringsItem.href}
                      Icon={offeringsItem.Icon}
                      title={offeringsItem.title}
                      onClose={closeMobile}
                    />
                  )}

                  {/* Metrics */}
                  {metricsItem && (
                    <MobileNavItem
                      href={metricsItem.href}
                      Icon={metricsItem.Icon}
                      title={metricsItem.title}
                      onClose={closeMobile}
                    />
                  )}

                  {/* Settings Section */}
                  {settingsItems.length > 0 && (
                    <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
                      <CollapsibleTrigger asChild>
                        <button
                          className={cn(
                            'w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl',
                            'text-slate-300 hover:bg-white/10 active:bg-white/15',
                            'transition-all duration-200',
                            settingsOpen && 'bg-white/5'
                          )}
                        >
                          <div className='flex items-center gap-3'>
                            <Settings className='w-6 h-6 text-amber-400' />
                            <span className='text-base font-medium'>Configuraciones</span>
                          </div>
                          <ChevronDown
                            className={cn(
                              'w-5 h-5 transition-transform duration-200',
                              settingsOpen && 'rotate-180'
                            )}
                          />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className='pt-1 pl-4 space-y-0.5 border-l border-slate-700/50 ml-7'>
                        {settingsItems.map((item) => (
                          <MobileNavItem
                            key={item.href}
                            href={item.href}
                            Icon={item.Icon}
                            title={item.title}
                            isNested
                            onClose={closeMobile}
                          />
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </nav>

                {/* Footer */}
                <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800/50 bg-slate-900/95'>
                  {/* Theme Options */}
                  <div className='flex items-center justify-center gap-2 mb-3'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setTheme('light')}
                      className={cn(
                        'flex-1 h-9 rounded-lg',
                        theme === 'light'
                          ? 'bg-blue-600/20 text-blue-300'
                          : 'text-slate-400 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      <Sun className='w-4 h-4 mr-1.5' />
                      Claro
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setTheme('dark')}
                      className={cn(
                        'flex-1 h-9 rounded-lg',
                        theme === 'dark'
                          ? 'bg-blue-600/20 text-blue-300'
                          : 'text-slate-400 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      <Moon className='w-4 h-4 mr-1.5' />
                      Oscuro
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setTheme('system')}
                      className={cn(
                        'flex-1 h-9 rounded-lg',
                        theme === 'system'
                          ? 'bg-blue-600/20 text-blue-300'
                          : 'text-slate-400 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      <Monitor className='w-4 h-4 mr-1.5' />
                      Auto
                    </Button>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      closeMobile();
                      logoutUser();
                    }}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl',
                      'text-red-400 hover:bg-red-500/10 active:bg-red-500/15',
                      'transition-all duration-200'
                    )}
                  >
                    <LogOut className='w-5 h-5' />
                    <span className='font-medium'>Cerrar Sesión</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className='md:hidden h-16' />
    </>
  );
};
