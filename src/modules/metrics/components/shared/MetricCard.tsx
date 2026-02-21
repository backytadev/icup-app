import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { FcDataBackup } from 'react-icons/fc';
import { CardSkeleton } from '@/shared/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/shared/components/feedback/EmptyState';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card';

interface MetricCardProps {
  title: ReactNode;
  description?: string;
  subTitle?: string;
  headerAction?: ReactNode;
  children: ReactNode;
  isLoading?: boolean;
  isFetching?: boolean;
  icon?: ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
  className?: string;
  contentClassName?: string;
}

export const MetricCard = ({
  title,
  description,
  subTitle,
  icon,
  headerAction,
  children,
  isLoading,
  isFetching,
  isEmpty,
  emptyMessage,
  className,
  contentClassName,
}: MetricCardProps): JSX.Element => {
  if (isLoading) {
    return (
      <CardSkeleton
        className={cn('h-auto', className)}
        showHeader
        showChart
        chartHeight='h-[200px]'
      />
    );
  }

  return (
    <Card
      className={cn(
        'overflow-hidden',
        'border-slate-200/80 dark:border-slate-700/50',
        'bg-white dark:bg-slate-900',
        'shadow-sm hover:shadow-md transition-shadow duration-300',
        className
      )}
    >
      <CardHeader className='flex flex-col sm:flex-row items-start justify-between space-y-0 pb-3 pt-4 px-4 md:px-5'>
        <div className='flex items-start gap-3'>
          {icon && (
            <div className='p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:from-blue-500/20 dark:to-blue-600/10'>
              {icon}
            </div>
          )}
          <div className='flex flex-col'>
            <CardTitle className='flex items-center gap-2 text-base md:text-lg font-semibold font-outfit text-slate-800 dark:text-slate-100'>
              {title}
            </CardTitle>
            {(description ?? subTitle) && (
              <CardDescription className='text-sm text-slate-500 dark:text-slate-400 font-inter mt-0.5'>
                {description ?? subTitle}
              </CardDescription>
            )}
          </div>
        </div>
        {headerAction && (
          <div className='flex-shrink-0 mx-auto sm:m-0 pt-2 sm:pt-0'>{headerAction}</div>
        )}
      </CardHeader>

      <CardContent className={cn('px-3 md:px-5 pb-4', contentClassName)}>
        {isFetching ? (
          <div className='flex flex-col items-center justify-center py-8'>
            <FcDataBackup className='text-[4rem] mb-2' />
            <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>Consultando datos...</p>
          </div>
        ) : isEmpty ? (
          <EmptyState variant='chart' description={emptyMessage} className='py-6' />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};
