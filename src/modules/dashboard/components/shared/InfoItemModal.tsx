import { useState, type ReactNode } from 'react';

import { useMediaQuery } from '@react-hook/media-query';
import { HiOutlineEye } from 'react-icons/hi2';

import { cn } from '@/shared/lib/utils';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '@/shared/components/ui/drawer';

interface InfoItemModalProps {
  /** Title for accessibility (sr-only) */
  title: string;
  /** Description for accessibility (sr-only) */
  description: string;
  /** Content to render inside the modal/drawer */
  children: ReactNode;
  /** Custom trigger button (optional, uses default if not provided) */
  trigger?: ReactNode;
  /** Max width class for the dialog (default: max-w-[690px]) */
  maxWidth?: string;
}

export function InfoItemModal({
  title,
  description,
  children,
  trigger,
  maxWidth = 'max-w-[690px]',
}: InfoItemModalProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const DefaultTrigger = (
    <Button
      variant='ghost'
      size='sm'
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 h-auto',
        'text-xs font-medium',
        'text-blue-600 dark:text-blue-400',
        'bg-blue-50/50 dark:bg-blue-900/20',
        'hover:bg-blue-100 dark:hover:bg-blue-900/40',
        'hover:text-blue-700 dark:hover:text-blue-300',
        'border border-blue-200/50 dark:border-blue-700/30',
        'rounded-lg',
        'transition-all duration-200',
        'group-hover:border-blue-300 dark:group-hover:border-blue-600/50'
      )}
    >
      <HiOutlineEye className='w-3.5 h-3.5' />
      <span>Ver</span>
    </Button>
  );

  const triggerElement = trigger ?? DefaultTrigger;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerElement}</DialogTrigger>
        <DialogContent
          className={cn(maxWidth, 'w-full justify-center pt-14 pb-6 max-h-full overflow-y-auto')}
        >
          <DialogTitle className='sr-only'>{title}</DialogTitle>
          <DialogDescription className='sr-only'>{description}</DialogDescription>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerElement}</DrawerTrigger>
      <DrawerContent>
        <div className='flex justify-center py-8 px-6 max-h-[85vh] overflow-y-auto'>{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
