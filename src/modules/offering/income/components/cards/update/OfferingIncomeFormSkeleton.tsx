import { CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export const OfferingIncomeFormSkeleton = (): JSX.Element => {
  return (
    <CardContent className='py-3 px-2 md:px-4'>
      <div className='dark:text-slate-300 text-slate-500 font-bold text-[16px] mb-4 md:pl-4'>
        <Skeleton className='ml-2 h-7 w-auto md:w-[30rem]' />
        <Skeleton className='ml-2 h-4 w-auto md:w-[20rem] mt-2' />
      </div>
      <div>
        <form className='w-full flex flex-col md:grid sm:grid-cols-2 gap-x-8 gap-y-6 px-2 sm:px-8'>
          <div className='col-start-1 col-end-2'>
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

            <div className='flex flex-row gap-x-6'>
              <div className='w-full'>
                <Skeleton className='h-4 w-24 mt-6' />
                <Skeleton className='h-3 w-full mt-3' />
                <Skeleton className='h-8 w-full mt-2' />
              </div>
              <div className='w-full'>
                <Skeleton className='h-4 w-24 mt-6' />
                <Skeleton className='h-3 w-full mt-3' />
                <Skeleton className='h-8 w-full mt-2' />
              </div>
            </div>

            <div className='flex flex-row gap-x-6'>
              <div className='w-full'>
                <Skeleton className='h-4 w-24 mt-6' />
                <Skeleton className='h-3 w-full mt-3' />
                <Skeleton className='h-8 w-full mt-2' />
              </div>
              <div className='w-full'>
                <Skeleton className='h-4 w-24 mt-6' />
                <Skeleton className='h-3 w-full mt-3' />
                <Skeleton className='h-8 w-full mt-2' />
              </div>
            </div>

            <div>
              <Skeleton className='h-4 w-full mt-3' />
              <Skeleton className='h-4 w-64 mt-3' />
            </div>

            <div>
              <div className='flex'>
                <Skeleton className='h-4 w-24 mt-6' />
                <Skeleton className='ml-2 h-4 w-20 mt-6' />
              </div>
              <Skeleton className='h-[5rem] w-full mt-3' />
            </div>
          </div>

          <div className='col-start-2 col-end-3'>
            <div>
              <div className='md:flex'>
                <Skeleton className='h-4 w-24 mt-6' />
                <Skeleton className='ml-2 h-4 w-20 mt-6' />
              </div>
              <Skeleton className='h-40 w-auto md:w-[80%] mx-auto mt-3' />
              <Skeleton className='ml-10 h-4 w-56 mt-3' />
              <Skeleton className='ml-10 h-4 w-56 mt-2' />
            </div>

            <div>
              <div className='w-auto md:flex md:justify-between mt-6'>
                <Skeleton className='h-6 w-44 mt-5' />
                <Skeleton className='h-10 w-40 mt-5' />
              </div>
            </div>

            <div>
              <Skeleton className='h-5 w-40 mt-7' />
              <Skeleton className='h-1 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-5 w-40 mt-60' />
              <Skeleton className='h-1 w-full mt-2' />
            </div>
          </div>

          <div className='col-start-1 col-end-3 md:w-[20rem] mx-auto'>
            <Skeleton className='h-10 mt-3' />
            <div className='md:flex md:flex-col md:justify-center md:items-center mt-1'>
              <Skeleton className='text-center h-4 w-64 mt-2' />
              <Skeleton className='text-center h-4 w-60 mt-2' />
            </div>
          </div>
        </form>
      </div>
    </CardContent>
  );
};
