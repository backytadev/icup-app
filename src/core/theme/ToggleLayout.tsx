import { ModeToggle } from '@/core/theme/mode-toggle';

export const ToggleLayout = (): JSX.Element => {
  return (
    <div className='hidden md:flex z-50 mx-auto h-[100%] items-center '>
      <ModeToggle />
    </div>
  );
};
