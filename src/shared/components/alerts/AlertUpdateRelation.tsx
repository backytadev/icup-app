import { useState, useEffect } from 'react';
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

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
} from '@/shared/components/ui/drawer';

import { Button } from '@/shared/components/ui/button';

import { cn } from '@/shared/lib/utils';
import { getInitialFullNames } from '@/shared/helpers/get-full-names.helper';

export interface AlertUpdateRelationProps {
  //* Control props
  isAlertDialogOpen: boolean;
  setIsAlertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  changedId: string | undefined;
  setChangedId: React.Dispatch<React.SetStateAction<string | undefined>>;

  //* Data props
  data: any;
  query: UseQueryResult<any[], Error>;
  updateForm: UseFormReturn<any, any, any>;

  //* Config props
  mode: 'pastor' | 'church'; // pastor: cambio de pastor en ministry, church: cambio de iglesia en pastor
  formFieldName: string; // nombre del campo del formulario a resetear

  //* Display props (optional)
  title?: string;
  subtitle?: string;
  moduleLabel?: string;
  entityName?: string;
  warningMessage?: string;
}

export const AlertUpdateRelation = ({
  isAlertDialogOpen,
  setIsAlertDialogOpen,
  changedId,
  setChangedId,
  data,
  query,
  updateForm,
  mode,
  formFieldName,
  title,
  subtitle,
  moduleLabel,
  entityName,
  warningMessage,
}: AlertUpdateRelationProps): JSX.Element => {
  //* Default texts based on mode
  const defaultTexts = {
    pastor: {
      title: 'Cambio de Pastor',
      subtitle: 'Estás a punto de actualizar el Pastor asignado al ministerio',
      currentLabel: 'Pastor',
      newLabel: 'Pastor',
      warningMessage:
        'Al realizar el cambio de Pastor para este Ministerio, se eliminarán sus relaciones anteriores y se establecerán las nuevas en su lugar.',
    },
    church: {
      title: 'Cambio de Iglesia',
      subtitle: 'Estás a punto de actualizar la Iglesia asignada al pastor',
      currentLabel: 'Iglesia',
      newLabel: 'Iglesia',
      warningMessage:
        'Al realizar el cambio de Iglesia para este Pastor, se eliminarán sus relaciones anteriores y se establecerán las nuevas. Además, todo lo que estaban bajo su cobertura (co-pastores, supervisores, grupos familiares, zonas y discípulos) también serán reasignados con las nuevas relaciones.',
    },
  };

  const texts = defaultTexts[mode];

  //* Extract current info based on mode
  const currentInfo =
    mode === 'pastor'
      ? {
        relation: getInitialFullNames({
          firstNames: data?.theirPastor?.firstNames ?? '',
          lastNames: data?.theirPastor?.lastNames ?? '',
        }),
        church: data?.theirChurch?.abbreviatedChurchName,
      }
      : {
        relation: data?.theirChurch?.abbreviatedChurchName,
        church: null, // No mostrar iglesia en modo church
      };

  //* Extract new info based on mode
  const newEntity = query?.data?.find((item: any) => item.id === changedId);
  const newInfo =
    mode === 'pastor'
      ? {
        relation: getInitialFullNames({
          firstNames: newEntity?.member?.firstNames ?? newEntity?.firstNames ?? '',
          lastNames: newEntity?.member?.lastNames ?? newEntity?.lastNames ?? '',
        }),
        church: newEntity?.theirChurch?.abbreviatedChurchName,
      }
      : {
        relation: newEntity?.abbreviatedChurchName,
        church: null,
      };

  //* Get entity display name (for pastor mode shows ministry name, for church mode shows pastor name)
  const displayEntityName =
    mode === 'pastor'
      ? entityName || data?.customMinistryName
      : entityName || getInitialFullNames({
        firstNames: data?.member?.firstNames ?? '',
        lastNames: data?.member?.lastNames ?? '',
      });

  //* Hook to detect mobile/desktop breakpoint
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = (): void => {
      setIsMobile(window.innerWidth < 768); // md breakpoint is 768px
    };

    // Check on mount
    checkIsMobile();

    // Add event listener
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  //* Handler for cancel action (used in both mobile and desktop)
  const handleCancel = (): void => {
    const originalValue =
      mode === 'pastor' ? data?.theirPastor?.id : data?.theirChurch?.id;
    updateForm.setValue(formFieldName as any, originalValue as any);
    setChangedId(originalValue);
    setIsAlertDialogOpen(false);
  };


  //* Shared header content
  const HeaderContent = (): JSX.Element => (
    <div className='relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 dark:from-amber-600 dark:via-orange-600 dark:to-orange-700 p-5 -mx-6 -mt-4 mb-4 md:mx-0 md:mt-0'>
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-1/2 -right-1/4 w-48 h-48 rounded-full bg-white/10' />
        <div className='absolute -bottom-1/4 -left-1/4 w-32 h-32 rounded-full bg-white/5' />
      </div>
      <div className='relative z-10 space-y-2'>
        <h3 className='text-white font-bold text-xl md:text-2xl text-center font-outfit'>
          {title || texts.title}
        </h3>
        <p className='text-amber-100/90 text-[13px] md:text-[14px] text-center font-inter'>
          {subtitle || texts.subtitle}
        </p>
        {moduleLabel && (
          <div className='flex items-center justify-center gap-2 pt-2'>
            <span className='px-3 py-1 text-[12px] font-semibold bg-white/20 text-white rounded-full font-inter'>
              {moduleLabel}
            </span>
          </div>
        )}
        {displayEntityName && (
          <p className='text-white font-semibold text-[15px] md:text-[17px] text-center font-outfit pt-1'>
            {displayEntityName}
          </p>
        )}
      </div>
    </div>
  );

  //* Shared body content
  const BodyContent = (): JSX.Element => (
    <div className='space-y-4'>
      {/* Current Info */}
      <div className='p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30'>
        <div className='flex items-center gap-2 mb-3'>
          <FiInfo className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
          <p className='text-[13px] md:text-[14px] font-semibold text-emerald-700 dark:text-emerald-400 font-inter'>
            Información actual
          </p>
        </div>
        <div className={cn('grid gap-3', mode === 'pastor' ? 'grid-cols-2' : 'grid-cols-1')}>
          <div>
            <span className='block text-[11px] font-semibold uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400/70 font-inter mb-0.5'>
              {texts.currentLabel}
            </span>
            <span className='text-[13px] md:text-[14px] font-medium text-emerald-800 dark:text-emerald-200 font-inter'>
              {currentInfo.relation || 'Sin asignar'}
            </span>
          </div>
          {mode === 'pastor' && currentInfo.church && (
            <div>
              <span className='block text-[11px] font-semibold uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400/70 font-inter mb-0.5'>
                Iglesia
              </span>
              <span className='text-[13px] md:text-[14px] font-medium text-emerald-800 dark:text-emerald-200 font-inter'>
                {currentInfo.church}
              </span>
            </div>
          )}
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
        <div className={cn('grid gap-3', mode === 'pastor' ? 'grid-cols-2' : 'grid-cols-1')}>
          <div>
            <span className='block text-[11px] font-semibold uppercase tracking-wider text-amber-600/70 dark:text-amber-400/70 font-inter mb-0.5'>
              {texts.newLabel}
            </span>
            <span className='text-[13px] md:text-[14px] font-medium text-amber-800 dark:text-amber-200 font-inter'>
              {newInfo.relation || 'Sin seleccionar'}
            </span>
          </div>
          {mode === 'pastor' && newInfo.church && (
            <div>
              <span className='block text-[11px] font-semibold uppercase tracking-wider text-amber-600/70 dark:text-amber-400/70 font-inter mb-0.5'>
                Iglesia
              </span>
              <span className='text-[13px] md:text-[14px] font-medium text-amber-800 dark:text-amber-200 font-inter'>
                {newInfo.church}
              </span>
            </div>
          )}
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
              {warningMessage || texts.warningMessage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  //* Render mobile drawer or desktop modal based on screen size
  if (isMobile) {
    return (
      <Drawer open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <DrawerContent className='max-h-[96vh]'>
          <div className='overflow-y-auto px-6 pb-4'>
            <HeaderContent />
            <BodyContent />
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
              onClick={() => setIsAlertDialogOpen(false)}
            >
              Sí, Continuar
            </Button>
            <Button
              variant='outline'
              className={cn(
                'w-full h-11 text-[14px] font-semibold font-inter',
                'bg-slate-100 hover:bg-slate-200 text-slate-700',
                'dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300',
                'border border-slate-200 dark:border-slate-700',
                'transition-all duration-200'
              )}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
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
                  {title || texts.title}
                </AlertDialogTitle>
                <AlertDialogDescription className='text-amber-100/90 text-[13px] md:text-[14px] text-center font-inter'>
                  {subtitle || texts.subtitle}
                </AlertDialogDescription>
                {moduleLabel && (
                  <div className='flex items-center justify-center gap-2 pt-2'>
                    <span className='px-3 py-1 text-[12px] font-semibold bg-white/20 text-white rounded-full font-inter'>
                      {moduleLabel}
                    </span>
                  </div>
                )}
                {displayEntityName && (
                  <p className='text-white font-semibold text-[15px] md:text-[17px] text-center font-outfit pt-1'>
                    {displayEntityName}
                  </p>
                )}
              </AlertDialogHeader>
            </div>
          </div>

          {/* Content */}
          <div className='p-5'>
            <BodyContent />
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
              onClick={handleCancel}
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
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
