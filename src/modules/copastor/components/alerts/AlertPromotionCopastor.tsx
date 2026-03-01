import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

export interface AlertPromotionCopastorProps {
  isPromoteButtonDisabled: boolean;
  isInputDisabled: boolean;
  onPromote: () => void;
}

export const AlertPromotionCopastor = ({
  isPromoteButtonDisabled,
  isInputDisabled,
  onPromote,
}: AlertPromotionCopastorProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type='button'
          disabled={isPromoteButtonDisabled || isInputDisabled}
          className='w-full text-[14px] disabled:bg-slate-500 disabled:text-white bg-yellow-400 text-yellow-700 hover:text-white hover:bg-yellow-500'
        >
          Promover de cargo
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className='w-[95vw] max-w-[520px] p-0 overflow-hidden max-h-[90vh]'>
        <div className='overflow-y-auto'>
          {/* Header */}
          <div className='relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 dark:from-amber-600 dark:via-orange-600 dark:to-orange-700 p-5'>
            <div className='absolute inset-0 overflow-hidden'>
              <div className='absolute -top-1/2 -right-1/4 w-48 h-48 rounded-full bg-white/10' />
              <div className='absolute -bottom-1/4 -left-1/4 w-32 h-32 rounded-full bg-white/5' />
            </div>
            <div className='relative z-10'>
              <AlertDialogHeader className='space-y-2'>
                <AlertDialogTitle className='text-white font-bold text-xl md:text-2xl text-center font-outfit'>
                  Promover a este Co-Pastor
                </AlertDialogTitle>
                <AlertDialogDescription className='text-amber-100/90 text-[13px] md:text-[14px] text-center font-inter'>
                  ¿Estás seguro de promover al siguiente cargo?
                </AlertDialogDescription>
                <div className='flex items-center justify-center gap-2 pt-1'>
                  <span className='px-3 py-1 text-[12px] font-semibold bg-white/20 text-white rounded-full font-inter'>
                    Co-Pastor → Pastor
                  </span>
                </div>
              </AlertDialogHeader>
            </div>
          </div>

          {/* Body */}
          <div className='p-5 space-y-3'>
            <p className='text-[13px] md:text-[14px] font-semibold text-slate-600 dark:text-slate-300 font-inter'>
              Información importante antes de continuar:
            </p>

            <div className='space-y-2'>
              {[
                'Luego de confirmar esta promoción, deberás asignar una nueva relación. En este caso, deberás asignar una Iglesia al nuevo Pastor promovido.',
                'Una vez que guardes los cambios, el sistema eliminará automáticamente la relación que tenía el líder en su rol anterior con sus supervisores, zonas, predicadores, grupos familiares y discípulos.',
                'Todos los que dependían de este líder quedarán sin cobertura hasta que se les asigne un nuevo líder en el cargo correspondiente.',
                'Una vez realizada la promoción y actualizadas las relaciones, este líder estará listo para desempeñar sus funciones dentro del nuevo cargo asignado.',
              ].map((text, i) => (
                <div
                  key={i}
                  className='flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30'
                >
                  <FiCheckCircle className='w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0' />
                  <p className='text-[12px] md:text-[13px] text-emerald-700 dark:text-emerald-300 font-inter leading-relaxed'>
                    {text}
                  </p>
                </div>
              ))}
            </div>

            {/* Warning */}
            <div className='p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30'>
              <div className='flex items-start gap-3'>
                <div className='p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 mt-0.5'>
                  <FiAlertTriangle className='w-4 h-4 text-red-600 dark:text-red-400' />
                </div>
                <div>
                  <p className='text-[13px] font-semibold text-red-700 dark:text-red-400 font-inter mb-0.5'>
                    Advertencia
                  </p>
                  <p className='text-[12px] text-red-600 dark:text-red-300/90 font-inter leading-relaxed'>
                    Esta acción no se puede deshacer. Asegúrate de revisar la información antes de confirmar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <AlertDialogFooter className='px-5 pb-5 pt-0 flex gap-3'>
            <AlertDialogCancel
              className={cn(
                'flex-1 h-10 text-[13px] md:text-[14px] font-semibold font-inter mt-0',
                'bg-slate-100 hover:bg-slate-200 text-slate-700',
                'dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300',
                'border border-slate-200 dark:border-slate-700',
                'transition-all duration-200'
              )}
            >
              No, Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                'flex-1 h-10 text-[13px] md:text-[14px] font-semibold font-inter',
                'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
                'hover:from-amber-600 hover:to-orange-600',
                'shadow-sm hover:shadow-md hover:shadow-amber-500/20',
                'transition-all duration-200'
              )}
              onClick={onPromote}
            >
              Sí, Promover
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
