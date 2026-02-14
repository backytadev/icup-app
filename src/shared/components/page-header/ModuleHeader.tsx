import { type IconType } from 'react-icons';

import { cn } from '@/shared/lib/utils';

type TitleColor = 'slate' | 'green' | 'blue' | 'sky' | 'orange' | 'red';
type BadgeColor = 'blue' | 'amber' | 'green' | 'purple' | 'red';
type AccentColor = 'blue' | 'amber' | 'green' | 'purple' | 'red';

interface ModuleHeaderProps {
  title: string;
  description: string;
  titleColor?: TitleColor;
  className?: string;
  badge?: string;
  badgeColor?: BadgeColor;
  icon?: IconType;
  accentColor?: AccentColor;
}

const titleColorVariantsLight: Record<TitleColor, string> = {
  slate: 'text-slate-700',
  green: 'text-emerald-600',
  blue: 'text-blue-600',
  sky: 'text-sky-600',
  orange: 'text-orange-600',
  red: 'text-red-600',
};

const titleColorVariantsDark: Record<TitleColor, string> = {
  slate: 'dark:text-white',
  green: 'dark:text-emerald-400',
  blue: 'dark:text-blue-400',
  sky: 'dark:text-sky-400',
  orange: 'dark:text-orange-400',
  red: 'dark:text-red-400',
};

const badgeColorVariants: Record<BadgeColor, string> = {
  blue: 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-500/20',
  amber: 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-500/20',
  green: 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-500/20',
  purple: 'text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-500/20',
  red: 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-500/20',
};

const accentColorVariants: Record<AccentColor, string> = {
  blue: 'bg-blue-200/30 dark:bg-blue-500/10',
  amber: 'bg-amber-200/30 dark:bg-amber-500/10',
  green: 'bg-emerald-200/30 dark:bg-emerald-500/10',
  purple: 'bg-purple-200/30 dark:bg-purple-500/10',
  red: 'bg-red-200/30 dark:bg-red-500/10',
};

export const ModuleHeader = ({
  title,
  description,
  titleColor = 'slate',
  className,
  badge,
  badgeColor = 'blue',
  icon: Icon,
  accentColor = 'blue',
}: ModuleHeaderProps): JSX.Element => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-gradient-to-r from-slate-100 via-slate-50 to-white border border-slate-200/80',
        'dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 dark:border-slate-700/50',
        'p-6 md:p-8',
        'opacity-0 animate-slide-in-up',
        className
      )}
      style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
    >
      {/* Background decorative elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-1/2 -right-1/4 w-96 h-96 rounded-full bg-slate-200/50 dark:bg-white/5' />
        <div className='absolute -bottom-1/4 -left-1/4 w-64 h-64 rounded-full bg-slate-200/50 dark:bg-white/5' />
        <div className={cn('absolute top-1/4 right-1/4 w-32 h-32 rounded-full', accentColorVariants[accentColor])} />
      </div>

      <div className='relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        {/* Title section */}
        <div className='space-y-1'>
          {badge && (
            <div className='flex items-center gap-2 mb-2'>
              <span
                className={cn(
                  'px-3 py-1 text-xs font-semibold rounded-full font-inter',
                  badgeColorVariants[badgeColor]
                )}
              >
                {badge}
              </span>
            </div>
          )}
          <h1
            className={cn(
              'text-2xl md:text-3xl lg:text-4xl font-bold font-outfit',
              titleColorVariantsLight[titleColor],
              titleColorVariantsDark[titleColor]
            )}
          >
            {title}
          </h1>
          <p className='text-slate-500 dark:text-slate-300/80 text-sm md:text-base font-inter max-w-xl'>
            {description}
          </p>
        </div>

        {/* Icon */}
        {Icon && (
          <div className='hidden md:flex items-center justify-center'>
            <div className='p-4 bg-slate-200/70 dark:bg-white/10 rounded-2xl backdrop-blur-sm'>
              <Icon className='w-12 h-12 text-slate-600 dark:text-white/90' />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
