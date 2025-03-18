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

import { usePastorStore } from '@/stores/pastor/pastor.store';

import { getSimpleChurches } from '@/modules/church/services/church.service';

import {
  PastorSearchType,
  PastorSearchTypeNames,
} from '@/modules/pastor/enums/pastor-search-type.enum';
import {
  PastorSearchNamesByGender,
  PastorSearchNamesByBirthMonth,
  PastorSearchNamesByRecordStatus,
  PastorSearchNamesByMaritalStatus,
} from '@/modules/pastor/enums/pastor-search-select-option.enum';

import { SearchByTermPastorDataTable } from '@/modules/pastor/components/data-tables/boards/search-by-term-pastor-data-table';
import { pastorInactivateColumns as columns } from '@/modules/pastor/components/data-tables/columns/pastor-inactivate-columns';

import { pastorSearchByTermFormSchema } from '@/modules/pastor/validations/pastor-search-by-term-form-schema';

import { type PastorResponse } from '@/modules/pastor/interfaces/pastor-response.interface';
import { type PastorSearchFormByTerm } from '@/modules/pastor/interfaces/pastor-search-form-by-term.interface';

import { cn } from '@/shared/lib/utils';

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

const dataFictional: PastorResponse[] = [
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
    },
    recordStatus: '',
    theirChurch: null,
  },
];

export const PastorInactivatePage = (): JSX.Element => {
  //* States
  const [dataForm, setDataForm] = useState<PastorSearchFormByTerm>();
  const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useState<PastorSearchFormByTerm | undefined>();

  const isFiltersSearchByTermDisabled = usePastorStore(
    (state) => state.isFiltersSearchByTermDisabled
  );
  const setIsFiltersSearchByTermDisabled = usePastorStore(
    (state) => state.setIsFiltersSearchByTermDisabled
  );

  //* Forms
  const form = useForm<z.infer<typeof pastorSearchByTermFormSchema>>({
    resolver: zodResolver(pastorSearchByTermFormSchema),
    mode: 'onChange',
    defaultValues: {
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
    document.title = 'Modulo Pastor - IcupApp';
  }, []);

  useEffect(() => {
    if (churchesQuery.data?.length) {
      form.setValue('churchId', churchesQuery.data[0].id);
    }
  }, [churchesQuery.data, searchParams]);

  //* Form handler
  function onSubmit(formData: z.infer<typeof pastorSearchByTermFormSchema>): void {
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
      <PageTitle className='text-pastor-color'>Modulo Pastor</PageTitle>

      <SearchTitle className='text-red-500' isInactivateSearch titleName={'pastores'} />

      <div
        className={cn(
          'px-4 md:-px-2 md:px-[2rem] xl:px-[3rem] py-4 md:py-7 w-full',
          searchType === PastorSearchType.BirthDate && 'h-[48rem] md:h-full'
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
                          {Object.entries(PastorSearchTypeNames).map(
                            ([key, value]) =>
                              key !== PastorSearchType.RecordStatus && (
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

              {(searchType === PastorSearchType.OriginCountry ||
                searchType === PastorSearchType.ResidenceCountry ||
                searchType === PastorSearchType.ResidenceDepartment ||
                searchType === PastorSearchType.ResidenceProvince ||
                searchType === PastorSearchType.ResidenceDistrict ||
                searchType === PastorSearchType.ResidenceUrbanSector ||
                searchType === PastorSearchType.ResidenceAddress) && (
                <FormField
                  control={form.control}
                  name='inputTerm'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[14px] font-bold'>
                        {searchType === PastorSearchType.OriginCountry
                          ? `País (origen)`
                          : searchType === PastorSearchType.ResidenceCountry
                            ? 'País (residencia)'
                            : searchType === PastorSearchType.ResidenceDepartment
                              ? 'Departamento (residencia)'
                              : searchType === PastorSearchType.ResidenceProvince
                                ? 'Provincia (residencia)'
                                : searchType === PastorSearchType.ResidenceDistrict
                                  ? 'Distrito (residencia)'
                                  : searchType === PastorSearchType.ResidenceUrbanSector
                                    ? 'Sector Urbano (residencia)'
                                    : 'Dirección (residencia)'}
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Escribe aquí lo que deseas buscar.
                      </FormDescription>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          className='text-[14px] md:text-[14px]'
                          placeholder={
                            searchType === PastorSearchType.OriginCountry
                              ? 'Ejem: Colombia , Mexico , Perú...'
                              : searchType === PastorSearchType.ResidenceCountry
                                ? 'Ejem: Perú ...'
                                : searchType === PastorSearchType.ResidenceDepartment
                                  ? 'Ejem: Lima, Ayacucho, Puno...'
                                  : searchType === PastorSearchType.ResidenceProvince
                                    ? 'Ejem: Huaraz, Lima, Huamanga...'
                                    : searchType === PastorSearchType.ResidenceDistrict
                                      ? 'Ejem: Independencia, Los Olivos, SJL...'
                                      : searchType === PastorSearchType.ResidenceUrbanSector
                                        ? 'Ejem: Payet, Tahuantinsuyo, La Pascana ...'
                                        : 'Ejem: Jr. Pardo 123 , Av.Central 555 , Mz. D Lt. 8 Nuevo Bosque...'
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  )}
                />
              )}

              {searchType === PastorSearchType.BirthDate && (
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

              {(searchType === PastorSearchType.RecordStatus ||
                searchType === PastorSearchType.BirthMonth ||
                searchType === PastorSearchType.Gender ||
                searchType === PastorSearchType.MaritalStatus) && (
                <FormField
                  control={form.control}
                  name='selectTerm'
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className='text-[14px] font-bold'>
                          {searchType === PastorSearchType.Gender
                            ? `Género`
                            : searchType === PastorSearchType.BirthMonth
                              ? 'Mes de nacimiento'
                              : searchType === PastorSearchType.MaritalStatus
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
                              searchType === PastorSearchType.Gender
                                ? PastorSearchNamesByGender
                                : searchType === PastorSearchType.BirthMonth
                                  ? PastorSearchNamesByBirthMonth
                                  : searchType === PastorSearchType.MaritalStatus
                                    ? PastorSearchNamesByMaritalStatus
                                    : PastorSearchNamesByRecordStatus
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

              {(searchType === PastorSearchType.FirstNames ||
                searchType === PastorSearchType.FullNames) && (
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

              {(searchType === PastorSearchType.LastNames ||
                searchType === PastorSearchType.FullNames) && (
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
                <div className='flex gap-4 col-start-1 col-end-3 justify-between sm:justify-normal  md:justify-start'>
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
                  'w-full mt-2 md:mt-0 md:col-span-1 lg:col-span-1 xl:col-span-3',
                  !searchType && 'md:col-span-2 lg:col-span-2 xl:col-span-4',
                  searchType === PastorSearchType.FullNames &&
                    'md:col-span-3 lg:col-span-3 xl:col-span-2'
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
            <SearchByTermPastorDataTable
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

export default PastorInactivatePage;
