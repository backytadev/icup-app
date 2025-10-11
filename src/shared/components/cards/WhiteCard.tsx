/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { cn } from '@/shared/lib/utils';

interface Props {
  children?: React.ReactNode;
  centered?: boolean;
  className?: string;
  disabled?: boolean;
}

export const WhiteCard = ({ children, centered, className, disabled }: Props): JSX.Element => {
  return (
    <div className='relative w-full h-full'>
      <div
        className={cn(
          'border-[1.5px] rounded-[20px] shadow-3xl shadow-shadow-500 w-full border-slate-500 h-[10rem] sm:h-[12rem] md:h-full lg:h-full xl:h-full 2xl:h-full gap-0 lg:gap-2 p-4 justify-center xl:gap-4 ease-in duration-200 dark:hover:bg-slate-800 hover:bg-slate-200',
          className,
          centered && 'flex flex-col items-center text-center',
          disabled && 'opacity-50 select-none cursor-not-allowed relative overflow-hidden'
        )}
      >
        {children}

        {disabled && (
          <div className='absolute inset-0 flex flex-col items-center justify-center rounded-[20px] backdrop-blur-sm bg-gradient-to-br from-red-400/20 via-red-500/15 to-red-700/20 dark:from-red-700/20 dark:via-red-800/25 dark:to-red-900/30 border border-red-500/30'>
            <div className='flex items-center justify-center w-12 h-12 rounded-full bg-red-600/90 dark:bg-red-500/90 text-white shadow-md mb-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-6 h-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 9v4m0 4h.01M10.29 3.86l-6.6 11.4A1.5 1.5 0 005.4 18h13.2a1.5 1.5 0 001.31-2.74l-6.6-11.4a1.5 1.5 0 00-2.62 0z'
                />
              </svg>
            </div>

            {/* Texto */}
            <span className='text-[15px] font-semibold text-red-800 dark:text-red-300 bg-white/80 dark:bg-slate-800/80 px-3 py-1 rounded-md border border-red-300/50 dark:border-red-500/40'>
              Acceso restringido
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
