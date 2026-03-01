import { Skeleton } from '@/shared/components/ui/skeleton';

export const SupervisorFormSkeleton = (): JSX.Element => {
  return (
    <div className='py-3 px-2 md:px-4'>
      <div className='w-full flex flex-col md:grid md:grid-cols-3 gap-x-10 gap-y-0 px-2 sm:px-12'>
        <div className='col-start-1 col-end-2'>
          <Skeleton className='h-5 w-44 mt-2' />

          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>
          ))}

          <div>
            <Skeleton className='h-5 w-44 mt-6' />
            <div className='grid grid-cols-2 gap-x-6 gap-y-2'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='flex items-center gap-2 mt-3'>
                  <Skeleton className='h-5 w-5 rounded-md' />
                  <Skeleton className='h-3 w-32 rounded-md' />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='col-start-2 col-end-3'>
          <Skeleton className='h-5 w-44 mt-2' />

          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i}>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>
          ))}
        </div>

        <div className='col-start-3 col-end-4'>
          <Skeleton className='h-5 w-44 mt-2' />
          <Skeleton className='h-8 w-full mt-6' />
          <Skeleton className='h-8 w-full mt-4' />
          <hr className='my-4' />
          <Skeleton className='h-20 w-full mb-4' />
          <Skeleton className='h-20 w-full' />
          <div className='mt-4'>
            <Skeleton className='h-4 w-24 mt-5' />
            <Skeleton className='h-8 w-full mt-2' />
          </div>
          <Skeleton className='h-8 w-full mt-6' />
        </div>

        <div className='sm:col-start-2 w-full'>
          <Skeleton className='h-10 w-full mt-5' />
        </div>
      </div>
    </div>
  );
};
