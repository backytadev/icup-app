import { CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export const UserFormSkeleton = (): JSX.Element => {
  return (
    <CardContent className='py-3 px-2 md:px-4'>
      <div className='dark:text-slate-300 text-slate-500 font-bold text-[16px] mb-4 pl-0 md:pl-4'>
        <Skeleton className='h-5 w-60 mt-2' />
      </div>
      <div>
        <form className='w-full flex flex-col md:grid gap-x-10 gap-y-3 md:gap-y-5 px-2 sm:px-10'>
          <div className='col-start-1 col-end-2'>
            <div>
              <Skeleton className='h-4 w-24 mt-3' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-6' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-6' />
              <Skeleton className='h-3 w-full mt-2' />
              <div className='md:flex md:items-center md:gap-2 mt-6'>
                <Skeleton className='h-5 w-5 rounded-md' />
                <Skeleton className='h-3 w-16 rounded-md' />
              </div>
              <div className='md:flex md:items-center md:gap-2 mt-2'>
                <Skeleton className='h-5 w-5 rounded-md' />
                <Skeleton className='h-3 w-16 rounded-md' />
              </div>
              <div className='md:flex md:items-center md:gap-2 mt-2'>
                <Skeleton className='h-5 w-5 rounded-md' />
                <Skeleton className='h-3 w-16 rounded-md' />
              </div>
              <div className='md:flex md:items-center md:gap-2 mt-2'>
                <Skeleton className='h-5 w-5 rounded-md' />
                <Skeleton className='h-3 w-16 rounded-md' />
              </div>
            </div>
          </div>

          <div className='col-start-2 col-end-3'>
            <div>
              <Skeleton className='h-4 w-24 mt-3' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-6' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-6' />
              <Skeleton className='h-8 w-full mt-2' />
              <Skeleton className='h-3 w-full mt-2' />
              <Skeleton className='h-3 w-full mt-2' />
            </div>
          </div>

          <div className='sm:col-start-1 sm:col-end-3 w-full'>
            <Skeleton className='mx-auto h-10 w-72 mt-2' />
            <div className='md:flex md:flex-col md:justify-center md:items-center mt-3'>
              <Skeleton className='text-center h-4 w-64 mt-1' />
              <Skeleton className='text-center h-4 w-60 mt-2' />
            </div>
          </div>
        </form>
      </div>
    </CardContent>
  );
};
