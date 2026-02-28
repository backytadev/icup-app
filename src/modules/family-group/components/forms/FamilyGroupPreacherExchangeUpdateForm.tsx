/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useState, useEffect } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { GiCardExchange } from 'react-icons/gi';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { getPreachersByFilters } from '@/modules/preacher/services/preacher.service';
import { PreacherSearchType } from '@/modules/preacher/enums/preacher-search-type.enum';

import { useFamilyGroupPreacherUpdateMutation } from '@/modules/family-group/hooks/mutations';
import { familyGroupPreacherUpdateFormSchema } from '@/modules/family-group/schemas';
import { type FamilyGroupResponse } from '@/modules/family-group/types';

import { cn } from '@/shared/lib/utils';
import { RecordOrder } from '@/shared/enums/record-order.enum';
import { getFullNames } from '@/shared/helpers/get-full-names.helper';

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from '@/shared/components/ui/form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/shared/components/ui/command';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

interface FamilyGroupPreacherExchangeUpdateFormProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: FamilyGroupResponse | undefined;
}

export const FamilyGroupPreacherExchangeUpdateForm = ({
  id,
  dialogClose,
  scrollToTop,
  data,
}: FamilyGroupPreacherExchangeUpdateFormProps): JSX.Element => {
  //* States
  const [isInputTheirPreacherOpen, setIsInputTheirPreacherOpen] = useState<boolean>(false);
  const [isInputTheirPreacherDisabled, setIsInputTheirPreacherDisabled] =
    useState<boolean>(false);

  //* Form
  const form = useForm<z.infer<typeof familyGroupPreacherUpdateFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(familyGroupPreacherUpdateFormSchema),
    defaultValues: {
      currentFamilyGroup: data?.familyGroupName ?? '',
      currentTheirPreacher: data?.theirPreacher
        ? `${data.theirPreacher.firstNames ?? ''} ${data.theirPreacher.lastNames ?? ''}`.trim()
        : '',
      newTheirPreacher: '',
      newFamilyGroup: '',
    },
  });

  //* Watchers
  const newTheirPreacher = form.watch('newTheirPreacher');
  const newFamilyGroup = form.watch('newFamilyGroup');

  //* Query
  const preachersQuery = useQuery({
    queryKey: ['preachers-by-zone', data?.theirZone?.id],
    queryFn: () =>
      getPreachersByFilters({
        searchType: PreacherSearchType.AvailablePreachersByZone,
        zoneTerm: data?.theirZone?.id ?? '',
        withNullFamilyGroup: false,
        order: RecordOrder.Ascending,
      }),
    enabled: !!data?.theirZone?.id,
    retry: false,
  });

  //* Effects - populate current values on mount
  useEffect(() => {
    form.setValue(
      'currentTheirPreacher',
      data?.theirPreacher
        ? `${data.theirPreacher.firstNames ?? ''} ${data.theirPreacher.lastNames ?? ''}`.trim()
        : '❌ Sin Predicador'
    );
    form.setValue(
      'currentFamilyGroup',
      data?.familyGroupName ? data.familyGroupName : '❌ Sin Grupo Familiar'
    );
  }, []);

  //* Effects - dynamic URL
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/family-groups/update/${id}/exchange-preacher`;
      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);

  //* Mutation
  const familyGroupPreacherUpdateMutation = useFamilyGroupPreacherUpdateMutation({
    dialogClose,
    scrollToTop,
    data,
    setIsInputTheirPreacherDisabled,
  });

  //* Derived states
  const isPending = familyGroupPreacherUpdateMutation.isPending;
  const isSubmitButtonDisabled =
    !newTheirPreacher || !newFamilyGroup || isInputTheirPreacherDisabled;
  const isMessageErrorDisabled = !newTheirPreacher || !newFamilyGroup;

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof familyGroupPreacherUpdateFormSchema>): void => {
    setIsInputTheirPreacherDisabled(true);

    familyGroupPreacherUpdateMutation.mutate({
      id: id ?? '',
      formData: {
        newTheirPreacher: formData.newTheirPreacher,
      },
    });
  };

  return (
    <div className='w-full max-w-[650px] -mt-6'>
      {/* Header */}
      <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-teal-600 dark:from-emerald-600 dark:via-teal-600 dark:to-teal-700 px-6 py-5'>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-2 mb-1'>
            <span className='px-2.5 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter'>
              Intercambio
            </span>
          </div>
          <h2 className='text-xl md:text-2xl font-bold text-white font-outfit leading-tight'>
            Intercambiar Predicadores
          </h2>
          <p className='text-white/80 text-[13px] md:text-[14px] font-inter'>
            Zona: {data?.theirZone?.zoneName} — Supervisor:{' '}
            {data?.theirSupervisor?.firstNames} {data?.theirSupervisor?.lastNames}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
        <div className='py-5 px-4 md:px-6'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='w-full flex flex-col gap-x-10 gap-y-5 md:gap-y-5'
            >
              <div className='flex flex-col md:grid md:grid-cols-7 gap-2'>
                {/* Current (left side) */}
                <div className='flex flex-col gap-2 md:gap-4 md:col-start-1 md:col-end-4'>
                  <FormField
                    control={form.control}
                    name='currentTheirPreacher'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                          Predicador Actual
                        </FormLabel>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Input
                            className={cn(
                              'text-[13px] md:text-[14px] font-medium font-inter',
                              !data?.theirPreacher?.id && 'text-red-500 bg-red-50'
                            )}
                            disabled
                            placeholder='Predicador actual...'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-[12px] font-inter' />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='currentFamilyGroup'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                          Grupo Familiar Actual
                        </FormLabel>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Input
                            className='text-[13px] md:text-[14px] font-medium font-inter'
                            disabled
                            placeholder='Grupo familiar actual...'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-[12px] font-inter' />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Exchange icon */}
                <div className='pt-2 sm:pt-0 col-start-4 col-end-5 text-center justify-center flex items-center'>
                  <GiCardExchange className='text-[2.5rem] text-amber-500' />
                </div>

                {/* New (right side) */}
                <div className='flex flex-col gap-2 md:gap-4 md:col-start-5 md:col-end-8'>
                  <FormField
                    control={form.control}
                    name='newTheirPreacher'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                          Predicador Nuevo
                        </FormLabel>

                        <Popover
                          open={isInputTheirPreacherOpen}
                          onOpenChange={setIsInputTheirPreacherOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Button
                                disabled={isInputTheirPreacherDisabled || isPending}
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'w-full justify-between font-medium text-[13px] md:text-[14px] font-inter'
                                )}
                              >
                                {field.value
                                  ? `${preachersQuery?.data?.find((p) => p.id === field.value)?.member?.firstNames} ${preachersQuery.data?.find((p) => p.id === field.value)?.member?.lastNames}`
                                  : 'Seleccione un predicador'}
                                <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align='center' className='w-auto px-4 py-2'>
                            <Command>
                              <CommandInput
                                placeholder='Busque un predicador...'
                                className='h-9 text-[13px]'
                              />

                              <CommandEmpty>Predicador no encontrado.</CommandEmpty>

                              <CommandGroup
                                className={cn(
                                  'max-h-[200px] h-auto',
                                  !preachersQuery.data && 'w-[320px]'
                                )}
                              >
                                {preachersQuery.data?.map((preacher) =>
                                  preacher.id !== data?.theirPreacher?.id ? (
                                    <CommandItem
                                      className='text-[13px]'
                                      value={getFullNames({
                                        firstNames: preacher?.member?.firstNames ?? '',
                                        lastNames: preacher?.member?.lastNames ?? '',
                                      })}
                                      key={preacher.id}
                                      onSelect={() => {
                                        form.setValue('newTheirPreacher', preacher.id);
                                        form.setValue(
                                          'newFamilyGroup',
                                          preacher.theirFamilyGroup?.familyGroupName ?? ''
                                        );
                                        setIsInputTheirPreacherOpen(false);
                                      }}
                                    >
                                      {`${preacher?.member?.firstNames} ${preacher?.member?.lastNames}`}
                                      <CheckIcon
                                        className={cn(
                                          'ml-auto h-4 w-4',
                                          preacher.id === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                    </CommandItem>
                                  ) : null
                                ) ?? (
                                  <p className='text-[13px] font-medium text-red-500 text-center py-2 w-[20rem]'>
                                    ❌ No se encontró predicadores disponibles, todos están
                                    asignados a un grupo familiar.
                                  </p>
                                )}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <FormMessage className='text-[12px] font-inter' />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='newFamilyGroup'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                          Grupo Familiar Nuevo
                        </FormLabel>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Input
                            className='text-[13px] md:text-[14px] font-medium font-inter'
                            disabled
                            placeholder='Grupo familiar nuevo...'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-[12px] font-inter' />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {isMessageErrorDisabled ? (
                <p className='text-center text-[12px] md:text-[13px] font-medium text-red-500 font-inter px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30'>
                  Datos incompletos. Completa todos los campos para actualizar el registro.
                </p>
              ) : (
                <p className='text-center text-[12px] md:text-[13px] font-medium text-emerald-600 dark:text-emerald-400 font-inter px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30'>
                  ¡Campos completados! Para finalizar, guarda los cambios.
                </p>
              )}

              <div className='w-full md:w-[20rem] md:mx-auto'>
                <Button
                  disabled={isSubmitButtonDisabled}
                  type='submit'
                  className={cn(
                    'w-full text-[13px] md:text-[14px] font-semibold font-inter',
                    'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
                    'hover:from-emerald-600 hover:to-teal-600',
                    'shadow-sm hover:shadow-md hover:shadow-emerald-500/20',
                    'transition-all duration-200',
                    isPending && 'bg-gradient-to-r from-emerald-600 to-teal-600'
                  )}
                  onClick={() => {
                    setTimeout(() => {
                      if (Object.keys(form.formState.errors).length === 0) {
                        setIsInputTheirPreacherDisabled(true);
                      }
                    }, 100);
                  }}
                >
                  {isPending ? 'Procesando...' : 'Guardar cambios'}
                </Button>
              </div>
            </form>
          </Form>

          {/* Consideraciones */}
          <div className='mt-5 border-t border-slate-200 dark:border-slate-700/50 pt-4'>
            <span className='text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-inter'>
              Consideraciones
            </span>
            <ul className='mt-3 space-y-2 text-[13px] text-slate-600 dark:text-slate-300 font-inter'>
              <li className='flex items-start gap-2'>
                <span className='text-blue-500 mt-0.5'>ℹ</span>
                <span>
                  Solo se permitirá el intercambio entre Predicadores que estén bajo la misma Zona
                  y Supervisor.
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-blue-500 mt-0.5'>ℹ</span>
                <span>
                  Al ejecutar el intercambio, cada Predicador pasará al Grupo Familiar del otro,
                  adoptando toda la descendencia (discípulos) del Predicador intercambiado.
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-blue-500 mt-0.5'>ℹ</span>
                <span>
                  Si deseas intercambiar con otro Predicador que no pertenece a la misma Zona,
                  primero debes reasignarlo a la Zona y Supervisor correspondiente.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
