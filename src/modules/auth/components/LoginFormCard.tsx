import { MdEmail, MdLock } from 'react-icons/md';

import { cn } from '@/shared/lib/utils';
import { useLoginForm } from '@/modules/auth/hooks';
import { PasswordInput } from '@/modules/auth/components/PasswordInput';

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

interface LoginFormCardProps {
  className?: string;
}

export const LoginFormCard = ({ className }: LoginFormCardProps): JSX.Element => {
  const { form, isInputDisabled, isRateLimited, countdown, handleSubmit, handleInputClick } =
    useLoginForm();

  return (
    <div
      className={cn(
        'w-full max-w-md mx-auto',
        'px-6 py-8 sm:px-8 sm:py-10',
        'rounded-2xl',
        'bg-white/95 dark:bg-slate-900/95',
        'backdrop-blur-xl',
        'border border-slate-200/60 dark:border-slate-700/40',
        'shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50',
        'opacity-0 animate-fade-in-scale',
        className
      )}
      style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
    >
      {/* Header */}
      <div className='text-center mb-6'>
        {/* Mobile logo */}
        <div className='lg:hidden mb-4'>
          <img
            src='/images/logo-sn.webp'
            alt='Logo Iglesia'
            className='w-48 sm:w-56 mx-auto'
          />
        </div>

        <h2
          className={cn(
            'text-2xl sm:text-3xl font-bold font-outfit',
            'text-slate-800 dark:text-slate-100',
            'mb-2'
          )}
        >
          Inicia Sesión
        </h2>
        <p className='text-sm text-slate-500 dark:text-slate-400 font-inter'>
          Ingresa tus credenciales para acceder
        </p>
      </div>

      {/* Rate limit warning */}
      {isRateLimited && (
        <div
          className={cn(
            'mb-4 p-3 rounded-lg text-center',
            'bg-red-50 dark:bg-red-900/20',
            'border border-red-200 dark:border-red-800/40',
            'animate-slide-in-up'
          )}
        >
          <p className='text-sm font-medium text-red-600 dark:text-red-400 font-inter'>
            Por favor, espera <span className='font-bold'>{countdown}</span> segundos antes de
            intentar nuevamente.
          </p>
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='space-y-5'
        >
          {/* Email field */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem
                className='opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
              >
                <FormLabel className='text-sm font-medium text-slate-700 dark:text-slate-300 font-inter'>
                  Usuario o Correo Electrónico
                </FormLabel>
                <FormControl>
                  <div className='relative'>
                    <MdEmail className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5' />
                    <Input
                      {...field}
                      disabled={isInputDisabled}
                      placeholder='usuario@correo.com'
                      autoComplete='username'
                      className={cn(
                        'pl-10 h-11',
                        'transition-all duration-200',
                        'focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
                        'placeholder:text-slate-400 dark:placeholder:text-slate-500'
                      )}
                    />
                  </div>
                </FormControl>
                <FormMessage className='text-xs font-inter' />
              </FormItem>
            )}
          />

          {/* Password field */}
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem
                className='opacity-0 animate-slide-in-up'
                style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
              >
                <FormLabel className='text-sm font-medium text-slate-700 dark:text-slate-300 font-inter'>
                  Contraseña
                </FormLabel>
                <FormControl>
                  <div className='relative'>
                    <MdLock className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5 z-10' />
                    <PasswordInput
                      {...field}
                      disabled={isInputDisabled}
                      placeholder='Escribe tu contraseña'
                      autoComplete='current-password'
                      className='pl-10 h-11'
                    />
                  </div>
                </FormControl>
                <FormMessage className='text-xs font-inter' />
              </FormItem>
            )}
          />

          {/* Submit button */}
          <div
            className='pt-2 opacity-0 animate-slide-in-up'
            style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
          >
            <Button
              type='submit'
              disabled={isInputDisabled}
              onClick={handleInputClick}
              className={cn(
                'w-full h-11 font-semibold font-inter text-base',
                'transition-all duration-300',
                !isInputDisabled && !isRateLimited && [
                  'bg-gradient-to-r from-blue-600 to-blue-500',
                  'hover:from-blue-700 hover:to-blue-600',
                  'hover:shadow-lg hover:shadow-blue-500/25',
                  'hover:scale-[1.02]',
                  'active:scale-[0.98]',
                ],
                isInputDisabled && !isRateLimited && [
                  'bg-emerald-600 hover:bg-emerald-600',
                  'cursor-wait',
                ]
              )}
            >
              {isInputDisabled && !isRateLimited ? (
                <span className='flex items-center gap-2'>
                  <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  Conectando...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
