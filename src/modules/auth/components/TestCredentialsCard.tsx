import { cn } from '@/shared/lib/utils';

interface TestCredentialsCardProps {
  className?: string;
}

const testCredentials = [
  { email: 'user.test1@icup.com', password: 'Abcd12345#' },
  { email: 'user.test2@icup.com', password: 'Abcd12345%' },
];

export const TestCredentialsCard = ({ className }: TestCredentialsCardProps): JSX.Element | null => {
  // Only show in test environment
  if (import.meta.env.VITE_FRONTEND_URL !== 'https://icup-app-test.vercel.app') {
    return null;
  }

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-md px-4 py-4 rounded-xl',
        'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm',
        'border border-slate-200/60 dark:border-slate-700/60',
        'shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50',
        'opacity-0 animate-slide-in-up',
        className
      )}
      style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
    >
      <h4 className='text-base font-semibold text-slate-800 dark:text-slate-200 text-center mb-2 font-outfit'>
        Credenciales de prueba
      </h4>
      <p className='text-sm text-slate-500 dark:text-slate-400 text-center mb-3 font-inter'>
        Usa estas credenciales para probar la aplicación
      </p>

      <div className='space-y-2'>
        {testCredentials.map((cred, index) => (
          <div
            key={index}
            className={cn(
              'p-3 rounded-lg',
              'bg-slate-50/80 dark:bg-slate-900/60',
              'border border-slate-200/50 dark:border-slate-700/50',
              'text-sm text-slate-700 dark:text-slate-300',
              'flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4',
              'transition-all duration-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
            )}
          >
            <p className='font-medium font-inter'>
              <span className='text-blue-600 dark:text-blue-400'>Usuario:</span>{' '}
              <span className='text-slate-600 dark:text-slate-300'>{cred.email}</span>
            </p>
            <p className='font-medium font-inter'>
              <span className='text-blue-600 dark:text-blue-400'>Clave:</span>{' '}
              <span className='text-slate-600 dark:text-slate-300'>{cred.password}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
