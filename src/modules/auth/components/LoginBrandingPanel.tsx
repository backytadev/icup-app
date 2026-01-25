import { cn } from '@/shared/lib/utils';

interface LoginBrandingPanelProps {
  className?: string;
}

export const LoginBrandingPanel = ({ className }: LoginBrandingPanelProps): JSX.Element => {
  return (
    <div
      className={cn(
        'hidden lg:flex lg:flex-col relative w-1/2 h-full',
        'overflow-hidden',
        className
      )}
    >
      {/* Background image - blurred */}
      <div className='absolute inset-0'>
        <img
          src='/images/jesus-image.webp'
          alt='Imagen Jesus'
          className='w-full h-full object-cover scale-110 blur-[2px] opacity-70 dark:opacity-50'
        />
      </div>

      {/* Gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-indigo-900/60' />

      {/* Decorative background orbs */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div
          className='absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-40'
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 80%)',
          }}
        />
        <div
          className='absolute top-1/4 -right-20 w-[400px] h-[400px] rounded-full opacity-30'
          style={{
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
          }}
        />
        <div
          className='absolute -bottom-20 left-1/4 w-[350px] h-[350px] rounded-full opacity-30'
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content section - Logo, title, verse */}
      <div className='relative z-10 flex-1 flex flex-col items-center justify-center px-8 xl:px-12'>
        {/* Logo */}
        <div
          className='mb-6 opacity-0 animate-fade-in-scale'
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          <img
            src='/images/logo-simple.webp'
            alt='Logo Iglesia'
            className='w-56 xl:w-52 2xl:w-64 h-40 drop-shadow-2xl'
          />
        </div>

        {/* App title */}
        <h1
          className='text-3xl xl:text-4xl 2xl:text-5xl font-bold font-outfit tracking-tight mb-3 opacity-0 animate-slide-in-up text-white drop-shadow-lg'
          style={{
            animationDelay: '0.2s',
            animationFillMode: 'forwards',
          }}
        >
          ICUP ADMIN
        </h1>

        {/* Subtitle */}
        <p
          className='text-sm xl:text-base text-slate-200 font-inter mb-8 opacity-0 animate-slide-in-up'
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          Sistema de Gestión Integral
        </p>

        {/* Bible verse card */}
        <div
          className='max-w-sm px-6 py-5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-2xl opacity-0 animate-slide-in-up'
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          <p className='text-xl xl:text-2xl font-dancing-script text-amber-300 text-center leading-relaxed drop-shadow-md'>
            &ldquo;Ven y sígueme&rdquo;
          </p>
          <p className='mt-2 text-sm text-slate-300 font-inter text-center tracking-wide'>
            — Mateo 4:19
          </p>
        </div>
      </div>
    </div>
  );
};
