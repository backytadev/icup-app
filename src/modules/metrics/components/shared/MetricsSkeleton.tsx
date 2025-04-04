import { cn } from '@/shared/lib/utils';

import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';

interface Options {
  pathname: string;
}

export const MetricsSkeleton = ({ pathname }: Options): JSX.Element => {
  return (
    <div
      className={cn(
        'mt-5 px-2 pb-10 sm:pb-10 md:px-6 xl:pb-14 flex flex-col xl:grid xl:grid-cols-2 gap-10 h-[270rem] sm:h-[270rem] md:h-[253rem] lg:h-[275rem] xl:h-auto',
        pathname === '/metrics/offering-expense' && 'xl:flex xl:flex-col'
      )}
    >
      <Card
        className={cn(
          'bg-slate-50/40 dark:bg-slate-900/40 flex flex-col col-start-1 col-end-2 h-[25rem] md:h-[28rem] lg:h-[25rem] 2xl:h-[26rem] m-0 border-slate-200 dark:border-slate-800',
          pathname === '/metrics/offering-expense' && 'lg:h-[26rem]'
        )}
      >
        <CardHeader className='flex flex-row items-center justify-between px-4 py-2.5'>
          <Skeleton className='h-7 w-44 mt-1' />
          <Skeleton className='h-10 w-20 mt-1' />
        </CardHeader>
        <CardContent className='h-full px-2 sm:px-4 py-0'>
          <Skeleton
            className={cn(
              'h-[18rem] w-full mt-1',
              pathname === '/metrics/offering-expense' && 'h-[19rem]'
            )}
          />
          <div className='flex justify-center gap-10'>
            <Skeleton className='h-3 w-10 mt-3' />
            <Skeleton className='h-3 w-10 mt-3' />
          </div>
        </CardContent>
      </Card>

      <Card className='bg-slate-50/40 dark:bg-slate-900/40 flex flex-col row-start-auto col-start-2 col-end-3 h-[25rem] md:h-[28rem] lg:h-[25rem] 2xl:h-[26rem] m-0 border-slate-200 dark:border-slate-800'>
        <CardHeader className='flex flex-row items-center justify-between px-4 py-2.5'>
          <Skeleton className='h-7 w-44 mt-1' />
          <Skeleton className='h-10 w-20 mt-1' />
        </CardHeader>
        <CardContent className='h-full px-2 sm:px-4 py-0'>
          <Skeleton
            className={cn(
              'h-[18rem] w-full mt-1',
              pathname === '/metrics/offering-expense' && 'h-[19rem]'
            )}
          />
          <div className='flex justify-center gap-10'>
            <Skeleton className='h-3 w-10 mt-3' />
            <Skeleton className='h-3 w-10 mt-3' />
          </div>
        </CardContent>
      </Card>

      <Card className='bg-slate-50/40 dark:bg-slate-900/40 flex flex-col row-start-auto col-start-1 col-end-3 h-[25rem] md:h-[28rem] lg:h-[25rem] 2xl:h-[26rem] m-0 border-slate-200 dark:border-slate-800'>
        <CardHeader className='flex flex-row items-center justify-between px-4 py-2.5'>
          <Skeleton className='h-7 w-44 mt-1' />
          <Skeleton className='h-10 w-20 mt-1' />
        </CardHeader>
        <CardContent className='h-full px-2 sm:px-4 py-0'>
          <Skeleton
            className={cn(
              'h-[18rem] w-full mt-1',
              pathname === '/metrics/offering-expense' && 'h-[19rem]'
            )}
          />
          <div className='flex justify-center gap-10'>
            <Skeleton className='h-3 w-10 mt-3' />
            <Skeleton className='h-3 w-10 mt-3' />
          </div>
        </CardContent>
      </Card>

      <Card className='bg-slate-50/40 dark:bg-slate-900/40 flex flex-col row-start-auto col-start-1 col-end-2 h-[25rem] md:h-[28rem] lg:h-[25rem] 2xl:h-[26rem] m-0 border-slate-200 dark:border-slate-800'>
        <CardHeader className='flex flex-row items-center justify-between px-4 py-2.5'>
          <Skeleton className='h-7 w-44 mt-1' />
          <Skeleton className='h-10 w-20 mt-1' />
        </CardHeader>
        <CardContent className='h-full px-2 sm:px-4 py-0'>
          <Skeleton
            className={cn(
              'h-[18rem] w-full mt-1',
              pathname === '/metrics/offering-expense' && 'h-[19rem]'
            )}
          />
          <div className='flex justify-center gap-10'>
            <Skeleton className='h-3 w-10 mt-3' />
            <Skeleton className='h-3 w-10 mt-3' />
          </div>
        </CardContent>
      </Card>

      <Card className='bg-slate-50/40 dark:bg-slate-900/40 flex flex-col row-start-auto col-start-2 col-end-3 h-[25rem] md:h-[28rem] lg:h-[25rem] 2xl:h-[26rem] m-0 border-slate-200 dark:border-slate-800'>
        <CardHeader className='flex flex-row items-center justify-between px-4 py-2.5'>
          <Skeleton className='h-7 w-44 mt-1' />
          <Skeleton className='h-10 w-20 mt-1' />
        </CardHeader>
        <CardContent className='h-full px-2 sm:px-4 py-0'>
          <Skeleton
            className={cn(
              'h-[18rem] w-full mt-1',
              pathname === '/metrics/offering-expense' && 'h-[19rem]'
            )}
          />
          <div className='flex justify-center gap-10'>
            <Skeleton className='h-3 w-10 mt-3' />
            <Skeleton className='h-3 w-10 mt-3' />
          </div>
        </CardContent>
      </Card>

      <Card className='bg-slate-50/40 dark:bg-slate-900/40 flex flex-col row-start-auto col-start-1 col-end-2 h-[25rem] md:h-[28rem] lg:h-[25rem] 2xl:h-[26rem] m-0 border-slate-200 dark:border-slate-800'>
        <CardHeader className='flex flex-row items-center justify-between px-4 py-2.5'>
          <Skeleton className='h-7 w-44 mt-1' />
          <Skeleton className='h-10 w-20 mt-1' />
        </CardHeader>
        <CardContent className='h-full px-2 sm:px-4 py-0'>
          <Skeleton
            className={cn(
              'h-[18rem] w-full mt-1',
              pathname === '/metrics/offering-expense' && 'h-[19rem]'
            )}
          />
          <div className='flex justify-center gap-10'>
            <Skeleton className='h-3 w-10 mt-3' />
            <Skeleton className='h-3 w-10 mt-3' />
          </div>
        </CardContent>
      </Card>
      <Card className='bg-slate-50/40 dark:bg-slate-900/40 flex flex-col row-start-auto col-start-2 col-end-3 h-[25rem] md:h-[28rem] lg:h-[25rem] 2xl:h-[26rem] m-0 border-slate-200 dark:border-slate-800'>
        <CardHeader className='flex flex-row items-center justify-between px-4 py-2.5'>
          <Skeleton className='h-7 w-44 mt-1' />
          <Skeleton className='h-10 w-20 mt-1' />
        </CardHeader>
        <CardContent className='h-full px-2 sm:px-4 py-0'>
          <Skeleton
            className={cn(
              'h-[18rem] w-full mt-1',
              pathname === '/metrics/offering-expense' && 'h-[19rem]'
            )}
          />
          <div className='flex justify-center gap-10'>
            <Skeleton className='h-3 w-10 mt-3' />
            <Skeleton className='h-3 w-10 mt-3' />
          </div>
        </CardContent>
      </Card>
      <Card className='bg-slate-50/40 dark:bg-slate-900/40 flex flex-col row-start-auto col-start-1 col-end-3 h-[25rem] md:h-[28rem] lg:h-[25rem] 2xl:h-[26rem] m-0 border-slate-200 dark:border-slate-800'>
        <CardHeader className='flex flex-row items-center justify-between px-4 py-2.5'>
          <Skeleton className='h-7 w-44 mt-1' />
          <Skeleton className='h-10 w-20 mt-1' />
        </CardHeader>
        <CardContent className='h-full px-2 sm:px-4 py-0'>
          <Skeleton
            className={cn(
              'h-[18rem] w-full mt-1',
              pathname === '/metrics/offering-expense' && 'h-[19rem]'
            )}
          />
          <div className='flex justify-center gap-10'>
            <Skeleton className='h-3 w-10 mt-3' />
            <Skeleton className='h-3 w-10 mt-3' />
          </div>
        </CardContent>
      </Card>
      <Card className='bg-slate-50/40 dark:bg-slate-900/40 flex flex-col row-start-auto col-start-1 col-end-2 h-[25rem] md:h-[28rem] lg:h-[25rem] 2xl:h-[26rem] m-0 border-slate-200 dark:border-slate-800'>
        <CardHeader className='flex flex-row items-center justify-between px-4 py-2.5'>
          <Skeleton className='h-7 w-44 mt-1' />
          <Skeleton className='h-10 w-20 mt-1' />
        </CardHeader>
        <CardContent className='h-full px-2 sm:px-4 py-0'>
          <Skeleton
            className={cn(
              'h-[18rem] w-full mt-1',
              pathname === '/metrics/offering-expense' && 'h-[19rem]'
            )}
          />
          <div className='flex justify-center gap-10'>
            <Skeleton className='h-3 w-10 mt-3' />
            <Skeleton className='h-3 w-10 mt-3' />
          </div>
        </CardContent>
      </Card>
      <Card className='bg-slate-50/40 dark:bg-slate-900/40 flex flex-col row-start-auto col-start-2 col-end-3 h-[25rem] md:h-[28rem] lg:h-[25rem] 2xl:h-[26rem] m-0 border-slate-200 dark:border-slate-800'>
        <CardHeader className='flex flex-row items-center justify-between px-4 py-2.5'>
          <Skeleton className='h-7 w-44 mt-1' />
          <Skeleton className='h-10 w-20 mt-1' />
        </CardHeader>
        <CardContent className='h-full px-2 sm:px-4 py-0'>
          <Skeleton
            className={cn(
              'h-[18rem] w-full mt-1',
              pathname === '/metrics/offering-expense' && 'h-[19rem]'
            )}
          />
          <div className='flex justify-center gap-10'>
            <Skeleton className='h-3 w-10 mt-3' />
            <Skeleton className='h-3 w-10 mt-3' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
