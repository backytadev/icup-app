/* eslint-disable @typescript-eslint/no-unsafe-argument */
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

import { useOfferingIncomeStore } from '@/stores/offering-income/offering-income.store';

import { getSimpleChurches } from '@/modules/church/services/church.service';

import {
  OfferingIncomeSearchSubType,
  SubTypeNamesOfferingIncomeSearchByActivities,
  SubTypeNamesOfferingIncomeSearchByFamilyGroup,
  // SubTypeNamesOfferingIncomeSearchByYoungService,
  // SubTypeNamesOfferingIncomeSearchBySundaySchool,
  SubTypeNamesOfferingIncomeSearchBySundayService,
  SubTypeNamesOfferingIncomeSearchByUnitedService,
  SubTypeNamesOfferingIncomeSearchByIncomeAdjustment,
  SubTypeNamesOfferingIncomeSearchByFastingAndVigilZonalAndZonalEvangelism,
  SubTypeNamesOfferingIncomeSearchByFastingAndVigilGeneralAndGeneralEvangelism,
  SubTypeNamesOfferingIncomeSearchByChurchGroundAndSpecial,
} from '@/modules/offering/income/enums/offering-income-search-sub-type.enum';
import {
  OfferingIncomeSearchType,
  OfferingIncomeSearchTypeNames,
} from '@/modules/offering/income/enums/offering-income-search-type.enum';
import {
  OfferingIncomeSearchNamesByShift,
  OfferingIncomeSearchNamesByMemberType,
  OfferingIncomeSearchNamesByRecordStatus,
} from '@/modules/offering/income/enums/offering-income-search-select-option.enum';

import { offeringIncomeInfoColumns as columns } from '@/modules/offering/income/components/data-tables/columns/offering-income-info-columns';
import { SearchByTermOfferingIncomeDataTable } from '@/modules/offering/income/components/data-tables/boards/search-by-term-offering-income-data-table';

import { type OfferingIncomeResponse } from '@/modules/offering/income/interfaces/offering-income-response.interface';
import { type OfferingIncomeSearchFormByTerm } from '@/modules/offering/income/interfaces/offering-income-search-form-by-term.interface';

import { offeringIncomeSearchByTermFormSchema } from '@/modules/offering/income/validations/offering-income-search-by-term-form-schema';

import { cn } from '@/shared/lib/utils';

import { PageTitle } from '@/shared/components/page/PageTitle';
import { SearchTitle } from '@/shared/components/page/SearchTitle';
import { RecordOrder, RecordOrderNames } from '@/shared/enums/record-order.enum';

import { dateFormatterTermToTimestamp } from '@/shared/helpers/date-formatter-to-timestamp.helper';
import { firstNamesFormatter, lastNamesFormatter } from '@/shared/helpers/names-formatter.helper';

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

const dataFictional: OfferingIncomeResponse[] = [
  {
    id: '',
    type: '',
    subType: '',
    category: '',
    amount: '',
    currency: '',
    shift: '',
    date: new Date('2024-05-21'),
    comments: '',
    imageUrls: [],
    recordStatus: '',
    memberType: '',
    familyGroup: null,
    zone: null,
    disciple: null,
    preacher: null,
    supervisor: null,
    copastor: null,
    pastor: null,
    church: null,
  },
];

export const OfferingsIncomeSearchPageByTerm = (): JSX.Element => {
  //* States
  const [dataForm, setDataForm] = useState<OfferingIncomeSearchFormByTerm>();
  const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useState<OfferingIncomeSearchFormByTerm | undefined>();

  const isFiltersSearchByTermDisabled = useOfferingIncomeStore(
    (state) => state.isFiltersSearchByTermDisabled
  );
  const setIsFiltersSearchByTermDisabled = useOfferingIncomeStore(
    (state) => state.setIsFiltersSearchByTermDisabled
  );

  //* Forms
  const form = useForm<z.infer<typeof offeringIncomeSearchByTermFormSchema>>({
    resolver: zodResolver(offeringIncomeSearchByTermFormSchema),
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
  const { searchType, searchSubType, limit, order, all } = form.watch();

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
    document.title = 'Modulo Ofrenda - IcupApp';
  }, []);

  useEffect(() => {
    if (churchesQuery.data?.length) {
      form.setValue('churchId', churchesQuery.data[0].id);
    }
  }, [churchesQuery.data, searchParams]);

  //* Form handler
  function onSubmit(formData: z.infer<typeof offeringIncomeSearchByTermFormSchema>): void {
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
      <PageTitle className='text-green-600'>Modulo de Ingreso</PageTitle>

      <SearchTitle
        className='w-[14rem] sm:w-auto leading-8 sm:leading-10'
        isByTypeSearch
        titleName={'ingresos'}
      />

      <div className='px-4 md:-px-2 md:px-[2rem] xl:px-[3rem] py-4 md:py-7 w-full'>
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
                        }}
                        onValueChange={field.onChange}
                      >
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecciona un tipo' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(OfferingIncomeSearchTypeNames).map(([key, value]) => (
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

              {(searchType === OfferingIncomeSearchType.Activities ||
                searchType === OfferingIncomeSearchType.ChurchGround ||
                searchType === OfferingIncomeSearchType.FamilyGroup ||
                searchType === OfferingIncomeSearchType.GeneralFasting ||
                searchType === OfferingIncomeSearchType.GeneralVigil ||
                searchType === OfferingIncomeSearchType.GeneralEvangelism ||
                searchType === OfferingIncomeSearchType.IncomeAdjustment ||
                searchType === OfferingIncomeSearchType.Special ||
                // searchType === OfferingIncomeSearchType.SundaySchool ||
                searchType === OfferingIncomeSearchType.SundayService ||
                searchType === OfferingIncomeSearchType.UnitedService ||
                // searchType === OfferingIncomeSearchType.YouthService ||
                searchType === OfferingIncomeSearchType.ZonalFasting ||
                searchType === OfferingIncomeSearchType.ZonalVigil ||
                searchType === OfferingIncomeSearchType.ZonalEvangelism) && (
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
                              searchType === OfferingIncomeSearchType.SundayService
                                ? SubTypeNamesOfferingIncomeSearchBySundayService
                                : // : searchType === OfferingIncomeSearchType.SundaySchool
                                  //   ? SubTypeNamesOfferingIncomeSearchBySundaySchool
                                  searchType === OfferingIncomeSearchType.FamilyGroup
                                  ? SubTypeNamesOfferingIncomeSearchByFamilyGroup
                                  : searchType === OfferingIncomeSearchType.ZonalVigil ||
                                      searchType === OfferingIncomeSearchType.ZonalFasting ||
                                      searchType === OfferingIncomeSearchType.ZonalEvangelism
                                    ? SubTypeNamesOfferingIncomeSearchByFastingAndVigilZonalAndZonalEvangelism
                                    : searchType === OfferingIncomeSearchType.GeneralFasting ||
                                        searchType === OfferingIncomeSearchType.GeneralVigil ||
                                        searchType === OfferingIncomeSearchType.GeneralEvangelism
                                      ? SubTypeNamesOfferingIncomeSearchByFastingAndVigilGeneralAndGeneralEvangelism
                                      : // : searchType === OfferingIncomeSearchType.YouthService
                                        //   ? SubTypeNamesOfferingIncomeSearchByYoungService
                                        searchType === OfferingIncomeSearchType.UnitedService
                                        ? SubTypeNamesOfferingIncomeSearchByUnitedService
                                        : searchType === OfferingIncomeSearchType.Activities
                                          ? SubTypeNamesOfferingIncomeSearchByActivities
                                          : searchType === OfferingIncomeSearchType.Special ||
                                              searchType === OfferingIncomeSearchType.ChurchGround
                                            ? SubTypeNamesOfferingIncomeSearchByChurchGroundAndSpecial
                                            : SubTypeNamesOfferingIncomeSearchByIncomeAdjustment
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

              {(searchType === OfferingIncomeSearchType.FamilyGroup ||
                searchType === OfferingIncomeSearchType.ZonalFasting ||
                searchType === OfferingIncomeSearchType.ZonalVigil ||
                searchType === OfferingIncomeSearchType.ZonalEvangelism) &&
                (searchSubType === OfferingIncomeSearchSubType.OfferingByGroupCode ||
                  searchSubType === OfferingIncomeSearchSubType.OfferingByGroupCodeDate ||
                  searchSubType === OfferingIncomeSearchSubType.OfferingByZone ||
                  searchSubType === OfferingIncomeSearchSubType.OfferingByZoneDate) && (
                  <FormField
                    control={form.control}
                    name='inputTerm'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[14px] font-bold'>
                          {searchSubType === OfferingIncomeSearchSubType.OfferingByGroupCode ||
                          searchSubType === OfferingIncomeSearchSubType.OfferingByGroupCodeDate
                            ? 'Código de grupo familiar'
                            : searchSubType === OfferingIncomeSearchSubType.OfferingByZone ||
                                searchSubType === OfferingIncomeSearchSubType.OfferingByZoneDate
                              ? 'Zona'
                              : ''}
                        </FormLabel>
                        <FormDescription className='text-[13.5px] md:text-[14px]'>
                          Escribe aquí lo que deseas buscar.
                        </FormDescription>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Input
                            className='text-[14px] md:text-[14px]'
                            placeholder='Ejem: C-2, Av.Central 123, Lima ....'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-[13px]' />
                      </FormItem>
                    )}
                  />
                )}

              {(searchType === OfferingIncomeSearchType.Activities ||
                searchType === OfferingIncomeSearchType.ChurchGround ||
                searchType === OfferingIncomeSearchType.FamilyGroup ||
                searchType === OfferingIncomeSearchType.GeneralFasting ||
                searchType === OfferingIncomeSearchType.GeneralVigil ||
                searchType === OfferingIncomeSearchType.GeneralEvangelism ||
                searchType === OfferingIncomeSearchType.IncomeAdjustment ||
                searchType === OfferingIncomeSearchType.Special ||
                // searchType === OfferingIncomeSearchType.SundaySchool ||
                searchType === OfferingIncomeSearchType.SundayService ||
                searchType === OfferingIncomeSearchType.UnitedService ||
                // searchType === OfferingIncomeSearchType.YouthService ||
                searchType === OfferingIncomeSearchType.ZonalFasting ||
                searchType === OfferingIncomeSearchType.ZonalVigil ||
                searchType === OfferingIncomeSearchType.ZonalEvangelism) &&
                (searchSubType === OfferingIncomeSearchSubType.OfferingByDate ||
                  searchSubType === OfferingIncomeSearchSubType.OfferingByGroupCodeDate ||
                  searchSubType === OfferingIncomeSearchSubType.OfferingByShiftDate ||
                  searchSubType === OfferingIncomeSearchSubType.OfferingByZoneDate) && (
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
                                  <span className='text-[14px] md:text-[14px]'>
                                    Elige una fecha
                                  </span>
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

              {(searchType === OfferingIncomeSearchType.RecordStatus || // searchType === OfferingIncomeSearchType.SundaySchool ||
                ((searchType === OfferingIncomeSearchType.SundayService ||
                  searchType === OfferingIncomeSearchType.GeneralFasting ||
                  searchType === OfferingIncomeSearchType.GeneralVigil ||
                  searchType === OfferingIncomeSearchType.GeneralEvangelism ||
                  searchType === OfferingIncomeSearchType.Activities ||
                  searchType === OfferingIncomeSearchType.UnitedService ||
                  // searchType === OfferingIncomeSearchType.YouthService ||
                  searchType === OfferingIncomeSearchType.IncomeAdjustment ||
                  searchType === OfferingIncomeSearchType.Special ||
                  searchType === OfferingIncomeSearchType.ChurchGround) &&
                  (searchSubType === OfferingIncomeSearchSubType.OfferingByShift ||
                    searchSubType === OfferingIncomeSearchSubType.OfferingByShiftDate ||
                    searchSubType === OfferingIncomeSearchSubType.OfferingByContributorFirstNames ||
                    searchSubType === OfferingIncomeSearchSubType.OfferingByContributorLastNames ||
                    searchSubType ===
                      OfferingIncomeSearchSubType.OfferingByContributorFullNames))) && (
                <FormField
                  control={form.control}
                  name='selectTerm'
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className='text-[14px] font-bold'>
                          {searchSubType === OfferingIncomeSearchSubType.OfferingByShift ||
                          searchSubType === OfferingIncomeSearchSubType.OfferingByShiftDate
                            ? `Turno`
                            : searchType === OfferingIncomeSearchType.RecordStatus
                              ? 'Estado de registro'
                              : 'Tipo de miembro'}
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
                              searchType === OfferingIncomeSearchType.RecordStatus
                                ? OfferingIncomeSearchNamesByRecordStatus
                                : searchSubType === OfferingIncomeSearchSubType.OfferingByShift ||
                                    searchSubType ===
                                      OfferingIncomeSearchSubType.OfferingByShiftDate
                                  ? OfferingIncomeSearchNamesByShift
                                  : OfferingIncomeSearchNamesByMemberType
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

              {(searchType === OfferingIncomeSearchType.ChurchGround ||
                searchType === OfferingIncomeSearchType.FamilyGroup ||
                searchType === OfferingIncomeSearchType.Special ||
                searchType === OfferingIncomeSearchType.ZonalFasting ||
                searchType === OfferingIncomeSearchType.ZonalVigil ||
                searchType === OfferingIncomeSearchType.ZonalEvangelism) &&
                // searchType === OfferingIncomeSearchType.YouthService ||
                // searchType === OfferingIncomeSearchType.SundaySchool
                (searchSubType === OfferingIncomeSearchSubType.OfferingByContributorFirstNames ||
                  searchSubType === OfferingIncomeSearchSubType.OfferingByContributorFullNames ||
                  searchSubType === OfferingIncomeSearchSubType.OfferingByPreacherFirstNames ||
                  searchSubType === OfferingIncomeSearchSubType.OfferingByPreacherFullNames ||
                  searchSubType === OfferingIncomeSearchSubType.OfferingBySupervisorFirstNames ||
                  searchSubType === OfferingIncomeSearchSubType.OfferingBySupervisorFullNames) && (
                  <FormField
                    control={form.control}
                    name='firstNamesTerm'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[14px] font-bold'>Nombres</FormLabel>
                        {searchType === OfferingIncomeSearchType.Special ||
                          (searchType === OfferingIncomeSearchType.ChurchGround && (
                            <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                              Opcional
                            </span>
                          ))}
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

              {(searchType === OfferingIncomeSearchType.ChurchGround ||
                searchType === OfferingIncomeSearchType.FamilyGroup ||
                searchType === OfferingIncomeSearchType.Special ||
                searchType === OfferingIncomeSearchType.ZonalFasting ||
                searchType === OfferingIncomeSearchType.ZonalVigil ||
                searchType === OfferingIncomeSearchType.ZonalEvangelism) &&
                // searchType === OfferingIncomeSearchType.YouthService ||
                // searchType === OfferingIncomeSearchType.SundaySchool
                (searchSubType === OfferingIncomeSearchSubType.OfferingByContributorLastNames ||
                  searchSubType === OfferingIncomeSearchSubType.OfferingByContributorFullNames ||
                  searchSubType === OfferingIncomeSearchSubType.OfferingByPreacherLastNames ||
                  searchSubType === OfferingIncomeSearchSubType.OfferingByPreacherFullNames ||
                  searchSubType === OfferingIncomeSearchSubType.OfferingBySupervisorLastNames ||
                  searchSubType === OfferingIncomeSearchSubType.OfferingBySupervisorFullNames) && (
                  <FormField
                    control={form.control}
                    name='lastNamesTerm'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[14px] font-bold'>Apellidos</FormLabel>
                        {searchType === OfferingIncomeSearchType.Special ||
                          (searchType === OfferingIncomeSearchType.ChurchGround && (
                            <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[1px] rounded-full mr-1'>
                              Opcional
                            </span>
                          ))}
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
                  !searchType && !searchSubType && 'md:col-span-2 lg:col-span-2 xl:col-span-4',
                  searchType && !searchSubType && 'md:col-span-1 lg:col-span-1 xl:col-span-3',
                  (searchSubType === OfferingIncomeSearchSubType.OfferingByContributorFirstNames ||
                    searchSubType === OfferingIncomeSearchSubType.OfferingByContributorLastNames) &&
                    'md:col-span-1 lg:col-span-1 xl:col-span-1',
                  searchSubType === OfferingIncomeSearchSubType.OfferingByContributorFullNames &&
                    'md:col-span-2 lg:col-span-1 xl:col-span-4',
                  (searchSubType === OfferingIncomeSearchSubType.OfferingByPreacherFullNames ||
                    searchSubType === OfferingIncomeSearchSubType.OfferingBySupervisorFullNames) &&
                    'md:col-span-1 lg:col-span-2 xl:col-span-1',
                  (searchSubType === OfferingIncomeSearchSubType.OfferingByShiftDate ||
                    searchSubType === OfferingIncomeSearchSubType.OfferingByZoneDate ||
                    searchSubType === OfferingIncomeSearchSubType.OfferingByGroupCodeDate) &&
                    'md:col-span-1 lg:col-span-2 xl:col-span-1'
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
            <SearchByTermOfferingIncomeDataTable
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

export default OfferingsIncomeSearchPageByTerm;
