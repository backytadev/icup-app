import { type UseFormReturn } from 'react-hook-form';
import { type UseQueryResult } from '@tanstack/react-query';
import { FiAlertTriangle, FiArrowRight, FiCheckCircle, FiInfo } from 'react-icons/fi';

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from '@/shared/components/ui/alert-dialog';

import { cn } from '@/shared/lib/utils';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';
import { type PastorResponse } from '@/modules/pastor/interfaces/pastor-response.interface';
import { type MinistryResponse, type MinistryFormData } from '@/modules/ministry/types';
import { MinistryType, MinistryTypeNames } from '@/modules/ministry/enums/ministry-type.enum';

export interface AlertUpdateRelationMinistryProps {
  data: MinistryResponse | undefined;
  isAlertDialogOpen: boolean;
  changedId: string | undefined;
  setChangedId: React.Dispatch<React.SetStateAction<string | undefined>>;
  pastorsQuery: UseQueryResult<PastorResponse[], Error>;
  setIsAlertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ministryUpdateForm: UseFormReturn<MinistryFormData, unknown, MinistryFormData | undefined>;
}

export const AlertUpdateRelationMinistry = ({
  data,
  isAlertDialogOpen,
  setIsAlertDialogOpen,
  pastorsQuery,
  ministryUpdateForm,
  setChangedId,
  changedId,
}: AlertUpdateRelationMinistryProps): JSX.Element => {
  const currentPastor = getInitialFullNames({
    firstNames: data?.theirPastor?.firstNames ?? '',
    lastNames: data?.theirPastor?.lastNames ?? '',
  });

  const newPastor = pastorsQuery?.data?.find((pastor) => pastor.id === changedId);
  const newPastorName = getInitialFullNames({
    firstNames: newPastor?.member?.firstNames ?? '',
    lastNames: newPastor?.member?.lastNames ?? '',
  });

  return (
    <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
      <AlertDialogContent className='w-[95vw] max-w-[520px] p-0 overflow-hidden'>
        {/* Header */}
        <div className='relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 dark:from-amber-600 dark:via-orange-600 dark:to-orange-700 p-5'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='absolute -top-1/2 -right-1/4 w-48 h-48 rounded-full bg-white/10' />
            <div className='absolute -bottom-1/4 -left-1/4 w-32 h-32 rounded-full bg-white/5' />
          </div>
          <div className='relative z-10'>
            <AlertDialogHeader className='space-y-2'>
              <AlertDialogTitle className='text-white font-bold text-xl md:text-2xl text-center font-outfit'>
                Cambio de Pastor
              </AlertDialogTitle>
              <AlertDialogDescription className='text-amber-100/90 text-[13px] md:text-[14px] text-center font-inter'>
                Estás a punto de actualizar el Pastor asignado al ministerio
              </AlertDialogDescription>
              <div className='flex items-center justify-center gap-2 pt-2'>
                <span className='px-3 py-1 text-[12px] font-semibold bg-white/20 text-white rounded-full font-inter'>
                  {MinistryTypeNames[data?.ministryType as MinistryType]}
                </span>
              </div>
              <p className='text-white font-semibold text-[15px] md:text-[17px] text-center font-outfit pt-1'>
                {data?.customMinistryName}
              </p>
            </AlertDialogHeader>
          </div>
        </div>

        {/* Content */}
        <div className='p-5 space-y-4'>
          {/* Current Info */}
          <div className='p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30'>
            <div className='flex items-center gap-2 mb-3'>
              <FiInfo className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
              <p className='text-[13px] md:text-[14px] font-semibold text-emerald-700 dark:text-emerald-400 font-inter'>
                Información actual
              </p>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <span className='block text-[11px] font-semibold uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400/70 font-inter mb-0.5'>
                  Pastor
                </span>
                <span className='text-[13px] md:text-[14px] font-medium text-emerald-800 dark:text-emerald-200 font-inter'>
                  {currentPastor || 'Sin asignar'}
                </span>
              </div>
              <div>
                <span className='block text-[11px] font-semibold uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400/70 font-inter mb-0.5'>
                  Iglesia
                </span>
                <span className='text-[13px] md:text-[14px] font-medium text-emerald-800 dark:text-emerald-200 font-inter'>
                  {data?.theirChurch?.abbreviatedChurchName || 'Sin asignar'}
                </span>
              </div>
            </div>
          </div>

          {/* Arrow indicator */}
          <div className='flex justify-center'>
            <div className='p-2 rounded-full bg-amber-100 dark:bg-amber-900/30'>
              <FiArrowRight className='w-5 h-5 text-amber-600 dark:text-amber-400 rotate-90' />
            </div>
          </div>

          {/* New Info */}
          <div className='p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30'>
            <div className='flex items-center gap-2 mb-3'>
              <FiCheckCircle className='w-4 h-4 text-amber-600 dark:text-amber-400' />
              <p className='text-[13px] md:text-[14px] font-semibold text-amber-700 dark:text-amber-400 font-inter'>
                Nueva relación seleccionada
              </p>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <span className='block text-[11px] font-semibold uppercase tracking-wider text-amber-600/70 dark:text-amber-400/70 font-inter mb-0.5'>
                  Pastor
                </span>
                <span className='text-[13px] md:text-[14px] font-medium text-amber-800 dark:text-amber-200 font-inter'>
                  {newPastorName || 'Sin seleccionar'}
                </span>
              </div>
              <div>
                <span className='block text-[11px] font-semibold uppercase tracking-wider text-amber-600/70 dark:text-amber-400/70 font-inter mb-0.5'>
                  Iglesia
                </span>
                <span className='text-[13px] md:text-[14px] font-medium text-amber-800 dark:text-amber-200 font-inter'>
                  {newPastor?.theirChurch?.abbreviatedChurchName || 'Sin asignar'}
                </span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className='p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30'>
            <div className='flex items-start gap-3'>
              <div className='p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 mt-0.5'>
                <FiAlertTriangle className='w-4 h-4 text-red-600 dark:text-red-400' />
              </div>
              <div>
                <p className='text-[13px] md:text-[14px] font-semibold text-red-700 dark:text-red-400 font-inter mb-1'>
                  Advertencia
                </p>
                <p className='text-[12px] md:text-[13px] text-red-600 dark:text-red-300/90 font-inter leading-relaxed'>
                  Al realizar el cambio de Pastor para este Ministerio, se eliminarán sus relaciones
                  anteriores y se establecerán las nuevas en su lugar.
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
            onClick={() => {
              ministryUpdateForm.setValue('theirPastor', data?.theirPastor?.id);
              setChangedId(data?.theirPastor?.id);
            }}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(
              'flex-1 h-10 text-[13px] md:text-[14px] font-semibold font-inter',
              'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
              'hover:from-amber-600 hover:to-orange-600',
              'shadow-sm hover:shadow-md hover:shadow-amber-500/20',
              'transition-all duration-200'
            )}
          >
            Sí, Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
