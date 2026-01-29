import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

type ColSpan = 1 | 2 | 3 | 4;

interface InfoCardFieldProps {
  label: string;
  value: ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  colSpan?: ColSpan;
  labelClassName?: string;
  valueClassName?: string;
  layout?: 'vertical' | 'horizontal';
}

const colSpanMap: Record<ColSpan, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
};

export const InfoCardField = ({
  label,
  value,
  icon: Icon,
  className,
  colSpan = 1,
  labelClassName,
  valueClassName,
  layout = 'vertical',
}: InfoCardFieldProps): JSX.Element => {
  const isHorizontal = layout === 'horizontal';

  return (
    <div
      className={cn(
        'group',
        colSpanMap[colSpan],
        isHorizontal && 'flex justify-between items-center',
        className
      )}
    >
      <div className={cn('flex items-center gap-2 mb-1.5', isHorizontal && 'mb-0')}>
        {Icon && (
          <div className='p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-200'>
            <Icon className='w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200' />
          </div>
        )}
        <span
          className={cn(
            'text-[12px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-inter',
            labelClassName
          )}
        >
          {label}
        </span>
      </div>
      <p
        className={cn(
          'text-[14px] md:text-[15px] font-medium text-slate-700 dark:text-slate-200 font-inter',
          !isHorizontal && 'pl-1',
          isHorizontal && 'text-right',
          valueClassName
        )}
      >
        {value ?? '-'}
      </p>
    </div>
  );
};
