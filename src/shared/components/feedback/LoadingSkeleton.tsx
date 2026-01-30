import { cn } from '@/shared/lib/utils';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'chart' | 'stat' | 'text' | 'avatar' | 'button';
  count?: number;
  className?: string;
}

export const LoadingSkeleton = ({
  variant = 'text',
  count = 1,
  className,
}: LoadingSkeletonProps): JSX.Element => {
  const items = Array.from({ length: count }, (_, i) => i);

  const renderSkeleton = (index: number) => {
    switch (variant) {
      case 'card':
        return (
          <div
            key={index}
            className={cn(
              'rounded-xl border border-slate-200 dark:border-slate-700/50 p-4',
              'bg-white dark:bg-slate-900',
              className
            )}
          >
            <div className='space-y-3'>
              <div className='h-4 w-3/4 rounded-md shimmer' />
              <div className='h-3 w-1/2 rounded-md shimmer' />
              <div className='h-24 w-full rounded-lg shimmer mt-4' />
            </div>
          </div>
        );

      case 'list':
        return (
          <div
            key={index}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg',
              'border border-slate-100 dark:border-slate-800',
              className
            )}
          >
            <div className='h-10 w-10 rounded-full shimmer flex-shrink-0' />
            <div className='flex-1 space-y-2'>
              <div className='h-3 w-3/4 rounded shimmer' />
              <div className='h-2 w-1/2 rounded shimmer' />
            </div>
          </div>
        );

      case 'chart':
        return (
          <div
            key={index}
            className={cn(
              'rounded-xl border border-slate-200 dark:border-slate-700/50 p-4',
              'bg-white dark:bg-slate-900',
              className
            )}
          >
            <div className='space-y-3'>
              <div className='flex justify-between items-center mb-4'>
                <div className='h-5 w-1/3 rounded shimmer' />
                <div className='h-8 w-24 rounded-lg shimmer' />
              </div>
              <div className='h-[200px] w-full rounded-lg shimmer' />
            </div>
          </div>
        );

      case 'stat':
        return (
          <div
            key={index}
            className={cn(
              'rounded-xl border border-slate-200 dark:border-slate-700/50 p-4',
              'bg-white dark:bg-slate-900',
              className
            )}
          >
            <div className='flex items-start justify-between'>
              <div className='space-y-2'>
                <div className='h-3 w-20 rounded shimmer' />
                <div className='h-8 w-16 rounded shimmer' />
              </div>
              <div className='h-10 w-10 rounded-lg shimmer' />
            </div>
          </div>
        );

      case 'avatar':
        return (
          <div
            key={index}
            className={cn('h-10 w-10 rounded-full shimmer', className)}
          />
        );

      case 'button':
        return (
          <div
            key={index}
            className={cn('h-10 w-24 rounded-lg shimmer', className)}
          />
        );

      case 'text':
      default:
        return (
          <div
            key={index}
            className={cn('h-4 w-full rounded shimmer', className)}
          />
        );
    }
  };

  return (
    <div className='space-y-3'>
      {items.map((_, index) => renderSkeleton(index))}
    </div>
  );
};

interface CardSkeletonProps {
  className?: string;
  showHeader?: boolean;
  showChart?: boolean;
  chartHeight?: string;
}

export const CardSkeleton = ({
  className,
  showHeader = true,
  showChart = false,
  chartHeight = 'h-[200px]',
}: CardSkeletonProps): JSX.Element => {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden',
        'bg-white dark:bg-slate-900',
        className
      )}
    >
      {showHeader && (
        <div className='px-4 md:px-5 pt-4 pb-3'>
          <div className='flex flex-col sm:flex-row items-start justify-between'>
            <div className='flex items-start gap-3'>
              <div className='p-2 rounded-lg shimmer h-10 w-10' />
              <div className='space-y-1.5'>
                <div className='h-5 w-36 md:w-44 rounded shimmer' />
                <div className='h-3 w-48 md:w-56 rounded shimmer' />
              </div>
            </div>
            <div className='h-9 w-32 rounded-lg shimmer mx-auto sm:mx-0 mt-3 sm:mt-0' />
          </div>
        </div>
      )}

      <div className='p-4'>
        {showChart ? (
          <div className={cn(chartHeight, 'w-full rounded-lg shimmer')} />
        ) : (
          <div className='space-y-3'>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className='flex items-center gap-3 p-2'>
                <div className='h-10 w-10 rounded-full shimmer flex-shrink-0' />
                <div className='flex-1 space-y-1.5'>
                  <div className='h-3 w-3/4 rounded shimmer' />
                  <div className='h-2 w-1/2 rounded shimmer' />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ListSkeletonProps {
  count?: number;
  className?: string;
}

export const ListSkeleton = ({ count = 5, className }: ListSkeletonProps): JSX.Element => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className='flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800'
        >
          <div className='h-10 w-10 rounded-full shimmer flex-shrink-0' />
          <div className='flex-1 space-y-1.5'>
            <div className='h-3.5 w-3/4 rounded shimmer' />
            <div className='h-2.5 w-1/2 rounded shimmer' />
          </div>
          <div className='h-6 w-16 rounded shimmer' />
        </div>
      ))}
    </div>
  );
};
