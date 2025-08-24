/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useCallback, useEffect, useRef, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { MdDeleteForever } from 'react-icons/md';
import { zodResolver } from '@hookform/resolvers/zod';

import { useZoneInactivationMutation } from '@/modules/zone/hooks/useZoneInactivationMutation';
import { zoneInactivationFormSchema } from '@/modules/zone/validations/zone-inactivation-form-schema';

import {
  ZoneInactivationCategory,
  ZoneInactivationCategoryNames,
} from '@/modules/zone/enums/zone-inactivation-category.enum';
import {
  ExternalFactorsReasonsNames,
  LeadershipIssuesReasonsNames,
  AdministrativeChangesReasonsNames,
  UnavoidableCircumstancesReasonsNames,
  GroupFamilyRelatedReasonsReasonsNames,
  LackOfActivityOrCommitmentReasonsNames,
} from '@/modules/zone/enums/zone-inactivation-reason.enum';

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
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';

interface ZoneInactivateCardProps {
  idRow: string;
}

export const ZoneInactivateCard = ({ idRow }: ZoneInactivateCardProps): JSX.Element => {
  //* States
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [isSelectInputDisabled, setIsSelectInputDisabled] = useState<boolean>(false);
  const topRef = useRef<HTMLDivElement>(null);

  //* Form
  const form = useForm<z.infer<typeof zoneInactivationFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(zoneInactivationFormSchema),
    defaultValues: {
      zoneInactivationCategory: '',
      zoneInactivationReason: '',
    },
  });

  //* Watchers
  const zoneInactivationCategory = form.watch('zoneInactivationCategory');
  const zoneInactivationReason = form.watch('zoneInactivationReason');

  //* Effects
  useEffect(() => {
    if (!zoneInactivationCategory && !zoneInactivationReason) {
      setIsButtonDisabled(true);
    }
    if (zoneInactivationCategory && zoneInactivationReason) {
      setIsButtonDisabled(false);
    }
  }, [form, zoneInactivationCategory, zoneInactivationReason]);

  //* Effects
  useEffect(() => {
    const originalUrl = window.location.href;

    if (idRow && isCardOpen) {
      const url = new URL(window.location.href);
      url.pathname = `/zones/inactivate/${idRow}/remove`;

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
  const zoneInactivationMutation = useZoneInactivationMutation({
    setIsCardOpen,
    setIsButtonDisabled,
    setIsSelectInputDisabled,
    scrollToTop: handleContainerScroll,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof zoneInactivationFormSchema>): void => {
    setIsSelectInputDisabled(true);
    setIsButtonDisabled(true);

    zoneInactivationMutation.mutate({
      id: idRow,
      zoneInactivationCategory: formData.zoneInactivationCategory,
      zoneInactivationReason: formData.zoneInactivationReason,
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
          <DialogTitle className='dark:text-yellow-500 text-amber-500 font-bold text-[24px] text-center md:text-[28px] pb-3'>
            ¿Estas seguro de inactivar esta Zona?
          </DialogTitle>

          <DialogDescription className='text-blue-500 font-bold mb-3 inline-block text-[16px] md:text-[18px]'>
            Luego de realizar esta operación sucederá lo siguiente:
          </DialogDescription>
          <br />
          <span className='inline-block mb-2 text-[14.5px] md:text-[15px]'>
            ❌ El registro de esta Zona se colocara en estado{' '}
            <span className='font-bold'>INACTIVO.</span>
          </span>
          <span className='inline-block mb-2 text-[14.5px] md:text-[15px]'>
            ❌ El registro de esta Zona se eliminara de los lugares donde estaba relacionado con
            algunos de estos roles:
            <li className='ml-2'>
              <span className='-ml-2'>
                Pastor, Co-Pastor, Supervisor, Zona, Predicador, G. Familiar, Discípulo.
              </span>
            </li>
          </span>
          <span className='inline-block text-[14.5px] md:text-[15px]'>
            ✅ Para poder activarlo nuevamente deberás hacerlo desde el modulo{' '}
            <span className='font-bold'>Actualizar Zona.</span>
          </span>
          <br />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name='zoneInactivationCategory'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold text-emerald-500'>
                        ¿Cuál es el motivo por el cual se esta inactivando este registro?
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px] pl-1'>
                        Elige una categoría de eliminación.
                      </FormDescription>
                      <Select
                        disabled={isSelectInputDisabled}
                        value={field.value}
                        onOpenChange={() => {
                          form.resetField('zoneInactivationReason', {
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
                          {Object.entries(ZoneInactivationCategoryNames).map(([key, value]) => (
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
                name='zoneInactivationReason'
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
                        <SelectContent className='mr-[0rem] w-[80%] sm:ml-[0rem] sm:w-[95%] md:mx-auto md:w-full'>
                          {Object.entries(
                            zoneInactivationCategory ===
                              ZoneInactivationCategory.AdministrativeChanges
                              ? AdministrativeChangesReasonsNames
                              : zoneInactivationCategory ===
                                  ZoneInactivationCategory.ExternalFactors
                                ? ExternalFactorsReasonsNames
                                : zoneInactivationCategory ===
                                    ZoneInactivationCategory.FamilyGroupsRelatedReasons
                                  ? GroupFamilyRelatedReasonsReasonsNames
                                  : zoneInactivationCategory ===
                                      ZoneInactivationCategory.LackOfActivityOrCommitment
                                    ? LackOfActivityOrCommitmentReasonsNames
                                    : zoneInactivationCategory ===
                                        ZoneInactivationCategory.LeadershipIssues
                                      ? LeadershipIssuesReasonsNames
                                      : zoneInactivationCategory ===
                                          ZoneInactivationCategory.UnavoidableCircumstances
                                        ? UnavoidableCircumstancesReasonsNames
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
