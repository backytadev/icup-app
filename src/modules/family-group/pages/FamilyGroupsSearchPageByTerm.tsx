/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { Toaster } from 'sonner';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { useFamilyGroupStore } from '@/stores/family-group/family-group.store';

import { getSimpleChurches } from '@/modules/church/services/church.service';

import { SearchByTermFamilyGroupDataTable } from '@/modules/family-group/components/data-tables/boards/search-by-term-family-group-data-table';
import { familyGroupInfoColumns as columns } from '@/modules/family-group/components/data-tables/columns/family-group-info-columns';

import {
  FamilyGroupSearchType,
  FamilyGroupSearchTypeNames,
} from '@/modules/family-group/enums/family-group-search-type.enum';
import {
  SubTypeNamesFamilyGroupSearchByFullNames,
  SubTypeNamesFamilyGroupSearchByLastNames,
  SubTypeNamesFamilyGroupSearchByFirstNames,
} from '@/modules/family-group/enums/family-group-search-sub-type.enum';
import { FamilyGroupSearchNamesByRecordStatus } from '@/modules/family-group/enums/family-group-search-select-option.enum';

import { type FamilyGroupResponse } from '@/modules/family-group/interfaces/family-group-response.interface';
import { type FamilyGroupSearchFormByTerm } from '@/modules/family-group/interfaces/family-group-search-by-term.interface';

import { familyGroupSearchByTermFormSchema } from '@/modules/family-group/validations/family-group-search-by-term-form-schema';

import { cn } from '@/shared/lib/utils';

import { PageTitle } from '@/shared/components/page-header/PageTitle';
import { SearchTitle } from '@/shared/components/page-header/SearchTitle';

import { RecordOrder, RecordOrderNames } from '@/shared/enums/record-order.enum';
import { firstNamesFormatter, lastNamesFormatter } from '@/shared/helpers/names-formatter.helper';
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
import { Checkbox } from '@/shared/components/ui/checkbox';

const dataFictional: FamilyGroupResponse[] = [
  {
    id: '',
    familyGroupName: '',
    familyGroupNumber: 0,
    familyGroupCode: '',
    serviceTime: '',
    country: '',
    department: '',
    province: '',
    district: '',
    urbanSector: '',
    address: '',
    referenceAddress: '',
    recordStatus: '',
    theirPreacher: null,
    theirZone: null,
  },
];

export const FamilyGroupsSearchPageByTerm = (): JSX.Element => {
  //* States
  const [dataForm, setDataForm] = useState<FamilyGroupSearchFormByTerm>();
  const [searchParams, setSearchParams] = useState<FamilyGroupSearchFormByTerm | undefined>();

  const isFiltersSearchByTermDisabled = useFamilyGroupStore(
    (state) => state.isFiltersSearchByTermDisabled
  );
  const setIsFiltersSearchByTermDisabled = useFamilyGroupStore(
    (state) => state.setIsFiltersSearchByTermDisabled
  );

  const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState<boolean>(true);

  //* Forms
  const form = useForm<z.infer<typeof familyGroupSearchByTermFormSchema>>({
    resolver: zodResolver(familyGroupSearchByTermFormSchema),
    mode: 'onChange',
    defaultValues: {
      searchSubType: '' as any,
      limit: '10',
      inputTerm: '',
      firstNamesTerm: '',
      lastNamesTerm: '',
      selectTerm: '',
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
    document.title = 'Modulo Grupo Familiar - IcupApp';
  }, []);

  useEffect(() => {
    if (churchesQuery.data?.length) {
      form.setValue('churchId', churchesQuery.data[0].id);
    }
  }, [churchesQuery.data, searchParams]);

  //* Form handler
  function onSubmit(formData: z.infer<typeof familyGroupSearchByTermFormSchema>): void {
    const newNamesTerm = firstNamesFormatter(formData?.firstNamesTerm);
    const newLastNamesTerm = lastNamesFormatter(formData?.lastNamesTerm);

    setSearchParams({
      ...formData,
      firstNamesTerm: newNamesTerm,
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
      <PageTitle className='text-family-group-color leading-10 sm:leading-normal'>
        Modulo Grupo Familiar
      </PageTitle>

      <SearchTitle
        className='w-[12rem] sm:w-auto leading-9'
        isByTypeSearch
        titleName={'grupos familiares'}
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
                          {Object.entries(FamilyGroupSearchTypeNames)
                            .filter(
                              ([key]) =>
                                ![
                                  FamilyGroupSearchType.Country,
                                  FamilyGroupSearchType.Department,
                                  FamilyGroupSearchType.Province,
                                  FamilyGroupSearchType.District,
                                  FamilyGroupSearchType.Address,
                                ].includes(key as FamilyGroupSearchType)
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

              {(searchType === FamilyGroupSearchType.FirstNames ||
                searchType === FamilyGroupSearchType.LastNames ||
                searchType === FamilyGroupSearchType.FullNames) && (
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
                              searchType === FamilyGroupSearchType.FirstNames
                                ? SubTypeNamesFamilyGroupSearchByFirstNames
                                : searchType === FamilyGroupSearchType.LastNames
                                  ? SubTypeNamesFamilyGroupSearchByLastNames
                                  : SubTypeNamesFamilyGroupSearchByFullNames
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

              {(searchType === FamilyGroupSearchType.ZoneName ||
                searchType === FamilyGroupSearchType.FamilyGroupCode ||
                searchType === FamilyGroupSearchType.FamilyGroupName ||
                searchType === FamilyGroupSearchType.Country ||
                searchType === FamilyGroupSearchType.Department ||
                searchType === FamilyGroupSearchType.Province ||
                searchType === FamilyGroupSearchType.District ||
                searchType === FamilyGroupSearchType.UrbanSector ||
                searchType === FamilyGroupSearchType.Address) && (
                <FormField
                  control={form.control}
                  name='inputTerm'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[14px] font-bold'>
                        {searchType === FamilyGroupSearchType.Country
                          ? `País`
                          : searchType === FamilyGroupSearchType.Department
                            ? 'Departamento'
                            : searchType === FamilyGroupSearchType.Province
                              ? 'Provincia'
                              : searchType === FamilyGroupSearchType.District
                                ? 'Distrito'
                                : searchType === FamilyGroupSearchType.UrbanSector
                                  ? 'Sector Urbano'
                                  : searchType === FamilyGroupSearchType.Address
                                    ? 'Dirección'
                                    : searchType === FamilyGroupSearchType.FamilyGroupCode
                                      ? 'Código de grupo familiar'
                                      : searchType === FamilyGroupSearchType.FamilyGroupName
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
                            searchType === FamilyGroupSearchType.Country
                              ? 'Ejem: Colombia , Mexico , Perú...'
                              : searchType === FamilyGroupSearchType.Department
                                ? 'Ejem: Lima, Ayacucho, Puno...'
                                : searchType === FamilyGroupSearchType.Province
                                  ? 'Ejem: Huaraz, Lima, Huamanga...'
                                  : searchType === FamilyGroupSearchType.District
                                    ? 'Ejem: Independencia, Los Olivos, SJL...'
                                    : searchType === FamilyGroupSearchType.UrbanSector
                                      ? 'Ejem: Payet, Tahuantinsuyo, La Pascana ...'
                                      : searchType === FamilyGroupSearchType.Address
                                        ? 'Ejem: Jr. Pardo 123 , Av.Central 555 , Mz. D Lt. 8 Nuevo Bosque...'
                                        : searchType === FamilyGroupSearchType.FamilyGroupCode
                                          ? 'Ejem: Jr. Levi-1 , Isacar-3 , Ruben-5..'
                                          : searchType === FamilyGroupSearchType.FamilyGroupName
                                            ? 'Ejem: Los Guerreros, Guardianes de la Fe...'
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

              {searchType === FamilyGroupSearchType.RecordStatus && (
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
                              searchType === FamilyGroupSearchType.RecordStatus &&
                                FamilyGroupSearchNamesByRecordStatus
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

              {(searchType === FamilyGroupSearchType.FirstNames ||
                searchType === FamilyGroupSearchType.FullNames) && (
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

              {(searchType === FamilyGroupSearchType.LastNames ||
                searchType === FamilyGroupSearchType.FullNames) && (
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
                  searchType === FamilyGroupSearchType.FullNames &&
                    'md:col-span-1 lg:col-span-2 xl:col-span-1',
                  searchType !== FamilyGroupSearchType.FirstNames &&
                    searchType !== FamilyGroupSearchType.LastNames &&
                    searchType !== FamilyGroupSearchType.FullNames &&
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
            <SearchByTermFamilyGroupDataTable
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

export default FamilyGroupsSearchPageByTerm;
