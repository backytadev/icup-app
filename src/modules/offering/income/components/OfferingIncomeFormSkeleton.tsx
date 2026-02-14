import { Skeleton } from '@/shared/components/ui/skeleton';

export const OfferingIncomeFormSkeleton = (): JSX.Element => {
  return (
    <div className='w-full'>
      {/* Header Skeleton */}
      <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-orange-500/70 via-amber-500/70 to-orange-600/70 dark:from-orange-600/50 dark:via-amber-600/50 dark:to-orange-700/50 px-6 py-5'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2 mb-1'>
            <Skeleton className='h-5 w-24 bg-white/20' />
            <Skeleton className='h-5 w-20 bg-white/20' />
          </div>
          <Skeleton className='h-7 w-56 bg-white/20' />
          <Skeleton className='h-4 w-48 bg-white/20' />
          <Skeleton className='h-4 w-40 bg-white/20' />
        </div>
      </div>

      {/* Form Content Skeleton */}
      <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
        <div className='p-5 md:p-4'>
          {/* Sección: Clasificación */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
            {/* Campo 1 */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-3 w-44' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Campo 2 */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-28' />
              <Skeleton className='h-3 w-36' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Campo 3 */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-36' />
              <Skeleton className='h-3 w-48' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Campo 4 - Horarios */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-3 w-44' />
              <div className='flex flex-wrap gap-x-4 gap-y-2 mt-2'>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className='flex items-center gap-2'>
                    <Skeleton className='h-4 w-4 rounded' />
                    <Skeleton className='h-3 w-12' />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className='border-t border-slate-200 dark:border-slate-700/50 my-5'></div>

        {/* Sección: Información del Miembro/Donante */}
        <div className='mb-6 px-4'>
          <div className='mb-4'>
            <Skeleton className='h-3 w-52' />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-3 w-40' />
              <Skeleton className='h-10 w-full' />
            </div>

            <div className='space-y-2'>
              <Skeleton className='h-4 w-36' />
              <Skeleton className='h-3 w-32' />
              <Skeleton className='h-10 w-full' />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className='border-t border-slate-200 dark:border-slate-700/50 my-5'></div>

        {/* Sección: Detalles de la Ofrenda */}
        <div className='mb-6 px-4'>
          <div className='mb-4'>
            <Skeleton className='h-3 w-40' />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-10 w-full' />
            </div>

            <div className='space-y-2'>
              <Skeleton className='h-4 w-28' />
              <Skeleton className='h-10 w-full' />
            </div>

            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-10 w-full' />
            </div>

            <div className='space-y-2'>
              <Skeleton className='h-4 w-28' />
              <Skeleton className='h-10 w-full' />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className='border-t border-slate-200 dark:border-slate-700/50 my-5'></div>

        {/* Sección: Notas e Imagen */}
        <div className='mb-6 px-4'>
          <div className='mb-4'>
            <Skeleton className='h-3 w-36' />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
            {/* Notas */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-40' />
              <Skeleton className='h-24 w-full' />
            </div>

            {/* Imagen del recibo */}
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-5 w-24' />
              </div>
              <Skeleton className='h-48 w-full rounded-lg' />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className='border-t border-slate-200 dark:border-slate-700/50 my-5'></div>

        {/* Footer */}
        <div className='flex flex-col items-center gap-4'>
          <Skeleton className='h-10 w-full max-w-md rounded-lg' />
          <Skeleton className='h-10 w-full md:w-[280px]' />
        </div>
      </div>
    </div>

  );
};
