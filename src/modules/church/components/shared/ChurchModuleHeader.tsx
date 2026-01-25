import { PiChurch } from 'react-icons/pi';

import { cn } from '@/shared/lib/utils';

type TitleColor = 'slate' | 'green' | 'blue' | 'sky' | 'orange' | 'red';

interface ChurchModuleHeaderProps {
  title: string;
  description: string;
  titleColor?: TitleColor;
  className?: string;
}

const titleColorVariants: Record<TitleColor, string> = {
  slate: 'text-white',
  green: 'text-emerald-400',
  blue: 'text-blue-400',
  sky: 'text-sky-400',
  orange: 'text-orange-400',
  red: 'text-red-400',
};

export const ChurchModuleHeader = ({
  title,
  description,
  titleColor = 'slate',
  className,
}: ChurchModuleHeaderProps): JSX.Element => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800',
        'dark:from-slate-800 dark:via-slate-900 dark:to-slate-950',
        'p-6 md:p-8',
        'opacity-0 animate-slide-in-up',
        className
      )}
      style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
    >
      {/* Background decorative elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-1/2 -right-1/4 w-96 h-96 rounded-full bg-white/5' />
        <div className='absolute -bottom-1/4 -left-1/4 w-64 h-64 rounded-full bg-white/5' />
        <div className='absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-amber-500/10' />
      </div>

      <div className='relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        {/* Title section */}
        <div className='space-y-1'>
          <div className='flex items-center gap-2 mb-2'>
            <span className='px-3 py-1 text-xs font-semibold text-amber-300 bg-amber-500/20 rounded-full font-inter'>
              Membresía
            </span>
          </div>
          <h1
            className={cn(
              'text-2xl md:text-3xl lg:text-4xl font-bold font-outfit',
              titleColorVariants[titleColor]
            )}
          >
            {title}
          </h1>
          <p className='text-slate-300/80 text-sm md:text-base font-inter max-w-xl'>
            {description}
          </p>
        </div>

        {/* Icon */}
        <div className='hidden md:flex items-center justify-center'>
          <div className='p-4 bg-white/10 rounded-2xl backdrop-blur-sm'>
            <PiChurch className='w-12 h-12 text-white/90' />
          </div>
        </div>
      </div>
    </div>
  );
};
