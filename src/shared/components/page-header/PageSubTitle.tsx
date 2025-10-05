import { cn } from '@/shared/lib/utils';

interface PageSubTitleProps {
  subTitle: string;
  description: string;
  className?: string;
}

export const PageSubTitle = ({
  subTitle,
  description,
  className,
}: PageSubTitleProps): JSX.Element => {
  return (
    <div className='w-full'>
      <h2
        className={cn(
          'text-left whitespace-nowrap pb-[2px] pt-2 px-4 sm:px-5 2xl:px-10 font-sans font-bold text-green-500 text-[1.6rem] sm:text-[1.75rem] md:text-[1.85rem] lg:text-[1.9rem] xl:text-[2.1rem] 2xl:text-4xl',
          className
        )}
      >
        {subTitle}
      </h2>

      {description && (
        <p className='dark:text-slate-300 text-left font-sans font-bold pl-5 pr-6 sm:pl-7 2xl:px-28 text-[13.5px] md:text-[15px] xl:text-base'>
          {description}
        </p>
      )}
    </div>
  );
};
