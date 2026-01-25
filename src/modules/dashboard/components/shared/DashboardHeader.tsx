import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { HiChartBar } from 'react-icons/hi2';

import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/stores/auth/auth.store';

interface DashboardHeaderProps {
  className?: string;
}

export const DashboardHeader = ({ className }: DashboardHeaderProps): JSX.Element => {
  const user = useAuthStore((state) => state.user);

  const today = new Date();
  const formattedDate = format(today, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });

  // Get greeting based on time of day
  const hour = today.getHours();
  let greeting = 'Buenos días';
  if (hour >= 12 && hour < 18) {
    greeting = 'Buenas tardes';
  } else if (hour >= 18) {
    greeting = 'Buenas noches';
  }

  const firstName = user?.firstNames?.split(' ')[0] ?? 'Usuario';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700',
        'dark:from-blue-900 dark:via-blue-800 dark:to-indigo-900',
        'p-6 md:p-8',
        'opacity-0 animate-slide-in-up',
        className
      )}
      style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
    >
      {/* Background decorative elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-1/2 -right-1/4 w-96 h-96 rounded-full bg-white/5' />
        <div className='absolute -bottom-1/4 -left-1/4 w-64 h-64 rounded-full bg-white/5' />
      </div>

      <div className='relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        {/* Greeting section */}
        <div className='space-y-1'>
          <p className='text-blue-200 text-sm font-medium font-inter capitalize'>
            {formattedDate}
          </p>
          <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-white font-outfit'>
            {greeting}, {firstName}
          </h1>
          <p className='text-blue-100/80 text-sm md:text-base font-inter'>
            Bienvenido al panel de administración de ICUP
          </p>
        </div>

        {/* Icon */}
        <div className='hidden md:flex items-center justify-center'>
          <div className='p-4 bg-white/10 rounded-2xl backdrop-blur-sm'>
            <HiChartBar className='w-10 h-10 text-white/90' />
          </div>
        </div>
      </div>
    </div>
  );
};
