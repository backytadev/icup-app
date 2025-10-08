/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useState, useEffect } from 'react';

import { type z } from 'zod';
import { Toaster } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useChurchStore } from '@/modules/church/stores/church.store';

import { type ChurchResponse } from '@/modules/church/interfaces/church-response.interface';
import { churchInfoColumns as columns } from '@/modules/church/components/data-tables/columns/church-info-columns';
import { GeneralChurchSearchDataTable } from '@/modules/church/components/data-tables/boards/general-church-search-data-table';

import { cn } from '@/shared/lib/utils';

import { PageTitle } from '@/shared/components/page-header/PageTitle';
import { SearchTitle } from '@/shared/components/page-header/SearchTitle';

import { RecordOrder, RecordOrderNames } from '@/shared/enums/record-order.enum';
import { formSearchGeneralSchema } from '@/shared/validations/form-search-general-schema';
import { type GeneralSearchForm } from '@/shared/interfaces/search-general-form.interface';

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
  FormMessage,
  FormControl,
  FormDescription,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';

const dataFictional: ChurchResponse[] = [
  {
    id: '',
    churchName: '',
    abbreviatedChurchName: '',
    churchCode: '',
    isAnexe: false,
    serviceTimes: ['16:00'],
    foundingDate: new Date('2024-05-31'),
    email: 'iglesia.central@gmail.com',
    phoneNumber: '',
    country: '',
    department: '',
    province: '',
    district: '',
    urbanSector: '',
    address: '',
    referenceAddress: '',
    recordStatus: 'active',
    theirMainChurch: null,
  },
];

export const ChurchesGeneralSearchPage = (): JSX.Element => {
  //* States
  const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState<boolean>(true);

  const isFiltersSearchGeneralDisabled = useChurchStore(
    (state) => state.isFiltersSearchGeneralDisabled
  );
  const setIsFiltersSearchGeneralDisabled = useChurchStore(
    (state) => state.setIsFiltersSearchGeneralDisabled
  );

  const [searchParams, setSearchParams] = useState<GeneralSearchForm | undefined>();

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
  const limit = form.watch('limit');
  const offset = form.watch('offset');
  const order = form.watch('order');

  //* Effects
  useEffect(() => {
    if (limit !== '' && offset !== '' && order !== '') {
      setIsDisabledSubmitButton(false);
    }

    if (limit === '' || offset === '' || order === '') {
      setIsDisabledSubmitButton(true);
    }
  }, [limit, offset, order]);

  useEffect(() => {
    setIsFiltersSearchGeneralDisabled(true);
  }, []);

  useEffect(() => {
    document.title = 'Modulo Iglesia - IcupApp';
  }, []);

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
      <PageTitle className='text-slate-500 dark:text-slate-400'>Modulo Iglesia</PageTitle>

      <SearchTitle isGeneralSearch titleName={'iglesias'} />

      <div className='px-4 md:-px-2 md:px-[2rem] xl:px-[3rem] py-4 md:py-7 w-full'>
        {isFiltersSearchGeneralDisabled && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='grid grid-cols-2 gap-y-2 md:gap-x-2 items-end mb-8 md:mb-10 lg:flex lg:justify-between 2xl:justify-normal lg:w-full'
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
                          value={form.getValues('all') ? '-' : field.value || ''}
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
                          value={form.getValues('all') ? '-' : field?.value || ''}
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
                              (form.getValues('limit') || form.getValues('offset')) &&
                              !form.formState.errors.limit &&
                              !form.formState.errors.offset
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
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='order'
                render={({ field }) => (
                  <FormItem className='col-span-2 md:col-auto w-auto lg:min-w-[14rem] xl:min-w-[16rem] 2xl:w-full'>
                    <FormLabel className='text-[14px] font-bold'>Orden</FormLabel>
                    <FormDescription className='text-[13.5px] md:text-[14px]'>
                      Selecciona el tipo de orden de los registros.
                    </FormDescription>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl className='text-[14px] md:text-[14px] lg:w-full'>
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

              <div className='col-start-1 col-end-3 md:row-start-2 md:row-end-3 md:col-start-2 md:col-end-3 lg:row-start-auto lg:col-start-auto lg:w-[50%]'>
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
            <GeneralChurchSearchDataTable
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

export default ChurchesGeneralSearchPage;
