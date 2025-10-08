import { ModeToggle } from '@/core/theme/mode-toggle';

export const ToggleLayout = (): JSX.Element => {
  return (
    <div className='hidden md:block md:absolute right-10 top-3'>
      <ModeToggle />
    </div>
  );
};
