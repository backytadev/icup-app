import { cn } from '@/shared/lib/utils';

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTitle = (props: PageTitleProps): JSX.Element => {
  const { children, className } = props;

  return (
    <>
      <div
        className={cn(
          'text-center py-2 md:py-2 xl:pt-3 xl:pb-5 font-sans font-bold text-[2rem] sm:text-[2.5rem] md:text-[2.5rem] lg:text-[2.8rem] xl:text-5xl',
          className
        )}
      >
        {children}
      </div>
      <hr className='md:p-[0.02rem] bg-slate-500' />
    </>
  );
};
