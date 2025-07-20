/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { GiCardExchange } from 'react-icons/gi';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { useZoneSupervisorUpdateEffects } from '@/modules/zone/hooks/useZoneSupervisorUpdateEffects';
import { useZoneSupervisorUpdateMutation } from '@/modules/zone/hooks/useZoneSupervisorUpdateMutation';
import { useZoneSupervisorUpdateSubmitButtonLogic } from '@/modules/zone/hooks/useZoneSupervisorUpdateSubmitButtonLogic';

import { type ZoneResponse } from '@/modules/zone/interfaces/zone-response.interface';
import { getSupervisorsByCopastor } from '@/modules/supervisor/services/supervisor.service';
import { SupervisorSearchType } from '@/modules/supervisor/enums/supervisor-search-type.enum';
import { zoneSupervisorUpdateFormSchema } from '@/modules/zone/validations/zone-supervisor-update-form-schema';

import { cn } from '@/shared/lib/utils';

import { getFullNames } from '@/shared/helpers/get-full-names.helper';

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
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
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
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(true);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);
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

  //* Queries
  const supervisorsQuery = useQuery({
    queryKey: ['supervisors-by-copastor', data?.theirCopastor?.id],
    queryFn: () =>
      getSupervisorsByCopastor({
        searchType: SupervisorSearchType.CopastorId,
        copastorId: data?.theirCopastor?.id ?? '',
        isNullZone: false,
      }),
    enabled: !!data?.theirCopastor?.id,
    retry: false,
  });

  //* Custom Hooks
  useZoneSupervisorUpdateEffects({
    id,
    data,
    zoneSupervisorUpdateForm: form,
    supervisorsQuery,
  });

  useZoneSupervisorUpdateSubmitButtonLogic({
    zoneSupervisorUpdateForm: form,
    setIsSubmitButtonDisabled,
    setIsMessageErrorDisabled,
    isInputTheirSupervisorDisabled,
  });

  const zoneSupervisorUpdateMutation = useZoneSupervisorUpdateMutation({
    dialogClose,
    scrollToTop,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
    setIsInputTheirSupervisorDisabled,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof zoneSupervisorUpdateFormSchema>): void => {
    zoneSupervisorUpdateMutation.mutate({
      id: id ?? '',
      formData: {
        newTheirSupervisor: formData.newTheirSupervisor,
      },
    });
  };

  return (
    <Tabs
      defaultValue='general-info'
      className='-mt-8 w-auto sm:w-[480px] md:w-[550px] lg:w-[550px] xl:w-[600px]'
    >
      <h2 className='text-center text-emerald-500 font-bold text-[24px] sm:text-[24px] md:text-[30px] uppercase'>
        Intercambiar Supervisores
      </h2>

      <TabsContent value='general-info' className='overflow-y-auto'>
        <Card className='w-full'>
          <CardContent className='py-4 px-4'>
            <div className='font-bold text-[15px] md:text-[15px] mb-4'>
              Copastor:{' '}
              <span className='font-black text-amber-500 text-[16.5px] md:text-[17.5px]'>
                {`${data?.theirCopastor?.firstNames} ${data?.theirCopastor?.lastNames}`}
              </span>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='w-full flex flex-col gap-x-10 gap-y-5 md:gap-y-5 px-2 md:px-4'
              >
                <div className='flex flex-col md:grid md:grid-cols-7 gap-2'>
                  <div className='flex flex-col gap-2 md:gap-4 md:col-start-1 md:col-end-4'>
                    <FormField
                      control={form.control}
                      name='currentTheirSupervisor'
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel className='text-[14px] font-bold'>
                              Supervisor Actual
                            </FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                className={cn(
                                  'text-[14px] font-medium ',
                                  !data?.theirSupervisor?.id && 'text-red-500 bg-red-50'
                                )}
                                disabled={isInputDisabled}
                                placeholder='Supervisor actual...'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name='currentZone'
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel className='text-[14px] font-bold'>Zona Actual</FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                className='font-medium'
                                disabled={isInputDisabled}
                                placeholder='Zona actual...'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  <div className='pt-2 sm:pt-0 col-start-4 col-end-5 text-center justify-center flex items-center'>
                    <GiCardExchange className='text-[2.5rem] text-amber-500' />
                  </div>

                  <div className='flex flex-col gap-2 md:gap-4 md:col-start-5 md:col-end-8'>
                    <FormField
                      control={form.control}
                      name='newTheirSupervisor'
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel className='text-[14px] font-bold'>
                              Supervisor Nuevo
                            </FormLabel>

                            <Popover
                              open={isInputTheirSupervisorOpen}
                              onOpenChange={setIsInputTheirSupervisorOpen}
                            >
                              <PopoverTrigger asChild>
                                <FormControl className='text-[14px] md:text-[14px]'>
                                  <Button
                                    disabled={isInputTheirSupervisorDisabled}
                                    variant='outline'
                                    role='combobox'
                                    className={cn('w-full justify-between font-medium text-[14px]')}
                                  >
                                    {field.value
                                      ? `${supervisorsQuery?.data?.find((supervisor) => supervisor.id === field.value)?.member?.firstNames} ${supervisorsQuery.data?.find((supervisor) => supervisor.id === field.value)?.member?.lastNames}`
                                      : 'Seleccione un supervisor'}
                                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent align='center' className='w-auto px-4 py-2'>
                                <Command>
                                  <CommandInput
                                    placeholder='Busque un supervisor...'
                                    className='h-9 text-[14px]'
                                  />

                                  <CommandEmpty>Supervisor no encontrado.</CommandEmpty>

                                  <CommandGroup
                                    className={cn(
                                      'max-h-[200px] h-auto ',
                                      !supervisorsQuery.data && 'w-[320px]'
                                    )}
                                  >
                                    {supervisorsQuery.data?.map((supervisor) =>
                                      supervisor.id !== data?.theirSupervisor?.id ? (
                                        <CommandItem
                                          className='text-[14px]'
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
                                      <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                        ❌ No se encontró supervisores disponibles, todos están
                                        asignados a una zona.
                                      </p>
                                    )}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>

                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name='newZone'
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel className='text-[14px] font-bold'>Zona Nueva</FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                className='font-medium'
                                disabled={isInputDisabled}
                                placeholder='Zona nueva...'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </div>

                {isMessageErrorDisabled ? (
                  <p className='-mb-2 md:-mb-3 md:row-start-5 md:row-end-6 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                    ❌ Datos incompletos, completa todos los campos para actualizar el registro.
                  </p>
                ) : (
                  <p className='-mt-1 order-last md:-mt-3 md:row-start-6 md:row-end-7 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                    ¡Campos completados correctamente! <br /> Para finalizar por favor guarde los
                    cambios.
                  </p>
                )}

                <div className='w-full md:w-[20rem] md:mx-auto col-start-1 col-end-3 text-sm md:text-md xl:text-base'>
                  <Button
                    disabled={isSubmitButtonDisabled}
                    type='submit'
                    className={cn(
                      'w-full text-[14px]',
                      zoneSupervisorUpdateMutation?.isPending &&
                        'bg-emerald-500 disabled:opacity-100 disabled:text-[16px] text-white'
                    )}
                    onClick={() => {
                      setTimeout(() => {
                        if (Object.keys(form.formState.errors).length === 0) {
                          setIsSubmitButtonDisabled(true);
                          setIsInputDisabled(true);
                          setIsInputTheirSupervisorDisabled(true);
                        }
                      }, 100);
                    }}
                  >
                    {zoneSupervisorUpdateMutation?.isPending ? 'Procesando...' : 'Guardar cambios'}
                  </Button>
                </div>
              </form>
            </Form>
            <div className='mt-3'>
              <p className='text-sky-500 text-[54px] md:text-[15px] font-bold mb-2'>
                Consideraciones
              </p>

              <p className='text-[14px] md:text-[14px] mb-2 font-medium'>
                ℹ Solo se permitirá el intercambio entre Supervisores que estén bajo el mismo
                Co-Pastor.
              </p>
              <p className='text-[13px] md:text-[13px] mb-2 font-medium'>
                ℹ Al ejecutar el intercambio, cada Supervisor pasará a la Zona del otro, adoptando
                así toda la descendencia (predicadores, grupos familiares y discípulos) del
                Supervisor intercambiado.
              </p>
              <p className='text-[14px] md:text-[14px] mb-2 font-medium'>
                ℹ Esta opción es útil cuando ambos Supervisores pertenecen a un mismo grupo
                liderado por el mismo Co-Pastor.
              </p>
              <p className='text-[13px] md:text-[13px] mb-2 font-medium'>
                ℹ Si deseas intercambiar con otro Supervisor que no pertenece al mismo Co-Pastor,
                primero debes reasignarlo al Co-Pastor correspondiente.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
