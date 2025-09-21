import { CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export const ZoneFormSkeleton = (): JSX.Element => {
  return (
    <CardContent className='py-3 px-2 md:px-4'>
      <div className='dark:text-slate-300 text-slate-500 font-bold text-[16px] mb-4 pl-0 md:pl-4'>
        <Skeleton className='h-7 w-64' />
      </div>
      <div>
        <form className='w-full flex flex-col md:grid md:grid-cols-2 gap-x-10 gap-y-5 px-2 sm:px-12'>
          <div className='col-start-1 col-end-2'>
            <div>
              <Skeleton className='h-5 w-24 mt-4' />
              <Skeleton className='h-[12px] w-44 mt-3' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-5 w-24 mt-7' />
              <Skeleton className='h-[12px] w-44 mt-3' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-5 w-24 mt-7' />
              <Skeleton className='h-[12px] w-44 mt-3' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-5 w-24 mt-7' />
              <Skeleton className='h-[12px] w-44 mt-3' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>
          </div>

          <div className='col-start-2 col-end-3'>
            <div>
              <Skeleton className='h-5 w-24 mt-4' />
              <Skeleton className='h-[12px] w-44 mt-3' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-5 w-24 mt-7' />
              <Skeleton className='h-[12px] w-44 mt-3' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-5 w-24 mt-7' />
              <Skeleton className='h-8 w-full mt-3' />
              <Skeleton className='h-[12px] w-full mt-3' />
              <Skeleton className='h-[12px] w-44 mt-2' />
            </div>
          </div>

          <div className='mt-2 md:mt-1 md:col-start-1 md:col-end-3 md:row-start-3 md:row-end-4 w-full md:w-[20rem] md:m-auto'>
            <Skeleton className='h-10 w-full' />
            <div className='md:flex md:flex-col md:justify-center md:items-center mt-1'>
              <Skeleton className='text-center h-4 w-64 mt-2' />
              <Skeleton className='text-center h-4 w-64 mt-2' />
            </div>
          </div>
        </form>
      </div>
    </CardContent>
  );
};
