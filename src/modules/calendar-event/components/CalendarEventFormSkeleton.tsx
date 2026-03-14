import { Skeleton } from '@/shared/components/ui/skeleton';

export const CalendarEventFormSkeleton = (): JSX.Element => {
  return (
    <div className='w-full flex flex-col md:grid grid-cols-2 gap-x-8 gap-y-4 p-5 md:p-6'>
      <div className='md:col-start-1 md:col-end-2 space-y-6'>
        <div className='space-y-4'>
          <Skeleton className='h-5 w-44' />
          <div className='pl-4 border-l-2 border-teal-200 dark:border-teal-900 space-y-4'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-11 w-full' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-28' />
              <Skeleton className='h-24 w-full' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-11 w-full' />
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          <Skeleton className='h-5 w-36' />
          <div className='pl-4 border-l-2 border-teal-200 dark:border-teal-900 space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-16' />
                <Skeleton className='h-11 w-full' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-16' />
                <Skeleton className='h-11 w-full' />
              </div>
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-40' />
              <div className='grid grid-cols-2 gap-2'>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className='h-10 w-full rounded-lg' />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='md:col-start-2 md:col-end-3 md:border-l border-slate-200 dark:border-slate-700/50 md:pl-6 space-y-4'>
        <Skeleton className='h-5 w-44' />
        <Skeleton className='h-40 w-full rounded-xl' />
        <Skeleton className='h-5 w-36' />
        <div className='grid grid-cols-2 gap-4'>
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className='h-11 w-full' />
          ))}
        </div>
      </div>

      <Skeleton className='md:col-span-2 h-4 w-72 mx-auto' />
      <Skeleton className='md:col-span-2 h-11 w-full max-w-xs mx-auto' />
    </div>
  );
};
