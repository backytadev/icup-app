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

import { useSupervisorStore } from '@/stores/supervisor/supervisor.store';

import { getSimpleChurches } from '@/modules/church/services/church.service';

import { SearchByTermSupervisorDataTable } from '@/modules/supervisor/components/data-tables/boards/search-by-term-supervisor-data-table';
import { supervisorInactivateColumns as columns } from '@/modules/supervisor/components/data-tables/columns/supervisor-inactivate-columns';

import { type SupervisorResponse } from '@/modules/supervisor/interfaces/supervisor-response.interface';
import { type SupervisorSearchFormByTerm } from '@/modules/supervisor/interfaces/supervisor-form-search-by-term.interface';

import { supervisorSearchByTermFormSchema } from '@/modules/supervisor/validations/supervisor-search-by-term-form-schema';

import { cn } from '@/shared/lib/utils';

import {
  SupervisorSearchType,
  SupervisorSearchTypeNames,
} from '@/modules/supervisor/enums/supervisor-search-type.enum';
import {
  SubTypeNamesSupervisorSearchByFullNames,
  SubTypeNamesSupervisorSearchByLastNames,
  SubTypeNamesSupervisorSearchByFirstNames,
} from '@/modules/supervisor/enums/supervisor-search-sub-type.num';
import {
  SupervisorSearchNamesByGender,
  SupervisorSearchNamesByBirthMonth,
  SupervisorSearchNamesByRecordStatus,
  SupervisorSearchNamesByMaritalStatus,
} from '@/modules/supervisor/enums/supervisor-search-select-option.enum';

import { PageTitle } from '@/shared/components/page/PageTitle';
import { SearchTitle } from '@/shared/components/page/SearchTitle';

import { RecordOrder, RecordOrderNames } from '@/shared/enums/record-order.enum';

import { lastNamesFormatter, firstNamesFormatter } from '@/shared/helpers/names-formatter.helper';
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

const dataFictional: SupervisorResponse[] = [
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
      roles: [],
      ministries: [],
    },
    relationType: '',
    recordStatus: '',
    theirPastor: null,
    theirCopastor: null,
  },
];

export const SupervisorInactivatePage = (): JSX.Element => {
  //* States
  const [dataForm, setDataForm] = useState<SupervisorSearchFormByTerm>();
  const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useState<SupervisorSearchFormByTerm | undefined>();

  const isFiltersSearchByTermDisabled = useSupervisorStore(
    (state) => state.isFiltersSearchByTermDisabled
  );
  const setIsFiltersSearchByTermDisabled = useSupervisorStore(
    (state) => state.setIsFiltersSearchByTermDisabled
  );

  //* Forms
  const form = useForm<z.infer<typeof supervisorSearchByTermFormSchema>>({
    resolver: zodResolver(supervisorSearchByTermFormSchema),
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
    document.title = 'Modulo Supervisor - IcupApp';
  }, []);

  useEffect(() => {
    if (churchesQuery.data?.length) {
      form.setValue('churchId', churchesQuery.data[0].id);
    }
  }, [churchesQuery.data, searchParams]);

  //* Form handler
  function onSubmit(formData: z.infer<typeof supervisorSearchByTermFormSchema>): void {
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
      <PageTitle className='text-supervisor-color'>Modulo Supervisor</PageTitle>

      <SearchTitle
        isInactivateSearch
        className='-ml-2.5 sm:mt-0 text-red-500 w-[15.5rem] sm:w-auto whitespace-nowrap'
        titleName={'supervisores'}
      />

      <div
        className={cn(
          'px-4 md:-px-2 md:px-[2rem] xl:px-[3rem] py-4 md:py-7 w-full',
          searchType === SupervisorSearchType.BirthDate && 'h-[48rem] md:h-full'
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
                          {Object.entries(SupervisorSearchTypeNames).map(
                            ([key, value]) =>
                              key !== SupervisorSearchType.RecordStatus && (
                                <SelectItem
                                  className={`text-[14px] md:text-[14px]`}
                                  key={key}
                                  value={key}
                                >
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

              {(searchType === SupervisorSearchType.FirstNames ||
                searchType === SupervisorSearchType.LastNames ||
                searchType === SupervisorSearchType.FullNames) && (
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
                              searchType === SupervisorSearchType.FirstNames
                                ? SubTypeNamesSupervisorSearchByFirstNames
                                : searchType === SupervisorSearchType.LastNames
                                  ? SubTypeNamesSupervisorSearchByLastNames
                                  : SubTypeNamesSupervisorSearchByFullNames
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

              {(searchType === SupervisorSearchType.OriginCountry ||
                searchType === SupervisorSearchType.ZoneName ||
                searchType === SupervisorSearchType.ResidenceCountry ||
                searchType === SupervisorSearchType.ResidenceDepartment ||
                searchType === SupervisorSearchType.ResidenceProvince ||
                searchType === SupervisorSearchType.ResidenceDistrict ||
                searchType === SupervisorSearchType.ResidenceUrbanSector ||
                searchType === SupervisorSearchType.ResidenceAddress) && (
                <FormField
                  control={form.control}
                  name='inputTerm'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[14px] font-bold'>
                        {searchType === SupervisorSearchType.OriginCountry
                          ? `País (origen)`
                          : searchType === SupervisorSearchType.ResidenceCountry
                            ? 'País (residencia)'
                            : searchType === SupervisorSearchType.ResidenceDepartment
                              ? 'Departamento (residencia)'
                              : searchType === SupervisorSearchType.ResidenceProvince
                                ? 'Provincia (residencia)'
                                : searchType === SupervisorSearchType.ResidenceDistrict
                                  ? 'Distrito (residencia)'
                                  : searchType === SupervisorSearchType.ResidenceUrbanSector
                                    ? 'Sector Urbano (residencia)'
                                    : searchType === SupervisorSearchType.ResidenceAddress
                                      ? 'Dirección (residencia)'
                                      : 'Nombre de zona'}
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Escribe aquí lo que deseas buscar.
                      </FormDescription>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          className='text-[14px] md:text-[14px]'
                          placeholder={
                            searchType === SupervisorSearchType.OriginCountry
                              ? 'Ejem: Colombia , Mexico , Perú...'
                              : searchType === SupervisorSearchType.ResidenceCountry
                                ? 'Ejem: Perú ...'
                                : searchType === SupervisorSearchType.ResidenceDepartment
                                  ? 'Ejem: Lima, Ayacucho, Puno...'
                                  : searchType === SupervisorSearchType.ResidenceProvince
                                    ? 'Ejem: Huaraz, Lima, Huamanga...'
                                    : searchType === SupervisorSearchType.ResidenceDistrict
                                      ? 'Ejem: Independencia, Los Olivos, SJL...'
                                      : searchType === SupervisorSearchType.ResidenceUrbanSector
                                        ? 'Ejem: Payet, Tahuantinsuyo, La Pascana ...'
                                        : searchType === SupervisorSearchType.ResidenceAddress
                                          ? 'Ejem: Jr. Pardo 123 , Av.Central 555 , Mz. D Lt. 8 Nuevo Bosque...'
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

              {searchType === SupervisorSearchType.BirthDate && (
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

              {(searchType === SupervisorSearchType.RecordStatus ||
                searchType === SupervisorSearchType.BirthMonth ||
                searchType === SupervisorSearchType.Gender ||
                searchType === SupervisorSearchType.MaritalStatus) && (
                <FormField
                  control={form.control}
                  name='selectTerm'
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className='text-[14px] font-bold'>
                          {searchType === SupervisorSearchType.Gender
                            ? `Género`
                            : searchType === SupervisorSearchType.BirthMonth
                              ? 'Mes de nacimiento'
                              : searchType === SupervisorSearchType.MaritalStatus
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
                              searchType === SupervisorSearchType.Gender
                                ? SupervisorSearchNamesByGender
                                : searchType === SupervisorSearchType.BirthMonth
                                  ? SupervisorSearchNamesByBirthMonth
                                  : searchType === SupervisorSearchType.MaritalStatus
                                    ? SupervisorSearchNamesByMaritalStatus
                                    : SupervisorSearchNamesByRecordStatus
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

              {(searchType === SupervisorSearchType.FirstNames ||
                searchType === SupervisorSearchType.FullNames) && (
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

              {(searchType === SupervisorSearchType.LastNames ||
                searchType === SupervisorSearchType.FullNames) && (
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
                  searchType === SupervisorSearchType.FullNames &&
                    'md:col-span-1 lg:col-span-2 xl:col-span-1',
                  searchType !== SupervisorSearchType.FirstNames &&
                    searchType !== SupervisorSearchType.LastNames &&
                    searchType !== SupervisorSearchType.FullNames &&
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
            <SearchByTermSupervisorDataTable
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

export default SupervisorInactivatePage;
