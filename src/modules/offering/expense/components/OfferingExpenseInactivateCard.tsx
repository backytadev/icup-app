/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useCallback, useEffect, useRef, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/shared/lib/utils';
import { Trash2 } from 'lucide-react';

import { offeringInactivateFormSchema } from '@/modules/offering/shared/validations/offering-inactivate-form-schema';
import { useOfferingExpenseInactivationMutation } from '@/modules/offering/expense/hooks/useOfferingExpenseInactivationMutation';
import { OfferingExpenseInactivationReasonNames } from '@/modules/offering/expense/enums/offering-expense-inactivation-reason.enum';

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/shared/components/ui/form';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/shared/components/ui/select';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';

interface OfferingExpenseInactivateCardProps {
  id: string;
}
export const OfferingExpenseInactivateCard = ({
  id,
}: OfferingExpenseInactivateCardProps): JSX.Element => {
  //* States
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [isSelectInputDisabled, setIsSelectInputDisabled] = useState<boolean>(false);
  const [isTextAreaDisabled, setIsTextAreaDisabled] = useState<boolean>(false);
  const topRef = useRef<HTMLDivElement>(null);

  //* Form
  const form = useForm<z.infer<typeof offeringInactivateFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(offeringInactivateFormSchema),
    defaultValues: {
      offeringInactivationReason: '',
      offeringInactivationDescription: '',
    },
  });

  //* Watchers
  const offeringInactivationReason = form.watch('offeringInactivationReason');
  const offeringInactivationDescription = form.watch('offeringInactivationDescription');

  //* Effects
  useEffect(() => {
    if (
      !offeringInactivationReason ||
      offeringInactivationDescription!.length === 0 ||
      offeringInactivationDescription!.length < 5
    ) {
      setIsButtonDisabled(true);
    }
    if (offeringInactivationReason && offeringInactivationDescription!.length >= 5) {
      setIsButtonDisabled(false);
    }
  }, [form, offeringInactivationReason, offeringInactivationDescription]);

  useEffect(() => {
    const originalUrl = window.location.href;

    if (id && isCardOpen) {
      const url = new URL(window.location.href);
      url.pathname = `/offerings/expenses/inactivate/${id}/remove`;

      window.history.replaceState({}, '', url);

      return () => {
        window.history.replaceState({}, '', originalUrl);
      };
    }
  }, [id, isCardOpen]);

  //* Functions
  const handleContainerScroll = useCallback((): void => {
    if (topRef.current !== null) {
      topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  //* Custom hooks
  const offeringExpenseInactivationMutation = useOfferingExpenseInactivationMutation({
    setIsCardOpen,
    setIsButtonDisabled,
    setIsSelectInputDisabled,
    setIsTextAreaDisabled,
    scrollToTop: handleContainerScroll,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof offeringInactivateFormSchema>): void => {
    setIsSelectInputDisabled(true);
    setIsTextAreaDisabled(true);
    setIsButtonDisabled(true);

    offeringExpenseInactivationMutation.mutate({
      id: id,
      offeringInactivationReason: formData.offeringInactivationReason,
      offeringInactivationDescription: formData.offeringInactivationDescription ?? '',
    });
  };

  return (
    <Dialog open={isCardOpen} onOpenChange={setIsCardOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => {
            form.reset();
          }}
          className='h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20'
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent
        ref={topRef}
        className='w-[23rem] sm:w-[25rem] md:w-[500px] max-h-full overflow-x-hidden overflow-y-auto p-0'
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
                Inactivar Salida de Ofrenda
              </DialogTitle>
              <DialogDescription className='text-red-100/80 text-sm text-center mt-1 font-inter'>
                Esta acción desactivará permanentemente el registro
              </DialogDescription>
            </div>
          </div>

          {/* Content */}
          <div className='p-5 space-y-4'>
            {/* Warning Box */}
            <div className='p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30'>
              <p className='text-sm font-semibold text-amber-700 dark:text-amber-400 font-inter mb-2'>
                Luego de realizar esta operación:
              </p>
              <ul className='space-y-2 text-[13px] text-amber-600 dark:text-amber-300/90 font-inter'>
                <li className='flex items-start gap-2'>
                  <span className='text-red-500'>✗</span>
                  <span>
                    El registro se colocará en estado <span className='font-semibold'>INACTIVO</span> permanente
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-red-500'>✗</span>
                  <span>No podrá ser reactivado nuevamente</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-emerald-500'>✓</span>
                  <span>
                    Se registrará: motivo, fecha y usuario que ejecutó esta acción
                  </span>
                </li>
              </ul>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
                <FormField
                  control={form.control}
                  name='offeringInactivationReason'
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                          Motivo de inactivación
                        </FormLabel>
                        <FormDescription className='text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
                          Selecciona el motivo por el cual se está eliminando este registro
                        </FormDescription>
                        <Select
                          disabled={isSelectInputDisabled}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'>
                              {field.value ? (
                                <SelectValue placeholder='Selecciona un motivo' />
                              ) : (
                                'Selecciona un motivo'
                              )}
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(OfferingExpenseInactivationReasonNames).map(
                              ([key, value]) => (
                                <SelectItem
                                  className='text-[13px] md:text-[14px] font-inter'
                                  key={key}
                                  value={key}
                                >
                                  {value}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage className='text-[12px] font-inter' />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name='offeringInactivationDescription'
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                          Descripción detallada
                          <span className='ml-2 inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full'>
                            Requerido
                          </span>
                        </FormLabel>
                        <FormDescription className='text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
                          Describe brevemente el motivo de inactivación (mínimo 5 caracteres)
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            disabled={isTextAreaDisabled}
                            placeholder='Describe el motivo de inactivación del registro...'
                            className='text-[13px] md:text-[14px] font-inter resize-none bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-[12px] font-inter' />
                      </FormItem>
                    );
                  }}
                />

                {/* Action Buttons */}
                <div className='flex gap-3 pt-2'>
                  <Button
                    disabled={isButtonDisabled}
                    className={cn(
                      'flex-1 h-10 text-[13px] md:text-[14px] font-semibold font-inter',
                      'bg-slate-100 hover:bg-slate-200 text-slate-700',
                      'dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300',
                      'border border-slate-200 dark:border-slate-700',
                      'transition-all duration-200'
                    )}
                    type='button'
                    onClick={() => {
                      setIsCardOpen(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    disabled={isButtonDisabled}
                    type='submit'
                    className={cn(
                      'flex-1 h-10 text-[13px] md:text-[14px] font-semibold font-inter',
                      'bg-gradient-to-r from-red-500 to-rose-500 text-white',
                      'hover:from-red-600 hover:to-rose-600',
                      'shadow-sm hover:shadow-md hover:shadow-red-500/20',
                      'transition-all duration-200',
                      isButtonDisabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isButtonDisabled ? 'Procesando...' : 'Sí, inactivar'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
