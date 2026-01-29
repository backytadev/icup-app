import { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

import { cn } from '@/shared/lib/utils';
import { MdBlock } from 'react-icons/md';

interface ChurchOptionCardProps {
  to: string;
  icon: ReactNode;
  title: string;
  description: string;
  color: 'green' | 'blue' | 'sky' | 'orange' | 'red';
  disabled?: boolean;
  delay?: string;
}

const colorVariants = {
  green: {
    gradient: 'from-emerald-500 via-emerald-600 to-teal-600',
    darkGradient: 'dark:from-emerald-600 dark:via-emerald-700 dark:to-teal-700',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-100',
    hoverShadow: 'hover:shadow-emerald-500/20',
    borderAccent: 'border-emerald-400/30',
  },
  blue: {
    gradient: 'from-blue-500 via-blue-600 to-indigo-600',
    darkGradient: 'dark:from-blue-600 dark:via-blue-700 dark:to-indigo-700',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-100',
    hoverShadow: 'hover:shadow-blue-500/20',
    borderAccent: 'border-blue-400/30',
  },
  sky: {
    gradient: 'from-sky-500 via-cyan-600 to-blue-600',
    darkGradient: 'dark:from-sky-600 dark:via-cyan-700 dark:to-blue-700',
    iconBg: 'bg-sky-500/20',
    iconColor: 'text-sky-100',
    hoverShadow: 'hover:shadow-sky-500/20',
    borderAccent: 'border-sky-400/30',
  },
  orange: {
    gradient: 'from-orange-500 via-amber-600 to-yellow-600',
    darkGradient: 'dark:from-orange-600 dark:via-amber-700 dark:to-yellow-700',
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-100',
    hoverShadow: 'hover:shadow-orange-500/20',
    borderAccent: 'border-orange-400/30',
  },
  red: {
    gradient: 'from-red-500 via-rose-600 to-pink-600',
    darkGradient: 'dark:from-red-600 dark:via-rose-700 dark:to-pink-700',
    iconBg: 'bg-red-500/20',
    iconColor: 'text-red-100',
    hoverShadow: 'hover:shadow-red-500/20',
    borderAccent: 'border-red-400/30',
  },
};

export const ChurchOptionCard = ({
  to,
  icon,
  title,
  description,
  color,
  disabled = false,
  delay = '0.2s',
}: ChurchOptionCardProps): JSX.Element => {
  const variant = colorVariants[color];

  return (
    <NavLink
      to={disabled ? '#' : to}
      onClick={(e) => {
        if (disabled) e.preventDefault();
      }}
      className={cn(
        'group block opacity-0 animate-slide-in-up',
        disabled && 'cursor-not-allowed'
      )}
      style={{ animationDelay: delay, animationFillMode: 'forwards' }}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl h-full min-h-[180px]',
          'bg-gradient-to-br',
          variant.gradient,
          variant.darkGradient,
          'p-6',
          'transition-all duration-300 ease-out',
          !disabled && [
            'hover:scale-[1.02]',
            'hover:shadow-2xl',
            variant.hoverShadow,
          ],
          'border border-white/10',
          disabled && 'opacity-60'
        )}
      >
        {/* Background pattern */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-white/5 transition-transform duration-500 group-hover:scale-150' />
          <div className='absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-black/5' />
        </div>

        {/* Content */}
        <div className='relative z-10 flex flex-col h-full'>
          {/* Icon */}
          <div
            className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
              variant.iconBg,
              'backdrop-blur-sm',
              'transition-transform duration-300 group-hover:scale-110'
            )}
          >
            <span className={cn('text-3xl', variant.iconColor)}>{icon}</span>
          </div>

          {/* Title & Description */}
          <h3 className='text-xl md:text-2xl font-bold text-white font-outfit mb-2'>
            {title}
          </h3>
          <p className='text-sm text-white/80 font-inter leading-relaxed pr-10'>
            {description}
          </p>
        </div>

        {/* Arrow indicator */}
        {!disabled && (
          <div className='absolute bottom-6 right-6 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1'>
            <svg
              className='w-4 h-4 text-white'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </div>
        )}

        {/* Disabled overlay */}
        {disabled && (
          <div className='absolute inset-0 z-20 bg-slate-900/50 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center'>
            <div className='w-12 h-12 rounded-full bg-red-500/80 flex items-center justify-center mb-2'>
              <MdBlock className='w-6 h-6 text-white' />
            </div>
            <span className='text-sm font-semibold text-white/90 font-inter'>
              Acceso restringido
            </span>
          </div>
        )}
      </div>
    </NavLink>
  );
};
