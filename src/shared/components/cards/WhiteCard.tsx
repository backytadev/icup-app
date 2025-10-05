/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { cn } from '@/shared/lib/utils';

interface Props {
  children?: React.ReactNode;
  centered?: boolean;
  className?: string;
}

export const WhiteCard = ({ children, centered, className }: Props): JSX.Element => {
  return (
    <div
      className={cn(
        'border-[1.5px] rounded-[20px] shadow-3xl shadow-shadow-500 w-full border-slate-500 h-[10rem] sm:h-[12rem] md:h-full lg:h-full xl:h-full 2xl:h-full gap-0 lg:gap-2 p-4 justify-center xl:gap-4 ease-in duration-200 dark:hover:bg-slate-800 hover:bg-slate-200',
        className,
        centered && 'flex flex-col items-center text-center'
      )}
    >
      {children}
    </div>
  );
};
