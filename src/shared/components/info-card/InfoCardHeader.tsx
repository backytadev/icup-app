import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

type HeaderVariant = 'blue' | 'orange' | 'green' | 'red' | 'purple' | 'amber';

interface InfoCardHeaderProps {
  title: string;
  description?: string;
  variant?: HeaderVariant;
  icon?: ReactNode;
  badge?: string;
  className?: string;
}

const variantGradientMap: Record<HeaderVariant, string> = {
  blue: 'from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900',
  orange: 'from-orange-500 via-orange-600 to-amber-600 dark:from-orange-700 dark:via-orange-800 dark:to-amber-800',
  green: 'from-emerald-500 via-emerald-600 to-teal-600 dark:from-emerald-700 dark:via-emerald-800 dark:to-teal-800',
  red: 'from-red-500 via-red-600 to-rose-600 dark:from-red-700 dark:via-red-800 dark:to-rose-800',
  purple: 'from-purple-500 via-purple-600 to-indigo-600 dark:from-purple-700 dark:via-purple-800 dark:to-indigo-800',
  amber: 'from-amber-500 via-amber-600 to-orange-600 dark:from-amber-700 dark:via-amber-800 dark:to-orange-800',
};

const variantBadgeMap: Record<HeaderVariant, string> = {
  blue: 'bg-blue-500/20 text-blue-100',
  orange: 'bg-orange-500/20 text-orange-100',
  green: 'bg-emerald-500/20 text-emerald-100',
  red: 'bg-red-500/20 text-red-100',
  purple: 'bg-purple-500/20 text-purple-100',
  amber: 'bg-amber-500/20 text-amber-100',
};

export const InfoCardHeader = ({
  title,
  description,
  variant = 'blue',
  icon,
  badge,
  className,
}: InfoCardHeaderProps): JSX.Element => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-t-2xl',
        'bg-gradient-to-r',
        variantGradientMap[variant],
        'p-5 md:p-6',
        className
      )}
    >
      {/* Decorative elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-1/2 -right-1/4 w-64 h-64 rounded-full bg-white/10' />
        <div className='absolute -bottom-1/4 -left-1/4 w-48 h-48 rounded-full bg-white/5' />
      </div>

      <div className='relative z-10 flex items-start justify-between gap-4'>
        <div className='flex-1 min-w-0'>
          {badge && (
            <span
              className={cn(
                'inline-block px-2.5 py-1 mb-2 text-[11px] font-semibold rounded-full font-inter',
                variantBadgeMap[variant]
              )}
            >
              {badge}
            </span>
          )}
          <h2 className='text-xl md:text-2xl font-bold text-white font-outfit'>
            {title}
          </h2>
          {description && (
            <p className='text-white/80 text-sm font-inter mt-1'>
              {description}
            </p>
          )}
        </div>

        {icon && (
          <div className='flex-shrink-0 p-3 bg-white/10 rounded-xl backdrop-blur-sm'>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
