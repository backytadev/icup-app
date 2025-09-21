import { CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export const FamilyGroupFormSkeleton = (): JSX.Element => {
  return (
    <CardContent className='py-3 px-2 md:px-4'>
      <div className='dark:text-slate-300 text-slate-500 font-bold text-[16px] mb-4 pl-0 md:pl-4'>
        <Skeleton className='ml-2 h-7 w-[18rem] md:w-[40rem]' />
      </div>
      <div>
        <form className='w-full flex flex-col md:grid md:grid-cols-2 gap-x-10 gap-y-5 px-2 sm:px-12'>
          <div className='col-start-1 col-end-2'>
            <div>
              <Skeleton className='h-4 w-24 mt-4' />
              <Skeleton className='h-3 w-56 mt-3' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-7' />
              <Skeleton className='h-3 w-56 mt-3' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-7' />
              <Skeleton className='h-3 w-56 mt-3' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-7' />
              <Skeleton className='h-3 w-56 mt-3' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-6' />
              <Skeleton className='h-3 w-56 mt-3' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-6' />
              <Skeleton className='h-3 w-56 mt-3' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>
          </div>

          <div className='col-start-2 col-end-3'>
            <div>
              <Skeleton className='h-4 w-24 mt-4' />
              <Skeleton className='h-3 w-56 mt-3' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-7' />
              <Skeleton className='h-3 w-56 mt-3' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-7' />
              <Skeleton className='h-24 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-7' />
              <Skeleton className='h-3 w-56 mt-3' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-6' />
              <Skeleton className='h-3 w-56 mt-3' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-6' />
              <Skeleton className='h-8 w-full mt-2' />
              <Skeleton className='h-3 w-full mt-2' />
            </div>
          </div>

          <div className='col-start-1 col-end-3 w-[20rem] mx-auto'>
            <Skeleton className='h-10 mt-5' />
            <div className='md:flex flex-col md:justify-center md:items-center mt-1'>
              <Skeleton className='text-center h-4 w-64 mt-2' />
              <Skeleton className='text-center h-4 w-60 mt-2' />
            </div>
          </div>
        </form>
      </div>
    </CardContent>
  );
};
