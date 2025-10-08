/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { Toaster } from 'sonner';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { useZoneStore } from '@/modules/zone/stores/zone.store';

import { getSimpleChurches } from '@/modules/church/services/church.service';

import {
  SubTypeNamesZoneSearchByFullNames,
  SubTypeNamesZoneSearchByLastNames,
  SubTypeNamesZoneSearchByFirstNames,
} from '@/modules/zone/enums/zone-search-sub-type.enum';

import { ZoneSearchType, ZoneSearchTypeNames } from '@/modules/zone/enums/zone-search-type.enum';
import { ZoneSearchNamesByRecordStatus } from '@/modules/zone/enums/zone-search-select-option.enum';

import { zoneSearchByTermFormSchema } from '@/modules/zone/validations/zone-search-by-term-form-schema';

import { type ZoneResponse } from '@/modules/zone/interfaces/zone-response.interface';
import { type ZoneSearchFormByTerm } from '@/modules/zone/interfaces/zone-search-form-by-term.interface';

import { SearchByTermZoneDataTable } from '@/modules/zone/components/data-tables/boards/search-by-term-zone-data-table';
import { zoneUpdateColumns as columns } from '@/modules/zone/components/data-tables/columns/zone-update-columns';

import { cn } from '@/shared/lib/utils';

import { PageTitle } from '@/shared/components/page-header/PageTitle';
import { SearchTitle } from '@/shared/components/page-header/SearchTitle';

import { RecordOrder, RecordOrderNames } from '@/shared/enums/record-order.enum';

import { firstNamesFormatter, lastNamesFormatter } from '@/shared/helpers/names-formatter.helper';

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/shared/components/ui/form';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';

const dataFictional: ZoneResponse[] = [
  {
    id: '',
    zoneName: '',
    country: '',
    department: '',
    province: '',
    district: '',
    recordStatus: 'active',
    theirSupervisor: null,
  },
];

export const ZoneUpdatePage = (): JSX.Element => {
  //* States
  const [dataForm, setDataForm] = useState<ZoneSearchFormByTerm>();
  const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useState<ZoneSearchFormByTerm | undefined>();

  const isFiltersSearchByTermDisabled = useZoneStore(
    (state) => state.isFiltersSearchByTermDisabled
  );
  const setIsFiltersSearchByTermDisabled = useZoneStore(
    (state) => state.setIsFiltersSearchByTermDisabled
  );

  //* Forms
  const form = useForm<z.infer<typeof zoneSearchByTermFormSchema>>({
    resolver: zodResolver(zoneSearchByTermFormSchema),
    mode: 'onChange',
    defaultValues: {
      limit: '10',
      inputTerm: '',
      selectTerm: '',
      firstNamesTerm: '',
      lastNamesTerm: '',
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
    document.title = 'Modulo Zona - IcupApp';
  }, []);

  useEffect(() => {
    if (churchesQuery.data?.length) {
      form.setValue('churchId', churchesQuery.data[0].id);
    }
  }, [churchesQuery.data, searchParams]);

  //* Form handler
  function onSubmit(formData: z.infer<typeof zoneSearchByTermFormSchema>): void {
    const newFirstNamesTerm = firstNamesFormatter(formData?.firstNamesTerm);
    const newLastNamesTerm = lastNamesFormatter(formData?.lastNamesTerm);

    setSearchParams({
      ...formData,
      firstNamesTerm: newFirstNamesTerm,
      lastNamesTerm: newLastNamesTerm,
    });

    setIsDisabledSubmitButton(true);
    setIsFiltersSearchByTermDisabled(false);
    setDataForm(formData);
    form.reset();
    setIsDisabledSubmitButton(false);
  }

  return (
    <div className='animate-fadeInPage'>
      <PageTitle className='text-cyan-400 dark:text-cyan-500'>Modulo Zona</PageTitle>

      <SearchTitle isUpdateSearch className='text-orange-500' titleName={'zonas'} />

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
                          {Object.entries(ZoneSearchTypeNames).map(([key, value]) => (
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

              {(searchType === ZoneSearchType.FirstNames ||
                searchType === ZoneSearchType.LastNames ||
                searchType === ZoneSearchType.FullNames) && (
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
                              searchType === ZoneSearchType.FirstNames
                                ? SubTypeNamesZoneSearchByFirstNames
                                : searchType === ZoneSearchType.LastNames
                                  ? SubTypeNamesZoneSearchByLastNames
                                  : SubTypeNamesZoneSearchByFullNames
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

              {(searchType === ZoneSearchType.ZoneName ||
                searchType === ZoneSearchType.Country ||
                searchType === ZoneSearchType.Department ||
                searchType === ZoneSearchType.Province ||
                searchType === ZoneSearchType.District) && (
                <FormField
                  control={form.control}
                  name='inputTerm'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[14px] font-bold'>
                        {searchType === ZoneSearchType.Department
                          ? 'Departamento'
                          : searchType === ZoneSearchType.Province
                            ? 'Provincia'
                            : searchType === ZoneSearchType.District
                              ? 'Distrito'
                              : searchType === ZoneSearchType.ZoneName
                                ? 'Nombre de zona'
                                : 'País'}
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Escribe aquí lo que deseas buscar.
                      </FormDescription>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          className='text-[14px] md:text-[14px]'
                          placeholder={
                            searchType === ZoneSearchType.Department
                              ? 'Ejem: Lima, Ancash, Puno...'
                              : searchType === ZoneSearchType.Province
                                ? 'Ejem: Huamanga, Lima, Caraz'
                                : searchType === ZoneSearchType.District
                                  ? 'Ejem: Independencia, Los Olivos, SJL'
                                  : searchType === ZoneSearchType.ZoneName
                                    ? 'Ejem: Los Guerreros, Guardianes de la Fe...'
                                    : 'Ejem: Perú, Bolivia, Venezuela...'
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  )}
                />
              )}

              {searchType === ZoneSearchType.RecordStatus && (
                <FormField
                  control={form.control}
                  name='selectTerm'
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className='text-[14px] font-bold'>Estado de registro</FormLabel>
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
                              searchType === ZoneSearchType.RecordStatus &&
                                ZoneSearchNamesByRecordStatus
                            ).map(([key, value]) => (
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
              )}

              {(searchType === ZoneSearchType.FirstNames ||
                searchType === ZoneSearchType.FullNames) && (
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

              {(searchType === ZoneSearchType.LastNames ||
                searchType === ZoneSearchType.FullNames) && (
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
                            value={form.getValues('all') ? '-' : field.value || ''}
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
                  searchType === ZoneSearchType.FullNames &&
                    'md:col-span-1 lg:col-span-2 xl:col-span-1',
                  searchType !== ZoneSearchType.FirstNames &&
                    searchType !== ZoneSearchType.LastNames &&
                    searchType !== ZoneSearchType.FullNames &&
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
            <SearchByTermZoneDataTable
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

export default ZoneUpdatePage;
