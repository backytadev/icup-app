/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import { type z } from 'zod';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { getSimplePastors } from '@/modules/pastor/services/pastor.service';
import { getSimpleCopastors } from '@/modules/copastor/services/copastor.service';

import { usePreacherUpdateEffects } from '@/modules/preacher/hooks/usePreacherUpdateEffects';
import { usePreacherUpdateMutation } from '@/modules/preacher/hooks/usePreacherUpdateMutation';
import { usePreacherPromoteButtonLogic } from '@/modules/preacher/hooks/usePreacherPromoteButtonLogic';
import { usePreacherUpdateSubmitButtonLogic } from '@/modules/preacher/hooks/usePreacherUpdateSubmitButtonLogic';

import { getSimpleSupervisors } from '@/modules/supervisor/services/supervisor.service';
import { preacherFormSchema } from '@/modules/preacher/validations/preacher-form-schema';
import { type PreacherResponse } from '@/modules/preacher/interfaces/preacher-response.interface';
import { PreacherFormSkeleton } from '@/modules/preacher/components/cards/update/PreacherFormSkeleton';

import { cn } from '@/shared/lib/utils';

import { GenderNames } from '@/shared/enums/gender.enum';
import { CountryNames } from '@/shared/enums/country.enum';
import { ProvinceNames } from '@/shared/enums/province.enum';
import { DistrictNames } from '@/shared/enums/district.enum';
import { DepartmentNames } from '@/shared/enums/department.enum';
import { UrbanSectorNames } from '@/shared/enums/urban-sector.enum';
import { MaritalStatusNames } from '@/shared/enums/marital-status.enum';
import { MemberRole, MemberRoleNames } from '@/shared/enums/member-role.enum';

import { useRoleValidationByPath } from '@/shared/hooks/useRoleValidationByPath';

import { getFullNames } from '@/shared/helpers/get-full-names.helper';
import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

import { AlertPromotionPreacher } from '@/modules/preacher/components/alerts/AlertPromotionPreacher';
import { AlertUpdateRelationPreacher } from '@/modules/preacher/components/alerts/AlertUpdateRelationPreacher';

import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Calendar } from '@/shared/components/ui/calendar';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

interface PreacherFormUpdateProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: PreacherResponse | undefined;
}

export const PreacherUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: PreacherFormUpdateProps): JSX.Element => {
  //* States
  const [isRelationSelectDisabled, setIsRelationSelectDisabled] = useState<boolean>(false);
  const [isInputTheirSupervisorOpen, setIsInputTheirSupervisorOpen] = useState<boolean>(false);
  const [isInputTheirCopastorOpen, setIsInputTheirCopastorOpen] = useState<boolean>(false);
  const [isInputTheirPastorOpen, setIsInputTheirPastorOpen] = useState<boolean>(false);
  const [isInputBirthDateOpen, setIsInputBirthDateOpen] = useState<boolean>(false);
  const [isInputConvertionDateOpen, setIsInputConvertionDateOpen] = useState<boolean>(false);
  const [isPromoteButtonDisabled, setIsPromoteButtonDisabled] = useState<boolean>(false);

  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isCheckBoxDisabled, setIsCheckBoxDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(false);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);
  const [isMessagePromoteDisabled, setIsMessagePromoteDisabled] = useState<boolean>(false);

  const [isLoadingData, setIsLoadingData] = useState(true);

  const [changedId, setChangedId] = useState(data?.theirSupervisor?.id);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  //* Hooks (external libraries)
  const { pathname } = useLocation();

  //* Form
  const form = useForm<z.infer<typeof preacherFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(preacherFormSchema),
    defaultValues: {
      firstNames: '',
      lastNames: '',
      gender: '',
      originCountry: '',
      birthDate: undefined,
      maritalStatus: '',
      numberChildren: '',
      conversionDate: undefined,
      email: '',
      phoneNumber: '',
      residenceCountry: '',
      residenceDepartment: '',
      residenceProvince: '',
      residenceDistrict: '',
      residenceUrbanSector: '',
      residenceAddress: '',
      referenceAddress: '',
      roles: [MemberRole.Preacher],
      recordStatus: '',
      theirCopastor: '',
      theirSupervisor: '',
      theirPastor: '',
    },
  });

  //* Watchers
  const residenceDistric = form.watch('residenceDistrict');
  const theirCopastor = form.watch('theirCopastor');
  const theirSupervisor = form.watch('theirSupervisor');
  const theirPastor = form.watch('theirPastor');
  const isDirectRelationToPastor = form.watch('isDirectRelationToPastor');

  //* Effects
  useEffect(() => {
    if (data && data?.theirSupervisor?.id !== changedId) {
      setTimeout(() => {
        setIsAlertDialogOpen(true);
      }, 100);
    }
  }, [changedId]);

  //* Helpers
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(residenceDistric);
  const districtsValidation = validateDistrictsAllowedByModule(pathname);

  //* Custom Hooks
  usePreacherUpdateEffects({
    id,
    data,
    setIsLoadingData,
    preacherUpdateForm: form,
  });

  const { disabledRoles } = useRoleValidationByPath({
    path: pathname,
  });

  usePreacherPromoteButtonLogic({
    preacherUpdateForm: form,
    setIsPromoteButtonDisabled,
  });

  usePreacherUpdateSubmitButtonLogic({
    preacherUpdateForm: form,

    isInputDisabled,
    setIsMessageErrorDisabled,
    setIsSubmitButtonDisabled,
    isRelationSelectDisabled,
  });

  const preacherUpdateMutation = usePreacherUpdateMutation({
    dialogClose,
    scrollToTop,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
    setIsRelationSelectDisabled,
    setIsCheckBoxDisabled,
  });

  //* Queries
  const supervisorsQuery = useQuery({
    queryKey: ['supervisors', id],
    queryFn: () => getSimpleSupervisors({ isNullZone: false, isSimpleQuery: true }),
    retry: false,
  });

  const copastorsQuery = useQuery({
    queryKey: ['copastors', id],
    queryFn: () => getSimpleCopastors({ isSimpleQuery: true }),
    retry: false,
  });

  const pastorsQuery = useQuery({
    queryKey: ['pastors', id],
    queryFn: () => getSimplePastors({ isSimpleQuery: true }),
    retry: false,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof preacherFormSchema>): void => {
    preacherUpdateMutation.mutate({ id, formData });
  };

  return (
    <Tabs
      defaultValue='general-info'
      className='w-auto -mt-8 sm:w-[520px] md:w-[680px] lg:w-[990px] xl:w-[1100px]'
    >
      <h2 className='text-center leading-7 text-orange-500 pb-2 font-bold text-[24px] sm:text-[26px] md:text-[28px]'>
        Modificar información del Predicador
      </h2>

      <TabsContent value='general-info'>
        <Card className='w-full'>
          {isLoadingData && <PreacherFormSkeleton />}

          {!isLoadingData && (
            <CardContent className='py-3 px-4'>
              <div className='dark:text-slate-300 text-slate-500 font-bold text-[16.5px] md:text-[18px] mb-4 pl-0 md:pl-4'>
                Predicador: {data?.member?.firstNames} {data?.member?.lastNames}
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className='w-full flex flex-col md:grid md:grid-cols-3 gap-x-10 gap-y-5 px-2 sm:px-12'
                >
                  <div className='col-start-1 col-end-2'>
                    <legend className='font-bold text-[15px] md:text-[16px]'>
                      Datos generales
                    </legend>
                    <FormField
                      control={form.control}
                      name='firstNames'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-3'>
                            <FormLabel className='text-[14px]'>Nombres</FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                disabled={isInputDisabled}
                                className='text-[14px]'
                                placeholder='Ejem: Roberto Martin...'
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
                      name='lastNames'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>Apellidos</FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                disabled={isInputDisabled}
                                className='text-[14px]'
                                placeholder='Ejem: Mendoza Prado...'
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
                      name='gender'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>Género</FormLabel>
                            <Select
                              disabled={isInputDisabled}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl className='text-[14px]'>
                                <SelectTrigger>
                                  {field.value ? (
                                    <SelectValue placeholder='Selecciona el tipo de Género' />
                                  ) : (
                                    'Selecciona el tipo de Género'
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(GenderNames).map(([key, value]) => (
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
                      name='originCountry'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>País de Origen</FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                disabled={isInputDisabled}
                                className='text-[14px]'
                                placeholder='Ejem: Perú, Colombia, Mexico...'
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
                      name='birthDate'
                      render={({ field }) => (
                        <FormItem className='mt-2'>
                          <FormLabel className='text-[14px]'>Fecha de Nacimiento</FormLabel>
                          <Popover
                            open={isInputBirthDateOpen}
                            onOpenChange={setIsInputBirthDateOpen}
                          >
                            <PopoverTrigger asChild>
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <Button
                                  disabled={isInputDisabled}
                                  variant={'outline'}
                                  className={cn(
                                    'text-[14px] w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'LLL dd, y', {
                                      locale: es,
                                    })
                                  ) : (
                                    <span className='text-[14px]'>Fecha de nacimiento</span>
                                  )}
                                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0' align='start'>
                              <Calendar
                                mode='single'
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setIsInputBirthDateOpen(false);
                                }}
                                disabled={(date) =>
                                  date > new Date() || date < new Date('1900-01-01')
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription className='pl-2 text-blue-600 text-[12.5px] xl:text-[13px] font-bold italic'>
                            * Su fecha de nacimiento se utiliza para calcular su edad.
                          </FormDescription>
                          <FormMessage className='text-[13px]' />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='maritalStatus'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>Estado Civil</FormLabel>
                            <Select
                              disabled={isInputDisabled}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl className='text-[14px]'>
                                <SelectTrigger>
                                  {field.value ? (
                                    <SelectValue placeholder='Selecciona el estado civil' />
                                  ) : (
                                    'Selecciona el estado civil'
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(MaritalStatusNames).map(([key, value]) => (
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
                      name='numberChildren'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>Nro. de hijos</FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                disabled={isInputDisabled}
                                className='text-[14px]'
                                placeholder='Ejem: 3'
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
                      name='conversionDate'
                      render={({ field }) => (
                        <FormItem className='mt-2'>
                          <FormLabel className='text-[14px]'>Fecha de conversión</FormLabel>
                          <Popover
                            open={isInputConvertionDateOpen}
                            onOpenChange={setIsInputConvertionDateOpen}
                          >
                            <PopoverTrigger asChild>
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <Button
                                  disabled={isInputDisabled}
                                  variant={'outline'}
                                  className={cn(
                                    'text-[14px] w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'LLL dd, y', {
                                      locale: es,
                                    })
                                  ) : (
                                    <span className='text-[14px]'>Fecha de conversion</span>
                                  )}
                                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0' align='start'>
                              <Calendar
                                mode='single'
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setIsInputConvertionDateOpen(false);
                                }}
                                disabled={(date) =>
                                  date > new Date() || date < new Date('1900-01-01')
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription className='pl-2 text-blue-600 text-[12.5px] xl:text-[13px] font-bold italic'>
                            * Fecha en la que el creyente se convirtió.
                          </FormDescription>
                          <FormMessage className='text-[13px]' />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='recordStatus'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
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
                                <span className='font-bold text-red-500'>
                                  Inactivar Predicador.
                                </span>
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

                  {/* Contacto y Vivienda */}

                  <div className='sm:col-start-2 sm:col-end-3'>
                    <legend className='font-bold text-[15px] md:text-[16px]'>
                      Contacto / Vivienda
                    </legend>

                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>E-mail</FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                disabled={isInputDisabled}
                                className='text-[14px]'
                                placeholder='Ejem: martin@example.com'
                                type='email'
                                autoComplete='username'
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
                      name='phoneNumber'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>Número de Teléfono</FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                disabled={isInputDisabled}
                                className='text-[14px]'
                                placeholder='Ejem: +51 999 999 999'
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
                      name='residenceCountry'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>País</FormLabel>
                            <Select
                              disabled={isInputDisabled}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl className='text-[14px]'>
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
                      name='residenceDepartment'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>Departamento</FormLabel>
                            <Select
                              disabled={isInputDisabled}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl className='text-[14px]'>
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
                      name='residenceProvince'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>Provincia</FormLabel>
                            <Select
                              disabled={isInputDisabled}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl className='text-[14px]'>
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

                    <FormField
                      control={form.control}
                      name='residenceDistrict'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>Distrito</FormLabel>
                            <Select
                              disabled={isInputDisabled}
                              value={field.value}
                              onValueChange={field.onChange}
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
                      name='residenceUrbanSector'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px] font-medium'>Sector Urbano</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isInputDisabled}
                            >
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <SelectTrigger>
                                  {field.value ? (
                                    <SelectValue placeholder='Selecciona el sector urbano' />
                                  ) : (
                                    'Selecciona el sector urbano'
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(UrbanSectorNames).map(([key, value]) => (
                                  <SelectItem
                                    className={`text-[14px] ${(urbanSectorsValidation?.urbanSectorsDataResult?.includes(value) ?? !residenceDistric) ? 'hidden' : ''}`}
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
                      name='residenceAddress'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>Dirección</FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                disabled={isInputDisabled}
                                className='text-[14px]'
                                placeholder='Ejem: Av. Central 123'
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
                      name='referenceAddress'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px] font-medium'>
                              Referencia de dirección
                            </FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Textarea
                                disabled={isInputDisabled}
                                className='text-[14px]'
                                placeholder='Comentarios de referencia sobre la ubicación de la vivienda....'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  <div className='sm:col-start-3 sm:col-end-4 flex flex-col gap-4'>
                    <FormField
                      control={form.control}
                      name='roles'
                      render={() => (
                        <FormItem>
                          <div className='mb-4'>
                            <FormLabel className='font-bold text-[15px] md:text-[16px]'>
                              Roles de Membresía
                            </FormLabel>
                          </div>
                          {Object.values(MemberRole).map(
                            (role) =>
                              (role === MemberRole.Pastor ||
                                role === MemberRole.Copastor ||
                                role === MemberRole.Supervisor ||
                                role === MemberRole.Preacher ||
                                role === MemberRole.Treasurer ||
                                role === MemberRole.Disciple) && (
                                <FormField
                                  key={role}
                                  control={form.control}
                                  name='roles'
                                  render={({ field }) => {
                                    const isDisabled = disabledRoles?.includes(role);
                                    return (
                                      <FormItem
                                        key={role}
                                        className='flex flex-row cursor-pointer items-center space-x-3 space-y-0'
                                      >
                                        <FormControl className='text-[14px] md:text-[14px]'>
                                          <Checkbox
                                            checked={field.value?.includes(role)}
                                            disabled={isDisabled || isInputDisabled}
                                            onCheckedChange={(checked) => {
                                              let updatedRoles: MemberRole[] = [];
                                              checked
                                                ? (updatedRoles = field.value
                                                    ? [...field.value, role]
                                                    : [role])
                                                : (updatedRoles =
                                                    field.value?.filter(
                                                      (value) => value !== role
                                                    ) ?? []);

                                              field.onChange(updatedRoles);
                                            }}
                                            className={
                                              isDisabled || isInputDisabled ? 'bg-slate-500' : ''
                                            }
                                          />
                                        </FormControl>
                                        <FormLabel className='text-[14px] cursor-pointer font-normal'>
                                          {MemberRoleNames[role]}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              )
                          )}
                          <FormMessage className='text-[13px]' />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='roles'
                      render={() => (
                        <FormItem>
                          <div className='mb-4'>
                            <FormLabel className='font-bold text-[15px] md:text-[16px]'>
                              Roles Ministeriales
                            </FormLabel>
                          </div>

                          {Object.values(MemberRole).map(
                            (role) =>
                              role !== MemberRole.Pastor &&
                              role !== MemberRole.Copastor &&
                              role !== MemberRole.Supervisor &&
                              role !== MemberRole.Preacher &&
                              role !== MemberRole.Treasurer &&
                              role !== MemberRole.Disciple &&
                              role !== MemberRole.Presbyter &&
                              role !== MemberRole.IntercessionMinistryLeader &&
                              role !== MemberRole.EvangelismMinistryLeader &&
                              role !== MemberRole.DiscipleshipMinistryLeader &&
                              role !== MemberRole.TechnologyMinistryMember && (
                                <FormField
                                  key={role}
                                  control={form.control}
                                  name='roles'
                                  render={({ field }) => {
                                    const isDisabled = disabledRoles?.includes(role);
                                    return (
                                      <FormItem
                                        key={role}
                                        className='flex flex-row cursor-pointer items-center space-x-3 space-y-0'
                                      >
                                        <FormControl className='text-[14px] md:text-[14px]'>
                                          <Checkbox
                                            checked={field.value?.includes(role)}
                                            disabled={isDisabled || isInputDisabled}
                                            onCheckedChange={(checked) => {
                                              let updatedRoles: MemberRole[] = [];
                                              checked
                                                ? (updatedRoles = field.value
                                                    ? [...field.value, role]
                                                    : [role])
                                                : (updatedRoles =
                                                    field.value?.filter(
                                                      (value) => value !== role
                                                    ) ?? []);

                                              field.onChange(updatedRoles);
                                            }}
                                            className={
                                              isDisabled || isInputDisabled ? 'bg-slate-500' : ''
                                            }
                                          />
                                        </FormControl>
                                        <FormLabel className='text-[14px] cursor-pointer font-normal'>
                                          {MemberRoleNames[role]}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              )
                          )}
                          <FormMessage className='text-[13px]' />
                        </FormItem>
                      )}
                    />

                    {isMessagePromoteDisabled && (
                      <span className='text-[14px] md:text-[14px] dark:text-yellow-500 text-amber-500 font-bold text-center'>
                        !SE HA PROMOVIDO CORRECTAMENTE! <br />
                        <span className='text-[14px] md:text-[14px]'>
                          {form.getValues('roles').includes(MemberRole.Supervisor) &&
                            !form.getValues('roles').includes(MemberRole.Treasurer) && (
                              <div>
                                <span className='text-red-500 text-center inline-block'>
                                  Roles anteriores: Predicador
                                </span>
                                <br />
                                <span className='text-green-500  text-center inline-block'>
                                  Roles nuevos: Supervisor
                                </span>
                              </div>
                            )}

                          {form.getValues('roles').includes(MemberRole.Supervisor) &&
                            form.getValues('roles').includes(MemberRole.Treasurer) && (
                              <div>
                                <span className='text-red-500  text-center inline-block'>
                                  Roles anteriores: Predicador - Tesorero
                                </span>
                                <br />
                                <span className='text-green-500  text-center inline-block'>
                                  Roles nuevos: Supervisor - Tesorero
                                </span>
                              </div>
                            )}
                        </span>
                      </span>
                    )}

                    {/* Relaciones  */}
                    <div>
                      <legend className='font-bold col-start-1 col-end-3 text-[15px] md:text-[16px]'>
                        Relaciones
                      </legend>
                      {!isMessagePromoteDisabled && (
                        <FormField
                          control={form.control}
                          name='theirSupervisor'
                          render={({ field }) => {
                            return (
                              <FormItem className='mt-2'>
                                <FormLabel className='text-[14px] md:text-[15px] font-bold'>
                                  Supervisor
                                </FormLabel>
                                <FormDescription className='text-[13.5px] md:text-[14px]'>
                                  Asigna el Supervisor responsable para este Predicador.
                                </FormDescription>
                                <Popover
                                  open={isInputTheirSupervisorOpen}
                                  onOpenChange={setIsInputTheirSupervisorOpen}
                                >
                                  <PopoverTrigger asChild>
                                    <FormControl className='text-[14px] md:text-[14px]'>
                                      <Button
                                        disabled={isRelationSelectDisabled}
                                        variant='outline'
                                        role='combobox'
                                        className={cn(
                                          'w-full justify-between overflow-hidden',
                                          !field.value && 'text-slate-500 font-normal text-[14px]'
                                        )}
                                      >
                                        {field.value
                                          ? `${supervisorsQuery?.data?.find((supervisor) => supervisor.id === field.value)?.member?.firstNames} ${supervisorsQuery?.data?.find((supervisor) => supervisor.id === field.value)?.member?.lastNames}`
                                          : 'Busque y seleccione un supervisor'}
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
                                      <CommandGroup className='max-h-[200px] h-auto'>
                                        {supervisorsQuery?.data?.map((supervisor) => (
                                          <CommandItem
                                            className='text-[14px]'
                                            value={getFullNames({
                                              firstNames: supervisor?.member?.firstNames,
                                              lastNames: supervisor?.member?.lastNames,
                                            })}
                                            key={supervisor.id}
                                            onSelect={() => {
                                              form.setValue('theirSupervisor', supervisor.id);
                                              setIsInputTheirSupervisorOpen(false);
                                              setChangedId(supervisor.id);
                                            }}
                                          >
                                            {`${supervisor?.member?.firstNames} ${supervisor?.member?.lastNames}`}
                                            <CheckIcon
                                              className={cn(
                                                'ml-auto h-4 w-4',
                                                supervisor?.id === field.value
                                                  ? 'opacity-100'
                                                  : 'opacity-0'
                                              )}
                                            />
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                                <FormMessage className='text-[13px]' />
                              </FormItem>
                            );
                          }}
                        />
                      )}

                      <AlertUpdateRelationPreacher
                        data={data}
                        isAlertDialogOpen={isAlertDialogOpen}
                        setIsAlertDialogOpen={setIsAlertDialogOpen}
                        supervisorsQuery={supervisorsQuery}
                        preacherUpdateForm={form}
                        setChangedId={setChangedId}
                        changedId={changedId}
                      />

                      {isPromoteButtonDisabled && isInputDisabled && isMessagePromoteDisabled && (
                        <FormField
                          control={form.control}
                          name='isDirectRelationToPastor'
                          render={({ field }) => (
                            <FormItem className='flex flex-row gap-2 items-center mt-2 px-1 py-3 h-[2.5rem]'>
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <Checkbox
                                  className={cn(isCheckBoxDisabled && 'bg-slate-500')}
                                  disabled={isCheckBoxDisabled}
                                  checked={field?.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked);
                                  }}
                                />
                              </FormControl>
                              <div className='space-y-1 leading-none'>
                                <FormLabel className='text-[14px] cursor-pointer md:text-[14px]'>
                                  ¿Este registro estará relacionado directamente con un pastor?
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      )}

                      {isPromoteButtonDisabled &&
                        isInputDisabled &&
                        !isDirectRelationToPastor &&
                        isMessagePromoteDisabled && (
                          <FormField
                            control={form.control}
                            name='theirCopastor'
                            render={({ field }) => {
                              return (
                                <FormItem className='mt-3'>
                                  <FormLabel className='text-[14px] md:text-[15px] font-bold'>
                                    Copastor
                                  </FormLabel>
                                  <FormDescription className='text-[13.5px] md:text-[14px]'>
                                    Asigna el Copastor responsable para este Supervisor.
                                  </FormDescription>
                                  <Popover
                                    open={isInputTheirCopastorOpen}
                                    onOpenChange={setIsInputTheirCopastorOpen}
                                  >
                                    <PopoverTrigger asChild>
                                      <FormControl className='text-[14px] md:text-[14px]'>
                                        <Button
                                          disabled={isRelationSelectDisabled}
                                          variant='outline'
                                          role='combobox'
                                          className={cn(
                                            'w-full justify-between overflow-hidden',
                                            !field.value && 'text-slate-500 font-normal text-[14px]'
                                          )}
                                        >
                                          {field.value
                                            ? `${copastorsQuery?.data?.find((copastor) => copastor.id === field.value)?.member?.firstNames} ${copastorsQuery?.data?.find((copastor) => copastor.id === field.value)?.member?.lastNames}`
                                            : 'Busque y seleccione un co-pastor'}
                                          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent align='center' className='w-auto px-4 py-2'>
                                      <Command>
                                        {copastorsQuery?.data?.length &&
                                        copastorsQuery?.data?.length > 0 ? (
                                          <>
                                            <CommandInput
                                              placeholder='Busque una co-pastor...'
                                              className='h-9 text-[14px]'
                                            />
                                            <CommandEmpty>Co-Pastor no encontrado.</CommandEmpty>
                                            <CommandGroup className='max-h-[200px] h-auto'>
                                              {copastorsQuery?.data?.map((copastor) => (
                                                <CommandItem
                                                  className='text-[14px]'
                                                  value={getFullNames({
                                                    firstNames: copastor.member?.firstNames ?? '',
                                                    lastNames: copastor.member?.lastNames ?? '',
                                                  })}
                                                  key={copastor.id}
                                                  onSelect={() => {
                                                    form.setValue('theirCopastor', copastor.id);
                                                    setIsInputTheirCopastorOpen(false);
                                                  }}
                                                >
                                                  {`${copastor?.member?.firstNames} ${copastor?.member?.lastNames}`}
                                                  <CheckIcon
                                                    className={cn(
                                                      'ml-auto h-4 w-4',
                                                      copastor?.id === field.value
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                    )}
                                                  />
                                                </CommandItem>
                                              ))}
                                            </CommandGroup>
                                          </>
                                        ) : (
                                          copastorsQuery?.data?.length === 0 && (
                                            <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                              ❌No hay co-pastores disponibles.
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
                        )}

                      {isPromoteButtonDisabled && isInputDisabled && isDirectRelationToPastor && (
                        <FormField
                          control={form.control}
                          name='theirPastor'
                          render={({ field }) => {
                            return (
                              <FormItem className='mt-2'>
                                <FormLabel className='text-[14px] md:text-[15px] font-bold'>
                                  Pastor
                                </FormLabel>
                                <FormDescription className='text-[13.5px] md:text-[14px]'>
                                  Asigna el Pastor responsable para este Supervisor.
                                </FormDescription>
                                <Popover
                                  open={isInputTheirPastorOpen}
                                  onOpenChange={setIsInputTheirPastorOpen}
                                >
                                  <PopoverTrigger asChild>
                                    <FormControl className='text-[14px] md:text-[14px]'>
                                      <Button
                                        disabled={isRelationSelectDisabled}
                                        variant='outline'
                                        role='combobox'
                                        className={cn(
                                          'w-full justify-between overflow-hidden',
                                          !field.value && 'text-slate-500 font-normal text-[14px]'
                                        )}
                                      >
                                        {field.value
                                          ? `${pastorsQuery?.data?.find((pastor) => pastor.id === field.value)?.member?.firstNames} ${pastorsQuery?.data?.find((pastor) => pastor.id === field.value)?.member?.lastNames}`
                                          : 'Busque y seleccione un pastor'}
                                        <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent align='center' className='w-auto px-4 py-2'>
                                    <Command>
                                      {pastorsQuery?.data?.length &&
                                      pastorsQuery?.data?.length > 0 ? (
                                        <>
                                          <CommandInput
                                            placeholder='Busque una pastor...'
                                            className='h-9 text-[14px]'
                                          />
                                          <CommandEmpty>Pastor no encontrado.</CommandEmpty>
                                          <CommandGroup className='max-h-[200px] h-auto'>
                                            {pastorsQuery?.data?.map((pastor) => (
                                              <CommandItem
                                                className='text-[14px]'
                                                value={getFullNames({
                                                  firstNames: pastor.member?.firstNames ?? '',
                                                  lastNames: pastor.member?.lastNames ?? '',
                                                })}
                                                key={pastor.id}
                                                onSelect={() => {
                                                  form.setValue('theirPastor', pastor.id);
                                                  setIsInputTheirPastorOpen(false);
                                                }}
                                              >
                                                {`${pastor?.member?.firstNames} ${pastor?.member?.lastNames}`}
                                                <CheckIcon
                                                  className={cn(
                                                    'ml-auto h-4 w-4',
                                                    pastor?.id === field.value
                                                      ? 'opacity-100'
                                                      : 'opacity-0'
                                                  )}
                                                />
                                              </CommandItem>
                                            ))}
                                          </CommandGroup>
                                        </>
                                      ) : (
                                        pastorsQuery?.data?.length === 0 && (
                                          <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                            ❌No hay pastores disponibles.
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
                      )}
                    </div>

                    {isPromoteButtonDisabled &&
                      !theirSupervisor &&
                      !theirCopastor &&
                      !theirPastor && (
                        <span className='mt-2text-[12.5px] md:text-[13px] font-bold text-center text-red-500'>
                          ! Por favor asigna la nueva relación para los roles promovidos !
                        </span>
                      )}

                    <AlertPromotionPreacher
                      isPromoteButtonDisabled={isPromoteButtonDisabled}
                      setIsInputDisabled={setIsInputDisabled}
                      setIsPromoteButtonDisabled={setIsPromoteButtonDisabled}
                      setIsMessagePromoteDisabled={setIsMessagePromoteDisabled}
                      preacherUpdateForm={form}
                    />

                    <div>
                      <p className='text-red-500 text-[13.5px] md:text-[14px] font-bold mb-2'>
                        Consideraciones
                      </p>
                      <p className='text-[12.5px] md:text-[13px] mb-2 font-medium '>
                        ❌ Mientras estés en modo de edición y los datos cambien no podrás promover
                        de cargo.{' '}
                      </p>
                      <p className='text-[12.5px] md:text-[13px] font-medium '>
                        ❌ Mientras el &#34;Estado&#34; sea{' '}
                        <span className='text-red-500 font-bold'>Inactivo</span> no podrás promover
                        de cargo.
                      </p>
                    </div>
                  </div>

                  {isMessageErrorDisabled ? (
                    <p className='-mb-4 md:-mb-3 md:row-start-2 md:row-end-3 md:col-start-2 md:col-end-3 mx-auto md:w-full text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                      ❌ Datos incompletos, completa todos los campos para guardar el registro.
                    </p>
                  ) : (
                    <p className='-mt-3 order-last md:-mt-3 md:row-start-3 md:row-end-4 md:col-start-2 md:col-end-3 mx-auto md:w-full text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                      ¡Campos completados correctamente! <br /> Para finalizar por favor guarde los
                      cambios.
                    </p>
                  )}

                  <div className='sm:col-start-2 w-full'>
                    <Button
                      disabled={isSubmitButtonDisabled}
                      type='submit'
                      className={cn(
                        'w-full text-[14px]',
                        preacherUpdateMutation?.isPending &&
                          'bg-emerald-500 hover:bg-emerald-500 disabled:opacity-100 disabled:md:text-[15px] text-white'
                      )}
                      onClick={() => {
                        setTimeout(() => {
                          if (Object.keys(form.formState.errors).length === 0) {
                            setIsSubmitButtonDisabled(true);
                            setIsInputDisabled(true);
                            setIsRelationSelectDisabled(true);
                            setIsCheckBoxDisabled(true);
                          }
                        }, 100);
                      }}
                    >
                      {preacherUpdateMutation?.isPending ? 'Procesando...' : 'Guardar cambios'}
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
