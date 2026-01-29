import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

type SectionVariant = 'yellow' | 'red' | 'blue' | 'green' | 'purple' | 'amber' | 'slate';

interface InfoCardSectionProps {
  title: string;
  variant?: SectionVariant;
  children?: ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3 | 4;
  asDivider?: boolean;
}

const variantColorMap: Record<SectionVariant, string> = {
  yellow: 'text-yellow-600 dark:text-yellow-400',
  red: 'text-red-600 dark:text-red-400',
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-emerald-600 dark:text-emerald-400',
  purple: 'text-purple-600 dark:text-purple-400',
  amber: 'text-amber-600 dark:text-amber-400',
  slate: 'text-slate-500 dark:text-slate-400',
};

const variantBorderMap: Record<SectionVariant, string> = {
  yellow: 'border-yellow-200 dark:border-yellow-900/50',
  red: 'border-red-200 dark:border-red-900/50',
  blue: 'border-blue-200 dark:border-blue-900/50',
  green: 'border-emerald-200 dark:border-emerald-900/50',
  purple: 'border-purple-200 dark:border-purple-900/50',
  amber: 'border-amber-200 dark:border-amber-900/50',
  slate: 'border-slate-200 dark:border-slate-700/50',
};

const colSpanMap: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
};

export const InfoCardSection = ({
  title,
  variant = 'amber',
  children,
  className,
  colSpan = 4,
  asDivider = true,
}: InfoCardSectionProps): JSX.Element => {
  if (asDivider) {
    return (
      <div className={cn(colSpanMap[colSpan], 'relative my-2', className)}>
        <div className='absolute inset-0 flex items-center'>
          <div className={cn('w-full border-t', variantBorderMap[variant])} />
        </div>
        <div className='relative flex justify-center'>
          <span
            className={cn(
              'px-3 bg-white dark:bg-slate-900',
              'text-[12px] font-semibold uppercase tracking-wider font-inter',
              variantColorMap[variant]
            )}
          >
            {title}
          </span>
        </div>
        {children}
      </div>
    );
  }

  return (
    <>
      <span
        className={cn(
          'pt-1 md:pt-0 text-[15px] md:text-[16px] font-bold',
          variantColorMap[variant],
          colSpanMap[colSpan],
          className
        )}
      >
        {title}
      </span>
      {children}
    </>
  );
};
