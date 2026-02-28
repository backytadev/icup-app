import { useState, useEffect } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { GiCardExchange } from 'react-icons/gi';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { useZoneSupervisorUpdateMutation } from '@/modules/zone/hooks/mutations';
import { zoneSupervisorUpdateFormSchema } from '@/modules/zone/schemas';
import { type ZoneResponse } from '@/modules/zone/types';

import { getSupervisorsByFilters } from '@/modules/supervisor/services/supervisor.service';
import { SupervisorSearchType } from '@/modules/supervisor/enums/supervisor-search-type.enum';

import { cn } from '@/shared/lib/utils';
import { getFullNames } from '@/shared/helpers/get-full-names.helper';
import { RecordOrder } from '@/shared/enums/record-order.enum';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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

interface ZoneSupervisorExchangeFormUpdateProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: ZoneResponse | undefined;
}

export const ZoneSupervisorExchangeUpdateForm = ({
  id,
  dialogClose,
  scrollToTop,
  data,
}: ZoneSupervisorExchangeFormUpdateProps): JSX.Element => {
  //* States
  const [isInputTheirSupervisorOpen, setIsInputTheirSupervisorOpen] = useState<boolean>(false);
  const [isInputTheirSupervisorDisabled, setIsInputTheirSupervisorDisabled] =
    useState<boolean>(false);

  //* Form
  const form = useForm<z.infer<typeof zoneSupervisorUpdateFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(zoneSupervisorUpdateFormSchema),
    defaultValues: {
      currentZone: '',
      currentTheirSupervisor: '',
      newTheirSupervisor: '',
      newZone: '',
    },
  });

  //* Watchers
  const newTheirSupervisor = form.watch('newTheirSupervisor');
  const newZone = form.watch('newZone');

  //* Query
  const supervisorsQuery = useQuery({
    queryKey: ['supervisors-by-copastor', data?.theirCopastor?.id],
    queryFn: () =>
      getSupervisorsByFilters({
        searchType: SupervisorSearchType.AvailableSupervisorsByCopastor,
        copastorTerm: data?.theirCopastor?.id ?? '',
        withNullZone: false,
        churchId: data?.theirChurch?.id ?? '',
        order: RecordOrder.Ascending,
      }),
    enabled: !!data?.theirCopastor?.id,
    retry: false,
  });

  //* Effects - populate current values on mount
  useEffect(() => {
    form.setValue(
      'currentTheirSupervisor',
      data?.theirSupervisor?.id
        ? `${data?.theirSupervisor?.firstNames} ${data?.theirSupervisor?.lastNames}`
        : '❌ Sin Supervisor'
    );
    form.setValue('currentZone', data?.zoneName ? data?.zoneName : '❌ Sin Zona');
  }, []);

  //* Effects - auto-fill new zone when supervisor is selected
  useEffect(() => {
    if (newTheirSupervisor) {
      const zoneBySupervisor = supervisorsQuery?.data?.find(
        (supervisor) => newTheirSupervisor === supervisor.id
      );
      form.setValue(
        'newZone',
        zoneBySupervisor?.theirZone?.id
          ? zoneBySupervisor?.theirZone?.zoneName
          : '❌ No existe zona'
      );
    }
  }, [newTheirSupervisor]);

  //* Effects - dynamic URL
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/zones/update/${id}/exchange-supervisor`;
      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);

  //* Mutation
  const zoneSupervisorUpdateMutation = useZoneSupervisorUpdateMutation({
    dialogClose,
    scrollToTop,
    setIsInputDisabled: setIsInputTheirSupervisorDisabled,
  });

  //* Derived disabled states
  const isPending = zoneSupervisorUpdateMutation.isPending;
  const isSubmitButtonDisabled = !newTheirSupervisor || !newZone || isInputTheirSupervisorDisabled;
  const isMessageErrorDisabled = !newTheirSupervisor || !newZone;

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof zoneSupervisorUpdateFormSchema>): void => {
    zoneSupervisorUpdateMutation.mutate({
      id: id ?? '',
      formData: {
        newTheirSupervisor: formData.newTheirSupervisor,
      } as any,
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
            Intercambiar Supervisores
          </h2>
          <p className='text-white/80 text-[13px] md:text-[14px] font-inter'>
            {data?.zoneName} - Co-Pastor:{' '}
            {data?.theirCopastor?.firstNames} {data?.theirCopastor?.lastNames}
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
                <div className='flex flex-col gap-2 md:gap-4 md:col-start-1 md:col-end-4'>
                  <FormField
                    control={form.control}
                    name='currentTheirSupervisor'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                          Supervisor Actual
                        </FormLabel>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Input
                            className={cn(
                              'text-[13px] md:text-[14px] font-medium font-inter',
                              !data?.theirSupervisor?.id && 'text-red-500 bg-red-50'
                            )}
                            disabled
                            placeholder='Supervisor actual...'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-[12px] font-inter' />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='currentZone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                          Zona Actual
                        </FormLabel>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Input
                            className='text-[13px] md:text-[14px] font-medium font-inter'
                            disabled
                            placeholder='Zona actual...'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-[12px] font-inter' />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='pt-2 sm:pt-0 col-start-4 col-end-5 text-center justify-center flex items-center'>
                  <GiCardExchange className='text-[2.5rem] text-amber-500' />
                </div>

                <div className='flex flex-col gap-2 md:gap-4 md:col-start-5 md:col-end-8'>
                  <FormField
                    control={form.control}
                    name='newTheirSupervisor'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                          Supervisor Nuevo
                        </FormLabel>

                        <Popover
                          open={isInputTheirSupervisorOpen}
                          onOpenChange={setIsInputTheirSupervisorOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Button
                                disabled={isInputTheirSupervisorDisabled || isPending}
                                variant='outline'
                                role='combobox'
                                className={cn('w-full justify-between font-medium text-[13px] md:text-[14px] font-inter')}
                              >
                                {field.value
                                  ? `${supervisorsQuery?.data?.find((s) => s.id === field.value)?.member?.firstNames} ${supervisorsQuery.data?.find((s) => s.id === field.value)?.member?.lastNames}`
                                  : 'Seleccione un supervisor'}
                                <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align='center' className='w-auto px-4 py-2'>
                            <Command>
                              <CommandInput
                                placeholder='Busque un supervisor...'
                                className='h-9 text-[13px]'
                              />

                              <CommandEmpty>Supervisor no encontrado.</CommandEmpty>

                              <CommandGroup
                                className={cn(
                                  'max-h-[200px] h-auto',
                                  !supervisorsQuery.data && 'w-[320px]'
                                )}
                              >
                                {supervisorsQuery.data?.map((supervisor) =>
                                  supervisor.id !== data?.theirSupervisor?.id ? (
                                    <CommandItem
                                      className='text-[13px]'
                                      value={getFullNames({
                                        firstNames: supervisor?.member?.firstNames ?? '',
                                        lastNames: supervisor?.member?.lastNames ?? '',
                                      })}
                                      key={supervisor.id}
                                      onSelect={() => {
                                        form.setValue('newTheirSupervisor', supervisor?.id);
                                        setIsInputTheirSupervisorOpen(false);
                                      }}
                                    >
                                      {`${supervisor?.member?.firstNames} ${supervisor?.member?.lastNames}`}
                                      <CheckIcon
                                        className={cn(
                                          'ml-auto h-4 w-4',
                                          supervisor.id === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                    </CommandItem>
                                  ) : null
                                ) ?? (
                                    <p className='text-[13px] font-medium text-red-500 text-center py-2 w-[20rem]'>
                                      ❌ No se encontró supervisores disponibles, todos están
                                      asignados a una zona.
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
                    name='newZone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                          Zona Nueva
                        </FormLabel>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Input
                            className='text-[13px] md:text-[14px] font-medium font-inter'
                            disabled
                            placeholder='Zona nueva...'
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
                        setIsInputTheirSupervisorDisabled(true);
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
                <span>Solo se permitirá el intercambio entre Supervisores que estén bajo el mismo Co-Pastor.</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-blue-500 mt-0.5'>ℹ</span>
                <span>Al ejecutar el intercambio, cada Supervisor pasará a la Zona del otro, adoptando toda la descendencia (predicadores, grupos familiares y discípulos) del Supervisor intercambiado.</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-blue-500 mt-0.5'>ℹ</span>
                <span>Esta opción es útil cuando ambos Supervisores pertenecen a un mismo grupo liderado por el mismo Co-Pastor.</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-blue-500 mt-0.5'>ℹ</span>
                <span>Si deseas intercambiar con otro Supervisor que no pertenece al mismo Co-Pastor, primero debes reasignarlo al Co-Pastor correspondiente.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
