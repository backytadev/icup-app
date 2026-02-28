import { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogDescription,
} from '@/shared/components/ui/alert-dialog';
import { Drawer, DrawerContent, DrawerFooter } from '@/shared/components/ui/drawer';
import { Button } from '@/shared/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';

const STEPS: Array<{ number: string; content: React.ReactNode }> = [
  {
    number: '1',
    content: (
      <>
        Identifica al Predicador que deseas trasladar y actualiza su Supervisor desde{' '}
        <a
          target='_blank'
          href='/preachers/update'
          className='text-blue-500 hover:text-blue-700 underline font-semibold transition-colors'
        >
          Actualizar Predicador
        </a>
        , para que pertenezca a la misma Zona del G. Familiar que deseas cambiar.
      </>
    ),
  },
  {
    number: '2',
    content:
      'La nueva Zona y Supervisor se propagarán automáticamente a toda la descendencia del Predicador (grupos familiares y discípulos).',
  },
  {
    number: '3',
    content: (
      <>
        Ahora que el Predicador pertenece a la misma Zona, realiza el intercambio desde{' '}
        <a
          target='_blank'
          href='/family-groups/update'
          className='text-blue-500 hover:text-blue-700 underline font-semibold transition-colors'
        >
          Intercambiar Predicador
        </a>{' '}
        (busca y selecciona el nuevo predicador).
      </>
    ),
  },
  {
    number: '4',
    content:
      'El otro Predicador involucrado también adoptará toda la descendencia que hayas transferido.',
  },
  {
    number: '5',
    content: (
      <>
        Finalmente, reasigna al Predicador afectado actualizando su Supervisor para que pertenezca a
        la otra Zona desde{' '}
        <a
          target='_blank'
          href='/preachers/update'
          className='text-blue-500 hover:text-blue-700 underline font-semibold transition-colors'
        >
          Actualizar Predicador
        </a>
        .
      </>
    ),
  },
];

const TriggerButton = ({ onClick }: { onClick: () => void }): JSX.Element => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          className='w-8 h-8 p-1.5 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors'
          onClick={onClick}
        >
          <HelpCircle className='w-5 h-5 text-amber-500' />
        </Button>
      </TooltipTrigger>
      <TooltipContent side='bottom'>
        <p className='text-[13px] font-medium'>Ver detalles del proceso</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const StepsList = (): JSX.Element => (
  <div className='space-y-3'>
    <div className='p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30'>
      <p className='text-[12px] md:text-[13px] text-red-600 dark:text-red-300/90 font-inter leading-relaxed'>
        ⚠ No es posible reasignar directamente un G. Familiar a un Predicador de otra Zona. Sigue
        estos pasos:
      </p>
    </div>

    <div className='space-y-2'>
      {STEPS.map((step) => (
        <div
          key={step.number}
          className='flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50'
        >
          <span className='flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center font-inter'>
            {step.number}
          </span>
          <p className='text-[12px] md:text-[13px] text-slate-600 dark:text-slate-300 font-inter leading-relaxed'>
            {step.content}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export const AlertUpdateRelationFamilyGroup = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = (): void => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) {
    return (
      <>
        <TriggerButton onClick={() => setIsOpen(true)} />
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className='max-h-[92vh]'>
            <div className='overflow-y-auto px-6 pb-4'>
              {/* Header */}
              <div className='relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 dark:from-amber-600 dark:via-orange-600 dark:to-orange-700 p-5 -mx-6 mb-4'>
                <div className='absolute inset-0 overflow-hidden'>
                  <div className='absolute -top-1/2 -right-1/4 w-48 h-48 rounded-full bg-white/10' />
                  <div className='absolute -bottom-1/4 -left-1/4 w-32 h-32 rounded-full bg-white/5' />
                </div>
                <div className='relative z-10 space-y-1 text-center'>
                  <h3 className='text-white font-bold text-xl font-outfit'>Reasignar a otra Zona</h3>
                  <p className='text-amber-100/90 text-[13px] font-inter'>
                    ¿Deseas mover este G. Familiar a un Predicador de otra Zona?
                  </p>
                </div>
              </div>

              <StepsList />
            </div>

            <DrawerFooter className='pt-2'>
              <Button
                className={cn(
                  'w-full h-11 text-[14px] font-semibold font-inter',
                  'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
                  'hover:from-amber-600 hover:to-orange-600',
                  'shadow-sm hover:shadow-md hover:shadow-amber-500/20',
                  'transition-all duration-200'
                )}
                onClick={() => setIsOpen(false)}
              >
                Sí, Entiendo
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      <TriggerButton onClick={() => setIsOpen(true)} />
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className='w-[95vw] max-w-[520px] p-0 overflow-hidden max-h-[90vh]'>
          <div className='overflow-y-auto'>
            {/* Header */}
            <div className='relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 dark:from-amber-600 dark:via-orange-600 dark:to-orange-700 p-5'>
              <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute -top-1/2 -right-1/4 w-48 h-48 rounded-full bg-white/10' />
                <div className='absolute -bottom-1/4 -left-1/4 w-32 h-32 rounded-full bg-white/5' />
              </div>
              <div className='relative z-10'>
                <AlertDialogHeader className='space-y-1'>
                  <AlertDialogTitle className='text-white font-bold text-xl md:text-2xl text-center font-outfit'>
                    Reasignar a otra Zona
                  </AlertDialogTitle>
                  <AlertDialogDescription className='text-amber-100/90 text-[13px] md:text-[14px] text-center font-inter'>
                    ¿Deseas mover este G. Familiar a un Predicador de otra Zona?
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </div>
            </div>

            {/* Content */}
            <div className='p-5'>
              <StepsList />
            </div>

            {/* Footer */}
            <AlertDialogFooter className='px-5 pb-5 pt-0'>
              <AlertDialogAction
                className={cn(
                  'w-full h-10 text-[13px] md:text-[14px] font-semibold font-inter',
                  'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
                  'hover:from-amber-600 hover:to-orange-600',
                  'shadow-sm hover:shadow-md hover:shadow-amber-500/20',
                  'transition-all duration-200'
                )}
              >
                Sí, Entiendo
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
