import { HiOutlineSearchCircle } from 'react-icons/hi';
import { TbListDetails } from 'react-icons/tb';
import { PiChurch } from 'react-icons/pi';

import { cn } from '@/shared/lib/utils';

interface SearchMetadata {
  title: string;
  subtitle?: string;
  recordCount: number;
  churchName?: string;
}

interface DataTableHeaderProps {
  searchMetadata: SearchMetadata;
  className?: string;
}

export const DataTableHeader = ({
  searchMetadata,
  className,
}: DataTableHeaderProps): JSX.Element => {
  const { title, subtitle, recordCount, churchName } = searchMetadata;

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'p-4 md:p-5',
        'rounded-xl',
        'bg-gradient-to-r from-slate-50 via-white to-slate-50',
        'dark:from-slate-800/50 dark:via-slate-900/50 dark:to-slate-800/50',
        'border border-slate-200/60 dark:border-slate-700/40',
        className
      )}
    >
      {/* Decorative accent */}
      <div className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 via-amber-500 to-orange-500' />

      <div className='flex flex-wrap items-center gap-4 md:gap-6'>
        {/* Search Type */}
        <div className='flex items-center gap-2.5'>
          <div className='p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30'>
            <HiOutlineSearchCircle className='w-4 h-4 text-amber-600 dark:text-amber-400' />
          </div>
          <div>
            <span className='block text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-inter'>
              Búsqueda
            </span>
            <span className='block text-[13px] md:text-[14px] font-medium text-slate-700 dark:text-slate-200 font-inter'>
              {title}
              {subtitle && (
                <span className='text-slate-500 dark:text-slate-400'> - {subtitle}</span>
              )}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className='hidden md:block h-10 w-px bg-slate-200 dark:bg-slate-700' />

        {/* Church Name (if provided) */}
        {churchName && (
          <>
            <div className='flex items-center gap-2.5'>
              <div className='p-2 rounded-lg bg-sky-100 dark:bg-sky-900/30'>
                <PiChurch className='w-4 h-4 text-sky-600 dark:text-sky-400' />
              </div>
              <div>
                <span className='block text-[11px] font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 font-inter'>
                  Iglesia
                </span>
                <span className='block text-[13px] md:text-[14px] font-medium text-slate-700 dark:text-slate-200 font-inter'>
                  {churchName}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className='hidden md:block h-10 w-px bg-slate-200 dark:bg-slate-700' />
          </>
        )}

        {/* Record Count */}
        <div className='flex items-center gap-2.5'>
          <div className='p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30'>
            <TbListDetails className='w-4 h-4 text-purple-600 dark:text-purple-400' />
          </div>
          <div>
            <span className='block text-[11px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-inter'>
              Registros
            </span>
            <span className='block text-[13px] md:text-[14px] font-medium text-slate-700 dark:text-slate-200 font-inter'>
              {recordCount} {recordCount === 1 ? 'registro' : 'registros'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
