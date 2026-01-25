import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Users,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';
import type { IconType } from 'react-icons';

import { cn } from '@/shared/lib/utils';
import { menuItems } from '@/shared/data/menu-items-data';
import { useAuthStore } from '@/stores/auth/auth.store';
import { useSidebarStore } from '@/stores/sidebar/sidebar.store';
import { useTheme } from '@/core/theme/theme-provider';
import { UserRoleNames } from '@/modules/user/enums/user-role.enum';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar';

interface SidebarItemProps {
  href: string;
  Icon: IconType;
  title: string;
  isExpanded: boolean;
  isNested?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({
  href,
  Icon,
  title,
  isExpanded,
  isNested = false,
  onClick,
}: SidebarItemProps): JSX.Element => {
  const { pathname } = useLocation();
  const isActive = pathname.startsWith(href);

  const content = (
    <NavLink
      to={href}
      onClick={onClick}
      className={cn(
        'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl',
        'transition-all duration-200 ease-out',
        isNested && 'py-2',
        isActive
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
          : 'text-slate-300 hover:bg-white/10 hover:text-white'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center',
          isExpanded ? 'w-6' : 'w-full',
          isNested && 'w-5'
        )}
      >
        <Icon
          className={cn(
            'transition-transform duration-200',
            isNested ? 'text-xl' : 'text-2xl',
            isActive && 'scale-110'
          )}
        />
      </div>
      {isExpanded && (
        <span
          className={cn(
            'font-medium whitespace-nowrap',
            isNested ? 'text-sm' : 'text-sm'
          )}
        >
          {title}
        </span>
      )}
      {isActive && !isExpanded && (
        <div className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full' />
      )}
    </NavLink>
  );

  if (!isExpanded) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent
            side='right'
            sideOffset={12}
            className='font-medium bg-slate-800 text-white border-slate-700'
            style={{ zIndex: 99999 }}
          >
            {title}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
};

export const Sidebar = (): JSX.Element => {
  const { isExpanded, toggleExpanded } = useSidebarStore();
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const userInfo = useAuthStore((state) => state.user);
  const { theme, setTheme } = useTheme();

  const [membershipOpen, setMembershipOpen] = useState(false);

  const userNames = userInfo?.firstNames ?? 'Usuario';
  const userLastNames = userInfo?.lastNames ?? '';
  const gender = userInfo?.gender;
  const roles = userInfo?.roles ?? [];

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
  const dashboardItem = filteredItems.find((i) => i.href === '/dashboard');
  const offeringsItem = filteredItems.find((i) => i.href === '/offerings');
  const metricsItem = filteredItems.find((i) => i.href === '/metrics');
  const usersItem = filteredItems.find((i) => i.href === '/users');

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
  const avatarSrc = gender === 'male' ? '/images/boy.webp' : '/images/girl.webp';

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-screen sticky top-0 z-40',
        'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950',
        'border-r border-slate-800/50',
        'transition-all duration-300 ease-out',
        isExpanded ? 'w-64' : 'w-20'
      )}
    >
      {/* Header */}
      <div className={cn('p-4', isExpanded ? 'px-5' : 'px-3')}>
        <a
          href='/dashboard'
          className={cn(
            'flex items-center gap-3',
            !isExpanded && 'justify-center'
          )}
        >
          <div className='relative'>
            <div className='absolute -inset-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur opacity-40' />
            <img
              src='/images/logo.webp'
              alt='Logo ICUP'
              className='relative w-12 h-12 rounded-full bg-white p-0.5'
            />
          </div>
          {isExpanded && (
            <div className='flex flex-col'>
              <h1 className='text-xl font-bold font-outfit text-white tracking-tight'>
                ICUP ADMIN
              </h1>
              <span className='text-xs text-slate-400 font-inter'>
                Panel Administrativo
              </span>
            </div>
          )}
        </a>
      </div>

      {/* User Info - Only when expanded */}
      {isExpanded && (
        <div className='px-4 pb-3'>
          <div className='flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-slate-700/50'>
            <Avatar className='h-10 w-10 ring-2 ring-blue-500/30'>
              <AvatarImage src={avatarSrc} />
              <AvatarFallback className='bg-blue-600 text-white text-sm'>
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
      )}

      {/* Toggle Button */}
      <div className={cn('px-3 mb-2', isExpanded && 'px-4')}>
        <button
          onClick={toggleExpanded}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2 rounded-lg',
            'text-slate-400 hover:text-white hover:bg-white/5',
            'transition-all duration-200',
            'border border-slate-700/50 hover:border-slate-600'
          )}
        >
          {isExpanded ? (
            <>
              <ChevronLeft className='w-4 h-4' />
              <span className='text-xs font-medium'>Colapsar</span>
            </>
          ) : (
            <ChevronRight className='w-4 h-4' />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className='flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700'>
        {/* Dashboard */}
        {dashboardItem && (
          <SidebarItem
            href={dashboardItem.href}
            Icon={dashboardItem.Icon}
            title={dashboardItem.title}
            isExpanded={isExpanded}
          />
        )}

        {/* Membership Section */}
        {membershipItems.length > 0 && (
          <Collapsible open={membershipOpen} onOpenChange={setMembershipOpen}>
            {!isExpanded ? (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CollapsibleTrigger asChild>
                      <button
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
                          'text-slate-300 hover:bg-white/10 hover:text-white',
                          'transition-all duration-200',
                          membershipOpen && 'bg-white/5'
                        )}
                      >
                        <div className='flex items-center justify-center w-full'>
                          <Users className='w-6 h-6 text-emerald-400' />
                        </div>
                      </button>
                    </CollapsibleTrigger>
                  </TooltipTrigger>
                  <TooltipContent
                    side='right'
                    sideOffset={12}
                    className='font-medium bg-slate-800 text-white border-slate-700'
                    style={{ zIndex: 99999 }}
                  >
                    Membresía
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
                    'text-slate-300 hover:bg-white/10 hover:text-white',
                    'transition-all duration-200',
                    membershipOpen && 'bg-white/5'
                  )}
                >
                  <div className='flex items-center justify-center w-6'>
                    <Users className='w-6 h-6 text-emerald-400' />
                  </div>
                  <span className='flex-1 text-left text-sm font-medium'>
                    Membresía
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform duration-200',
                      membershipOpen && 'rotate-180'
                    )}
                  />
                </button>
              </CollapsibleTrigger>
            )}
            <CollapsibleContent className='pt-1 space-y-0.5'>
              <div
                className={cn(
                  'space-y-0.5',
                  isExpanded && 'ml-3 pl-3 border-l border-slate-700/50'
                )}
              >
                {membershipItems.map((item) => (
                  <SidebarItem
                    key={item.href}
                    href={item.href}
                    Icon={item.Icon}
                    title={item.title}
                    isExpanded={isExpanded}
                    isNested
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Offerings */}
        {offeringsItem && (
          <SidebarItem
            href={offeringsItem.href}
            Icon={offeringsItem.Icon}
            title={offeringsItem.title}
            isExpanded={isExpanded}
          />
        )}

        {/* Metrics */}
        {metricsItem && (
          <SidebarItem
            href={metricsItem.href}
            Icon={metricsItem.Icon}
            title={metricsItem.title}
            isExpanded={isExpanded}
          />
        )}

        {/* Users */}
        {usersItem && (
          <SidebarItem
            href={usersItem.href}
            Icon={usersItem.Icon}
            title={usersItem.title}
            isExpanded={isExpanded}
          />
        )}
      </nav>

      {/* Footer */}
      <div className='p-3 space-y-2 border-t border-slate-800/50'>
        {/* Theme Toggle */}
        <DropdownMenu>
          {!isExpanded ? (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      className={cn(
                        'w-full flex items-center justify-center px-3 py-2.5 h-auto rounded-xl',
                        'text-slate-300 hover:bg-white/10 hover:text-white',
                        'transition-all duration-200'
                      )}
                    >
                      <ThemeIcon className='w-5 h-5' />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent
                  side='right'
                  sideOffset={12}
                  className='font-medium bg-slate-800 text-white border-slate-700'
                  style={{ zIndex: 99999 }}
                >
                  Cambiar tema
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 h-auto rounded-xl',
                  'text-slate-300 hover:bg-white/10 hover:text-white',
                  'transition-all duration-200'
                )}
              >
                <ThemeIcon className='w-5 h-5' />
                <span className='text-sm font-medium'>
                  {theme === 'dark' ? 'Oscuro' : theme === 'light' ? 'Claro' : 'Sistema'}
                </span>
              </Button>
            </DropdownMenuTrigger>
          )}
          <DropdownMenuContent
            side={isExpanded ? 'top' : 'right'}
            align='start'
            sideOffset={8}
            className='min-w-[140px] bg-slate-800 backdrop-blur-md border-slate-700 rounded-xl'
            style={{ zIndex: 99999 }}
          >
            <DropdownMenuItem
              onClick={() => setTheme('light')}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium cursor-pointer rounded-lg mx-1 my-0.5',
                theme === 'light'
                  ? 'bg-blue-600/20 text-blue-300'
                  : 'text-slate-300 hover:bg-slate-700/50'
              )}
            >
              <Sun className='h-4 w-4 text-amber-400' />
              <span>Claro</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme('dark')}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium cursor-pointer rounded-lg mx-1 my-0.5',
                theme === 'dark'
                  ? 'bg-blue-600/20 text-blue-300'
                  : 'text-slate-300 hover:bg-slate-700/50'
              )}
            >
              <Moon className='h-4 w-4 text-blue-400' />
              <span>Oscuro</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme('system')}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium cursor-pointer rounded-lg mx-1 my-0.5',
                theme === 'system'
                  ? 'bg-blue-600/20 text-blue-300'
                  : 'text-slate-300 hover:bg-slate-700/50'
              )}
            >
              <Monitor className='h-4 w-4 text-slate-400' />
              <span>Sistema</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Logout */}
        {!isExpanded ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={logoutUser}
                  className={cn(
                    'w-full flex items-center justify-center px-3 py-2.5 rounded-xl',
                    'text-red-400 hover:bg-red-500/10 hover:text-red-300',
                    'transition-all duration-200'
                  )}
                >
                  <LogOut className='w-5 h-5' />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side='right'
                sideOffset={12}
                className='font-medium bg-slate-800 text-white border-slate-700'
                style={{ zIndex: 99999 }}
              >
                Cerrar Sesión
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <button
            onClick={logoutUser}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
              'text-red-400 hover:bg-red-500/10 hover:text-red-300',
              'transition-all duration-200'
            )}
          >
            <LogOut className='w-5 h-5' />
            <span className='text-sm font-medium'>Cerrar Sesión</span>
          </button>
        )}
      </div>
    </aside>
  );
};
