/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { Toaster } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { useDiscipleStore } from '@/stores/disciple/disciple.store';

import { getSimpleChurches } from '@/modules/church/services/church.service';

import { discipleUpdateColumns as columns } from '@/modules/disciple/components/data-tables/columns/disciple-update-columns';
import { SearchByTermDiscipleDataTable } from '@/modules/disciple/components/data-tables/boards/search-by-term-disciple-data-table';

import {
  DiscipleSearchType,
  DiscipleSearchTypeNames,
} from '@/modules/disciple/enums/disciple-search-type.enum';
import {
  SubTypeNamesDiscipleSearchByFullNames,
  SubTypeNamesDiscipleSearchByLastNames,
  SubTypeNamesDiscipleSearchByFirstNames,
} from '@/modules/disciple/enums/disciple-search-sub-type.enum';
import {
  DiscipleSearchNamesByGender,
  DiscipleSearchNamesByBirthMonth,
  DiscipleSearchNamesByRecordStatus,
  DiscipleSearchNamesByMaritalStatus,
} from '@/modules/disciple/enums/disciple-search-select-option.enum';

import { type DiscipleResponse } from '@/modules/disciple/interfaces/disciple-response.interface';
import { type DiscipleSearchFormByTerm } from '@/modules/disciple/interfaces/disciple-form-search-by-term.interface';

import { discipleSearchByTermFormSchema } from '@/modules/disciple/validations/disciple-search-by-term-form-schema';

import { cn } from '@/shared/lib/utils';

import { RecordOrder, RecordOrderNames } from '@/shared/enums/record-order.enum';

import { PageTitle } from '@/shared/components/page/PageTitle';
import { SearchTitle } from '@/shared/components/page/SearchTitle';

import { firstNamesFormatter, lastNamesFormatter } from '@/shared/helpers/names-formatter.helper';
import { dateFormatterTermToTimestamp } from '@/shared/helpers/date-formatter-to-timestamp.helper';

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
  SelectTrigger,
  SelectContent,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

const dataFictional: DiscipleResponse[] = [
  {
    id: '',
    member: {
      id: '',
      firstNames: '',
      lastNames: '',
      gender: '',
      age: 0,
      originCountry: '',
      birthDate: new Date('2024-05-21'),
      maritalStatus: '',
      numberChildren: 0,
      conversionDate: new Date('2024-05-21'),
      email: '',
      phoneNumber: '',
      residenceCountry: '',
      residenceDepartment: '',
      residenceProvince: '',
      residenceDistrict: '',
      residenceUrbanSector: '',
      residenceAddress: '',
      referenceAddress: '',
      ministries: [],
      roles: [],
    },
    relationType: '',
    recordStatus: '',
    theirFamilyGroup: null,
    theirSupervisor: null,
  },
];

export const DiscipleUpdatePage = (): JSX.Element => {
  //* States
  const [dataForm, setDataForm] = useState<DiscipleSearchFormByTerm>();
  const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useState<DiscipleSearchFormByTerm | undefined>();

  const isFiltersSearchByTermDisabled = useDiscipleStore(
    (state) => state.isFiltersSearchByTermDisabled
  );
  const setIsFiltersSearchByTermDisabled = useDiscipleStore(
    (state) => state.setIsFiltersSearchByTermDisabled
  );

  //* Forms
  const form = useForm<z.infer<typeof discipleSearchByTermFormSchema>>({
    resolver: zodResolver(discipleSearchByTermFormSchema),
    mode: 'onChange',
    defaultValues: {
      searchSubType: '' as any,
      limit: '10',
      inputTerm: '',
      firstNamesTerm: '',
      lastNamesTerm: '',
      selectTerm: '',
      dateTerm: undefined,
      all: false,
      order: RecordOrder.Descending,
    },
  });

  //* Watchers
  const { searchType, limit, order, all } = form.watch();

  //* Queries
  const churchesQuery = useQuery({
    queryKey: ['churches'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

  //* Effects
  useEffect(() => {
    if (all) form.setValue('limit', '10');
  }, [all]);

  useEffect(() => {
    setIsDisabledSubmitButton(!limit || !order);
  }, [limit, order]);

  useEffect(() => {
    setIsFiltersSearchByTermDisabled(true);
  }, []);

  useEffect(() => {
    form.setValue('searchSubType', undefined);
  }, [searchType]);

  useEffect(() => {
    document.title = 'Modulo Discípulo - IcupApp';
  }, []);

  useEffect(() => {
    if (churchesQuery.data?.length) {
      form.setValue('churchId', churchesQuery.data[0].id);
    }
  }, [churchesQuery.data, searchParams]);

  //* Form handler
  function onSubmit(formData: z.infer<typeof discipleSearchByTermFormSchema>): void {
    let newDateTermTo;
    if (!formData.dateTerm?.to) {
      newDateTermTo = formData.dateTerm?.from;
    }

    const newDateTerm = dateFormatterTermToTimestamp({
      from: formData.dateTerm?.from,
      to: formData.dateTerm?.to ? formData.dateTerm?.to : newDateTermTo,
    });

    const newNamesTerm = firstNamesFormatter(formData?.firstNamesTerm);
    const newLastNamesTerm = lastNamesFormatter(formData?.lastNamesTerm);

    setSearchParams({
      ...formData,
      firstNamesTerm: newNamesTerm,
      lastNamesTerm: newLastNamesTerm,
      dateTerm: newDateTerm as any,
    });

    setIsDisabledSubmitButton(true);
    setIsFiltersSearchByTermDisabled(false);
    setDataForm(formData);
    form.reset();
    setIsDisabledSubmitButton(false);
  }

  return (
    <div className='animate-fadeInPage'>
      <PageTitle className='text-disciple-color'>Modulo Discípulo</PageTitle>

      <SearchTitle isUpdateSearch className='text-orange-500' titleName={'discípulos'} />

      <div
        className={cn(
          'px-4 md:-px-2 md:px-[2rem] xl:px-[3rem] py-4 md:py-7 w-full',
          searchType === DiscipleSearchType.BirthDate && 'h-[48rem] md:h-full'
        )}
      >
        {isFiltersSearchByTermDisabled && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='grid grid-cols-1 gap-y-2 md:gap-4 items-end mb-8 md:mb-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4 w-auto'
            >
              <FormField
                control={form.control}
                name='searchType'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className='text-[14px] font-bold'>Tipo</FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        ¿Qué tipo de búsqueda deseas hacer?
                      </FormDescription>
                      <Select
                        onOpenChange={() => {
                          form.resetField('dateTerm', {
                            keepError: true,
                          });
                          form.resetField('selectTerm', {
                            keepError: true,
                          });
                          form.resetField('inputTerm', {
                            keepError: true,
                          });
                          form.resetField('searchSubType', {
                            keepError: true,
                          });
                          form.resetField('firstNamesTerm', {
                            keepError: true,
                          });
                          form.resetField('lastNamesTerm', {
                            keepError: true,
                          });
                        }}
                        onValueChange={field.onChange}
                      >
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecciona un tipo' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(DiscipleSearchTypeNames)
                            .filter(
                              ([key]) =>
                                ![
                                  DiscipleSearchType.OriginCountry,
                                  DiscipleSearchType.ResidenceCountry,
                                  DiscipleSearchType.ResidenceDepartment,
                                  DiscipleSearchType.ResidenceProvince,
                                  DiscipleSearchType.ResidenceDistrict,
                                  DiscipleSearchType.ResidenceAddress,
                                ].includes(key as DiscipleSearchType)
                            )
                            .map(([key, value]) => (
                              <SelectItem
                                className={`text-[14px] md:text-[14px]`}
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

              {(searchType === DiscipleSearchType.FirstNames ||
                searchType === DiscipleSearchType.LastNames ||
                searchType === DiscipleSearchType.FullNames) && (
                <FormField
                  control={form.control}
                  name='searchSubType'
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className='text-[14px] font-bold'>Sub-tipo</FormLabel>
                        <FormDescription className='text-[13.5px] md:text-[14px]'>
                          ¿Qué sub tipo de búsqueda deseas hacer?
                        </FormDescription>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                          onOpenChange={() => {
                            form.resetField('firstNamesTerm', {
                              defaultValue: '',
                            });
                            form.resetField('lastNamesTerm', {
                              defaultValue: '',
                            });
                            form.resetField('dateTerm', {
                              keepError: true,
                            });
                            form.resetField('selectTerm', {
                              keepError: true,
                            });
                            form.resetField('inputTerm', {
                              keepError: true,
                            });
                          }}
                        >
                          <FormControl className='text-[14px] md:text-[14px]'>
                            <SelectTrigger>
                              {field.value ? (
                                <SelectValue placeholder='Selecciona un sub-tipo' />
                              ) : (
                                'Elige un sub-tipo'
                              )}
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(
                              searchType === DiscipleSearchType.FirstNames
                                ? SubTypeNamesDiscipleSearchByFirstNames
                                : searchType === DiscipleSearchType.LastNames
                                  ? SubTypeNamesDiscipleSearchByLastNames
                                  : SubTypeNamesDiscipleSearchByFullNames
                            ).map(([key, value]) => (
                              <SelectItem
                                className={cn(`text-[14px] md:text-[14px]`)}
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
              )}

              {(searchType === DiscipleSearchType.FamilyGroupCode ||
                searchType === DiscipleSearchType.FamilyGroupName ||
                searchType === DiscipleSearchType.OriginCountry ||
                searchType === DiscipleSearchType.ZoneName ||
                searchType === DiscipleSearchType.ResidenceCountry ||
                searchType === DiscipleSearchType.ResidenceDepartment ||
                searchType === DiscipleSearchType.ResidenceProvince ||
                searchType === DiscipleSearchType.ResidenceDistrict ||
                searchType === DiscipleSearchType.ResidenceUrbanSector ||
                searchType === DiscipleSearchType.ResidenceAddress) && (
                <FormField
                  control={form.control}
                  name='inputTerm'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[14px] font-bold'>
                        {searchType === DiscipleSearchType.OriginCountry
                          ? `País (origen)`
                          : searchType === DiscipleSearchType.ResidenceCountry
                            ? 'País (residencia)'
                            : searchType === DiscipleSearchType.ResidenceDepartment
                              ? 'Departamento (residencia)'
                              : searchType === DiscipleSearchType.ResidenceProvince
                                ? 'Provincia (residencia)'
                                : searchType === DiscipleSearchType.ResidenceDistrict
                                  ? 'Distrito (residencia)'
                                  : searchType === DiscipleSearchType.ResidenceUrbanSector
                                    ? 'Sector Urbano (residencia)'
                                    : searchType === DiscipleSearchType.ResidenceAddress
                                      ? 'Dirección (residencia)'
                                      : searchType === DiscipleSearchType.FamilyGroupCode
                                        ? 'Código de grupo familiar'
                                        : searchType === DiscipleSearchType.FamilyGroupName
                                          ? 'Nombre de grupo familiar'
                                          : 'Nombre de zona'}
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Escribe aquí lo que deseas buscar.
                      </FormDescription>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          className='text-[14px] md:text-[14px]'
                          placeholder={
                            searchType === DiscipleSearchType.OriginCountry
                              ? 'Ejem: Colombia , Mexico , Perú...'
                              : searchType === DiscipleSearchType.ResidenceCountry
                                ? 'Ejem: Perú ...'
                                : searchType === DiscipleSearchType.ResidenceDepartment
                                  ? 'Ejem: Lima, Ayacucho, Puno...'
                                  : searchType === DiscipleSearchType.ResidenceProvince
                                    ? 'Ejem: Huaraz, Lima, Huamanga...'
                                    : searchType === DiscipleSearchType.ResidenceDistrict
                                      ? 'Ejem: Independencia, Los Olivos, SJL...'
                                      : searchType === DiscipleSearchType.ResidenceUrbanSector
                                        ? 'Ejem: Payet, Tahuantinsuyo, La Pascana ...'
                                        : searchType === DiscipleSearchType.ResidenceAddress
                                          ? 'Ejem: Jr. Pardo 123 , Av.Central 555 , Mz. D Lt. 8 Nuevo Bosque...'
                                          : searchType === DiscipleSearchType.FamilyGroupCode
                                            ? 'Ejem: Jr. Levi-1 , Isacar-3 , Ruben-5..'
                                            : searchType === DiscipleSearchType.FamilyGroupName
                                              ? 'Nombre de grupo familiar'
                                              : 'Ejem: Isacar, Levi, Neftali...'
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  )}
                />
              )}

              {searchType === DiscipleSearchType.BirthDate && (
                <FormField
                  control={form.control}
                  name='dateTerm'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[14px] font-bold'>Fecha</FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Buscar por fecha o rango de fechas.
                      </FormDescription>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl className='text-[14px] md:text-[14px]'>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full text-left font-normal justify-center p-4 text-[14px]',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className='mr-[0.1rem] h-4 w-4' />
                              {field?.value?.from ? (
                                field?.value.to ? (
                                  <>
                                    {format(field?.value.from, 'LLL dd, y', {
                                      locale: es,
                                    })}{' '}
                                    -{' '}
                                    {format(field?.value.to, 'LLL dd, y', {
                                      locale: es,
                                    })}
                                  </>
                                ) : (
                                  format(field?.value.from, 'LLL dd, y')
                                )
                              ) : (
                                <span className='text-[14px] md:text-[14px]'>Elige una fecha</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            initialFocus
                            mode='range'
                            selected={field.value}
                            onSelect={field.onChange}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  )}
                />
              )}

              {(searchType === DiscipleSearchType.RecordStatus ||
                searchType === DiscipleSearchType.BirthMonth ||
                searchType === DiscipleSearchType.Gender ||
                searchType === DiscipleSearchType.MaritalStatus) && (
                <FormField
                  control={form.control}
                  name='selectTerm'
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className='text-[14px] font-bold'>
                          {searchType === DiscipleSearchType.Gender
                            ? `Género`
                            : searchType === DiscipleSearchType.BirthMonth
                              ? 'Mes de nacimiento'
                              : searchType === DiscipleSearchType.MaritalStatus
                                ? 'Estado civil'
                                : 'Estado de registro'}
                        </FormLabel>
                        <FormDescription className='text-[13.5px] md:text-[14px]'>
                          Selecciona una opción de búsqueda.
                        </FormDescription>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl className='text-[14px] md:text-[14px]'>
                            <SelectTrigger>
                              {field.value ? (
                                <SelectValue
                                  className='text-[14px] md:text-[14px]'
                                  placeholder='Elige una opción'
                                />
                              ) : (
                                'Elige una opción'
                              )}
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(
                              searchType === DiscipleSearchType.Gender
                                ? DiscipleSearchNamesByGender
                                : searchType === DiscipleSearchType.BirthMonth
                                  ? DiscipleSearchNamesByBirthMonth
                                  : searchType === DiscipleSearchType.MaritalStatus
                                    ? DiscipleSearchNamesByMaritalStatus
                                    : DiscipleSearchNamesByRecordStatus
                            ).map(([key, value]) => (
                              <SelectItem
                                className={cn(`text-[14px] md:text-[14px]`)}
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
              )}

              {(searchType === DiscipleSearchType.FirstNames ||
                searchType === DiscipleSearchType.FullNames) && (
                <FormField
                  control={form.control}
                  name='firstNamesTerm'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[14px] font-bold'>Nombres</FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Escribe los nombres que deseas buscar.
                      </FormDescription>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          className='text-[14px] md:text-[14px]'
                          placeholder='Ejem: Rolando Martin...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  )}
                />
              )}

              {(searchType === DiscipleSearchType.LastNames ||
                searchType === DiscipleSearchType.FullNames) && (
                <FormField
                  control={form.control}
                  name='lastNamesTerm'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[14px] font-bold'>Apellidos</FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Escribe los apellidos que deseas buscar.
                      </FormDescription>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          className='text-[14px] md:text-[14px]'
                          placeholder='Ejem: Sanchez Torres...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  )}
                />
              )}

              <div className='grid grid-cols-2 items-end justify-evenly'>
                <div className='flex flex-col gap-2 col-start-1 col-end-3 pb-2'>
                  <FormField
                    control={form.control}
                    name='limit'
                    render={() => (
                      <FormItem>
                        <FormLabel className='text-[14px] font-bold'>Limite</FormLabel>
                        <FormDescription className='text-[13.5px] md:text-[14px]'>
                          ¿Cuantos registros necesitas?
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex gap-4 col-start-1 col-end-3 justify-between sm:justify-normal md:justify-start'>
                  <FormField
                    control={form.control}
                    name='limit'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Input
                            {...field}
                            disabled={form.getValues('all')}
                            className='text-[14px] md:text-[14px]'
                            value={form.getValues('all') ? '-' : (field.value ?? '')}
                            placeholder='Limite de registros'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='all'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-end space-x-2 space-y-0 rounded-md border p-3 h-[2.5rem] w-[8rem] justify-center'>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Checkbox
                            disabled={!form.getValues('limit') || !!form.formState.errors.limit} // transform to boolean
                            checked={field?.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                            }}
                            className={
                              form.getValues('limit') && !form.formState.errors.limit
                                ? ''
                                : 'bg-slate-500'
                            }
                          />
                        </FormControl>
                        <div className='space-y-1 leading-none'>
                          <FormLabel className='text-[13.5px] md:text-[14px] cursor-pointer'>
                            Todos
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div
                  className={cn(
                    'flex flex-col gap-2 col-start-1 col-end-3',
                    form.formState.errors.limit && 'mt-2'
                  )}
                >
                  <FormField
                    control={form.control}
                    name='limit'
                    render={() => (
                      <FormItem>
                        <FormMessage className='text-[13px]' />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name='order'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='text-[14px] font-bold'>Orden</FormLabel>
                    <FormDescription className='text-[13.5px] md:text-[14px]'>
                      Elige el tipo de orden de los registros.
                    </FormDescription>
                    <Select
                      onOpenChange={() => {}}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl className='text-[14px]'>
                        <SelectTrigger>
                          {field.value ? (
                            <SelectValue
                              className='text-[14px] md:text-[14px]'
                              placeholder='Selecciona un tipo de orden'
                            />
                          ) : (
                            'Selecciona un tipo de orden'
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(RecordOrderNames).map(([key, value]) => (
                          <SelectItem
                            className={`text-[14px] md:text-[14px]`}
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
                )}
              />

              <FormField
                control={form.control}
                name='churchId'
                render={({ field }) => {
                  return (
                    <FormItem className='w-full'>
                      <FormLabel className='text-[14px] font-bold'>
                        Iglesia
                        <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                          Opcional
                        </span>
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Selecciona una iglesia para la búsqueda.
                      </FormDescription>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || churchesQuery?.data?.[0]?.id}
                        value={field.value}
                      >
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue
                                className='text-[14px] md:text-[14px]'
                                placeholder='Elige una opción'
                              />
                            ) : (
                              'Elige una opción'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {churchesQuery?.data?.map((church) => (
                            <SelectItem
                              className={`text-[14px] md:text-[14px]`}
                              key={church.id}
                              value={church.id}
                            >
                              {church.abbreviatedChurchName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  );
                }}
              />

              <div
                className={cn(
                  'w-full mt-2 md:mt-0 md:col-span-2 lg:col-span-3 xl:col-span-2',
                  !searchType && 'md:col-span-2 lg:col-span-2 xl:col-span-4',
                  searchType === DiscipleSearchType.FullNames &&
                    'md:col-span-1 lg:col-span-2 xl:col-span-1',
                  searchType !== DiscipleSearchType.FirstNames &&
                    searchType !== DiscipleSearchType.LastNames &&
                    searchType !== DiscipleSearchType.FullNames &&
                    searchType &&
                    'md:col-span-1 lg:col-span-1 xl:col-span-3'
                )}
              >
                <Toaster position='top-center' richColors />
                <Button
                  disabled={isDisabledSubmitButton}
                  type='submit'
                  variant='ghost'
                  className='mx-auto w-full text-[14px] h-[2.5rem] 2xl:mx-auto px-4 py-2 border-1 border-green-500 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white hover:text-green-100 hover:from-green-500 hover:via-green-600 hover:to-green-700 dark:from-green-600 dark:via-green-700 dark:to-green-800 dark:text-gray-100 dark:hover:text-gray-200 dark:hover:from-green-700 dark:hover:via-green-800 dark:hover:to-green-900'
                >
                  Buscar
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* Table */}
        <div className='w-full'>
          {
            <SearchByTermDiscipleDataTable
              columns={columns}
              data={dataFictional}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              dataForm={dataForm}
            />
          }
        </div>
      </div>
    </div>
  );
};

export default DiscipleUpdatePage;
