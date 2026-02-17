import { Skeleton } from '@/shared/components/ui/skeleton';

export const UserFormSkeleton = (): JSX.Element => {
  return (
    <div className='w-[340px] sm:min-w-[520px] md:min-w-[980px] xl:min-w-[980px]'>
      {/* Header Skeleton */}
      <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-amber-500/70 via-orange-500/70 to-orange-600/70 dark:from-amber-600/50 dark:via-orange-600/50 dark:to-orange-700/50 px-6 py-5'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2 mb-1'>
            <Skeleton className='h-5 w-24 bg-white/20' />
            <Skeleton className='h-5 w-32 bg-white/20' />
          </div>
          <Skeleton className='h-7 w-40 bg-white/20' />
          <Skeleton className='h-4 w-56 bg-white/20' />
        </div>
      </div>

      {/* Form Content Skeleton */}
      <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
        <div className='p-5 md:p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-y-8 md:gap-x-10'>
            {/* Nombres */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Apellidos */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Género */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Email */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Usuario */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Estado (solo en update) */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Roles - ocupa ambas columnas */}
            <div className='col-span-1 md:col-span-2 space-y-3'>
              <Skeleton className='h-4 w-12' />
              <Skeleton className='h-3 w-36' />
              <div className='flex flex-col md:flex-row md:flex-wrap gap-4'>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className='flex items-center gap-2'>
                    <Skeleton className='h-5 w-5 rounded' />
                    <Skeleton className='h-3 w-24' />
                  </div>
                ))}
              </div>
            </div>

            {/* Iglesias/Ministerios - ocupa ambas columnas */}
            <div className='col-span-1 md:col-span-2 space-y-2'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-10 w-full' />
            </div>
          </div>

          {/* Footer - Mensaje y Botón */}
          <div className='flex flex-col items-center gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800'>
            <Skeleton className='h-4 w-72' />
            <Skeleton className='h-11 w-full md:w-[22rem]' />
          </div>
        </div>
      </div>
    </div>
  );
};
