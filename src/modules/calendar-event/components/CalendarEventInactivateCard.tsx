import { useCallback, useEffect, useRef, useState } from 'react';

import { Trash2 } from 'lucide-react';

import { useCalendarEventInactivationMutation } from '@/modules/calendar-event/hooks/mutations';

import { cn } from '@/shared/lib/utils';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';

interface EventInactivateCardProps {
  idRow: string;
}

export const CalendarEventInactivateCard = ({ idRow }: EventInactivateCardProps): JSX.Element => {
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [isSelectInputDisabled, setIsSelectInputDisabled] = useState<boolean>(false);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const originalUrl = window.location.href;

    if (idRow && isCardOpen) {
      const url = new URL(window.location.href);
      url.pathname = `/calendar-events/search/${idRow}/delete`;
      window.history.replaceState({}, '', url);

      return () => {
        window.history.replaceState({}, '', originalUrl);
      };
    }
  }, [idRow, isCardOpen]);

  const handleContainerScroll = useCallback((): void => {
    if (topRef.current !== null) {
      topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const eventInactivationMutation = useCalendarEventInactivationMutation({
    setIsCardOpen,
    setIsButtonDisabled,
    setIsSelectInputDisabled,
    scrollToTop: handleContainerScroll,
  });

  const handleConfirm = (): void => {
    setIsSelectInputDisabled(true);
    setIsButtonDisabled(true);

    eventInactivationMutation.mutate({
      id: idRow,
    });
  };

  return (
    <Dialog
      open={isCardOpen}
      onOpenChange={(open) => {
        setIsCardOpen(open);
        if (!open) {
          setIsSelectInputDisabled(false);
          setIsButtonDisabled(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20'
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent
        ref={topRef}
        className='w-[23rem] sm:w-[25rem] md:w-[480px] max-h-full overflow-x-hidden overflow-y-auto p-0'
      >
        <div className='h-auto'>
          {/* Header */}
          <div className='relative overflow-hidden bg-gradient-to-r from-red-500 via-red-600 to-rose-600 dark:from-red-700 dark:via-red-800 dark:to-rose-800 p-5 rounded-t-lg'>
            <div className='absolute inset-0 overflow-hidden'>
              <div className='absolute -top-1/2 -right-1/4 w-48 h-48 rounded-full bg-white/10' />
              <div className='absolute -bottom-1/4 -left-1/4 w-32 h-32 rounded-full bg-white/5' />
            </div>
            <div className='relative z-10'>
              <DialogTitle className='text-white font-bold text-xl md:text-2xl text-center font-outfit'>
                Eliminar Evento
              </DialogTitle>
              <DialogDescription className='text-red-100/80 text-sm text-center mt-1 font-inter'>
                Esta acción eliminará permanentemente el registro del evento
              </DialogDescription>
            </div>
          </div>

          {/* Content */}
          <div className='p-5 space-y-4'>
            {/* Warning */}
            <div className='p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30'>
              <p className='text-sm font-semibold text-amber-700 dark:text-amber-400 font-inter mb-1'>
                Luego de realizar esta operación:
              </p>
              <ul className='space-y-1 text-[13px] text-amber-600 dark:text-amber-300/90 font-inter list-disc list-inside'>
                <li>El evento será eliminado de forma definitiva.</li>
                <li>Esta acción no se puede deshacer.</li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className='flex gap-3 pt-2'>
              <Button
                type='button'
                variant='outline'
                disabled={isSelectInputDisabled}
                onClick={() => setIsCardOpen(false)}
                className='flex-1 h-11 text-sm font-semibold border-slate-300 dark:border-slate-600'
              >
                Cancelar
              </Button>
              <Button
                type='button'
                disabled={isButtonDisabled}
                onClick={handleConfirm}
                className={cn(
                  'flex-1 h-11 text-sm font-semibold',
                  'bg-gradient-to-r from-red-500 to-rose-600',
                  'hover:from-red-600 hover:to-rose-700',
                  'text-white border-transparent'
                )}
              >
                {eventInactivationMutation.isPending ? 'Procesando...' : 'Confirmar'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
