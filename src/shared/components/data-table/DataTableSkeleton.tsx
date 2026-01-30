import { cn } from '@/shared/lib/utils';

interface DataTableSkeletonProps {
  columns?: number;
  rows?: number;
  className?: string;
  showHeader?: boolean;
  showFilters?: boolean;
  showPagination?: boolean;
}

export const DataTableSkeleton = ({
  columns = 5,
  rows = 5,
  className,
  showHeader = true,
  showFilters = true,
}: DataTableSkeletonProps): JSX.Element => {
  return (
    <div className={cn('space-y-4', className)}>
      {/* 1. Header Skeleton - Search metadata */}
      {showHeader && (
        <div
          className={cn(
            'relative overflow-hidden',
            'p-4 md:p-5',
            'rounded-xl',
            'bg-slate-50/80 dark:bg-slate-800/30',
            'border border-slate-200/60 dark:border-slate-700/40'
          )}
        >
          <div className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-300 via-slate-200 to-slate-300 dark:from-slate-600 dark:via-slate-700 dark:to-slate-600 animate-pulse' />
          <div className='flex flex-wrap items-center gap-4 md:gap-6'>
            <div className='flex items-center gap-2.5'>
              <div className='w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse' />
              <div className='space-y-2'>
                <div className='h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
                <div className='h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
              </div>
            </div>
            <div className='hidden md:block h-10 w-px bg-slate-200 dark:bg-slate-700' />
            <div className='flex items-center gap-2.5'>
              <div className='w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse' />
              <div className='space-y-2'>
                <div className='h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
                <div className='h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Filters Skeleton - Table filters */}
      {showFilters && (
        <div
          className={cn(
            'flex flex-col md:flex-row gap-3 md:items-center',
            'p-4 md:p-5',
            'rounded-xl',
            'bg-slate-50/50 dark:bg-slate-800/30',
            'border border-slate-200/60 dark:border-slate-700/40'
          )}
        >
          <div className='flex flex-1 flex-wrap gap-3'>
            <div className='flex-1 min-w-[180px] h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse' />
            <div className='flex-1 min-w-[180px] h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse' />
          </div>
          <div className='flex gap-2 mt-2 md:mt-0'>
            <div className='h-9 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse' />
            <div className='h-9 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse' />
          </div>
        </div>
      )}

      {/* 3. Table Skeleton - Data table */}
      <div
        className={cn(
          'relative overflow-hidden',
          'rounded-xl',
          'border border-slate-200/80 dark:border-slate-700/50',
          'bg-white dark:bg-slate-900/80'
        )}
      >
        {/* Decorative top gradient line */}
        <div className='absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-slate-300/50 via-slate-200/50 to-slate-300/50 dark:from-slate-600/50 dark:via-slate-700/50 dark:to-slate-600/50' />

        {/* Header */}
        <div className='bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-700/50'>
          <div className='flex'>
            {Array.from({ length: columns }).map((_, i) => (
              <div
                key={`header-${i}`}
                className='flex-1 px-4 py-4'
              >
                <div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto animate-pulse' />
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className='divide-y divide-slate-100 dark:divide-slate-800/50'>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className={cn(
                'flex',
                rowIndex % 2 === 0 ? 'bg-white dark:bg-slate-900/50' : 'bg-slate-50/30 dark:bg-slate-800/20'
              )}
              style={{ animationDelay: `${rowIndex * 0.05}s` }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className='flex-1 px-4 py-3'
                >
                  <div
                    className='h-4 bg-slate-200 dark:bg-slate-700 rounded mx-auto animate-pulse'
                    style={{
                      width: `${Math.random() * 30 + 50}%`,
                      animationDelay: `${(rowIndex * columns + colIndex) * 0.02}s`,
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Pagination Skeleton - Report button + pagination */}
      <div
        className={cn(
          'flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4',
          'p-3 sm:p-4 rounded-xl',
          'bg-slate-50/50 dark:bg-slate-800/30',
          'border border-slate-200/60 dark:border-slate-700/40'
        )}
      >
        {/* Report button skeleton */}
        <div className='flex items-center w-full sm:w-auto justify-center sm:justify-start'>
          <div className='h-9 sm:h-10 w-32 sm:w-36 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse' />
        </div>

        {/* Page info + Navigation - same row on mobile */}
        <div className='flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto'>
          {/* Page info skeleton */}
          <div className='flex items-center gap-1'>
            <div className='h-3 w-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
            <div className='h-6 w-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md animate-pulse' />
            <div className='h-3 w-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
          </div>

          {/* Navigation buttons skeleton */}
          <div className='flex items-center gap-1'>
            <div className='h-8 w-8 sm:h-9 sm:w-9 bg-slate-200 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 animate-pulse' />
            <div className='h-8 w-8 sm:h-9 sm:w-20 bg-slate-200 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 animate-pulse' />
            <div className='h-8 w-8 sm:h-9 sm:w-20 bg-slate-200 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 animate-pulse' />
            <div className='h-8 w-8 sm:h-9 sm:w-9 bg-slate-200 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 animate-pulse' />
          </div>
        </div>
      </div>
    </div>
  );
};
