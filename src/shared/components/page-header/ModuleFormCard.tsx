import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface ModuleFormCardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const ModuleFormCard = ({
  children,
  title,
  description,
  className,
}: ModuleFormCardProps): JSX.Element => {
  return (
    <div
      className={cn(
        'relative w-full',
        'rounded-2xl',
        'bg-white/95 dark:bg-slate-900/95',
        'backdrop-blur-xl',
        'border border-slate-200/60 dark:border-slate-700/40',
        'shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50',
        'p-4 md:p-6',
        'opacity-0 animate-fade-in-scale',
        className
      )}
      style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
    >
      {(title ?? description) && (
        <div className='mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-700/40'>
          {title && (
            <h2 className='text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 font-outfit'>
              {title}
            </h2>
          )}
          {description && (
            <p className='mt-1 text-sm text-slate-500 dark:text-slate-400 font-inter'>
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
