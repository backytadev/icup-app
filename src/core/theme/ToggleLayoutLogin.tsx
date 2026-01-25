import { ModeToggle } from '@/core/theme/mode-toggle';

export const ToggleLayoutLogin = (): JSX.Element => {
  return (
    <div>
      <div className='fixed right-6 top-4 z-50'>
        <ModeToggle />
      </div>
    </div>
  );
};
