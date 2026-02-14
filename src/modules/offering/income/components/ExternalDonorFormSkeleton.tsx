import { Skeleton } from '@/shared/components/ui/skeleton';

export const ExternalDonorFormSkeleton = (): JSX.Element => {
  return (
    <div className='px-1 space-y-5'>
      {/* Información Personal */}
      <div className='space-y-4'>
        <Skeleton className='h-6 w-48' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-10 w-full' />
          </div>
        </div>
      </div>

      {/* Información de Origen */}
      <div className='space-y-4'>
        <Skeleton className='h-6 w-48' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-28' />
          <Skeleton className='h-10 w-full' />
        </div>
      </div>

      {/* Contacto y Residencia */}
      <div className='space-y-4'>
        <Skeleton className='h-6 w-48' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-36' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div className='space-y-2 md:col-span-2'>
            <Skeleton className='h-4 w-28' />
            <Skeleton className='h-10 w-full' />
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className='flex gap-3 pt-2'>
        <Skeleton className='h-10 flex-1' />
        <Skeleton className='h-10 flex-1' />
      </div>
    </div>
  );
};
