import { Skeleton } from '@/shared/components/ui/skeleton';

export const ZoneFormSkeleton = (): JSX.Element => {
  return (
    <div className='w-full'>
      {/* Header Skeleton */}
      <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-amber-500/70 via-orange-500/70 to-orange-600/70 dark:from-amber-600/50 dark:via-orange-600/50 dark:to-orange-700/50 px-6 py-5'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2 mb-1'>
            <Skeleton className='h-5 w-24 bg-white/20' />
          </div>
          <Skeleton className='h-7 w-40 bg-white/20' />
          <Skeleton className='h-4 w-32 bg-white/20' />
        </div>
      </div>

      {/* Form Content Skeleton */}
      <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
        <div className='p-5 md:p-6'>
          {/* Sección: Información General */}
          <div className='mb-6'>
            <div className='mb-4'>
              <Skeleton className='h-3 w-40' />
            </div>

            <div className='grid grid-cols-1 gap-x-6 gap-y-4'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-3 w-44' />
                <Skeleton className='h-10 w-full' />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className='border-t border-slate-200 dark:border-slate-700/50 my-5' />

          {/* Sección: Ubicación */}
          <div className='mb-6'>
            <div className='mb-4'>
              <Skeleton className='h-3 w-24' />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className='space-y-2'>
                  <Skeleton className='h-4 w-28' />
                  <Skeleton className='h-10 w-full' />
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className='border-t border-slate-200 dark:border-slate-700/50 my-5' />

          {/* Sección: Relaciones */}
          <div className='mb-6'>
            <div className='mb-4'>
              <Skeleton className='h-3 w-28' />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-3 w-48' />
                <Skeleton className='h-10 w-full' />
              </div>

              <div className='space-y-2'>
                <Skeleton className='h-4 w-36' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-3 w-full' />
                <Skeleton className='h-3 w-44' />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className='border-t border-slate-200 dark:border-slate-700/50 my-5' />

          {/* Footer */}
          <div className='flex flex-col items-center gap-4'>
            <Skeleton className='h-10 w-full max-w-md rounded-lg' />
            <Skeleton className='h-10 w-full md:w-[280px]' />
          </div>
        </div>
      </div>
    </div>
  );
};
