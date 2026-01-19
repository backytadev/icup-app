import { useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { getSimpleZones } from '@/modules/zone/services/zone.service';

import { PreacherSearchType } from '@/modules/preacher/enums/preacher-search-type.enum';

import { familyGroupFormSchema } from '@/modules/family-group/validations/family-group-form-schema';
import { FamilyGroupServiceTimeNames } from '@/modules/family-group/enums/family-group-service-time.enum';
import { type FamilyGroupResponse } from '@/modules/family-group/interfaces/family-group-response.interface';
import { FamilyGroupFormSkeleton } from '@/modules/family-group/components/cards/update/FamilyGroupFormSkeleton';
import { AlertUpdateRelationFamilyGroup } from '@/modules/family-group/components/alerts/AlertUpdateRelationFamilyGroup';

import { useFamilyGroupUpdateEffects } from '@/modules/family-group/hooks/useFamilyGroupUpdateEffects';
import { useFamilyGroupUpdateMutation } from '@/modules/family-group/hooks/useFamilyGroupUpdateMutation';
import { useFamilyGroupUpdateSubmitButtonLogic } from '@/modules/family-group/hooks/useFamilyGroupUpdateSubmitButtonLogic';

import {
  getSimplePreachers,
  getPreachersByFilters,
} from '@/modules/preacher/services/preacher.service';

import { cn } from '@/shared/lib/utils';

import { CountryNames } from '@/shared/enums/country.enum';
import { ProvinceNames } from '@/shared/enums/province.enum';
import { DistrictNames } from '@/shared/enums/district.enum';
import { RecordOrder } from '@/shared/enums/record-order.enum';
import { DepartmentNames } from '@/shared/enums/department.enum';
import { RecordStatus } from '@/shared/enums/record-status.enum';
import { UrbanSectorNames } from '@/shared/enums/urban-sector.enum';

import { getFullNames } from '@/shared/helpers/get-full-names.helper';
import { validateDistrictsAllowedByModule } from '@/shared/helpers/validate-districts-allowed-by-module.helper';
import { validateUrbanSectorsAllowedByDistrict } from '@/shared/helpers/validate-urban-sectors-allowed-by-district.helper';

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
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

interface FamilyGroupFormUpdateProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: FamilyGroupResponse | undefined;
}

export const FamilyGroupUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: FamilyGroupFormUpdateProps): JSX.Element => {
  //* States
  const [isInputTheirPreacherOpen, setIsInputTheirPreacherOpen] = useState<boolean>(false);
  const [isInputTheirZoneOpen, setIsInputTheirZoneOpen] = useState<boolean>(false);

  const [isInputTheirPreacherDisabled, setIsInputTheirPreacherDisabled] = useState<boolean>(true);
  const [isInputTheirZoneDisabled, setIsInputTheirZoneDisabled] = useState<boolean>(true);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);

  const [isLoadingData, setIsLoadingData] = useState(true);

  //* Hooks (external libraries)
  const { pathname } = useLocation();

  //* Form
  const form = useForm<z.infer<typeof familyGroupFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(familyGroupFormSchema),
    defaultValues: {
      familyGroupName: '',
      country: '',
      department: '',
      province: '',
      district: '',
      urbanSector: '',
      address: '',
      serviceTime: '',
      referenceAddress: '',
      theirPreacher: '',
      theirZone: '',
      recordStatus: '',
    },
  });

  //* Watchers
  const district = form.watch('district');
  const theirZone = form.watch('theirZone');

  //* Helpers
  const urbanSectorsValidation = validateUrbanSectorsAllowedByDistrict(district);
  const districtsValidation = validateDistrictsAllowedByModule(pathname);

  //* Custom hooks
  useFamilyGroupUpdateEffects({
    id,
    data,
    setIsLoadingData,
    setIsInputTheirPreacherDisabled,
    familyGroupUpdateForm: form,
  });

  useFamilyGroupUpdateSubmitButtonLogic({
    familyGroupUpdateForm: form,
    setIsSubmitButtonDisabled,
    setIsMessageErrorDisabled,
    isInputDisabled,
  });

  const familyGroupUpdateMutation = useFamilyGroupUpdateMutation({
    dialogClose,
    scrollToTop,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  //* Queries
  const zonesQuery = useQuery({
    queryKey: ['zones'],
    queryFn: () => getSimpleZones({ isSimpleQuery: true }),
    retry: false,
  });

  const preachersQuery = useQuery({
    queryKey: ['preachers'],
    queryFn: () => getSimplePreachers({ isSimpleQuery: true, churchId: data?.theirChurch?.id }),
    retry: false,
  });

  const preachersByZoneQuery = useQuery({
    queryKey: ['update-preachers-by-zone', theirZone],
    queryFn: () =>
      getPreachersByFilters({
        searchType: PreacherSearchType.AvailablePreachersByZone,
        zoneTerm: theirZone ?? '',
        withNullFamilyGroup: true,
        order: RecordOrder.Ascending,
      }),
    enabled: !!theirZone,
    retry: false,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof familyGroupFormSchema>): void => {
    familyGroupUpdateMutation.mutate({ id, formData });
  };

  return (
    <Tabs
      defaultValue='general-info'
      className='w-auto -mt-8 sm:w-[520px] md:w-[680px] lg:w-[990px] xl:w-[1100px]'
    >
      <h2 className='text-center leading-7 text-orange-500 pb-2 font-bold text-[24px] sm:text-[26px] md:text-[28px]'>
        Modificar información del Grupo Familiar
      </h2>

      <TabsContent value='general-info'>
        <Card className='w-full'>
          {isLoadingData && <FamilyGroupFormSkeleton />}

          {!isLoadingData && (
            <CardContent className='py-3 px-4'>
              <div className='dark:text-slate-300 text-slate-500 font-bold text-[16.5px] md:text-[18px] mb-4 pl-0 md:pl-4'>
                Grupo Familiar: {`${data?.familyGroupName} (${data?.familyGroupCode ?? 'SC'})`}
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className='w-full flex flex-col md:grid md:grid-cols-2 gap-x-10 gap-y-5 px-2 sm:px-12'
                >
                  <div className='col-start-1 col-end-2'>
                    <FormField
                      control={form.control}
                      name='familyGroupName'
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Nombre
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asigna una nombre al grupo familiar.
                            </FormDescription>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                disabled={isInputDisabled}
                                placeholder='Ejem: Los Guerreros de Dios...'
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
                      name='serviceTime'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Horario de culto
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asigna un horario de culto al grupo familiar.
                            </FormDescription>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isInputDisabled}
                            >
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <SelectTrigger>
                                  {field.value ? (
                                    <SelectValue placeholder='Selecciona un horario' />
                                  ) : (
                                    'Selecciona un horario'
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(FamilyGroupServiceTimeNames).map(([key, value]) => (
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
                      name='country'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              País
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asigna el país al que pertenece el grupo familiar.
                            </FormDescription>
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
                      name='department'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Departamento
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asigna el departamento al que pertenece el grupo familiar.
                            </FormDescription>
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
                      name='province'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Provincia
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asigna la provincia a la que pertenece el grupo familiar.
                            </FormDescription>
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
                      name='district'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Distrito
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asigna el distrito al que pertenece el grupo familiar.
                            </FormDescription>
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
                  </div>

                  <div className='col-start-2 col-end-3'>
                    <FormField
                      control={form.control}
                      name='urbanSector'
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Sector Urbano
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asigna el sector urbano al que pertenece el grupo familiar.
                            </FormDescription>
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
                                    className={`text-[14px] ${(urbanSectorsValidation?.urbanSectorsDataResult?.includes(value) ?? !district) ? 'hidden' : ''}`}
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
                      name='address'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Dirección
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asigna la dirección al que pertenece el grupo familiar.
                            </FormDescription>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                disabled={isInputDisabled}
                                placeholder='Ej: Av. Central 123 - Mz.A Lt.3'
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
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Referencia de dirección
                            </FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Textarea
                                disabled={isInputDisabled}
                                placeholder='Comentarios sobre la referencia de ubicación del grupo familiar...'
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
                      name='theirZone'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold flex justify-between items-center'>
                              <p>Zona</p>
                              <AlertUpdateRelationFamilyGroup />
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asigna la Zona a la que pertenecerá este Grupo Familiar.
                            </FormDescription>
                            <Popover
                              open={isInputTheirZoneOpen}
                              onOpenChange={setIsInputTheirZoneOpen}
                            >
                              <PopoverTrigger asChild>
                                <FormControl className='text-[14px] md:text-[14px]'>
                                  <Button
                                    disabled={isInputTheirZoneDisabled}
                                    variant='outline'
                                    role='combobox'
                                    className={cn(
                                      'w-full justify-between ',
                                      !field.value && 'font-normal',
                                      isInputTheirZoneDisabled &&
                                        'dark:bg-gray-100  dark:text-black bg-gray-200'
                                    )}
                                  >
                                    {field.value
                                      ? zonesQuery?.data?.find((zone) => zone.id === field.value)
                                          ?.zoneName
                                      : 'Busque y seleccione una zona'}
                                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent align='center' className='w-auto px-4 py-2'>
                                <Command>
                                  {zonesQuery?.data?.length && zonesQuery?.data?.length > 0 ? (
                                    <>
                                      <CommandInput
                                        placeholder='Busque una zona'
                                        className='h-9 text-[14px]'
                                      />
                                      <CommandEmpty>Zona no encontrada.</CommandEmpty>
                                      <CommandGroup className='max-h-[200px] h-auto'>
                                        {zonesQuery?.data?.map((zone) => (
                                          <CommandItem
                                            className='text-[14px]'
                                            value={zone.zoneName}
                                            key={zone.id}
                                            onSelect={() => {
                                              form.setValue('theirZone', zone?.id);
                                              setIsInputTheirZoneOpen(false);
                                            }}
                                          >
                                            {zone.zoneName}
                                            <CheckIcon
                                              className={cn(
                                                'ml-auto h-4 w-4',
                                                zone?.id === field.value
                                                  ? 'opacity-100'
                                                  : 'opacity-0'
                                              )}
                                            />
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </>
                                  ) : (
                                    zonesQuery?.data?.length === 0 && (
                                      <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                        ❌No hay zonas disponibles.
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

                    <FormField
                      control={form.control}
                      name='theirPreacher'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Predicador
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asigna el Predicador responsable para este Grupo Familiar.
                            </FormDescription>
                            {preachersByZoneQuery?.isFetching &&
                            (data?.recordStatus === RecordStatus.Inactive ||
                              !data?.theirPreacher) ? (
                              <div className='pt-2 font-black text-[16px] text-center dark:text-gray-300 text-gray-500'>
                                <span>Cargando predicadores...</span>
                              </div>
                            ) : (
                              <Popover
                                open={isInputTheirPreacherOpen}
                                onOpenChange={setIsInputTheirPreacherOpen}
                              >
                                <PopoverTrigger asChild>
                                  <FormControl className='text-[14px] md:text-[14px]'>
                                    <Button
                                      disabled={isInputTheirPreacherDisabled}
                                      variant='outline'
                                      role='combobox'
                                      className={cn(
                                        'w-full justify-between ',
                                        !field.value && 'font-normal',
                                        isInputTheirPreacherDisabled &&
                                          'dark:bg-gray-100  dark:text-black bg-gray-200'
                                      )}
                                    >
                                      {field.value ||
                                      (field.value && data?.recordStatus === RecordStatus.Active)
                                        ? `${preachersQuery?.data?.find((preacher) => preacher.id === field.value)?.member?.firstNames} ${preachersQuery?.data?.find((preacher) => preacher.id === field.value)?.member?.lastNames}`
                                        : field.value &&
                                            (data?.recordStatus === RecordStatus.Inactive ||
                                              !data?.theirPreacher)
                                          ? `${preachersByZoneQuery?.data?.find((preacher) => preacher.id === field.value)?.member?.firstNames} ${preachersByZoneQuery?.data?.find((preacher) => preacher.id === field.value)?.member?.lastNames}`
                                          : 'Busque y seleccione un predicador'}
                                      <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent align='center' className='w-auto px-4 py-2'>
                                  <Command>
                                    {(data?.theirPreacher?.id ||
                                      preachersByZoneQuery?.data?.length !== 0) && (
                                      <CommandInput
                                        placeholder='Busque un predicador...'
                                        className='h-9 text-[14px]'
                                      />
                                    )}
                                    {data?.recordStatus === RecordStatus.Active &&
                                      data?.theirPreacher &&
                                      preachersQuery?.data &&
                                      preachersByZoneQuery?.data?.length !== 0 && (
                                        <CommandEmpty>Predicador no encontrado.</CommandEmpty>
                                      )}
                                    <CommandGroup
                                      className={cn(
                                        'max-h-[200px] h-auto ',
                                        (!preachersQuery.data || !preachersByZoneQuery.data) &&
                                          'w-[320px]'
                                      )}
                                    >
                                      {data?.recordStatus === RecordStatus.Active &&
                                      data.theirPreacher?.id
                                        ? preachersQuery?.data?.map((preacher) => (
                                            <CommandItem
                                              className='text-[14px]'
                                              value={getFullNames({
                                                firstNames: preacher?.member?.firstNames ?? '',
                                                lastNames: preacher?.member?.lastNames ?? '',
                                              })}
                                              key={preacher.id}
                                              onSelect={() => {
                                                form.setValue('theirPreacher', preacher.id);
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
                                          ))
                                        : (data?.recordStatus === RecordStatus.Active ||
                                              data?.recordStatus === RecordStatus.Inactive) &&
                                            !data.theirPreacher?.id &&
                                            preachersByZoneQuery?.data?.length !== 0
                                          ? preachersByZoneQuery?.data?.map((preacher) => (
                                              <CommandItem
                                                className='text-[14px]'
                                                value={getFullNames({
                                                  firstNames: preacher?.member?.firstNames ?? '',
                                                  lastNames: preacher?.member?.lastNames ?? '',
                                                })}
                                                key={preacher.id}
                                                onSelect={() => {
                                                  form.setValue('theirPreacher', preacher.id);
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
                                            ))
                                          : preachersByZoneQuery?.data?.length === 0 && (
                                              <p className='text-[13.5px] md:text-[14.5px] w-[20rem] font-medium text-red-500 text-center'>
                                                ❌ No se encontró predicadores disponibles, todos
                                                están asignados a un grupo familiar.
                                              </p>
                                            )}
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            )}

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
                            <FormLabel className='text-[14px] font-bold'>Estado</FormLabel>
                            <Select
                              disabled={isInputDisabled}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl className='text-[14px] md:text-[14px]'>
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
                                  Inactivar Grupo Familiar.
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
                        familyGroupUpdateMutation?.isPending &&
                          'bg-emerald-500 hover:bg-emerald-500 disabled:opacity-100 disabled:md:text-[15px] text-white'
                      )}
                      onClick={() => {
                        setTimeout(() => {
                          if (Object.keys(form.formState.errors).length === 0) {
                            setIsSubmitButtonDisabled(true);
                            setIsInputDisabled(true);
                            setIsInputTheirPreacherDisabled(true);
                            setIsInputTheirZoneDisabled(true);
                          }
                        }, 100);
                      }}
                    >
                      {familyGroupUpdateMutation?.isPending ? 'Procesando...' : 'Guardar cambios'}
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
