import { Moon, Sun, Monitor } from 'lucide-react';

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
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className={cn(
            'h-10 w-10 rounded-xl',
            'bg-white/80 dark:bg-slate-800/80',
            'backdrop-blur-md',
            'border border-slate-200/60 dark:border-slate-700/60',
            'hover:bg-slate-100 dark:hover:bg-slate-700',
            'hover:border-slate-300 dark:hover:border-slate-600',
            'shadow-sm hover:shadow-md',
            'transition-all duration-200',
            'focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0'
          )}
        >
          <Sun className='h-[1.2rem] w-[1.2rem] text-amber-500 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] text-blue-400 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Cambiar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='min-w-[140px] bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-slate-200/60 dark:border-slate-700/60 rounded-xl shadow-lg'
      >
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={cn(
            'flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium cursor-pointer rounded-lg mx-1 my-0.5',
            'transition-colors duration-150',
            theme === 'light'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'
          )}
        >
          <Sun className='h-4 w-4 text-amber-500' />
          <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={cn(
            'flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium cursor-pointer rounded-lg mx-1 my-0.5',
            'transition-colors duration-150',
            theme === 'dark'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'
          )}
        >
          <Moon className='h-4 w-4 text-blue-400' />
          <span>Oscuro</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={cn(
            'flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium cursor-pointer rounded-lg mx-1 my-0.5',
            'transition-colors duration-150',
            theme === 'system'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'
          )}
        >
          <Monitor className='h-4 w-4 text-slate-500 dark:text-slate-400' />
          <span>Sistema</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
