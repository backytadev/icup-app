/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';

import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { CalendarIcon } from 'lucide-react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { getSimplePastors } from '@/modules/pastor/services/pastor.service';
import { copastorFormSchema } from '@/modules/copastor/validations/copastor-form-schema';
import { type CopastorResponse } from '@/modules/copastor/interfaces/copastor-response.interface';
import { CopastorFormSkeleton } from '@/modules/copastor/components/cards/update/CopastorFormSkeleton';

import { useCopastorUpdateEffects } from '@/modules/copastor/hooks/useCopastorUpdateEffects';
import { useCopastorUpdateMutation } from '@/modules/copastor/hooks/useCopastorUpdateMutation';
import { useCopastorPromoteButtonLogic } from '@/modules/copastor/hooks/useCopastorPromoteButtonLogic';
import { useCopastorUpdateSubmitButtonLogic } from '@/modules/copastor/hooks/useCopastorUpdateSubmitButtonLogic';

import { cn } from '@/shared/lib/utils';

import { getSimpleChurches } from '@/modules/church/services/church.service';

import { useRoleValidationByPath } from '@/shared/hooks/useRoleValidationByPath';

import { GenderNames } from '@/shared/enums/gender.enum';
import { CountryNames } from '@/shared/enums/country.enum';
import { ProvinceNames } from '@/shared/enums/province.enum';
import { DistrictNames } from '@/shared/enums/district.enum';
import { DepartmentNames } from '@/shared/enums/department.enum';
import { UrbanSectorNames } from '@/shared/enums/urban-sector.enum';
import { MaritalStatusNames } from '@/shared/enums/marital-status.enum';
import { MemberRole, MemberRoleNames } from '@/shared/enums/member-role.enum';

import { getFullNames } from '@/shared/helpers/get-full-names.helper';
import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

import { AlertPromotionCopastor } from '@/modules/copastor/components/alerts/AlertPromotionCopastor';
import { AlertUpdateRelationCopastor } from '@/modules/copastor/components/alerts/AlertUpdateRelationCopastor';

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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/shared/components/ui/command';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Calendar } from '@/shared/components/ui/calendar';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

interface CopastorFormUpdateProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: CopastorResponse | undefined;
}

export const CopastorUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: CopastorFormUpdateProps): JSX.Element => {
  //* States
  const [isRelationSelectDisabled, setIsRelationSelectDisabled] = useState<boolean>(false);
  const [isInputTheirChurchOpen, setIsInputTheirChurchOpen] = useState<boolean>(false);
  const [isInputTheirPastorOpen, setIsInputTheirPastorOpen] = useState<boolean>(false);
  const [isInputBirthDateOpen, setIsInputBirthDateOpen] = useState<boolean>(false);
  const [isInputConvertionDateOpen, setIsInputConvertionDateOpen] = useState<boolean>(false);
  const [isPromoteButtonDisabled, setIsPromoteButtonDisabled] = useState<boolean>(false);

  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(false);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);
  const [isMessagePromoteDisabled, setIsMessagePromoteDisabled] = useState<boolean>(false);

  const [isLoadingData, setIsLoadingData] = useState(true);

  const [changedId, setChangedId] = useState(data?.theirPastor?.id);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  //* Hooks (external libraries)
  const { pathname } = useLocation();

  //* Form
  const form = useForm<z.infer<typeof copastorFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(copastorFormSchema),
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
      roles: [MemberRole.Copastor],
      recordStatus: '',
      theirPastor: '',
      theirChurch: '',
    },
  });

  //* Watchers
  const residenceDistrict = form.watch('residenceDistrict');
  const theirChurch = form.watch('theirChurch');
  const theirPastor = form.watch('theirPastor');

  //* Effects
  useEffect(() => {
    if (data && data?.theirPastor?.id !== changedId) {
      setTimeout(() => {
        setIsAlertDialogOpen(true);
      }, 100);
    }
  }, [changedId]);

  //* Helpers
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(residenceDistrict);
  const districtsValidation = validateDistrictsAllowedByModule(pathname);

  //* Custom Hooks
  useCopastorUpdateEffects({
    id,
    data,
    setIsLoadingData,
    copastorUpdateForm: form,
  });

  const { disabledRoles } = useRoleValidationByPath({
    path: pathname,
  });

  useCopastorPromoteButtonLogic({
    copastorUpdateForm: form,
    setIsPromoteButtonDisabled,
  });

  useCopastorUpdateSubmitButtonLogic({
    copastorUpdateForm: form,
    isInputDisabled,
    setIsMessageErrorDisabled,
    setIsSubmitButtonDisabled,
    isRelationSelectDisabled,
  });

  const copastorUpdateMutation = useCopastorUpdateMutation({
    dialogClose,
    scrollToTop,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
    setIsRelationSelectDisabled,
  });

  //* Queries
  const pastorsQuery = useQuery({
    queryKey: ['pastors', id],
    queryFn: () => getSimplePastors({ isSimpleQuery: true }),
    retry: false,
  });

  const churchesQuery = useQuery({
    queryKey: ['churches', id],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof copastorFormSchema>): void => {
    copastorUpdateMutation.mutate({ id, formData });
  };

  return (
    <Tabs
      defaultValue='general-info'
      className='w-auto -mt-8 sm:w-[520px] md:w-[680px] lg:w-[990px] xl:w-[1100px]'
    >
      <h2 className='text-center leading-7 text-orange-500 pb-2 font-bold text-[24px] sm:text-[26px] md:text-[28px]'>
        Modificar información del Co-Pastor
      </h2>

      <TabsContent value='general-info'>
        <Card className='w-full'>
          {isLoadingData && <CopastorFormSkeleton />}

          {!isLoadingData && (
            <CardContent className='py-3 px-4'>
              <div className='dark:text-slate-300 text-slate-500 font-bold text-[16.5px] md:text-[18px] pl-0 mb-4 md:pl-4'>
                Co-Pastor: {data?.member?.firstNames} {data?.member?.lastNames}
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
                          <FormItem className='mt-2'>
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
                        <FormItem className='mt-3'>
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
                        <FormItem className='flex flex-col mt-2'>
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
                                <span className='font-bold text-red-500'>Inactivar Co-Pastor.</span>
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
                                    className={`text-[14px] ${(urbanSectorsValidation?.urbanSectorsDataResult?.includes(value) ?? !residenceDistrict) ? 'hidden' : ''}`}
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
                          <div className='mb-2'>
                            <FormLabel className='font-bold text-[15px] md:text-[16px]'>
                              Roles de Membresía
                            </FormLabel>
                          </div>
                          {Object.values(MemberRole).map(
                            (role) =>
                              (role === MemberRole.Presbyter ||
                                role === MemberRole.Pastor ||
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
                          <div className='mb-2'>
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
                              role !== MemberRole.KidsMinistryLeader &&
                              role !== MemberRole.KidsMinistryTeamMember &&
                              role !== MemberRole.YouthMinistryLeader &&
                              role !== MemberRole.YouthMinistryTeamMember &&
                              role !== MemberRole.TechnologyMinistryTeamMember && (
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
                          {form.getValues('roles').includes(MemberRole.Pastor) &&
                            !form.getValues('roles').includes(MemberRole.Presbyter) && (
                              <div>
                                <span className='text-red-500 text-center inline-block'>
                                  Roles anteriores: Co-Pastor
                                </span>
                                <br />
                                <span className='text-green-500 text-center inline-block'>
                                  Roles nuevos: Pastor
                                </span>
                              </div>
                            )}
                          {form.getValues('roles').includes(MemberRole.Pastor) &&
                            form.getValues('roles').includes(MemberRole.Presbyter) && (
                              <div>
                                <span className='text-red-500 text-center inline-block'>
                                  Roles anteriores: Co-Pastor - Presbítero
                                </span>
                                <br />
                                <span className='text-green-500 text-center inline-block'>
                                  Roles nuevos: Pastor - Presbítero
                                </span>
                              </div>
                            )}
                        </span>
                      </span>
                    )}

                    {/* Relations  */}
                    <div>
                      <legend className='font-bold col-start-1 col-end-3 text-[15px] md:text-[16px]'>
                        Relaciones
                      </legend>
                      {!isMessagePromoteDisabled && (
                        <FormField
                          control={form.control}
                          name='theirPastor'
                          render={({ field }) => {
                            return (
                              <FormItem className='mt-3'>
                                <FormLabel className='text-[14px] md:text-[15px] font-bold'>
                                  Pastor
                                </FormLabel>
                                <FormDescription className='text-[13.5px] md:text-[14px]'>
                                  Asigna el Pastor responsable de este por Co-Pastor.
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
                                            placeholder='Busque un pastor...'
                                            className='h-9 text-[14px]'
                                          />
                                          <CommandEmpty>Pastor no encontrado.</CommandEmpty>
                                          <CommandGroup className='max-h-[200px] h-auto'>
                                            {pastorsQuery?.data?.map((pastor) => (
                                              <CommandItem
                                                className='text-[14px]'
                                                value={getFullNames({
                                                  firstNames: pastor?.member?.firstNames ?? '',
                                                  lastNames: pastor?.member?.lastNames ?? '',
                                                })}
                                                key={pastor.id}
                                                onSelect={() => {
                                                  form.setValue('theirPastor', pastor.id);
                                                  setChangedId(pastor.id);
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

                      <AlertUpdateRelationCopastor
                        data={data}
                        changedId={changedId}
                        setChangedId={setChangedId}
                        isAlertDialogOpen={isAlertDialogOpen}
                        setIsAlertDialogOpen={setIsAlertDialogOpen}
                        copastorUpdateForm={form}
                        pastorsQuery={pastorsQuery}
                      />

                      {isPromoteButtonDisabled && isInputDisabled && !theirPastor && (
                        <FormField
                          control={form.control}
                          name='theirChurch'
                          render={({ field }) => {
                            return (
                              <FormItem className='mt-2'>
                                <FormLabel className='text-[14px] md:text-[15px] font-bold'>
                                  Iglesia
                                </FormLabel>
                                <FormDescription className='text-[13.5px] md:text-[14px]'>
                                  Asigna una Iglesia a la que pertenecerá este Pastor.
                                </FormDescription>
                                <Popover
                                  open={isInputTheirChurchOpen}
                                  onOpenChange={setIsInputTheirChurchOpen}
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
                                          ? churchesQuery?.data?.find(
                                              (church) => church.id === field.value
                                            )?.abbreviatedChurchName
                                          : 'Busque y seleccione una iglesia'}
                                        <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent align='center' className='w-auto px-4 py-2'>
                                    <Command>
                                      {churchesQuery?.data?.length &&
                                      churchesQuery?.data?.length > 0 ? (
                                        <>
                                          <CommandInput
                                            placeholder='Busque una iglesia'
                                            className='h-9 text-[14px]'
                                          />
                                          <CommandEmpty>Iglesia no encontrada.</CommandEmpty>
                                          <CommandGroup className='max-h-[200px] h-auto'>
                                            {churchesQuery?.data?.map((church) => (
                                              <CommandItem
                                                className='text-[14px]'
                                                value={church.abbreviatedChurchName}
                                                key={church.id}
                                                onSelect={() => {
                                                  form.setValue('theirChurch', church.id);
                                                  setIsInputTheirChurchOpen(false);
                                                }}
                                              >
                                                {church?.abbreviatedChurchName}
                                                <CheckIcon
                                                  className={cn(
                                                    'ml-auto h-4 w-4',
                                                    church?.id === field.value
                                                      ? 'opacity-100'
                                                      : 'opacity-0'
                                                  )}
                                                />
                                              </CommandItem>
                                            ))}
                                          </CommandGroup>
                                        </>
                                      ) : (
                                        churchesQuery?.data?.length === 0 && (
                                          <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                            ❌No hay iglesias disponibles.
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

                    {isPromoteButtonDisabled && !theirChurch && !theirPastor && (
                      <span className='-mt-2 text-[12.5px] md:text-[13px] font-bold text-center text-red-500'>
                        ! Por favor asigna la nueva relación para los roles promovidos !
                      </span>
                    )}

                    <AlertPromotionCopastor
                      isPromoteButtonDisabled={isPromoteButtonDisabled}
                      setIsInputDisabled={setIsInputDisabled}
                      setIsPromoteButtonDisabled={setIsPromoteButtonDisabled}
                      setIsMessagePromoteDisabled={setIsMessagePromoteDisabled}
                      copastorUpdateForm={form}
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
                        copastorUpdateMutation?.isPending &&
                          'bg-emerald-500 hover:bg-emerald-500 disabled:opacity-100 disabled:md:text-[15px] text-white'
                      )}
                      onClick={() => {
                        setTimeout(() => {
                          if (Object.keys(form.formState.errors).length === 0) {
                            setIsSubmitButtonDisabled(true);
                            setIsInputDisabled(true);
                            setIsRelationSelectDisabled(true);
                          }
                        }, 100);
                      }}
                    >
                      {copastorUpdateMutation?.isPending ? 'Procesando...' : 'Guardar cambios'}
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
