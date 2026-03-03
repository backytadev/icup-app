import { CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export const DiscipleFormSkeleton = (): JSX.Element => {
  return (
    <CardContent className='py-3 px-2 md:px-4'>
      <div className='dark:text-slate-300 text-slate-500 font-bold text-[16px] mb-4 pl-0 md:pl-4'>
        <Skeleton className='ml-2 h-7 w-[18rem] md:w-[40rem]' />
      </div>
      <div>
        <form className='w-full flex flex-col md:grid md:grid-cols-3 gap-x-10 gap-y-0 px-2 sm:px-12'>
          <div className='col-start-1 col-end-2'>
            <Skeleton className='h-5 w-44 mt-2' />

            <div>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-8 w-full mt-2' />
              <Skeleton className='h-[10px] w-64 mt-2' />
              <Skeleton className='h-[10px] w-44 mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-8 w-full mt-2' />
              <Skeleton className='h-[10px] w-64 mt-2' />
            </div>

            <div>
              <Skeleton className='h-5 w-44 mt-6' />
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2'>
                <div className='md:flex md:items-center md:gap-2 mt-3'>
                  <Skeleton className='h-5 w-5 rounded-md' />
                  <Skeleton className='h-3 w-32 rounded-md' />
                </div>
                <div className='md:flex md:items-center md:gap-2 mt-1'>
                  <Skeleton className='h-5 w-5 rounded-md' />
                  <Skeleton className='h-3 w-32 rounded-md' />
                </div>
                <div className='md:flex md:items-center md:gap-2 mt-1'>
                  <Skeleton className='h-5 w-5 rounded-md' />
                  <Skeleton className='h-3 w-32 rounded-md' />
                </div>
                <div className='md:flex md:items-center md:gap-2 mt-1'>
                  <Skeleton className='h-5 w-5 rounded-md' />
                  <Skeleton className='h-3 w-32 rounded-md' />
                </div>
                <div className='md:flex md:items-center md:gap-2 mt-1'>
                  <Skeleton className='h-5 w-5 rounded-md' />
                  <Skeleton className='h-3 w-32 rounded-md' />
                </div>
                <div className='md:flex md:items-center md:gap-2 mt-1'>
                  <Skeleton className='h-5 w-5 rounded-md' />
                  <Skeleton className='h-3 w-32 rounded-md' />
                </div>
              </div>
            </div>
          </div>

          <div className='col-start-2 col-end-3'>
            <Skeleton className='h-5 w-44 mt-2' />

            <div>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-20 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-8 w-full mt-2' />
              <Skeleton className='h-[10px] w-72 mt-2' />
              <Skeleton className='h-[10px] w-64 mt-2' />
              <Skeleton className='h-[10px] w-44 mt-2' />
            </div>
          </div>

          <div className='col-start-3 col-end-4'>
            <Skeleton className='h-5 w-44 mt-2' />

            <div className='md:flex md:flex-row md:gap-2 mt-6'>
              <Skeleton className='h-5 w-5 rounded-md' />
              <div className='md:flex md:flex-col gap-2'>
                <Skeleton className='h-5 w-64' />
                <Skeleton className='pl-4 h-5 w-32' />
              </div>
            </div>

            <hr className='my-4' />
            <div className='md:flex md:flex-row md:gap-6 md:items-center'>
              <Skeleton className='h-5 w-64' />
              <Skeleton className='h-10 w-10 rounded-md' />
            </div>

            <hr className='my-4' />
            <Skeleton className='h-20 w-full mb-10' />
            <Skeleton className='h-20 w-full' />

            {/* Relaciones */}
            <div>
              <Skeleton className='h-4 w-24 mt-5' />
              <Skeleton className='h-3 w-full mt-2' />
              <Skeleton className='h-3 w-20 mt-2' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>

            <div>
              <Skeleton className='h-8 w-full mt-6' />
              <Skeleton className='h-3 w-32 mt-4' />
              <Skeleton className='h-3 w-full mt-4' />
              <Skeleton className='h-3 w-64 mt-2' />
              <Skeleton className='h-3 w-full mt-4' />
              <Skeleton className='h-3 w-64 mt-2' />
            </div>
          </div>

          <div className='sm:col-start-2 w-full'>
            <Skeleton className='h-10 w-full mt-5' />
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
