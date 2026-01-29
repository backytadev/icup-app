import { type ReactNode, useRef, useCallback } from 'react';

import { MdDeleteForever } from 'react-icons/md';

import { cn } from '@/shared/lib/utils';
import { BUTTON_VARIANTS, TRIGGER_BUTTON_BASE, ICON_SIZE } from '@/shared/constants/styles';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';

type ConfirmVariant = 'danger' | 'warning' | 'default';

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  variant?: ConfirmVariant;
  children?: ReactNode;
  trigger?: ReactNode;
  triggerIcon?: ReactNode;
  triggerClassName?: string;
  onTriggerClick?: () => void;
}

const titleVariantMap: Record<ConfirmVariant, string> = {
  danger: 'dark:text-yellow-500 text-amber-500',
  warning: 'dark:text-orange-500 text-orange-500',
  default: 'dark:text-blue-500 text-blue-500',
};

export const ConfirmModal = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Sí, confirmar',
  cancelLabel = 'No, cancelar',
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'danger',
  children,
  trigger,
  triggerIcon,
  triggerClassName,
  onTriggerClick,
}: ConfirmModalProps): JSX.Element => {
  const topRef = useRef<HTMLDivElement>(null);

  const scrollToTop = useCallback((): void => {
    if (topRef.current !== null) {
      topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleCancel = (): void => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = (): void => {
    onConfirm?.();
    scrollToTop();
  };

  const triggerButton = trigger ?? (
    <Button
      onClick={onTriggerClick}
      className={cn(TRIGGER_BUTTON_BASE, BUTTON_VARIANTS.delete, triggerClassName)}
    >
      {triggerIcon ?? <MdDeleteForever className={ICON_SIZE} />}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent
        ref={topRef}
        className='w-[23rem] sm:w-[25rem] md:w-full max-h-full overflow-x-hidden overflow-y-auto'
      >
        <div className='h-auto'>
          <DialogTitle
            className={cn(
              'font-bold text-[24px] text-center md:text-[28px] pb-3',
              titleVariantMap[variant]
            )}
          >
            {title}
          </DialogTitle>

          {description && (
            <DialogDescription asChild>
              <div className='text-blue-500 font-bold mb-3 inline-block text-[16px] md:text-[18px]'>
                {description}
              </div>
            </DialogDescription>
          )}

          {children}

          <div className='flex justify-center md:justify-end gap-x-4 mt-4'>
            <Button
              disabled={isLoading}
              className={cn('m-auto text-[14px] w-full', BUTTON_VARIANTS.cancel)}
              type='button'
              onClick={handleCancel}
            >
              {cancelLabel}
            </Button>
            <Button
              disabled={isLoading}
              type='submit'
              className={cn('m-auto text-[14px] w-full', BUTTON_VARIANTS.confirm)}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
