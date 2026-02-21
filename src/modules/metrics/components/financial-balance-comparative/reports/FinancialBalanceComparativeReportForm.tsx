import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { FaRegFilePdf } from 'react-icons/fa6';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/shared/lib/utils';
import { months } from '@/shared/data/months-data';
import { generateYearOptions } from '@/shared/helpers/generate-year-options.helper';

import {
  MetricFinancialBalanceComparisonSearchType,
  MetricFinancialBalanceComparisonSearchTypeNames,
} from '@/modules/metrics/enums/metrics-search-type.enum';
import { FinancialBalanceComparativeReportFormSchema } from '@/modules/metrics/schemas/report-form-schema';
import { getFinancialBalanceComparativeMetricsReport } from '@/modules/metrics/services/offering-comparative-metrics.service';

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
  Command,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from '@/shared/components/ui/command';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

interface Props {
  dialogClose: () => void;
}

export const FinancialBalanceComparativeReportForm = ({ dialogClose }: Props): JSX.Element => {
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

  //* States
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);
  const [isInputSearchEndMonthOpen, setIsInputSearchEndMonthOpen] = useState<boolean>(false);
  const [isInputSearchStartMonthOpen, setIsInputSearchStartMonthOpen] = useState<boolean>(false);

  //* Form
  const form = useForm<z.infer<typeof FinancialBalanceComparativeReportFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FinancialBalanceComparativeReportFormSchema),
    defaultValues: {
      types: [MetricFinancialBalanceComparisonSearchType.IncomeAndExpensesComparativeByYear],
      church: activeChurchId ?? undefined,
      year: new Date().getFullYear().toString(),
      startMonth: months[new Date().getMonth()]?.value,
      endMonth: months[new Date().getMonth()]?.value,
    },
  });

  //* Helpers
  const years = generateYearOptions(2021);

  //* Watchers
  const types = form.watch('types');
  const year = form.watch('year');
  const startMonth = form.watch('startMonth');
  const endMonth = form.watch('endMonth');
  const church = form.watch('church');

  //* Effects
  useEffect(() => {
    form.setValue('church', activeChurchId ?? '');
  }, [activeChurchId]);

  //* Effects
  useEffect(() => {
    if (form.formState.errors && Object.values(form.formState.errors).length > 0) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (types && types.length > 0) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (!types.length) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }
  }, [activeChurchId, types]);

  //* Query Report and Event trigger
  const generateReportQuery = useQuery({
    queryKey: ['financial-balance-comparative-report', church],
    queryFn: () =>
      getFinancialBalanceComparativeMetricsReport({
        churchId: church ?? '',
        year: year ?? '',
        startMonth: startMonth ?? '',
        endMonth: endMonth ?? '',
        types,
        dialogClose,
      }),
    retry: false,
    enabled: false,
  });

  //* Form handler
  const handleSubmit = (): void => {
    setIsInputDisabled(true);
    setIsSubmitButtonDisabled(true);
    generateReportQuery.refetch();
  };

  return (
    <Tabs
      defaultValue='general-info'
      className='w-auto -mt-8 sm:w-[480px] md:w-[550px] lg:w-[550px] xl:w-[600px]'
    >
      <h2 className='text-center text-yellow-500 leading-6 pb-1 font-bold text-[24px] sm:text-[26px] md:text-[28px]'>
        Generar Reporte
      </h2>

      <TabsContent value='general-info' className='overflow-y-auto'>
        <Card className='w-full'>
          <CardContent className='py-3 px-3'>
            <span className='text-[13.5px] md:text-[14px] font-medium dark:text-slate-400 text-slate-500'>
              👋🏻 Bienvenido al generador de reportes, por favor selecciona las opciones que quieres
              agregar al reporte.
            </span>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='w-full pt-2 flex flex-col gap-x-10 gap-y-4 md:gap-y-4 px-2 md:px-4'
              >
                <FormField
                  control={form.control}
                  name='year'
                  render={({ field }) => {
                    return (
                      <FormItem className='flex justify-start gap-5 items-center'>
                        <div className='w-auto'>
                          <FormLabel className='text-[14.5px] md:text-[14.5px] font-bold'>
                            Año de búsqueda
                          </FormLabel>
                          <FormDescription className='text-[13px] md:text-[13px] font-medium'>
                            Selecciona el año de búsqueda que tendrán los reportes.
                          </FormDescription>
                        </div>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isInputDisabled}
                        >
                          <FormControl className='text-[14px] md:text-[14px] w-[4.8rem] font-medium'>
                            <SelectTrigger>
                              {field.value ? <SelectValue placeholder='Año' /> : 'Año'}
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={cn(years.length >= 3 ? 'h-[8rem]' : 'h-auto')}>
                            {Object.values(years).map(({ label, value }) => (
                              <SelectItem className={`text-[14px]`} key={value} value={label}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className='text-[13px]' />
                      </FormItem>
                    );
                  }}
                />

                <div className='flex flex-col gap-2 w-full'>
                  <FormLabel className='text-[14.5px] md:text-[14.5px] font-bold'>
                    Rango de meses de búsqueda
                  </FormLabel>
                  <FormDescription className='-mt-2 text-[13px] md:text-[13px] font-medium'>
                    Selecciona el rango de meses de búsqueda que tendrán los reportes.
                  </FormDescription>

                  <div className='flex gap-4 w-full'>
                    <FormField
                      control={form.control}
                      name='startMonth'
                      render={({ field }) => {
                        return (
                          <FormItem className='w-full'>
                            <Popover
                              open={isInputSearchStartMonthOpen}
                              onOpenChange={setIsInputSearchStartMonthOpen}
                            >
                              <PopoverTrigger asChild>
                                <FormControl className='text-[14px] md:text-[14px]'>
                                  <Button
                                    disabled={isInputDisabled}
                                    variant='outline'
                                    role='combobox'
                                    className={cn(
                                      'justify-center w-full text-center px-2 text-[14px] md:text-[14px] ',
                                      !field.value &&
                                      'text-slate-500  dark:text-slate-200 font-normal px-2'
                                    )}
                                  >
                                    {field.value
                                      ? months.find((month) => month.value === field.value)?.label
                                      : 'Elige un mes'}
                                    <CaretSortIcon className='h-4 w-4 shrink-0' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent align='center' className='w-auto px-4 py-2'>
                                <Command>
                                  <CommandInput
                                    placeholder='Busque un mes'
                                    className='h-9 text-[14px] md:text-[14px]'
                                  />
                                  <CommandEmpty>Mes no encontrado.</CommandEmpty>
                                  <CommandGroup className='max-h-[100px] h-auto'>
                                    {months.map((month) => (
                                      <CommandItem
                                        className='text-[14px] md:text-[14px]'
                                        value={month.label}
                                        key={month.value}
                                        onSelect={() => {
                                          form.setValue('startMonth', month.value);
                                          setIsInputSearchStartMonthOpen(false);
                                        }}
                                      >
                                        {month.label}
                                        <CheckIcon
                                          className={cn(
                                            'ml-auto h-4 w-4',
                                            month.value === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
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
                      name='endMonth'
                      render={({ field }) => {
                        return (
                          <FormItem className='w-full'>
                            <Popover
                              open={isInputSearchEndMonthOpen}
                              onOpenChange={setIsInputSearchEndMonthOpen}
                            >
                              <PopoverTrigger asChild>
                                <FormControl className='text-[14px] md:text-[14px]'>
                                  <Button
                                    disabled={isInputDisabled}
                                    variant='outline'
                                    role='combobox'
                                    className={cn(
                                      'justify-center w-full text-center px-2 text-[14px] md:text-[14px]',
                                      !field.value &&
                                      'text-slate-500  dark:text-slate-200 font-normal px-2'
                                    )}
                                  >
                                    {field.value
                                      ? months.find((month) => month.value === field.value)?.label
                                      : 'Elige un mes'}
                                    <CaretSortIcon className='h-4 w-4 shrink-0' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent align='center' className='w-auto px-4 py-2'>
                                <Command>
                                  <CommandInput
                                    placeholder='Busque un mes'
                                    className='h-9 text-[14px] md:text-[14px]'
                                  />
                                  <CommandEmpty>Mes no encontrado.</CommandEmpty>
                                  <CommandGroup className='max-h-[100px] h-auto'>
                                    {months.map((month) => (
                                      <CommandItem
                                        className='text-[14px] md:text-[14px]'
                                        value={month.label}
                                        key={month.value}
                                        onSelect={() => {
                                          form.setValue('endMonth', month.value);
                                          setIsInputSearchEndMonthOpen(false);
                                        }}
                                      >
                                        {month.label}
                                        <CheckIcon
                                          className={cn(
                                            'ml-auto h-4 w-4',
                                            month.value === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name='types'
                  render={() => (
                    <FormItem>
                      <div>
                        <FormLabel className='text-[14.5px] md:text-[14.5px] font-bold'>
                          Opciones
                        </FormLabel>
                      </div>
                      <div className='flex flex-col md:grid md:grid-cols-2 items-start md:items-center mx-auto gap-x-[5rem] justify-between gap-y-2'>
                        {Object.values(MetricFinancialBalanceComparisonSearchType).map((type) => (
                          <FormField
                            key={type}
                            control={form.control}
                            name='types'
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={type}
                                  className='flex flex-row items-center space-x-3 space-y-0'
                                >
                                  <FormControl className='text-[14px] md:text-[14px]'>
                                    <Checkbox
                                      disabled={isInputDisabled}
                                      checked={field.value?.includes(type)}
                                      onCheckedChange={(checked) => {
                                        let updatedTypes: MetricFinancialBalanceComparisonSearchType[] =
                                          [];
                                        checked
                                          ? (updatedTypes = field.value
                                            ? [...field.value, type]
                                            : [type])
                                          : (updatedTypes =
                                            field.value?.filter((value) => value !== type) ?? []);

                                        field.onChange(updatedTypes);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel
                                    className={`text-[14px] md:text-[14px] font-medium cursor-pointer`}
                                  >
                                    {MetricFinancialBalanceComparisonSearchTypeNames[type]}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  )}
                />

                {isMessageErrorDisabled ? (
                  <p className='-mb-3 md:-mb-3 md:row-start-5 md:row-end-6 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                    ❌ Datos incompletos, completa los campos requeridos.
                  </p>
                ) : (
                  <p className='-mt-2 order-last md:-mt-3 md:row-start-6 md:row-end-7 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                    ¡Campos completados correctamente!
                  </p>
                )}

                <div className='w-full md:w-[20rem] md:mx-auto col-start-1 col-end-3 text-sm md:text-md xl:text-base'>
                  <Button
                    disabled={isSubmitButtonDisabled}
                    type='submit'
                    variant='ghost'
                    className={cn(
                      'w-full px-4 py-3 text-[14px] font-semibold rounded-lg shadow-lg transition-transform transform focus:outline-none focus:ring-red-300',
                      !generateReportQuery.isFetching &&
                      'text-white hover:text-white dark:text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800',
                      generateReportQuery.isFetching &&
                      'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200 cursor-not-allowed animate-pulse'
                    )}
                  >
                    <FaRegFilePdf
                      className={cn(
                        'mr-2 text-[1.5rem] text-white',
                        generateReportQuery.isFetching && 'text-gray-600 dark:text-gray-200'
                      )}
                    />
                    {generateReportQuery.isFetching ? 'Generando Reporte...' : 'Generar Reporte'}
                  </Button>
                </div>
              </form>
            </Form>
            <div className='mt-3'>
              <p className='text-blue-500 text-[14px] md:text-[14px] font-bold mb-2'>
                Consideraciones
              </p>
              <p className='text-[13px] md:text-[13px] font-medium'>
                ✅ Se generara el reporte pdf con la iglesia actual de la búsqueda.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
