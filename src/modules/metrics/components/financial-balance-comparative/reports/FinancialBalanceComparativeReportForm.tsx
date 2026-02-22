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
  const [isInputSearchStartMonthOpen, setIsInputSearchStartMonthOpen] = useState<boolean>(false);
  const [isInputSearchEndMonthOpen, setIsInputSearchEndMonthOpen] = useState<boolean>(false);

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
    generateReportQuery.refetch();
  };

  return (
    <div className='w-full -mt-2 md:-mt-6'>

      {/* Header */}
      <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 dark:from-amber-700 dark:via-amber-800 dark:to-orange-800 px-5 py-4'>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex-1 min-w-0'>
            <h2 className='text-base md:text-xl font-bold text-white font-outfit'>
              Generar Reporte
            </h2>
            <p className='text-amber-100/80 text-[12px] md:text-[13px] font-inter mt-0.5'>
              Selecciona las opciones para el reporte PDF de balance financiero comparativo.
            </p>
          </div>
          <div className='flex-shrink-0 p-2 md:p-2.5 bg-white/10 rounded-lg'>
            <FaRegFilePdf className='w-5 h-5 md:w-6 md:h-6 text-white/90' />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
        <div className='p-4 md:p-5 space-y-5'>

          <span className='text-[13px] md:text-[14px] font-medium dark:text-slate-400 text-slate-500 font-inter'>
            👋🏻 Bienvenido al generador de reportes, por favor selecciona las opciones que quieres
            agregar al reporte.
          </span>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='space-y-5'
            >
              {/* Año de búsqueda */}
              <FormField
                control={form.control}
                name='year'
                render={({ field }) => {
                  return (
                    <FormItem className='flex justify-start gap-5 items-center'>
                      <div className='w-auto'>
                        <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                          Año de búsqueda
                        </FormLabel>
                        <FormDescription className='text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
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
                            <SelectItem className='text-[14px]' key={value} value={label}>
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

              {/* Divider */}
              <div className='border-t border-slate-200 dark:border-slate-700/50' />

              {/* Rango de meses */}
              <div className='flex flex-col gap-2 w-full'>
                <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                  Rango de meses de búsqueda
                </FormLabel>
                <FormDescription className='-mt-1 text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
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
                                    'justify-center w-full text-center px-2 text-[14px] md:text-[14px]',
                                    !field.value &&
                                    'text-slate-500 dark:text-slate-200 font-normal px-2'
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
                                    'text-slate-500 dark:text-slate-200 font-normal px-2'
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

              {/* Divider */}
              <div className='border-t border-slate-200 dark:border-slate-700/50' />

              {/* Opciones del Reporte */}
              <FormField
                control={form.control}
                name='types'
                render={() => (
                  <FormItem>
                    <div className='mb-3'>
                      <span className='text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-inter'>
                        Opciones del Reporte
                      </span>
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
                                <FormLabel className='text-[13px] md:text-[14px] font-medium font-inter cursor-pointer text-slate-600 dark:text-slate-400'>
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

              {/* Divider */}
              <div className='border-t border-slate-200 dark:border-slate-700/50' />

              {/* Messages + Submit */}
              <div className='flex flex-col gap-4'>
                {isMessageErrorDisabled ? (
                  <p className='text-center text-[12px] md:text-[13px] font-medium text-red-500 font-inter px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30'>
                    ❌ Datos incompletos, completa los campos requeridos.
                  </p>
                ) : (
                  <p className='text-center text-[12px] md:text-[13px] font-medium text-emerald-600 dark:text-emerald-400 font-inter px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30'>
                    ¡Campos completados correctamente!
                  </p>
                )}

                <Button
                  disabled={isSubmitButtonDisabled}
                  type='submit'
                  className={cn(
                    'w-full md:w-[280px] md:mx-auto text-[13px] md:text-[14px] font-semibold font-inter',
                    !generateReportQuery.isFetching &&
                    'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300',
                    generateReportQuery.isFetching &&
                    'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  )}
                  onClick={() => {
                    setTimeout(() => {
                      if (Object.keys(form.formState.errors).length === 0) {
                        setIsInputDisabled(true);
                        setIsSubmitButtonDisabled(true);
                      }
                    }, 100);
                  }}
                >
                  {generateReportQuery.isFetching ? (
                    <span className='flex items-center gap-2'>
                      <span className='w-4 h-4 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin' />
                      Generando Reporte...
                    </span>
                  ) : (
                    <span className='flex items-center gap-2'>
                      <FaRegFilePdf className='text-[1.1rem]' />
                      Generar Reporte
                    </span>
                  )}
                </Button>
              </div>

              {/* Consideraciones */}
              <div className='p-3 rounded-lg bg-blue-50/80 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-700/30'>
                <p className='text-blue-600 dark:text-blue-400 text-[12px] md:text-[13px] font-semibold font-inter mb-1'>
                  Consideraciones
                </p>
                <p className='text-[12px] md:text-[13px] font-medium font-inter text-slate-600 dark:text-slate-400'>
                  ✅ Se generará el reporte PDF con la iglesia actual de la búsqueda.
                </p>
              </div>

            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
