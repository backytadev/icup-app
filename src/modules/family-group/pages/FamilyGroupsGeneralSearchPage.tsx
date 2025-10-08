/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useState, useEffect } from 'react';

import { type z } from 'zod';
import { Toaster } from 'sonner';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/shared/lib/utils';

import { useFamilyGroupStore } from '@/modules/family-group/stores/family-group.store';
import { getSimpleChurches } from '@/modules/church/services/church.service';

import { familyGroupInfoColumns as columns } from '@/modules/family-group/components/data-tables/columns/family-group-info-columns';
import { GeneralFamilyGroupSearchDataTable } from '@/modules/family-group/components/data-tables/boards/general-family-group-search-data-table';

import { type FamilyGroupResponse } from '@/modules/family-group/interfaces/family-group-response.interface';

import { PageTitle } from '@/shared/components/page-header/PageTitle';
import { SearchTitle } from '@/shared/components/page-header/SearchTitle';
import { type GeneralSearchForm } from '@/shared/interfaces/search-general-form.interface';

import { RecordOrder, RecordOrderNames } from '@/shared/enums/record-order.enum';

import { formSearchGeneralSchema } from '@/shared/validations/form-search-general-schema';

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
  FormControl,
  FormMessage,
  FormDescription,
} from '@/shared/components/ui/form';
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

export const FamilyGroupsGeneralSearchPage = (): JSX.Element => {
  //* States
  const [searchParams, setSearchParams] = useState<GeneralSearchForm | undefined>();
  const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState<boolean>(true);

  const isFiltersSearchGeneralDisabled = useFamilyGroupStore(
    (state) => state.isFiltersSearchGeneralDisabled
  );
  const setIsFiltersSearchGeneralDisabled = useFamilyGroupStore(
    (state) => state.setIsFiltersSearchGeneralDisabled
  );

  //* Forms
  const form = useForm<z.infer<typeof formSearchGeneralSchema>>({
    mode: 'onChange',
    resolver: zodResolver(formSearchGeneralSchema),
    defaultValues: {
      limit: '10',
      offset: '0',
      all: false,
      order: RecordOrder.Descending,
    },
  });

  //* Watchers
  const { limit, offset, order, all } = form.watch();

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
    setIsDisabledSubmitButton(!limit || !offset || !order);
  }, [limit, offset, order]);

  useEffect(() => {
    setIsFiltersSearchGeneralDisabled(true);
  }, []);

  useEffect(() => {
    document.title = 'Modulo Grupo Familiar - IcupApp';
  }, []);

  useEffect(() => {
    if (churchesQuery.data?.length) {
      form.setValue('churchId', churchesQuery.data[0].id);
    }
  }, [churchesQuery.data, searchParams]);

  //* Form handler
  function onSubmit(formData: z.infer<typeof formSearchGeneralSchema>): void {
    setSearchParams(formData);
    setIsDisabledSubmitButton(true);
    setIsFiltersSearchGeneralDisabled(false);
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
        isGeneralSearch
        titleName={'grupos familiares'}
      />

      <div className='px-4 md:-px-2 md:px-[2rem] xl:px-[3rem] py-4 md:py-7 w-full'>
        {isFiltersSearchGeneralDisabled && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='grid grid-cols-2 gap-y-2 gap-x-2 items-end mb-8 md:mb-10 lg:flex lg:justify-between 2xl:justify-normal'
            >
              <div className='w-full flex flex-row col-start-1 col-end-3 gap-3'>
                <FormField
                  control={form.control}
                  name='limit'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel className='text-[14px] font-bold'>Limite</FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        ¿Cuantos registros necesitas?
                      </FormDescription>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          {...field}
                          disabled={form.getValues('all')}
                          className='text-[14px] md:text-[14px]'
                          value={form.getValues('all') ? '-' : (field.value ?? '')}
                          placeholder='Limite de registros'
                        />
                      </FormControl>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='offset'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel className='text-[14px] font-bold'>Desplazamiento</FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        ¿Cuantos registros quieres saltar?
                      </FormDescription>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          disabled={form.getValues('all')}
                          className='text-[14px] md:text-[14px]'
                          placeholder='Nro. de registros desplazados'
                          {...field}
                          value={form.getValues('all') ? '-' : (field?.value ?? '')}
                        />
                      </FormControl>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='all'
                  render={({ field }) => (
                    <FormItem className='flex flex-col justify-end'>
                      <FormLabel></FormLabel>
                      <FormDescription></FormDescription>
                      <div className='flex items-center space-x-2 space-y-0 rounded-md border p-2.5 h-[2.5rem]'>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Checkbox
                            disabled={
                              !form.getValues('limit') ||
                              !form.getValues('offset') ||
                              !!form.formState.errors.limit // transform to boolean
                            }
                            checked={field?.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                            }}
                            className={
                              (form.getValues('limit') ?? form.getValues('offset')) &&
                              !form.formState.errors.limit &&
                              !form.formState.errors.offset
                                ? ''
                                : 'bg-slate-500'
                            }
                          />
                        </FormControl>
                        <div className='space-y-1 leading-none'>
                          <FormLabel className='text-[12.5px] md:text-[13px] cursor-pointer'>
                            Todos
                          </FormLabel>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='order'
                render={({ field }) => (
                  <FormItem className='w-auto lg:min-w-[13rem] xl:min-w-[15rem] 2xl:w-full'>
                    <FormLabel className='text-[14px] font-bold'>Orden</FormLabel>
                    <FormDescription className='text-[13.5px] md:text-[14px]'>
                      Selecciona el tipo de orden de los registros.
                    </FormDescription>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl className='text-[13px] md:text-[14px] lg:w-full'>
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
                    <FormItem className='w-auto lg:min-w-[12rem] xl:min-w-[13rem] 2xl:w-full'>
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

              <div className='col-start-1 col-end-3 md:row-start-3 md:row-end-4 md:col-start-1 md:col-end-3 lg:row-start-auto lg:col-start-auto lg:w-[50%]'>
                <Toaster position='top-center' richColors />
                <Button
                  disabled={isDisabledSubmitButton}
                  type='submit'
                  variant='ghost'
                  className={cn(
                    'text-[14px] w-full mt-2 px-4 py-2 border-1 border-green-500 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white hover:text-green-100 hover:from-green-500 hover:via-green-600 hover:to-green-700 dark:from-green-600 dark:via-green-700 dark:to-green-800 dark:text-gray-100 dark:hover:text-gray-200 dark:hover:from-green-700 dark:hover:via-green-800 dark:hover:to-green-900'
                  )}
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
            <GeneralFamilyGroupSearchDataTable
              columns={columns}
              data={dataFictional}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          }
        </div>
      </div>
    </div>
  );
};

export default FamilyGroupsGeneralSearchPage;
