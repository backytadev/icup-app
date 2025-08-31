/* eslint-disable @typescript-eslint/no-misused-promises */
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

import { CalendarIcon, ChevronDown, Plus, Trash } from 'lucide-react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { useDiscipleUpdateEffects } from '@/modules/disciple/hooks/useDiscipleUpdateEffects';
import { useDiscipleUpdateMutation } from '@/modules/disciple/hooks/useDiscipleUpdateMutation';
import { useDisciplePromoteButtonLogic } from '@/modules/disciple/hooks/useDisciplePromoteButtonLogic';
import { useDiscipleUpdateSubmitButtonLogic } from '@/modules/disciple/hooks/useDiscipleUpdateSubmitButtonLogic';

import { discipleFormSchema } from '@/modules/disciple/validations/disciple-form-schema';
import { type DiscipleResponse } from '@/modules/disciple/interfaces/disciple-response.interface';
import { DiscipleFormSkeleton } from '@/modules/disciple/components/cards/update/DiscipleFormSkeleton';

import { getSimplePastors } from '@/modules/pastor/services/pastor.service';
import { getSimpleChurches } from '@/modules/church/services/church.service';
import { getSimpleMinistries } from '@/modules/ministry/services/ministry.service';
import { getSimpleSupervisors } from '@/modules/supervisor/services/supervisor.service';
import { getSimpleFamilyGroups } from '@/modules/family-group/services/family-group.service';

import { cn } from '@/shared/lib/utils';

import { useRoleValidationByPath } from '@/shared/hooks/useRoleValidationByPath';

import {
  MinistryMemberRole,
  SearchTypesKidsMinistry,
  MinistryMemberRoleNames,
  SearchTypesYouthMinistry,
  SearchTypesWorshipMinistry,
  SearchTypesEvangelismMinistry,
  SearchTypesTechnologyMinistry,
  SearchTypesIntercessionMinistry,
  SearchTypesDiscipleshipMinistry,
} from '@/modules/ministry/enums/ministry-member-role.enum';
import { GenderNames } from '@/shared/enums/gender.enum';
import { CountryNames } from '@/shared/enums/country.enum';
import { ProvinceNames } from '@/shared/enums/province.enum';
import { DistrictNames } from '@/shared/enums/district.enum';
import { DepartmentNames } from '@/shared/enums/department.enum';
import { UrbanSectorNames } from '@/shared/enums/urban-sector.enum';
import { MaritalStatusNames } from '@/shared/enums/marital-status.enum';
import { MemberRole, MemberRoleNames } from '@/shared/enums/member-role.enum';
import { RelationType, RelationTypeNames } from '@/shared/enums/relation-type.enum';
import { MinistryType, MinistryTypeNames } from '@/modules/ministry/enums/ministry-type.enum';

import { getFullNames, getInitialFullNames } from '@/shared/helpers/get-full-names.helper';
import { getCodeAndNameFamilyGroup } from '@/shared/helpers/get-code-and-name-family-group.helper';
import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

import { AlertPromotionDisciple } from '@/modules/disciple/components/alerts/AlertPromotionDisciple';
import { AlertUpdateRelationDisciple } from '@/modules/disciple/components/alerts/AlertUpdateRelationDisciple';

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
  SelectContent,
  SelectTrigger,
} from '@/shared/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Calendar } from '@/shared/components/ui/calendar';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

interface DiscipleFormUpdateProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: DiscipleResponse | undefined;
}

export const DiscipleUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: DiscipleFormUpdateProps): JSX.Element => {
  //* States
  const [isRelationSelectDisabled, setIsRelationSelectDisabled] = useState<boolean>(false);
  const [isInputTheirSupervisorOpen, setIsInputTheirSupervisorOpen] = useState<boolean>(false);
  const [isInputTheirFamilyGroupOpen, setIsInputTheirFamilyGroupOpen] = useState<boolean>(false);
  const [isInputBirthDateOpen, setIsInputBirthDateOpen] = useState<boolean>(false);
  const [isInputConvertionDateOpen, setIsInputConvertionDateOpen] = useState<boolean>(false);
  const [isPromoteButtonDisabled, setIsPromoteButtonDisabled] = useState<boolean>(false);
  const [isInputTheirPastorOpen, setIsInputTheirPastorOpen] = useState<boolean>(false);

  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(false);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);
  const [isMessagePromoteDisabled, setIsMessagePromoteDisabled] = useState<boolean>(false);

  const [isLoadingData, setIsLoadingData] = useState(true);

  const [changedId, setChangedId] = useState(data?.theirFamilyGroup?.id);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
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

  //* Hooks (external libraries)
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
      roles: [MemberRole.Disciple],
      recordStatus: '',
      theirFamilyGroup: '',
      theirSupervisor: '',
      theirMinistries: [],
    },
  });

  //* Watchers
  const residenceDistrict = form.watch('residenceDistrict');
  const theirSupervisor = form.watch('theirSupervisor');
  const theirFamilyGroup = form.watch('theirFamilyGroup');
  const relationType = form.watch('relationType');

  //* Effects
  useEffect(() => {
    if (data && data?.theirFamilyGroup?.id !== changedId) {
      setTimeout(() => {
        setIsAlertDialogOpen(true);
      }, 100);
    }
  }, [changedId]);

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
  }, [relationType]);

  //* Helpers
  const districtsValidation = validateDistrictsAllowedByModule(pathname);
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(residenceDistrict);

  //* Custom Hooks
  useDiscipleUpdateEffects({
    id,
    data,
    setIsLoadingData,
    setMinistryBlocks,
    discipleUpdateForm: form,
  });

  const { disabledRoles } = useRoleValidationByPath({
    path: pathname,
  });

  useDisciplePromoteButtonLogic({
    data,
    ministryBlocks,
    discipleUpdateForm: form,
    setIsPromoteButtonDisabled,
  });

  useDiscipleUpdateSubmitButtonLogic({
    discipleUpdateForm: form,
    isInputDisabled,
    setIsMessageErrorDisabled,
    setIsSubmitButtonDisabled,
    isRelationSelectDisabled,
    ministryBlocks,
    setMinistryBlocks,
  });

  const discipleUpdateMutation = useDiscipleUpdateMutation({
    dialogClose,
    scrollToTop,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
    setIsRelationSelectDisabled,
  });

  //* Queries
  const familyGroupsQuery = useQuery({
    queryKey: ['family-groups', id],
    queryFn: async () => await getSimpleFamilyGroups({ isSimpleQuery: false }),
    retry: false,
  });

  const supervisorsQuery = useQuery({
    queryKey: ['supervisors', id],
    queryFn: async () => await getSimpleSupervisors({ isNullZone: false, isSimpleQuery: true }),
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
    if (relationType === RelationType.OnlyRelatedHierarchicalCover && ministryBlocks.length > 0) {
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

    discipleUpdateMutation.mutate({
      id: id,
      formData: {
        ...formData,
        theirMinistries: ministriesData.some(
          (item) => !item.ministryId || item.ministryRoles?.length === 0
        )
          ? []
          : ministriesData,
      },
    });
  };

  return (
    <Tabs
      defaultValue='general-info'
      className='w-auto -mt-8 sm:w-[520px] md:w-[680px] lg:w-[990px] xl:w-[1100px]'
    >
      <h2 className='text-center leading-7 text-orange-500 pb-2 font-bold text-[24px] sm:text-[26px] md:text-[28px]'>
        Modificar información del Discípulo
      </h2>

      <TabsContent value='general-info'>
        <Card className='w-full'>
          {isLoadingData && <DiscipleFormSkeleton />}

          {!isLoadingData && (
            <CardContent className='py-3 px-4'>
              <div className='dark:text-slate-300 text-slate-500 font-bold text-[17px] md:text-[18px] mb-4 ml-0 md:pl-4'>
                Discípulo: {data?.member?.firstNames} {data?.member?.lastNames}
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className='w-full flex flex-col md:grid md:grid-cols-3 gap-x-10 gap-y-5 px-2 sm:px-12'
                >
                  <div className='col-start-1 col-end-2'>
                    <legend className='font-bold text-[15px] sm:text-[16px]'>
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
                      name='roles'
                      render={() => (
                        <FormItem className='mt-3'>
                          <div className='mb-4'>
                            <FormLabel className='font-bold text-[15px] sm:text-[16px]'>
                              Roles de Membresía
                            </FormLabel>
                          </div>
                          <div className='grid grid-cols-2 sm:grid-cols-2 gap-x-6 gap-y-2'>
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
                          </div>
                          <FormMessage className='text-[13px]' />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Contacto y Vivienda */}

                  <div className='sm:col-start-2 sm:col-end-3'>
                    <legend className='font-bold text-[15px] sm:text-[16px]'>
                      Contacto / Vivienda
                    </legend>

                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>
                              E-mail
                              <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                                Opcional
                              </span>
                            </FormLabel>
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
                            <FormLabel className='text-[14px]'>
                              Número de Teléfono
                              <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                                Opcional
                              </span>
                            </FormLabel>
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

                  <div className='sm:col-start-3 sm:col-end-4 flex flex-col gap-4'>
                    <span className='font-bold text-[15px] sm:text-[16px]'>
                      Roles / Ministerios
                    </span>

                    <FormField
                      control={form.control}
                      name='relationType'
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel className='text-[14px] font-bold'>
                              Tipo de Relación
                            </FormLabel>
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
                                {Object.entries(RelationTypeNames).map(([key, value]) => (
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
                    <div>
                      <legend className='font-bold col-start-1 col-end-3 text-[15px] sm:text-[16px]'>
                        Relaciones
                      </legend>
                      {!isMessagePromoteDisabled &&
                        (relationType === RelationType.OnlyRelatedHierarchicalCover ||
                          relationType ===
                            RelationType.RelatedBothMinistriesAndHierarchicalCover) && (
                          <FormField
                            control={form.control}
                            name='theirFamilyGroup'
                            render={({ field }) => {
                              return (
                                <FormItem className='mt-2'>
                                  <FormLabel className='text-[14px] md:text-[14px] font-bold'>
                                    Grupo Familiar
                                  </FormLabel>
                                  <FormDescription className='text-[13.5px] md:text-[14px]'>
                                    Seleccione un grupo familiar para este discípulo.
                                  </FormDescription>
                                  <Popover
                                    open={isInputTheirFamilyGroupOpen}
                                    onOpenChange={setIsInputTheirFamilyGroupOpen}
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
                                            ? `${familyGroupsQuery?.data?.find((familyGroup) => familyGroup.id === field.value)?.familyGroupName} 
                                          (${familyGroupsQuery?.data?.find((familyGroup) => familyGroup.id === field.value)?.familyGroupCode}) ~ 
                                            ${getInitialFullNames({ firstNames: familyGroupsQuery?.data?.find((familyGroup) => familyGroup.id === field.value)?.theirPreacher?.firstNames ?? '', lastNames: familyGroupsQuery?.data?.find((familyGroup) => familyGroup.id === field.value)?.theirPreacher?.lastNames ?? '' })}`
                                            : 'Busque y seleccione un grupo familiar'}
                                          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent align='center' className='w-auto px-4 py-2'>
                                      <Command>
                                        {familyGroupsQuery?.data?.length &&
                                        familyGroupsQuery?.data?.length > 0 ? (
                                          <>
                                            <CommandInput
                                              placeholder='Busque un grupo familiar...'
                                              className='h-9 text-[14px]'
                                            />
                                            <CommandEmpty>
                                              Grupo familiar no encontrado.
                                            </CommandEmpty>
                                            <CommandGroup className='max-h-[200px] h-auto'>
                                              {familyGroupsQuery?.data?.map((familyGroup) => (
                                                <CommandItem
                                                  className='text-[14px]'
                                                  value={getCodeAndNameFamilyGroup({
                                                    code: familyGroup.familyGroupCode,
                                                    name: familyGroup.familyGroupName,
                                                    preacher: `${getInitialFullNames({ firstNames: familyGroup.theirPreacher?.firstNames ?? '', lastNames: familyGroup.theirPreacher?.lastNames ?? '' })}`,
                                                  })}
                                                  key={familyGroup.id}
                                                  onSelect={() => {
                                                    form.setValue(
                                                      'theirFamilyGroup',
                                                      familyGroup?.id
                                                    );
                                                    setIsInputTheirFamilyGroupOpen(false);
                                                    setChangedId(familyGroup.id);
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
                                          familyGroupsQuery?.data?.length === 0 && (
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

                      <AlertUpdateRelationDisciple
                        data={data}
                        isAlertDialogOpen={isAlertDialogOpen}
                        setIsAlertDialogOpen={setIsAlertDialogOpen}
                        familyGroupsQuery={familyGroupsQuery}
                        discipleUpdateForm={form}
                        setChangedId={setChangedId}
                        changedId={changedId}
                      />

                      {isPromoteButtonDisabled && isInputDisabled && !theirFamilyGroup && (
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
                                  Seleccione un supervisor para este predicador.
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
                                      {supervisorsQuery?.data?.length &&
                                      supervisorsQuery?.data?.length > 0 ? (
                                        <>
                                          <CommandInput
                                            placeholder='Busque una supervisor...'
                                            className='h-9 text-[14px]'
                                          />
                                          <CommandEmpty>Supervisor no encontrado.</CommandEmpty>
                                          <CommandGroup className='max-h-[200px] h-auto'>
                                            {supervisorsQuery?.data?.map((supervisor) => (
                                              <CommandItem
                                                className='text-[14px]'
                                                value={getFullNames({
                                                  firstNames: supervisor.member?.firstNames ?? '',
                                                  lastNames: supervisor.member?.lastNames ?? '',
                                                })}
                                                key={supervisor.id}
                                                onSelect={() => {
                                                  form.setValue('theirSupervisor', supervisor.id);
                                                  setIsInputTheirSupervisorOpen(false);
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
                                        </>
                                      ) : (
                                        supervisorsQuery?.data?.length === 0 && (
                                          <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                            ❌No hay supervisores disponibles.
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

                      {relationType === RelationType.OnlyRelatedMinistries &&
                        !isMessagePromoteDisabled && (
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
                                        {queryPastors?.data?.length &&
                                        queryPastors?.data?.length > 0 ? (
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
                          <h3 className='text-[16px] font-bold text-black dark:text-gray-100'>
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
                            <Plus className='w-4 h-4' />
                          </Button>
                        </div>

                        {ministryBlocks.map((block, index) => {
                          const selectedChurch = queryChurches?.data?.find(
                            (c) => c.id === block.churchId
                          );
                          const selectedMinistry = block.ministries?.find(
                            (m) => m.id === block.ministryId
                          );
                          const summary = `${MinistryTypeNames[block.ministryType as MinistryType] ?? '—'} • ${selectedChurch?.abbreviatedChurchName ?? 'Iglesia no seleccionada'} • ${selectedMinistry?.customMinistryName ?? 'Ministerio no seleccionado'}`;

                          return (
                            <Collapsible key={index} className='border rounded-lg bg-white/5'>
                              <div className='flex items-center justify-between px-4 py-3'>
                                <div className='flex flex-col'>
                                  <span className='text-md font-medium pb-1'>
                                    Ministerio {index + 1}
                                  </span>
                                  <span className='text-[12.5px] text-muted-foreground truncate text-wrap'>
                                    {summary}
                                  </span>
                                </div>

                                <div className='flex items-center gap-3'>
                                  <CollapsibleTrigger asChild>
                                    <Button
                                      className='text-[15px] md:text-base font-semibold tracking-wide mb-1 px-2 bg-slate-100 text-black dark:bg-slate-800 dark:text-white 
                                    hover:bg-slate-200 dark:hover:bg-slate-700 w-full justify-between [&[data-state=open]>svg]:rotate-180'
                                    >
                                      <ChevronDown className='h-4 w-4 transition-transform duration-300' />
                                    </Button>
                                  </CollapsibleTrigger>
                                </div>
                              </div>

                              <CollapsibleContent className='px-4 pb-4 pt-2 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden'>
                                <div key={index} className='w-full flex flex-col space-y-4'>
                                  <div className='grid grid-cols-1 md:grid-cols-1 gap-2'>
                                    {/* TIPO DE MINISTERIO */}
                                    <div className='flex flex-col'>
                                      <label className='text-[14px] md:text-[14px] font-bold mb-2'>
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
                                      <label className='text-[14px] md:text-[14px] font-bold mb-2'>
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
                                            {queryChurches?.data &&
                                            queryChurches?.data?.length > 0 ? (
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
                                                        updateMinistryBlock(
                                                          index,
                                                          'churchId',
                                                          church.id
                                                        );
                                                        updateMinistryBlock(
                                                          index,
                                                          'churchPopoverOpen',
                                                          !open
                                                        );
                                                        handleSelectChurch(index, church.id);
                                                      }}
                                                    >
                                                      {church?.abbreviatedChurchName}
                                                      <CheckIcon
                                                        className={cn(
                                                          'ml-auto h-4 w-4',
                                                          church.id ===
                                                            ministryBlocks[index].churchId
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
                                      <label className='text-[14px] md:text-[14px] font-bold mb-2'>
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
                                            disabled={
                                              !block.churchId ||
                                              !block.ministryType ||
                                              isInputDisabled
                                            }
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
                                                <CommandEmpty>
                                                  Ministerio no encontrado.
                                                </CommandEmpty>
                                                <CommandGroup className='max-h-[200px] h-auto'>
                                                  {block.ministries?.map((ministry) => (
                                                    <CommandItem
                                                      key={ministry.id}
                                                      value={ministry?.customMinistryName}
                                                      className='text-[14px]'
                                                      onSelect={() => {
                                                        updateMinistryBlock(
                                                          index,
                                                          'ministryId',
                                                          ministry.id
                                                        );
                                                        updateMinistryBlock(
                                                          index,
                                                          'ministryPopoverOpen',
                                                          !open
                                                        );
                                                      }}
                                                    >
                                                      {ministry?.customMinistryName}
                                                      <CheckIcon
                                                        className={cn(
                                                          'ml-auto h-4 w-4',
                                                          ministry.id ===
                                                            ministryBlocks[index].ministryId
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
                                    <label className='text-[14px] font-bold mb-2'>
                                      Roles de Ministerio
                                    </label>
                                    <div className='flex justify-between items-center gap-x-1'>
                                      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-x-4 gap-y-1'>
                                        {Object.values(
                                          block.ministryType === MinistryType.KidsMinistry
                                            ? SearchTypesKidsMinistry
                                            : block.ministryType === MinistryType.YouthMinistry
                                              ? SearchTypesYouthMinistry
                                              : block.ministryType ===
                                                  MinistryType.DiscipleshipMinistry
                                                ? SearchTypesDiscipleshipMinistry
                                                : block.ministryType ===
                                                    MinistryType.EvangelismMinistry
                                                  ? SearchTypesEvangelismMinistry
                                                  : block.ministryType ===
                                                      MinistryType.IntercessionMinistry
                                                    ? SearchTypesIntercessionMinistry
                                                    : block.ministryType ===
                                                        MinistryType.TechnologyMinistry
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
                                                {
                                                  MinistryMemberRoleNames[
                                                    role as MinistryMemberRole
                                                  ]
                                                }
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
                                        <Trash className='w-4 h-4' />
                                      </Button>
                                    </div>
                                  </div>

                                  <div className='border-b border-gray-300 my-4' />
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          );
                        })}
                      </div>
                    )}

                    {isMessagePromoteDisabled && (
                      <span className='text-[14px] md:text-[14px] dark:text-yellow-500 text-amber-500 font-bold text-center'>
                        !SE HA PROMOVIDO CORRECTAMENTE! <br />
                        <span className='text-[14px] md:text-[14px]'>
                          <div>
                            <span className='text-red-500 text-center inline-block'>
                              Roles anteriores: Discípulo
                            </span>
                            <br />
                            <span className='text-green-500 text-center inline-block'>
                              Roles nuevos: Predicador
                            </span>
                          </div>
                        </span>
                      </span>
                    )}

                    {/* Relaciones  */}

                    {isPromoteButtonDisabled &&
                      !theirSupervisor &&
                      !theirFamilyGroup &&
                      isMessagePromoteDisabled && (
                        <span className='-mt-2 text-[12.5px] md:text-[13px] font-bold text-center text-red-500'>
                          ! Por favor asigna la nueva relación para los roles promovidos !
                        </span>
                      )}

                    <AlertPromotionDisciple
                      isPromoteButtonDisabled={isPromoteButtonDisabled}
                      setIsInputDisabled={setIsInputDisabled}
                      setIsPromoteButtonDisabled={setIsPromoteButtonDisabled}
                      setIsMessagePromoteDisabled={setIsMessagePromoteDisabled}
                      discipleUpdateForm={form}
                      isInputDisabled={isInputDisabled}
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
                        discipleUpdateMutation?.isPending &&
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
                      {discipleUpdateMutation?.isPending ? 'Procesando...' : 'Guardar cambios'}
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
