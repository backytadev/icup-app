import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { useUpdateZoneEffects } from '@/modules/zone/hooks/useZoneUpdateEffects';
import { useZoneUpdateMutation } from '@/modules/zone/hooks/useZoneUpdateMutation';
import { useZoneUpdateSubmitButtonLogic } from '@/modules/zone/hooks/useZoneUpdateSubmitButtonLogic';

import { zoneFormSchema } from '@/modules/zone/validations/zone-form-schema';
import { type ZoneResponse } from '@/modules/zone/interfaces/zone-response.interface';
import { ZoneFormSkeleton } from '@/modules/zone/components/cards/update/ZoneFormSkeleton';
import { SupervisorSearchType } from '@/modules/supervisor/enums/supervisor-search-type.enum';

import { getSupervisorsByFilters } from '@/modules/supervisor/services/supervisor.service';

import { AlertUpdateRelationZone } from '@/modules/zone/components/alerts/AlertUpdateRelationZone';

import { cn } from '@/shared/lib/utils';

import { getFullNames } from '@/shared/helpers/get-full-names.helper';
import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';

import { CountryNames } from '@/shared/enums/country.enum';
import { ProvinceNames } from '@/shared/enums/province.enum';
import { DistrictNames } from '@/shared/enums/district.enum';
import { DepartmentNames } from '@/shared/enums/department.enum';
import { RecordOrder } from '@/shared/enums/record-order.enum';

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/shared/components/ui/form';
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from '@/shared/components/ui/command';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

interface ZoneFormUpdateProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: ZoneResponse | undefined;
}

export const ZoneUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: ZoneFormUpdateProps): JSX.Element => {
  //* States
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);
  const [isInputTheirSupervisorOpen, setIsInputTheirSupervisorOpen] = useState<boolean>(false);
  const [isInputTheirSupervisorDisabled, setIsInputTheirSupervisorDisabled] =
    useState<boolean>(false);

  const [changedId, setChangedId] = useState(data?.theirSupervisor?.id);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  //* Hooks (external libraries)
  const { pathname } = useLocation();

  //* Form
  const form = useForm<z.infer<typeof zoneFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(zoneFormSchema),
    defaultValues: {
      zoneName: '',
      country: '',
      department: '',
      province: '',
      district: '',
      recordStatus: '',
      theirSupervisor: '',
    },
  });

  //* Helpers
  const districtsValidation = validateDistrictsAllowedByModule(pathname);

  //* Effects
  useEffect(() => {
    if (data && data?.theirSupervisor?.id !== changedId) {
      setTimeout(() => {
        setIsAlertDialogOpen(true);
      }, 100);
    }
  }, [changedId]);

  //* Custom hooks
  useUpdateZoneEffects({
    id,
    data,
    setIsLoadingData,
    zoneUpdateForm: form,
  });

  useZoneUpdateSubmitButtonLogic({
    zoneUpdateForm: form,
    isInputDisabled,
    setIsSubmitButtonDisabled,
    setIsMessageErrorDisabled,
  });

  const zoneUpdateMutation = useZoneUpdateMutation({
    dialogClose,
    scrollToTop,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
    setIsInputTheirSupervisorDisabled,
  });

  //* Queries
  const availableSupervisorsQuery = useQuery({
    queryKey: ['available-supervisors'],
    queryFn: () =>
      getSupervisorsByFilters({
        searchType: SupervisorSearchType.AvailableSupervisorsByChurch,
        withNullZone: true,
        churchTerm: data?.theirChurch?.id ?? '',
        churchId: data?.theirChurch?.id ?? '',
        order: RecordOrder.Ascending,
      }),
    retry: false,
  });

  const notAvailableSupervisorQuery = useQuery({
    queryKey: ['not-available-supervisors'],
    queryFn: () =>
      getSupervisorsByFilters({
        searchType: SupervisorSearchType.AvailableSupervisorsByChurch,
        withNullZone: false,
        churchTerm: data?.theirChurch?.id ?? '',
        churchId: data?.theirChurch?.id ?? '',
        order: RecordOrder.Ascending,
      }),
    retry: false,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof zoneFormSchema>): void => {
    zoneUpdateMutation.mutate({ id, formData });
  };

  return (
    <Tabs
      defaultValue='general-info'
      className='w-auto -mt-8 sm:w-[520px] md:w-[680px] lg:w-[990px] xl:w-[1100px]'
    >
      <h2 className='text-center leading-7 text-orange-500 pb-2 font-bold text-[24px] sm:text-[26px] md:text-[28px]'>
        Modificar información de la Zona
      </h2>

      <TabsContent value='general-info'>
        <Card className='w-full'>
          {isLoadingData && <ZoneFormSkeleton />}

          {!isLoadingData && (
            <CardContent className='py-3 px-4'>
              <div className='dark:text-slate-300 text-slate-500 font-bold text-[16.5px] md:text-[18px] mb-4 md:pl-4'>
                Zona: {data?.zoneName} - {data?.district}
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className='w-full flex flex-col md:grid md:grid-cols-2 gap-x-10 gap-y-5 px-2 sm:px-12'
                >
                  <div className='col-start-1 col-end-2'>
                    <FormField
                      control={form.control}
                      name='zoneName'
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Nombre
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asignar una nombre a la zona.
                            </FormDescription>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                disabled={isInputDisabled}
                                placeholder='Ejem: Iglesia Roca Fuerte...'
                                type='text'
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
                      name='country'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-3'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              País
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asignar el país al que pertenece la iglesia.
                            </FormDescription>
                            <Select
                              disabled={isInputDisabled}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <SelectTrigger>
                                  {field.value ? (
                                    <SelectValue placeholder='Selecciona el país' />
                                  ) : (
                                    'Selecciona el país'
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(CountryNames).map(([key, value]) => (
                                  <SelectItem className={`text-[14px]`} key={key} value={key}>
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
                      name='department'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-3'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Departamento
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asignar el departamento al que pertenece el grupo familiar.
                            </FormDescription>
                            <Select
                              disabled={isInputDisabled}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <SelectTrigger>
                                  {field.value ? (
                                    <SelectValue placeholder='Selecciona el departamento' />
                                  ) : (
                                    'Selecciona el departamento'
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(DepartmentNames).map(([key, value]) => (
                                  <SelectItem className={`text-[14px]`} key={key} value={key}>
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
                      name='province'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-3'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Provincia
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asignar la provincia a la que pertenece la iglesia.
                            </FormDescription>
                            <Select
                              disabled={isInputDisabled}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <SelectTrigger>
                                  {field.value ? (
                                    <SelectValue placeholder='Selecciona la provincia' />
                                  ) : (
                                    'Selecciona la provincia'
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(ProvinceNames).map(([key, value]) => (
                                  <SelectItem className={`text-[14px]`} key={key} value={key}>
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
                  </div>

                  <div className='col-start-2 col-end-3'>
                    <FormField
                      control={form.control}
                      name='district'
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Distrito
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asignar el distrito al que pertenece la iglesia.
                            </FormDescription>
                            <Select
                              disabled={isInputDisabled}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <SelectTrigger>
                                  {field.value ? (
                                    <SelectValue placeholder='Selecciona el distrito' />
                                  ) : (
                                    'Selecciona el distrito'
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(DistrictNames).map(([key, value]) => (
                                  <SelectItem
                                    className={`text-[14px] ${districtsValidation?.districtsDataResult?.includes(value) ? 'hidden' : ''}`}
                                    key={key}
                                    value={key}
                                  >
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
                      name='theirSupervisor'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-3'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Supervisor
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asigna el Supervisor responsable de esta Zona.
                            </FormDescription>
                            <Popover
                              open={isInputTheirSupervisorOpen}
                              onOpenChange={setIsInputTheirSupervisorOpen}
                            >
                              <PopoverTrigger asChild>
                                <FormControl className='text-[14px] md:text-[14px]'>
                                  <Button
                                    value={field.value}
                                    disabled={isInputTheirSupervisorDisabled}
                                    variant='outline'
                                    role='combobox'
                                    className={cn(
                                      'w-full justify-between',
                                      !field.value && 'font-normal'
                                    )}
                                  >
                                    {field.value
                                      ? `${notAvailableSupervisorQuery?.data?.find((supervisor) => supervisor.id === field.value)?.member?.firstNames} ${notAvailableSupervisorQuery?.data?.find((supervisor) => supervisor.id === field.value)?.member?.lastNames}`
                                      : 'Busque y seleccione una iglesia'}
                                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent align='center' className='w-auto px-4 py-2'>
                                <Command>
                                  {availableSupervisorsQuery?.data?.length &&
                                  availableSupervisorsQuery?.data?.length > 0 ? (
                                    <>
                                      <CommandInput
                                        placeholder='Busque un supervisor...'
                                        className='h-9 text-[14px]'
                                      />
                                      <CommandEmpty>Supervisor no encontrado.</CommandEmpty>
                                      <CommandGroup className='max-h-[200px] h-auto w-[350px]'>
                                        {availableSupervisorsQuery?.data?.map((supervisor) => (
                                          <CommandItem
                                            className='text-[14px]'
                                            value={getFullNames({
                                              firstNames: supervisor?.member?.firstNames ?? '',
                                              lastNames: supervisor?.member?.lastNames ?? '',
                                            })}
                                            key={supervisor.id}
                                            onSelect={() => {
                                              form.setValue('theirSupervisor', supervisor.id);
                                              setChangedId(supervisor.id);
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
                                        ))}
                                      </CommandGroup>
                                    </>
                                  ) : (
                                    (!availableSupervisorsQuery?.data ||
                                      availableSupervisorsQuery?.data?.length === 0) && (
                                      <p className='text-[14.5px] w-[20rem] text-red-500 text-center'>
                                        ❌ No se encontró supervisores disponibles, todos están
                                        asignados a una zona.
                                      </p>
                                    )
                                  )}
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        );
                      }}
                    />

                    <AlertUpdateRelationZone
                      data={data}
                      isAlertDialogOpen={isAlertDialogOpen}
                      setIsAlertDialogOpen={setIsAlertDialogOpen}
                      availableSupervisorsQuery={availableSupervisorsQuery}
                      zoneUpdateForm={form}
                      setChangedId={setChangedId}
                      changedId={changedId}
                    />

                    <FormField
                      control={form.control}
                      name='recordStatus'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-3'>
                            <FormLabel className='text-[14px]'>Estado</FormLabel>
                            <Select
                              disabled={isInputDisabled}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl className='text-[14px]'>
                                <SelectTrigger>
                                  {field.value === 'active' ? (
                                    <SelectValue placeholder='Activo' />
                                  ) : (
                                    <SelectValue placeholder='Inactivo' />
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem className='text-[14px]' value='active'>
                                  Activo
                                </SelectItem>
                                <SelectItem className='text-[14px]' value='inactive'>
                                  Inactivo
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {form.getValues('recordStatus') === 'active' && (
                              <FormDescription className='pl-2 text-[12.5px] xl:text-[13px] font-bold'>
                                *El registro esta <span className='text-green-500'>Activo</span>,
                                para colocarla como <span className='text-red-500'>Inactivo</span>{' '}
                                debe inactivar el registro desde el modulo{' '}
                                <span className='font-bold text-red-500'>Inactivar Zona.</span>
                              </FormDescription>
                            )}
                            {form.getValues('recordStatus') === 'inactive' && (
                              <FormDescription className='pl-2 text-[12.5px] xl:text-[13px] font-bold'>
                                * El registro esta <span className='text-red-500 '>Inactivo</span>,
                                puede modificar el estado eligiendo otra opción.
                              </FormDescription>
                            )}
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  {isMessageErrorDisabled ? (
                    <p className='-mb-5 mt-4 md:mt-1 md:-mb-3 md:row-start-2 md:row-end-3 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                      ❌ Datos incompletos, completa todos los campos para guardar el registro.
                    </p>
                  ) : (
                    <p className='-mt-3 order-last md:-mt-2 md:row-start-4 md:row-end-5 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                      ¡Campos completados correctamente! <br /> Para finalizar por favor guarde los
                      cambios.
                    </p>
                  )}

                  <div className='mt-2 md:mt-1 md:col-start-1 md:col-end-3 md:row-start-3 md:row-end-4 w-full md:w-[20rem] md:m-auto'>
                    <Button
                      disabled={isSubmitButtonDisabled}
                      type='submit'
                      className={cn(
                        'w-full text-[14px]',
                        zoneUpdateMutation?.isPending &&
                          'bg-emerald-500 hover:bg-emerald-500 disabled:opacity-100 disabled:md:text-[15px] text-white'
                      )}
                      onClick={() => {
                        setTimeout(() => {
                          if (Object.keys(form.formState.errors).length === 0) {
                            setIsSubmitButtonDisabled(true);
                            setIsInputTheirSupervisorDisabled(true);
                            setIsInputDisabled(true);
                          }
                        }, 100);
                      }}
                    >
                      {zoneUpdateMutation?.isPending ? 'Procesando...' : 'Guardar cambios'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  );
};
