import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface InfoItemCardProps {
  children: ReactNode;
  className?: string;
}

export function InfoItemCard({ children, className }: InfoItemCardProps): JSX.Element {
  return (
    <div
      className={cn(
        'group relative flex items-center justify-between gap-4 p-3.5 rounded-xl',
        'bg-gradient-to-r from-white to-slate-50/80',
        'dark:from-slate-800/60 dark:to-slate-800/40',
        'border border-slate-200/70 dark:border-slate-700/50',
        'hover:border-blue-300/60 dark:hover:border-blue-600/40',
        'hover:shadow-md hover:shadow-blue-500/5',
        'transition-all duration-300 ease-out',
        className
      )}
    >
      {/* Subtle gradient accent on hover */}
      <div className='absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/[0.02] group-hover:via-blue-500/[0.03] group-hover:to-indigo-500/[0.02] transition-all duration-300' />
      <div className='relative flex items-center justify-between gap-4 w-full'>{children}</div>
    </div>
  );
}
