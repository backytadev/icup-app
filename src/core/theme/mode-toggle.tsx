import { Moon, Sun } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/core/theme/theme-provider';

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';

export function ModeToggle(): JSX.Element {
  const { pathname } = useLocation();
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className={cn(
            'bg-slate-900 hover:bg-slate-800 hover:text-white dark:bg-slate-900 dark:border-white hover:md:bg-slate-100 hover:md:text-black dark:hover:bg-slate-800 focus:ring-2 focus:ring-white focus:ring-opacity-50 md:border-black md:bg-white dark:md:text-white dark:md:bg-slate-950 dark:md:border-white dark:md:hover:bg-slate-800',
            pathname === '/auth/login' &&
              'dark:bg-slate-900 hover:text-black bg-white hover:bg-slate-100 border-slate-900 dark:text-white ring-0',
            'focus:ring-2 focus:ring-white focus:ring-opacity-50' // Clases para el ring
          )}
        >
          <Sun className='h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-[1.5rem] w-[1.5rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          className='text-[15px] md:text-[14px]'
          onClick={() => {
            setTheme('light');
          }}
        >
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem
          className='text-[15px] md:text-[14px]'
          onClick={() => {
            setTheme('dark');
          }}
        >
          Oscuro
        </DropdownMenuItem>
        <DropdownMenuItem
          className='text-[15px] md:text-[14px]'
          onClick={() => {
            setTheme('system');
          }}
        >
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
