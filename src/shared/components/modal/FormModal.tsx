import { type ReactNode, useRef, useCallback } from 'react';

import { GiArchiveRegister } from 'react-icons/gi';
import { useMediaQuery } from '@react-hook/media-query';

import { cn } from '@/shared/lib/utils';
import { BUTTON_VARIANTS, TRIGGER_BUTTON_BASE, MODAL_SIZES, ICON_SIZE } from '@/shared/constants/styles';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';

type ModalSize = keyof typeof MODAL_SIZES;

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: ReactNode;
  triggerIcon?: ReactNode;
  triggerClassName?: string;
  maxWidth?: ModalSize;
  customMaxWidth?: string;
  children: ReactNode;
  dialogClose?: () => void;
  scrollToTop?: () => void;
}

export const FormModal = ({
  open,
  onOpenChange,
  trigger,
  triggerIcon,
  triggerClassName,
  maxWidth = 'xl',
  customMaxWidth,
  children,
}: FormModalProps): JSX.Element => {
  const topRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleClose = useCallback((): void => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleScrollToTop = useCallback((): void => {
    if (topRef.current !== null) {
      topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const triggerButton = trigger ?? (
    <Button
      variant='outline'
      className={cn(TRIGGER_BUTTON_BASE, BUTTON_VARIANTS.update, triggerClassName)}
    >
      {triggerIcon ?? <GiArchiveRegister className={ICON_SIZE} />}
    </Button>
  );

  // Inject props to children if they accept dialogClose and scrollToTop
  const childrenWithProps =
    typeof children === 'object' && children !== null
      ? (() => {
        const child = children as React.ReactElement<{
          dialogClose?: () => void;
          scrollToTop?: () => void;
        }>;
        if (child.props !== undefined) {
          return {
            ...child,
            props: {
              ...child.props,
              dialogClose: handleClose,
              scrollToTop: handleScrollToTop,
            },
          };
        }
        return children;
      })()
      : children;

  // Build size classes based on maxWidth
  const sizeClasses =
    maxWidth === '2xl'
      ? `md:max-w-[740px] lg:${MODAL_SIZES.xl} xl:${MODAL_SIZES['2xl']}`
      : maxWidth === 'xl'
        ? `md:max-w-[740px] lg:${MODAL_SIZES.xl} xl:${MODAL_SIZES.xl}`
        : `md:${MODAL_SIZES[maxWidth]}`;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent
          ref={topRef}
          className={cn(
            'w-full max-h-full justify-center pt-[0.9rem] pb-[1.3rem] overflow-x-hidden overflow-y-auto',
            customMaxWidth ?? sizeClasses
          )}
        >
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          {childrenWithProps}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent
        ref={topRef}
        className='max-w-auto sm:max-w-[590px] w-full max-h-full justify-center pt-6 pb-4 px-6 overflow-y-auto overflow-x-hidden'
      >
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
        {childrenWithProps}
      </DialogContent>
    </Dialog>
  );
};
