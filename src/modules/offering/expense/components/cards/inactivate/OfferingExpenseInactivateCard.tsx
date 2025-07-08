/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useCallback, useEffect, useRef, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { MdDeleteForever } from 'react-icons/md';

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
  idRow: string;
}
export const OfferingExpenseInactivateCard = ({
  idRow,
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

    if (idRow && isCardOpen) {
      const url = new URL(window.location.href);
      url.pathname = `/offerings/expenses/inactivate/${idRow}/remove`;

      window.history.replaceState({}, '', url);

      return () => {
        window.history.replaceState({}, '', originalUrl);
      };
    }
  }, [idRow, isCardOpen]);

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
      id: idRow,
      offeringInactivationReason: formData.offeringInactivationReason,
      offeringInactivationDescription: formData.offeringInactivationDescription ?? '',
    });
  };

  return (
    <Dialog open={isCardOpen} onOpenChange={setIsCardOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            form.reset();
          }}
          className='mt-2 py-2 px-1 h-[2rem] bg-red-400 text-white hover:bg-red-500 hover:text-red-950  dark:text-red-950 dark:hover:bg-red-500 dark:hover:text-white'
        >
          <MdDeleteForever className='w-8 h-[1.65rem]' />
        </Button>
      </DialogTrigger>
      <DialogContent
        ref={topRef}
        className='w-[23rem] sm:w-[25rem] md:w-full max-h-full overflow-x-hidden overflow-y-auto'
      >
        <div className='h-auto'>
          <DialogTitle className='dark:text-yellow-500 text-amber-500 font-bold text-[22px] text-center md:text-[25px] pb-3'>
            ¿Estas seguro de inactivar este registro?
          </DialogTitle>

          <div className='h-[15rem] md:h-[14.5rem]'>
            <DialogDescription className='w-full text-left text-blue-500 font-medium mb-3 inline-block text-[16px] md:text-[18px]'>
              Luego de realizar esta operación sucederá lo siguiente:
            </DialogDescription>
            <br />
            <span className='w-full text-left inline-block mb-2 text-[14.5px] md:text-[15px]'>
              ❌ El registro de esta Salida de Ofrenda se colocara en estado{' '}
              <span className='font-bold'>INACTIVO.</span>
            </span>
            <span className='w-full text-left inline-block mb-2 text-[14.5px] md:text-[15px]'>
              ❌ Este registro no podrá ser activado nuevamente, se quedara inactivo de modo
              permanente para control interno.
            </span>
            <span className='w-full text-left mb-2 text-[14.5px] md:text-[15px] flex flex-col'>
              ✅ Se añadirán a los detalles y/u observaciones del registro:
              <span className='pl-8'>- El motivo de eliminación.</span>
              <span className='pl-8'>- La fecha en la que se elimino.</span>
              <span className='pl-8'>- El usuario que ejecuto esta acción.</span>
            </span>
            <br />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name='offeringInactivationReason'
                render={({ field }) => {
                  return (
                    <FormItem className='mb-4 mt-14 md:mt-4'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold text-emerald-500'>
                        ¿Cuál es el motivo por el cual se esta eliminando este registro?
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px] pl-1 mt-10'>
                        Elige un motivo de eliminación.
                      </FormDescription>
                      <Select
                        disabled={isSelectInputDisabled}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona una tipo de ofrenda' />
                            ) : (
                              'Selecciona una tipo'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(OfferingExpenseInactivationReasonNames).map(
                            ([key, value]) => (
                              <SelectItem className='text-[14px]' key={key} value={key}>
                                {value}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='offeringInactivationDescription'
                render={({ field }) => {
                  return (
                    <FormItem className='mb-5'>
                      <FormDescription>
                        ¿Por que estas inactivando este registro?
                        <span className='ml-3 inline-block bg-orange-200 text-orange-600 border text-[10px] font-bold uppercase px-2 py-[2px] rounded-full mr-1'>
                          Requerido
                        </span>
                      </FormDescription>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Textarea
                          disabled={isTextAreaDisabled}
                          placeholder={`Describe brevemente el motivo inactivación del registro...`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  );
                }}
              />

              <div className='flex justify-end gap-x-4'>
                <Button
                  disabled={isButtonDisabled}
                  className='m-auto text-[14px] w-full border-1 border-red-500 bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:text-red-100 hover:from-red-500 hover:via-red-600 hover:to-red-700 dark:from-red-600 dark:via-red-700 dark:to-red-800 dark:text-gray-100 dark:hover:text-gray-200 dark:hover:from-red-700 dark:hover:via-red-800 dark:hover:to-red-900'
                  type='button'
                  onClick={() => {
                    setIsCardOpen(false);
                  }}
                >
                  No, cancelar
                </Button>
                <Button
                  disabled={isButtonDisabled}
                  type='submit'
                  className='m-auto text-[14px] w-full border-1 border-green-500 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white hover:text-green-100 hover:from-green-500 hover:via-green-600 hover:to-green-700 dark:from-green-600 dark:via-green-700 dark:to-green-800 dark:text-gray-100 dark:hover:text-gray-200 dark:hover:from-green-700 dark:hover:via-green-800 dark:hover:to-green-900'
                >
                  Sí, inactivar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
