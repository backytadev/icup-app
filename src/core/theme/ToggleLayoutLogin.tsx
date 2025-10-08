import { ModeToggle } from '@/core/theme/mode-toggle';

export const ToggleLayoutLogin = (): JSX.Element => {
  return (
    <div>
      <div className='flex justify-end pt-4 pr-4 bg-neutral-100 dark:bg-slate-950 md:w-full md:flex md:-mb-14 md:items-center md:justify-end md:py-[8px] lg:px-[2rem] md:px-[2rem] '>
        <ModeToggle />
      </div>
    </div>
  );
};
