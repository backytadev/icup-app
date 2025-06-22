/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useState, useEffect } from 'react';

import { type z } from 'zod';
import { Toaster } from 'sonner';
import { es } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { endOfWeek, format, startOfWeek } from 'date-fns';

import { cn } from '@/shared/lib/utils';

import { getSimpleChurches } from '@/modules/church/services/church.service';
import { useOfferingIncomeStore } from '@/stores/offering-income/offering-income.store';

import { offeringIncomeInfoColumns as columns } from '@/modules/offering/income/components/data-tables/columns/offering-income-info-columns';
import { GeneralOfferingIncomeSearchDataTable } from '@/modules/offering/income/components/data-tables/boards/general-offering-income-search-data-table';

import { type OfferingIncomeResponse } from '@/modules/offering/income/interfaces/offering-income-response.interface';

import { PageTitle } from '@/shared/components/page/PageTitle';
import { SearchTitle } from '@/shared/components/page/SearchTitle';

import { type GeneralSearchForm } from '@/shared/interfaces/search-general-form.interface';
import { formSearchGeneralSchema } from '@/shared/validations/form-search-general-schema';
import { dateFormatterTermToTimestamp } from '@/shared/helpers/date-formatter-to-timestamp.helper';

import { RecordOrder, RecordOrderNames } from '@/shared/enums/record-order.enum';

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
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
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

const dataFictional: OfferingIncomeResponse[] = [
  {
    id: '',
    type: '',
    subType: '',
    category: '',
    amount: '',
    shift: '',
    currency: '',
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
    // church: null,
  },
];

export const OfferingsIncomeGeneralSearchPage = (): JSX.Element => {
  //* States
  const [searchParams, setSearchParams] = useState<GeneralSearchForm | undefined>();
  const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState<boolean>(true);

  const isFiltersSearchGeneralDisabled = useOfferingIncomeStore(
    (state) => state.isFiltersSearchGeneralDisabled
  );
  const setIsFiltersSearchGeneralDisabled = useOfferingIncomeStore(
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
      allByDate: true,
      dateTerm: {
        from: startOfWeek(new Date(), { weekStartsOn: 1 }),
        to: endOfWeek(new Date(), { weekStartsOn: 1 }),
      },
      order: RecordOrder.Descending,
    },
  });

  //* Watchers
  const { limit, offset, order, all, allByDate } = form.watch();

  //* Queries
  const churchesQuery = useQuery({
    queryKey: ['churches'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

  //* Effects
  useEffect(() => {
    if (all) form.setValue('limit', '10');
    if (allByDate) form.setValue('limit', '10');
  }, [all, allByDate]);

  useEffect(() => {
    setIsDisabledSubmitButton(!limit || !offset || !order);
  }, [limit, offset, order]);

  useEffect(() => {
    setIsFiltersSearchGeneralDisabled(true);
  }, []);

  useEffect(() => {
    document.title = 'Modulo Ofrenda - IcupApp';
  }, []);

  useEffect(() => {
    if (churchesQuery.data?.length) {
      form.setValue('churchId', churchesQuery.data[0].id);
    }
  }, [churchesQuery.data, searchParams]);

  //* Form handler
  function onSubmit(formData: z.infer<typeof formSearchGeneralSchema>): void {
    let newDateTermTo;
    if (!formData.dateTerm?.to) {
      newDateTermTo = formData.dateTerm?.from;
    }

    const newDateTerm = dateFormatterTermToTimestamp({
      from: formData.dateTerm?.from,
      to: formData.dateTerm?.to ? formData.dateTerm?.to : newDateTermTo,
    });

    setSearchParams({
      ...formData,
      dateTerm: newDateTerm as any,
    });
    setIsDisabledSubmitButton(true);
    setIsFiltersSearchGeneralDisabled(false);
    form.reset();
    setIsDisabledSubmitButton(false);
  }

  return (
    <div className='animate-fadeInPage'>
      <PageTitle className='text-green-600'>Modulo de Ingreso</PageTitle>

      <SearchTitle
        className='w-[14rem] sm:w-auto leading-8 sm:leading-10'
        isGeneralSearch
        titleName={'registros de ingreso'}
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
                    <FormItem className='w-full sm:min-w-[7.5rem] xl:w-full'>
                      <FormLabel className='text-[14px] font-bold'>Limite</FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        ¿Cuantos registros necesitas?
                      </FormDescription>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          {...field}
                          disabled={form.getValues('all') || form.getValues('allByDate')}
                          className='text-[14px] md:text-[14px]'
                          value={
                            form.getValues('all') || form.getValues('allByDate')
                              ? '-'
                              : field.value || ''
                          }
                          placeholder='Limite de registros'
                        />
                      </FormControl>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  )}
                />

                {/* <FormField
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
                          value={form.getValues('all') ? '-' : field?.value || ''}
                        />
                      </FormControl>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name='all'
                  render={({ field }) => (
                    <FormItem className='flex flex-col justify-end'>
                      <FormLabel></FormLabel>
                      <FormDescription>
                        <span className='tracking-wide text-center ml-1 mr-1 font-bold inline-block bg-gray-200 text-slate-600 border text-[10px] uppercase px-2 rounded-full'>
                          General
                        </span>
                      </FormDescription>
                      <div className='flex items-center space-x-2 space-y-0 rounded-md border p-2.5 h-[2.5rem]'>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Checkbox
                            disabled={
                              !form.getValues('limit') ||
                              !form.getValues('offset') ||
                              form.getValues('allByDate') ||
                              !!form.formState.errors.limit // transform to boolean
                            }
                            checked={field?.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                            }}
                            className={
                              (form.getValues('limit') || form.getValues('offset')) &&
                              !form.formState.errors.limit &&
                              !form.formState.errors.offset
                                ? ''
                                : 'bg-slate-500'
                            }
                          />
                        </FormControl>
                        <div className='space-y-1 leading-none'>
                          <FormLabel
                            className={cn(
                              'text-[12.5px] md:text-[13px] cursor-pointer',
                              form.getValues('allByDate') && 'text-gray-500'
                            )}
                          >
                            Todos
                          </FormLabel>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className='flex col-start-1 col-end-3 gap-2'>
                <FormField
                  control={form.control}
                  name='dateTerm'
                  render={({ field }) => (
                    <FormItem className='w-full lg:min-w-[14rem] xl:min-w-[15rem] 2xl:w-full col-start-1 col-end-3 sm:col-start-auto sm:col-end-auto'>
                      <FormLabel className='text-[14px] font-bold'>Fecha</FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Buscar por fecha o rango de fechas.
                      </FormDescription>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl className='text-[14px] md:text-[14px]'>
                            <Button
                              variant={'outline'}
                              disabled={form.getValues('all')}
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

                <FormField
                  control={form.control}
                  name='allByDate'
                  render={({ field }) => (
                    <FormItem className='flex flex-col justify-end'>
                      <FormLabel></FormLabel>
                      <FormDescription>
                        <span className='ml-1 mr-1 tracking-wide text-center inline-block bg-blue-200 text-blue-600 border text-[10px] font-bold uppercase px-2 rounded-full'>
                          Por fecha
                        </span>
                      </FormDescription>
                      <div className='flex items-center space-x-2 space-y-0 rounded-md border p-2.5 h-[2.5rem] w-[5.5rem]'>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Checkbox
                            disabled={form.getValues('all')}
                            checked={field?.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                            }}
                            className={
                              (form.getValues('limit') || form.getValues('offset')) &&
                              !form.formState.errors.limit &&
                              !form.formState.errors.offset
                                ? ''
                                : 'bg-slate-500'
                            }
                          />
                        </FormControl>
                        <div className='space-y-1 leading-none'>
                          <FormLabel
                            className={cn(
                              'text-[12.5px] md:text-[13px] cursor-pointer',
                              form.getValues('all') && 'text-gray-500'
                            )}
                          >
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
                  <FormItem className='w-auto lg:min-w-[13rem] xl:min-w-[15rem] 2xl:w-full col-start-1 col-end-3 sm:col-start-auto sm:col-end-auto md:row-start-1 md:row-end-2 md:col-start-3 md:col-end-4 lg:col-start-auto lg:col-end-auto sm:row-start-auto sm:row-end-auto'>
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
                    <FormItem className='w-auto lg:min-w-[12rem] xl:min-w-[13rem] 2xl:w-full col-start-1 col-end-3 sm:col-start-auto sm:col-end-auto'>
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

              <div className='col-start-1 col-end-3 sm:col-start-1 md:row-start-4 md:row-end-5 md:col-start-1 md:col-end-4 lg:row-start-auto lg:col-start-auto lg:w-[50%] xl:w-full'>
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
            <GeneralOfferingIncomeSearchDataTable
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

export default OfferingsIncomeGeneralSearchPage;
