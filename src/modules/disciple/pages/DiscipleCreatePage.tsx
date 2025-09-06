/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import type * as z from 'zod';
import { Toaster } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { Plus, Trash } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { getSimplePastors } from '@/modules/pastor/services/pastor.service';
import { getSimpleChurches } from '@/modules/church/services/church.service';
import { getSimpleMinistries } from '@/modules/ministry/services/ministry.service';
import { getSimpleFamilyGroups } from '@/modules/family-group/services/family-group.service';

import { discipleFormSchema } from '@/modules/disciple/validations/disciple-form-schema';
import { useDiscipleCreationMutation } from '@/modules/disciple/hooks/useDiscipleCreationMutation';
import { useDiscipleCreationSubmitButtonLogic } from '@/modules/disciple/hooks/useDiscipleCreationSubmitButtonLogic';

import { cn } from '@/shared/lib/utils';

import { PageTitle } from '@/shared/components/page/PageTitle';
import { useRoleValidationByPath } from '@/shared/hooks/useRoleValidationByPath';

import {
  MinistryMemberRole,
  MinistryMemberRoleNames,
  SearchTypesKidsMinistry,
  SearchTypesYouthMinistry,
  SearchTypesWorshipMinistry,
  SearchTypesTechnologyMinistry,
  SearchTypesEvangelismMinistry,
  SearchTypesDiscipleshipMinistry,
  SearchTypesIntercessionMinistry,
} from '@/modules/ministry/enums/ministry-member-role.enum';
import { RelationType, RelationTypeModuleNames } from '@/shared/enums/relation-type.enum';
import { MinistryType, MinistryTypeNames } from '@/modules/ministry/enums/ministry-type.enum';

import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';

import { GenderNames } from '@/shared/enums/gender.enum';
import { DistrictNames } from '@/shared/enums/district.enum';
import { Country, CountryNames } from '@/shared/enums/country.enum';
import { UrbanSectorNames } from '@/shared/enums/urban-sector.enum';
import { Province, ProvinceNames } from '@/shared/enums/province.enum';
import { MaritalStatusNames } from '@/shared/enums/marital-status.enum';
import { Department, DepartmentNames } from '@/shared/enums/department.enum';
import { MemberRole, MemberRoleNames } from '@/shared/enums/member-role.enum';

import { getCodeAndNameFamilyGroup } from '@/shared/helpers/get-code-and-name-family-group.helper';
import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

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
  SelectTrigger,
  SelectContent,
} from '@/shared/components/ui/select';

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Textarea } from '@/shared/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { getFullNames, getInitialFullNames } from '@/shared/helpers/get-full-names.helper';

export const DiscipleCreatePage = (): JSX.Element => {
  //* States
  const [isInputTheirFamilyGroupOpen, setIsInputTheirFamilyGroupOpen] = useState<boolean>(false);
  const [isInputBirthDateOpen, setIsInputBirthDateOpen] = useState<boolean>(false);
  const [isInputConvertionDateOpen, setIsInputConvertionDateOpen] = useState<boolean>(false);
  const [isInputTheirPastorOpen, setIsInputTheirPastorOpen] = useState<boolean>(false);

  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);

  // const [isRelatedMinistry, setIsRelatedMinistry] = useState<boolean>(false);
  const [ministryBlocks, setMinistryBlocks] = useState<MinistryMemberBlock[]>([
    {
      churchId: null,
      ministryType: null,
      ministryId: null,
      ministryRoles: [],
      churchPopoverOpen: false,
      ministryPopoverOpen: false,
      ministries: [],
    },
  ]);

  //* Library hooks
  const { pathname } = useLocation();

  //* Form
  const form = useForm<z.infer<typeof discipleFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(discipleFormSchema),
    defaultValues: {
      firstNames: '',
      lastNames: '',
      gender: '',
      originCountry: '',
      birthDate: undefined,
      conversionDate: undefined,
      numberChildren: '',
      maritalStatus: '',
      email: '',
      phoneNumber: '',
      relationType: undefined,
      residenceCountry: Country.Perú,
      residenceDepartment: Department.Lima,
      residenceProvince: Province.Lima,
      residenceDistrict: '',
      residenceAddress: '',
      referenceAddress: '',
      roles: [MemberRole.Disciple],
      theirFamilyGroup: '',
      theirPastor: '',
      theirMinistries: [],
    },
  });

  //* Watchers
  const residenceDistrict = form.watch('residenceDistrict');
  const theirFamilyGroup = form.watch('theirFamilyGroup');
  const theirPastor = form.watch('theirPastor');
  const relationType = form.watch('relationType');

  useDiscipleCreationSubmitButtonLogic({
    discipleCreationForm: form,
    isInputDisabled,
    ministryBlocks,
    setMinistryBlocks,
    setIsMessageErrorDisabled,
    setIsSubmitButtonDisabled,
  });

  //* Effects
  useEffect(() => {
    if (relationType === RelationType.OnlyRelatedHierarchicalCover) {
      form.setValue('theirPastor', undefined);
    }
    if (relationType === RelationType.OnlyRelatedMinistries) {
      form.setValue('theirFamilyGroup', undefined);
    }
    if (relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover) {
      form.setValue('theirPastor', undefined);
    }
  }, [theirFamilyGroup, theirPastor, relationType]);

  useEffect(() => {
    form.resetField('residenceUrbanSector', {
      keepError: true,
    });
  }, [residenceDistrict]);

  useEffect(() => {
    document.title = 'Modulo Discípulo - IcupApp';
  }, []);

  //* Helpers
  const districtsValidation = validateDistrictsAllowedByModule(pathname);
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(residenceDistrict);

  //* Custom hooks
  const { disabledRoles } = useRoleValidationByPath({
    path: pathname,
  });

  const discipleCreationMutation = useDiscipleCreationMutation({
    discipleCreationForm: form,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  //* Queries
  const queryFamilyGroup = useQuery({
    queryKey: ['family-groups'],
    queryFn: () => getSimpleFamilyGroups({ isSimpleQuery: false }),
    retry: false,
  });

  const queryChurches = useQuery({
    queryKey: ['churches'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

  const queryPastors = useQuery({
    queryKey: ['pastors'],
    queryFn: () => getSimplePastors({ isSimpleQuery: true }),
    retry: false,
  });

  //* Functions for handler ministries
  const addMinistryBlock = () => {
    setMinistryBlocks([
      ...ministryBlocks,
      {
        churchId: null,
        ministryType: null,
        ministryId: null,
        ministryRoles: [],
        ministries: [],
        churchPopoverOpen: false,
        ministryPopoverOpen: false,
      },
    ]);
  };

  const updateMinistryBlock = <K extends keyof MinistryMemberBlock>(
    index: number,
    field: K,
    value: MinistryMemberBlock[K]
  ) => {
    const updatedBlocks = [...ministryBlocks];
    updatedBlocks[index][field] = value;
    setMinistryBlocks(updatedBlocks);
  };

  const toggleRoleInBlock = (index: number, role: string, isChecked: boolean) => {
    setMinistryBlocks((prev) =>
      prev.map((block, i) =>
        i === index
          ? {
              ...block,
              ministryRoles: isChecked
                ? [...block.ministryRoles, role]
                : block.ministryRoles.filter((r) => r !== role),
            }
          : block
      )
    );
  };

  const removeMinistryBlock = (indexToRemove: number) => {
    setMinistryBlocks((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const fetchMinistriesByChurch = async (churchId: string) => {
    try {
      const respData = await getSimpleMinistries({ isSimpleQuery: true, churchId });
      return respData ?? [];
    } catch (error) {
      return [];
    }
  };

  const handleSelectChurch = async (index: number, churchId: string) => {
    const ministries = await fetchMinistriesByChurch(churchId);

    const filterMinistriesByType = ministries.filter(
      (ministry) => ministry.ministryType === ministryBlocks[index].ministryType
    );

    setMinistryBlocks((prev) =>
      prev.map((block, i) =>
        i === index
          ? { ...block, churchId, ministryId: null, ministries: filterMinistriesByType }
          : block
      )
    );
  };

  useEffect(() => {
    if (
      relationType !== RelationType.RelatedBothMinistriesAndHierarchicalCover &&
      ministryBlocks.length > 0
    ) {
      setMinistryBlocks([
        {
          churchId: null,
          ministryType: null,
          ministryId: null,
          ministryRoles: [],
          churchPopoverOpen: false,
          ministryPopoverOpen: false,
          ministries: [],
        },
      ]);
    }
  }, [relationType]);

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof discipleFormSchema>): void => {
    const ministriesData = ministryBlocks.map((ministryData) => {
      return {
        ministryId: ministryData.ministryId,
        ministryRoles: ministryData.ministryRoles,
      };
    });

    discipleCreationMutation.mutate({
      ...formData,
      theirMinistries: ministriesData.some(
        (item) => !item.ministryId || item.ministryRoles?.length === 0
      )
        ? []
        : ministriesData,
    });
  };

  return (
    <div className='animate-fadeInPage'>
      <PageTitle className='text-disciple-color'>Modulo Discípulo</PageTitle>

      <h2 className='text-left whitespace-nowrap pb-[2px] pt-2 px-4 sm:px-5 2xl:px-10 font-sans font-bold text-green-500 text-[1.6rem] sm:text-[1.75rem] md:text-[1.85rem] lg:text-[1.9rem] xl:text-[2.1rem] 2xl:text-4xl'>
        Crear un nuevo discípulo
      </h2>

      <p className='dark:text-slate-300 text-left font-sans font-bold pl-5 pr-6  sm:pl-7 2xl:px-28 text-[13.5px] md:text-[15px] xl:text-base'>
        Por favor llena los siguientes datos para crear un nuevo discípulo.
      </p>

      <div className='flex min-h-screen flex-col items-center justify-between px-6 py-4 sm:px-8 sm:py-6 lg:py-6 xl:px-14 2xl:px-36'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='w-full flex flex-col gap-y-6 md:grid md:grid-cols-2 md:gap-y-8 md:gap-x-10'
          >
            <div className='sm:col-start-1 sm:col-end-2'>
              <legend className='font-bold text-[16px] sm:text-[18px]'>Datos generales</legend>
              <FormField
                control={form.control}
                name='firstNames'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Nombres</FormLabel>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          className='text-[14px]'
                          disabled={isInputDisabled}
                          placeholder='Ejem: Ramiro Ignacio'
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
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Apellidos</FormLabel>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Ejem: Saavedra Ramirez'
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
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Género</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isInputDisabled}
                      >
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona el tipo de género' />
                            ) : (
                              'Selecciona el tipo de género'
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
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>País de origen</FormLabel>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Ejem:  Colombia, Panama, Ecuador'
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
                    <FormLabel className='text-[14px] font-medium'>Fecha de nacimiento</FormLabel>
                    <Popover open={isInputBirthDateOpen} onOpenChange={setIsInputBirthDateOpen}>
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
                              format(field.value, 'LLL dd, y', { locale: es })
                            ) : (
                              <span className='text-[14px]'>Selecciona la fecha de nacimiento</span>
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
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className='pl-2 text-blue-600 text-[12.5px] xl:text-[13px] font-bold italic'>
                      * Su fecha de nacimiento se utilizara para calcular su edad.
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
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Estado Civil</FormLabel>
                      <Select
                        value={field.value}
                        disabled={isInputDisabled}
                        onValueChange={field.onChange}
                      >
                        <FormControl className='text-[14px] md:text-[14px]'>
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
                name='numberChildren'
                render={({ field }) => {
                  return (
                    <FormItem className=' mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Nro. de hijos</FormLabel>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input disabled={isInputDisabled} placeholder='Ejem: 2' {...field} />
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
                  <FormItem className='mt-3'>
                    <FormLabel className='text-[14px] font-medium'>
                      Fecha de conversión
                      <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                        Opcional
                      </span>
                    </FormLabel>
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
                              format(field.value, 'LLL dd, y', { locale: es })
                            ) : (
                              <span className='text-[14px]'>Selecciona la fecha de conversión</span>
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
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
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
            </div>

            <div className='sm:col-start-2 sm:col-end-3'>
              <legend className='font-bold text-[16px] sm:text-[18px]'>Contacto / Vivienda</legend>

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>
                        E-mail
                        <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                          Opcional
                        </span>
                      </FormLabel>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Ejem: pedro123@gmail.com'
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
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>
                        Número de teléfono
                        <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                          Opcional
                        </span>
                      </FormLabel>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          disabled={isInputDisabled}
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
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>País</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isInputDisabled}
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
                name='residenceDepartment'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Departamento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isInputDisabled}
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
                name='residenceProvince'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Provincia</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isInputDisabled}
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

              <FormField
                control={form.control}
                name='residenceDistrict'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Distrito</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isInputDisabled}
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
                    <FormItem className='mt-3'>
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
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>Dirección</FormLabel>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Ejem: Jr. Rosales 111 - Mz.A Lt.14'
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
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] font-medium'>
                        Referencia de dirección
                      </FormLabel>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Textarea
                          disabled={isInputDisabled}
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

            {/* Roles */}

            <div className='sm:col-start-1 sm:col-end-2 sm:row-start-2 sm:row-end-3 h-auto'>
              <FormField
                control={form.control}
                name='roles'
                render={() => (
                  <FormItem>
                    <div className='mb-4'>
                      <FormLabel className='font-bold text-[16px] sm:text-[18px]'>
                        Roles de Membresía
                      </FormLabel>
                      <FormDescription className='font-medium'>
                        Asigna los roles de membresía correspondientes para este registro.
                      </FormDescription>
                    </div>
                    <div className='grid  grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>
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
                                const isDisabled = disabledRoles?.includes(role) ?? isInputDisabled;
                                return (
                                  <FormItem
                                    key={role}
                                    className='flex flex-row items-center space-x-2 space-y-0'
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
                                                field.value?.filter((value) => value !== role) ??
                                                []);

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
                    </div>
                    <FormMessage className='text-[13px]' />
                  </FormItem>
                )}
              />
            </div>

            {/* Relations */}

            <div className='sm:col-start-2 sm:col-end-3 sm:row-start-2 sm:row-end-3'>
              <legend className='font-bold col-start-1 col-end-3 text-[16.5px] sm:text-[18px]'>
                Relaciones
              </legend>

              <FormField
                control={form.control}
                name='relationType'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14.5px] md:text-[15px] font-bold'>
                        Tipo de Relación
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Selecciona el tipo de relación que tendrá el discípulo.
                      </FormDescription>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isInputDisabled}
                      >
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona el tipo de relación' />
                            ) : (
                              'Selecciona el tipo de relación'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(RelationTypeModuleNames['disciple']).map(
                            ([key, value]) => (
                              <SelectItem className={`text-[14px]`} key={key} value={key}>
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

              {(relationType === RelationType.OnlyRelatedHierarchicalCover ||
                relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover) && (
                <FormField
                  control={form.control}
                  name='theirFamilyGroup'
                  render={({ field }) => {
                    return (
                      <FormItem className='mt-3'>
                        <FormLabel className='text-[14.5px] md:text-[15px] font-bold'>
                          Grupo Familiar
                        </FormLabel>
                        <FormDescription className='text-[13.5px] md:text-[14px]'>
                          Asigna el grupo familiar al que pertenecerá este discípulo.
                        </FormDescription>
                        <Popover
                          open={isInputTheirFamilyGroupOpen}
                          onOpenChange={setIsInputTheirFamilyGroupOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Button
                                disabled={isInputDisabled}
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'w-full justify-between overflow-hidden',
                                  !field.value && 'text-slate-500 font-normal text-[14px]'
                                )}
                              >
                                {field.value
                                  ? `${queryFamilyGroup?.data?.find((familyGroup) => familyGroup.id === field.value)?.familyGroupName} 
                                    (${queryFamilyGroup?.data?.find((familyGroup) => familyGroup.id === field.value)?.familyGroupCode}) ~ 
                                      ${getInitialFullNames({ firstNames: queryFamilyGroup?.data?.find((familyGroup) => familyGroup.id === field.value)?.theirPreacher?.firstNames ?? '', lastNames: queryFamilyGroup?.data?.find((familyGroup) => familyGroup.id === field.value)?.theirPreacher?.lastNames ?? '' })}`
                                  : 'Busque y seleccione un grupo familiar'}
                                <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align='center' className='w-auto px-4 py-2'>
                            <Command>
                              {queryFamilyGroup?.data?.length &&
                              queryFamilyGroup?.data?.length > 0 ? (
                                <>
                                  <CommandInput
                                    placeholder='Busque un grupo familiar...'
                                    className='h-9 text-[14px]'
                                  />
                                  <CommandEmpty>Grupo familiar no encontrado.</CommandEmpty>
                                  <CommandGroup className='max-h-[200px] h-auto'>
                                    {queryFamilyGroup?.data?.map((familyGroup) => (
                                      <CommandItem
                                        className='text-[14px]'
                                        value={getCodeAndNameFamilyGroup({
                                          code: familyGroup.familyGroupCode,
                                          name: familyGroup.familyGroupName,
                                          preacher: `${getInitialFullNames({ firstNames: familyGroup.theirPreacher?.firstNames ?? '', lastNames: familyGroup.theirPreacher?.lastNames ?? '' })}`,
                                        })}
                                        key={familyGroup.id}
                                        onSelect={() => {
                                          form.setValue('theirFamilyGroup', familyGroup?.id);
                                          setIsInputTheirFamilyGroupOpen(false);
                                        }}
                                      >
                                        {`${familyGroup?.familyGroupName} (${familyGroup?.familyGroupCode}) ~ ${getInitialFullNames({ firstNames: familyGroup?.theirPreacher?.firstNames ?? '', lastNames: familyGroup?.theirPreacher?.lastNames ?? '' })}`}
                                        <CheckIcon
                                          className={cn(
                                            'ml-auto h-4 w-4',
                                            familyGroup?.id === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </>
                              ) : (
                                queryFamilyGroup?.data?.length === 0 && (
                                  <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                    ❌No hay grupos familiares disponibles.
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

              {relationType === RelationType.OnlyRelatedMinistries && (
                <FormField
                  control={form.control}
                  name='theirPastor'
                  render={({ field }) => {
                    return (
                      <FormItem className='mt-3'>
                        <FormLabel className='text-[14.5px] md:text-[15px] font-bold'>
                          Pastor
                        </FormLabel>
                        <FormDescription className='text-[13.5px] md:text-[14px]'>
                          Asigna el Pastor responsable para este Co-Pastor.
                        </FormDescription>
                        <Popover
                          open={isInputTheirPastorOpen}
                          onOpenChange={setIsInputTheirPastorOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Button
                                disabled={isInputDisabled}
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'w-full justify-between overflow-hidden',
                                  !field.value && 'text-slate-500 font-normal text-[14px]'
                                )}
                              >
                                {field.value
                                  ? `${queryPastors?.data?.find((pastor) => pastor.id === field.value)?.member?.firstNames} ${queryPastors?.data?.find((pastor) => pastor.id === field.value)?.member?.lastNames}`
                                  : 'Busque y seleccione un pastor'}
                                <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align='center' className='w-auto px-4 py-2'>
                            <Command>
                              {queryPastors?.data?.length && queryPastors?.data?.length > 0 ? (
                                <>
                                  <CommandInput
                                    placeholder='Busque un pastor'
                                    className='h-9 text-[14px]'
                                  />
                                  <CommandEmpty>Pastor no encontrado.</CommandEmpty>
                                  <CommandGroup className='max-h-[200px] h-auto'>
                                    {queryPastors?.data?.map((pastor) => (
                                      <CommandItem
                                        className='text-[14px]'
                                        value={getFullNames({
                                          firstNames: pastor.member?.firstNames ?? '',
                                          lastNames: pastor.member?.lastNames ?? '',
                                        })}
                                        key={pastor.id}
                                        onSelect={() => {
                                          form.setValue('theirPastor', pastor?.id);
                                          setIsInputTheirPastorOpen(false);
                                        }}
                                      >
                                        {`${pastor?.member?.firstNames} ${pastor?.member?.lastNames}`}
                                        <CheckIcon
                                          className={cn(
                                            'ml-auto h-4 w-4',
                                            pastor?.id === field.value ? 'opacity-100' : 'opacity-0'
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </>
                              ) : (
                                queryPastors?.data?.length === 0 && (
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

            {(relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover ||
              relationType === RelationType.OnlyRelatedMinistries) && (
              <div className='w-full border-t border-gray-300 pt-4 flex flex-col space-y-6 sm:col-start-1 sm:col-end-3'>
                <div className='w-full flex items-center justify-between border-b border-gray-300 pb-4'>
                  <h3 className='text-[17px] md:text-[22px] font-semibold text-black dark:text-gray-100'>
                    Agregar Ministerios
                  </h3>

                  <Button
                    type='button'
                    variant='ghost'
                    disabled={isInputDisabled}
                    onClick={addMinistryBlock}
                    className={cn(
                      'flex items-center gap-2 text-[14px] px-4 py-2 border border-blue-500 rounded-xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white hover:text-blue-100 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 transition-colors shadow-sm hover:shadow-md'
                    )}
                  >
                    <Plus className='w-4 h-4 md:w-5 md:h-5' />
                    <span className='hidden md:block'>Agregar Ministerio</span>
                  </Button>
                </div>

                {ministryBlocks.map((block, index) => (
                  <div key={index} className='w-full flex flex-col space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      {/* TIPO DE MINISTERIO */}
                      <div className='flex flex-col'>
                        <label className='text-[14.5px] md:text-[15px] font-bold mb-2'>
                          Tipo de Ministerio
                        </label>
                        <Select
                          value={block.ministryType ?? ''}
                          onValueChange={(value) => {
                            updateMinistryBlock(index, 'ministryType', value);
                            updateMinistryBlock(index, 'ministryRoles', []);
                            updateMinistryBlock(index, 'churchId', '');
                          }}
                          disabled={isInputDisabled}
                        >
                          <SelectTrigger className='h-10 text-sm'>
                            {block.ministryType ? (
                              <SelectValue placeholder='Selecciona el tipo de ministerio' />
                            ) : (
                              'Selecciona el tipo de ministerio'
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(MinistryTypeNames).map(([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* IGLESIA */}
                      <div className='flex flex-col'>
                        <label className='text-[14.5px] md:text-[15px] font-bold mb-2'>
                          Iglesia
                        </label>
                        <Popover
                          open={block.churchPopoverOpen}
                          onOpenChange={(open) =>
                            updateMinistryBlock(index, 'churchPopoverOpen', open)
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              disabled={!block.ministryType || isInputDisabled}
                              variant='outline'
                              role='combobox'
                              className='w-full h-10 justify-between text-sm'
                            >
                              {block.churchId
                                ? queryChurches?.data?.find(
                                    (church) => church.id === block.churchId
                                  )?.abbreviatedChurchName
                                : 'Seleccione una iglesia'}
                              <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align='center' className='w-[300px] p-4'>
                            <Command>
                              {queryChurches?.data && queryChurches?.data?.length > 0 ? (
                                <>
                                  <CommandInput
                                    placeholder='Busque una iglesia'
                                    className='h-9 text-[14px]'
                                  />
                                  <CommandEmpty>Iglesia no encontrada.</CommandEmpty>
                                  <CommandGroup className='max-h-[200px] h-auto'>
                                    {queryChurches?.data?.map((church) => (
                                      <CommandItem
                                        key={church.id}
                                        value={church.abbreviatedChurchName}
                                        className='text-[14px]'
                                        onSelect={() => {
                                          updateMinistryBlock(index, 'churchId', church.id);
                                          updateMinistryBlock(index, 'churchPopoverOpen', !open);
                                          handleSelectChurch(index, church.id);
                                        }}
                                      >
                                        {church?.abbreviatedChurchName}
                                        <CheckIcon
                                          className={cn(
                                            'ml-auto h-4 w-4',
                                            church.id === ministryBlocks[index].churchId
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </>
                              ) : (
                                queryChurches?.data?.length === 0 && (
                                  <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                    ❌ No hay iglesias disponibles.
                                  </p>
                                )
                              )}
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* MINISTERIO */}
                      <div className='flex flex-col'>
                        <label className='text-[14.5px] md:text-[15px] font-bold mb-2'>
                          Ministerio
                        </label>
                        <Popover
                          open={block.ministryPopoverOpen}
                          onOpenChange={(open) =>
                            updateMinistryBlock(index, 'ministryPopoverOpen', open)
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              disabled={!block.churchId || !block.ministryType || isInputDisabled}
                              variant='outline'
                              role='combobox'
                              className='w-full h-10 justify-between text-sm'
                            >
                              {block.ministryId
                                ? block.ministries?.find(
                                    (ministry) => ministry.id === block.ministryId
                                  )?.customMinistryName
                                : 'Seleccione un ministerio'}
                              <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align='center' className='w-[300px] p-4'>
                            <Command>
                              {block.ministries && block.ministries?.length > 0 ? (
                                <>
                                  <CommandInput
                                    placeholder='Busque un ministerio'
                                    className='h-9 text-[14px]'
                                  />
                                  <CommandEmpty>Ministerio no encontrado.</CommandEmpty>
                                  <CommandGroup className='max-h-[200px] h-auto'>
                                    {block.ministries?.map((ministry) => (
                                      <CommandItem
                                        key={ministry.id}
                                        value={ministry?.customMinistryName}
                                        className='text-[14px]'
                                        onSelect={() => {
                                          updateMinistryBlock(index, 'ministryId', ministry.id);
                                          updateMinistryBlock(index, 'ministryPopoverOpen', !open);
                                        }}
                                      >
                                        {ministry?.customMinistryName}
                                        <CheckIcon
                                          className={cn(
                                            'ml-auto h-4 w-4',
                                            ministry.id === ministryBlocks[index].ministryId
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </>
                              ) : (
                                block.ministries?.length === 0 && (
                                  <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                    ❌ No hay ministerios disponibles.
                                  </p>
                                )
                              )}
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* ROLES DE MINISTERIO */}
                    <div className='flex flex-col'>
                      <label className='text-[15px] font-bold mb-2'>Roles de Ministerio</label>
                      <div className='flex justify-between items-center gap-x-4'>
                        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1'>
                          {Object.values(
                            block.ministryType === MinistryType.KidsMinistry
                              ? SearchTypesKidsMinistry
                              : block.ministryType === MinistryType.YouthMinistry
                                ? SearchTypesYouthMinistry
                                : block.ministryType === MinistryType.DiscipleshipMinistry
                                  ? SearchTypesDiscipleshipMinistry
                                  : block.ministryType === MinistryType.EvangelismMinistry
                                    ? SearchTypesEvangelismMinistry
                                    : block.ministryType === MinistryType.IntercessionMinistry
                                      ? SearchTypesIntercessionMinistry
                                      : block.ministryType === MinistryType.TechnologyMinistry
                                        ? SearchTypesTechnologyMinistry
                                        : SearchTypesWorshipMinistry
                          ).map((role) => {
                            const isSelected = block.ministryRoles.includes(role);
                            const isAnySelected = block.ministryRoles.length > 0;
                            const isDisabled =
                              (!isSelected && isAnySelected) ||
                              isInputDisabled ||
                              !block.churchId ||
                              !block.ministryType ||
                              !block.ministryId;
                            const checkboxId = `role-${index}-${role}`;

                            return (
                              <div key={role} className='flex items-center space-x-2'>
                                <Checkbox
                                  id={checkboxId}
                                  disabled={isDisabled}
                                  checked={isSelected}
                                  onCheckedChange={(checked) =>
                                    toggleRoleInBlock(index, role, !!checked)
                                  }
                                  className={cn(isDisabled ? 'bg-slate-500' : '')}
                                />
                                <label
                                  htmlFor={checkboxId}
                                  className='text-sm cursor-pointer font-normal'
                                >
                                  {MinistryMemberRoleNames[role as MinistryMemberRole]}
                                </label>
                              </div>
                            );
                          })}
                        </div>

                        <Button
                          type='button'
                          variant='ghost'
                          disabled={isInputDisabled}
                          onClick={() => removeMinistryBlock(index)}
                          className={cn(
                            'flex items-center gap-2 text-[14px] px-4 py-2 border border-red-500 rounded-xl bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:text-red-100 hover:from-red-500 hover:via-red-600 hover:to-red-700 transition-colors shadow-sm hover:shadow-md'
                          )}
                        >
                          <Trash className='w-4 h-4 md:w-5 md:h-5' />
                          <span className='hidden md:block'>Eliminar</span>
                        </Button>
                      </div>
                    </div>

                    <div className='border-b border-gray-300 my-4' />
                  </div>
                ))}
              </div>
            )}

            {isMessageErrorDisabled ||
            (relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
              ministryBlocks.some(
                (item) =>
                  !item.churchId ||
                  !item.ministryId ||
                  !item.ministryType ||
                  item.ministryRoles.length === 0
              )) ? (
              <p className='mt-0 -mb-4 md:-mt-5 md:col-start-1 md:col-end-3 md:row-start-4 md:row-end-5 mx-auto md:w-[100%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                ❌ Datos incompletos, completa todos los campos para crear el registro.
              </p>
            ) : (
              <p className='order-last -mt-3 md:-mt-6 md:col-start-1 md:col-end-3 md:row-start-5 md:row-end-6 mx-auto md:w-[70%] lg:w-[50%] text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                ¡Campos completados correctamente!
              </p>
            )}

            <div className='md:mt-2 lg:mt-2 col-start-1 col-end-3 row-start-4 row-end-5 w-full md:w-[20rem] md:m-auto'>
              <Toaster position='top-center' richColors />
              <Button
                disabled={isSubmitButtonDisabled}
                type='submit'
                className={cn(
                  'w-full text-[14px]',
                  discipleCreationMutation?.isPending &&
                    'bg-emerald-500 hover:bg-emerald-500 disabled:opacity-100 disabled:md:text-[15px] text-white'
                )}
                onClick={() => {
                  setTimeout(() => {
                    if (Object.keys(form.formState.errors).length === 0) {
                      setIsSubmitButtonDisabled(true);
                      setIsInputDisabled(true);
                    }
                  }, 100);
                }}
              >
                {discipleCreationMutation?.isPending ? 'Procesando...' : 'Registrar Discípulo'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default DiscipleCreatePage;
