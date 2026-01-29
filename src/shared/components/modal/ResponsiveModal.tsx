import { type ReactNode } from 'react';

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
import { Drawer, DrawerContent, DrawerTrigger } from '@/shared/components/ui/drawer';

type TriggerVariant = 'info' | 'update' | 'delete' | 'outline';
type ModalSize = keyof typeof MODAL_SIZES;

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: ReactNode;
  triggerVariant?: TriggerVariant;
  triggerIcon?: ReactNode;
  triggerClassName?: string;
  children: ReactNode;
  maxWidth?: ModalSize;
  title?: string;
  description?: string;
  dialogContentClassName?: string;
  useDrawerOnMobile?: boolean;
}

const triggerVariantMap: Record<TriggerVariant, string> = {
  info: BUTTON_VARIANTS.info,
  update: BUTTON_VARIANTS.update,
  delete: BUTTON_VARIANTS.delete,
  outline: '',
};

export const ResponsiveModal = ({
  open,
  onOpenChange,
  trigger,
  triggerVariant = 'outline',
  triggerIcon,
  triggerClassName,
  children,
  maxWidth = 'lg',
  title,
  description,
  dialogContentClassName,
  useDrawerOnMobile = true,
}: ResponsiveModalProps): JSX.Element => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const triggerButton = trigger ?? (
    <Button
      variant='outline'
      className={cn(
        TRIGGER_BUTTON_BASE,
        triggerVariantMap[triggerVariant],
        triggerClassName
      )}
    >
      {triggerIcon && <span className={ICON_SIZE}>{triggerIcon}</span>}
    </Button>
  );

  // Desktop: Always Dialog
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent
          className={cn(
            'w-full justify-center py-6 max-h-full overflow-y-auto overflow-x-hidden',
            MODAL_SIZES[maxWidth],
            dialogContentClassName
          )}
        >
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  // Mobile: Drawer if enabled, otherwise Dialog
  if (useDrawerOnMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent>
          <div className='flex justify-center py-8 px-6 max-h-full overflow-y-auto overflow-x-hidden'>
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent
        className={cn(
          'w-full justify-center py-6 max-h-full overflow-y-auto overflow-x-hidden',
          'max-w-auto sm:max-w-[590px]',
          dialogContentClassName
        )}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
};
