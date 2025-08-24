/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useCallback, useEffect, useRef, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { MdDeleteForever } from 'react-icons/md';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  MinistryInactivationCategory,
  MinistryInactivationCategoryNames,
} from '@/modules/ministry/enums/ministry-inactivation-category.enum';
import {
  AdministrativeReasonsNames,
  LeadershipIssuesReasonsNames,
  CommunityRelatedIssuesReasonsNames,
  LackOfActivityOrCommitmentReasonsNames,
} from '@/modules/ministry/enums/ministry-inactivation-reason.enum';

import { useMinistryInactivationMutation } from '@/modules/ministry/hooks/useMinistryInactivationMutation';

import { ministryInactivationFormSchema } from '@/modules/ministry/validations/ministry-inactivation-form-schema';

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/shared/components/ui/form';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/shared/components/ui/select';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';

interface MinistryInactivateCardProps {
  idRow: string;
}

export const MinistryInactivateCard = ({ idRow }: MinistryInactivateCardProps): JSX.Element => {
  //* States
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [isSelectInputDisabled, setIsSelectInputDisabled] = useState<boolean>(false);
  const topRef = useRef<HTMLDivElement>(null);

  //* Form
  const form = useForm<z.infer<typeof ministryInactivationFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(ministryInactivationFormSchema),
    defaultValues: {
      ministryInactivationCategory: '',
      ministryInactivationReason: '',
    },
  });

  //* Watchers
  const ministryInactivationCategory = form.watch('ministryInactivationCategory');
  const ministryInactivationReason = form.watch('ministryInactivationReason');

  //* Effects
  useEffect(() => {
    if (!ministryInactivationCategory && !ministryInactivationReason) {
      setIsButtonDisabled(true);
    }
    if (ministryInactivationCategory && ministryInactivationReason) {
      setIsButtonDisabled(false);
    }
  }, [form, ministryInactivationCategory, ministryInactivationReason]);

  useEffect(() => {
    const originalUrl = window.location.href;

    if (idRow && isCardOpen) {
      const url = new URL(window.location.href);
      url.pathname = `/ministries/inactivate/${idRow}/remove`;

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
  const ministryInactivationMutation = useMinistryInactivationMutation({
    setIsCardOpen,
    setIsButtonDisabled,
    setIsSelectInputDisabled,
    scrollToTop: handleContainerScroll,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof ministryInactivationFormSchema>): void => {
    setIsSelectInputDisabled(true);
    setIsButtonDisabled(true);

    ministryInactivationMutation.mutate({
      id: idRow,
      ministryInactivationCategory: formData.ministryInactivationCategory,
      ministryInactivationReason: formData.ministryInactivationReason,
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
          <DialogTitle className='dark:text-yellow-500 text-amber-500 font-bold text-[22px] text-center md:text-[28px] pb-3'>
            ¿Estas seguro de inactivar este Ministerio?
          </DialogTitle>

          <DialogDescription className='text-blue-500 font-bold mb-3 inline-block text-[16px] md:text-[18px]'>
            Luego de realizar esta operación sucederá lo siguiente:
          </DialogDescription>
          <br />
          <span className='inline-block mb-2 text-[14.5px] md:text-[15px]'>
            ❌ El registro de este Ministerio se colocara en estado{' '}
            <span className='font-bold'>INACTIVO.</span>
          </span>
          <span className='inline-block mb-2 text-[14.5px] md:text-[15px]'>
            ❌ El registro de este Ministerio se eliminara de los lugares donde estaba relacionado:
            <li className='ml-2'>
              <span className='-ml-2'>Iglesia y Pastor</span>
            </li>
          </span>
          <span className='inline-block text-[14.5px] md:text-[15px]'>
            ✅ Para poder activarlo nuevamente deberás hacerlo desde el modulo{' '}
            <span className='font-bold'>
              <a
                href='/ministries/update'
                className='text-blue-600 hover:underline hover:text-blue-600 transition-colors'
              >
                Actualizar Ministerio.
              </a>
            </span>
          </span>
          <br />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name='ministryInactivationCategory'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] leading-1 md:text-[15px] font-bold text-emerald-500'>
                        ¿Cuál es el motivo por el cual se esta inactivando este registro?
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px] pl-1'>
                        Elige una categoría de eliminación.
                      </FormDescription>
                      <Select
                        disabled={isSelectInputDisabled}
                        value={field.value}
                        onOpenChange={() => {
                          form.resetField('ministryInactivationReason', {
                            defaultValue: '',
                          });
                        }}
                        onValueChange={field.onChange}
                      >
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona una categoría' />
                            ) : (
                              'Selecciona una categoría'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(MinistryInactivationCategoryNames).map(([key, value]) => (
                            <SelectItem className='text-[14px]' key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='ministryInactivationReason'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormDescription className='text-[13.5px] md:text-[14px] pl-1'>
                        Elige un motivo de eliminación según su categoría.
                      </FormDescription>
                      <Select
                        disabled={isSelectInputDisabled}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona un motivo' />
                            ) : (
                              'Selecciona un motivo'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='mr-[0rem] w-[85%] sm:ml-[0rem] sm:w-[95%] md:mx-auto md:w-full'>
                          {Object.entries(
                            ministryInactivationCategory ===
                              MinistryInactivationCategory.Administrative
                              ? AdministrativeReasonsNames
                              : ministryInactivationCategory ===
                                  MinistryInactivationCategory.CommunityRelatedIssues
                                ? CommunityRelatedIssuesReasonsNames
                                : ministryInactivationCategory ===
                                    MinistryInactivationCategory.LackOfActivityOrCommitment
                                  ? LackOfActivityOrCommitmentReasonsNames
                                  : ministryInactivationCategory ===
                                      MinistryInactivationCategory.LeadershipIssues
                                    ? LeadershipIssuesReasonsNames
                                    : []
                          ).map(([key, value]) => (
                            <SelectItem className='text-[14px]' key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  );
                }}
              />

              <div className='flex justify-center md:justify-end gap-x-4 mt-4'>
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
