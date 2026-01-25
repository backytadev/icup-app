import { forwardRef } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { cn } from '@/shared/lib/utils';
import { Input } from '@/shared/components/ui/input';
import { usePasswordVisibility } from '@/modules/auth/hooks';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, disabled, ...props }, ref) => {
    const { isVisible, toggle, inputType } = usePasswordVisibility();

    return (
      <div className='relative'>
        <Input
          ref={ref}
          type={inputType}
          disabled={disabled}
          className={cn(
            'pr-10 transition-all duration-200',
            'focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
            error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
            className
          )}
          {...props}
        />
        <button
          type='button'
          onClick={toggle}
          disabled={disabled}
          className={cn(
            'absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none transition-colors duration-200',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          tabIndex={-1}
          aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {isVisible ? (
            <FaEyeSlash size={18} className='transition-transform duration-200 hover:scale-110' />
          ) : (
            <FaEye size={18} className='transition-transform duration-200 hover:scale-110' />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
