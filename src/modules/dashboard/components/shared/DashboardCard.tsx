import { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { CardSkeleton } from '@/shared/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/shared/components/feedback/EmptyState';

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/shared/components/ui/card';

interface DashboardCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyVariant?: 'default' | 'chart' | 'member';
  emptyMessage?: string;
  className?: string;
  contentClassName?: string;
}

export const DashboardCard = ({
  title,
  description,
  icon,
  headerAction,
  children,
  isLoading,
  isEmpty,
  emptyVariant = 'default',
  emptyMessage,
  className,
  contentClassName,
}: DashboardCardProps): JSX.Element => {
  if (isLoading) {
    return <CardSkeleton className={className} showHeader showChart />;
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
      {/* Header */}
      <CardHeader className='flex flex-col sm:flex-row items-start justify-between space-y-0 pb-3 pt-4 px-4 md:px-5'>
        <div className='flex items-start gap-3'>
          {icon && (
            <div className='p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:from-blue-500/20 dark:to-blue-600/10'>
              {icon}
            </div>
          )}
          <div>
            <CardTitle className='text-lg md:text-xl font-semibold font-outfit text-slate-800 dark:text-slate-100'>
              {title}
            </CardTitle>
            <CardDescription className='text-sm text-slate-500 dark:text-slate-400 font-inter mt-0.5'>
              {description}
            </CardDescription>
          </div>
        </div>
        {headerAction && <div className='flex-shrink-0 mx-auto sm:m-0 pt-2 sm:mt-0'>{headerAction}</div>}
      </CardHeader>

      {/* Content */}
      <CardContent className={cn('px-4 md:px-5 pb-4', contentClassName)}>
        {isEmpty ? (
          <EmptyState
            variant={emptyVariant}
            description={emptyMessage}
            className='py-8'
          />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};
