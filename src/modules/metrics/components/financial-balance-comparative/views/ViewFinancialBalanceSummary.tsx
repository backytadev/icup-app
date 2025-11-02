import { useEffect, useState } from 'react';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { PieChart, Pie, Label } from 'recharts';
import { FaBalanceScale } from 'react-icons/fa';
import { months } from '@/shared/data/months-data';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';

import { cn } from '@/shared/lib/utils';
import { buildScaledData } from '@/modules/metrics/helpers/color-scale';
import { metricsFormSchema } from '@/modules/metrics/validations/metrics-form-schema';
import { getFinancialBalanceSummaryReport } from '@/modules/metrics/services/offering-comparative-metrics.service';

import { CurrencyType } from '@/modules/offering/shared/enums/currency-type.enum';
import { generateYearOptions } from '@/shared/helpers/generate-year-options.helper';

interface ChartPieDonutProps {
  title: string;
  data: { name: string; value: number; fill: string; currency: string }[];
  valueLabel: string;
  strokeColor: string;
}

function ChartPieDonut({ title, data, valueLabel, strokeColor }: ChartPieDonutProps) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle
          className={cn(
            'text-center text-4xl font-bold',
            valueLabel === 'Ingresos' && 'text-green-500 dark:text-green-400',
            valueLabel === 'Egresos' && 'text-red-500 dark:text-red-400',
            valueLabel === 'Saldo' && 'text-amber-500 dark:text-amber-400'
          )}
        >
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className='flex-1 pb-0'>
        <ChartContainer config={{}} className='mx-auto aspect-square max-h-[380px]'>
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className='text-[16px]' hideLabel />}
            />

            <Pie
              data={data}
              dataKey='value'
              nameKey='name'
              innerRadius={100}
              stroke={strokeColor}
              strokeWidth={1}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          className='text-4xl font-bold fill-foreground'
                          x={viewBox.cx}
                          y={viewBox.cy}
                        >
                          {Math.round(total).toLocaleString('es-PE')}
                        </tspan>
                        <tspan
                          className='text-muted-foreground text-[16px] font-medium'
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                        >
                          {`${data[0].currency}`}
                        </tspan>
                        <tspan
                          className='text-muted-foreground text-[20px] font-medium'
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 50}
                        >
                          {valueLabel}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const INCOME_BASE = '#22C55E';
const EXPENSE_BASE = '#EF4444';
const BALANCE_BASE = '#FACC15';

interface FinancialReportCanvasProps {
  churchId: string;
}

export const ViewFinancialBalanceSummary = ({ churchId }: FinancialReportCanvasProps) => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);

  //* QueryClient
  const queryClient = useQueryClient();

  //* Form
  const form = useForm<z.infer<typeof metricsFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(metricsFormSchema),
    defaultValues: {
      year: new Date().getFullYear().toString(),
      startMonth: months[new Date().getMonth() - 2]?.value,
      endMonth: months[new Date().getMonth()]?.value,
      currency: CurrencyType.PEN,
    },
  });

  //* Watchers
  const year = form.watch('year');
  const startMonth = form.watch('startMonth');
  const endMonth = form.watch('endMonth');
  const currency = form.watch('currency');

  //* Helpers
  const years = generateYearOptions(2025);

  //* Queries
  const balanceSummaryQuery = useQuery({
    queryKey: ['view-balance-report', startMonth, endMonth, currency, churchId],
    queryFn: () =>
      getFinancialBalanceSummaryReport({
        churchId: churchId ?? '',
        year: year ?? '',
        startMonth: startMonth ?? '',
        endMonth: endMonth ?? '',
        currency: currency ?? '',
      }),
    retry: false,
    enabled: Boolean(startMonth && endMonth && currency && churchId),
  });

  //* Effects
  useEffect(() => {
    form.reset();
    queryClient.removeQueries({
      queryKey: ['view-balance-report', startMonth, endMonth, currency, churchId],
    });
    setPage(1);
    setIsInputDisabled(false);
    setIsSubmitButtonDisabled(true);
    setIsMessageErrorDisabled(true);
  }, [open]);

  useEffect(() => {
    if (form.formState.errors && Object.values(form.formState.errors).length > 0) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (startMonth && endMonth && year) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (!startMonth || !endMonth || !year) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }
  }, [churchId, startMonth, endMonth, year, form.formState.errors]);

  //* Mappers
  const data = balanceSummaryQuery.data;

  const incomeData = buildScaledData(data ?? [], 'totalIncome', INCOME_BASE);
  const expenseData = buildScaledData(data ?? [], 'totalExpenses', EXPENSE_BASE);
  const balanceData = buildScaledData(data ?? [], 'netResult', BALANCE_BASE);

  // * Handlers
  const handleSubmit = async (): Promise<void> => {
    setIsSubmitButtonDisabled(true);
    await balanceSummaryQuery.refetch();
  };

  return (
    <div className='flex justify-center'>
      <Button onClick={() => setOpen(true)} className='text-white bg-amber-600 hover:bg-amber-700'>
        Abrir Canvas
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            'max-w-[100vw] h-[100vh] p-0 overflow-y-auto py-10',
            'dark:bg-slate-950 bg-slate-50 flex flex-col justify-evenly items-center'
          )}
        >
          <DialogHeader className='space-y-4 text-center'>
            <DialogTitle className='text-5xl font-bold text-amber-500 mb-4'>
              Balance Financiero General
            </DialogTitle>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='w-full pt-2 flex flex-col gap-x-10 gap-y-4 md:gap-y-4 px-2 md:px-4'
              >
                <div className='flex justify-center flex-wrap gap-3'>
                  <div className='flex flex-row gap-2 w-full'>
                    <FormField
                      control={form.control}
                      name='startMonth'
                      render={({ field }) => {
                        return (
                          <FormItem className='w-full'>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isInputDisabled}
                            >
                              <FormControl className='text-[14px] md:text-[14px] font-medium'>
                                <SelectTrigger>
                                  {field.value ? <SelectValue placeholder='Mes' /> : 'Mes'}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent
                                className={cn(months.length >= 3 ? 'h-[15rem]' : 'h-auto')}
                              >
                                {Object.values(months).map(({ label, value }) => (
                                  <SelectItem className={`text-[14px]`} key={value} value={value}>
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
                    <FormField
                      control={form.control}
                      name='endMonth'
                      render={({ field }) => {
                        return (
                          <FormItem className='w-full'>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isInputDisabled}
                            >
                              <FormControl className='text-[14px] md:text-[14px] font-medium'>
                                <SelectTrigger>
                                  {field.value ? <SelectValue placeholder='Mes' /> : 'Mes'}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent
                                className={cn(months.length >= 3 ? 'h-[15rem]' : 'h-auto')}
                              >
                                {Object.values(months).map(({ label, value }) => (
                                  <SelectItem className={`text-[14px]`} key={value} value={value}>
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

                    <FormField
                      control={form.control}
                      name='year'
                      render={({ field }) => {
                        return (
                          <FormItem className='flex justify-start gap-5 items-center'>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isInputDisabled}
                            >
                              <FormControl className='text-[14px] md:text-[14px] w-[6rem] font-medium'>
                                <SelectTrigger>
                                  {field.value ? <SelectValue placeholder='Año' /> : 'Año'}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent
                                className={cn(years.length >= 3 ? 'h-[8rem]' : 'h-auto')}
                              >
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

                    <FormField
                      control={form.control}
                      name='currency'
                      render={({ field }) => {
                        return (
                          <FormItem className='md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2'>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isInputDisabled}
                            >
                              <FormControl className='text-[14px] md:text-[14px] w-[6rem] font-medium'>
                                <SelectTrigger>
                                  {field.value ? <SelectValue placeholder='Divisa' /> : 'Divisa'}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent
                                className={cn(years.length >= 3 ? 'h-[8rem]' : 'h-auto')}
                              >
                                {Object.values(CurrencyType).map((currency) => (
                                  <SelectItem
                                    className={`text-[14px]`}
                                    key={currency}
                                    value={currency}
                                  >
                                    {currency}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </div>

                {isMessageErrorDisabled && (
                  <p className='-mb-3 md:-mb-3 md:row-start-5 md:row-end-6 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                    ❌ Datos incompletos, completa los campos requeridos.
                  </p>
                )}

                <Button
                  disabled={isSubmitButtonDisabled}
                  type='submit'
                  variant='ghost'
                  className={cn(
                    'w-full px-4 py-3 text-[14px] font-semibold rounded-lg shadow-lg transition-transform transform focus:outline-none focus:ring-red-300',
                    !balanceSummaryQuery.isFetching &&
                      'text-white hover:text-white dark:text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800',
                    balanceSummaryQuery.isFetching &&
                      'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200 cursor-not-allowed animate-pulse'
                  )}
                >
                  <FaBalanceScale
                    className={cn(
                      'mr-2 text-[1.5rem] text-white',
                      balanceSummaryQuery.isFetching && 'text-gray-600 dark:text-gray-200'
                    )}
                  />
                  {balanceSummaryQuery.isFetching ? 'GENERANDO BALANCE...' : 'GENERAR BALANCE'}
                </Button>
              </form>
            </Form>

            {/* Botones */}
            <div className='flex justify-between items-center w-full max-w-4xl px-6 mt-6'>
              <Button
                variant='ghost'
                disabled={page === 1 || !balanceSummaryQuery.data?.length}
                onClick={() => setPage((p) => (p > 1 ? p - 1 : p))}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white',
                  'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
                  'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-blue-600'
                )}
              >
                <ArrowLeft className='h-5 w-5' />
                Anterior
              </Button>

              <p className='dark:text-slate-300 text-slate-600 font-bold text-3xl tracking-wide'>
                {page === 1 && 'Resumen General'}
                {page === 2 && 'Ingresos'}
                {page === 3 && 'Salidas'}
              </p>

              <Button
                variant='ghost'
                disabled={page === 3 || !balanceSummaryQuery.data?.length}
                onClick={() => setPage((p) => (p < 3 ? p + 1 : p))}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white',
                  'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
                  'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-blue-600'
                )}
              >
                Siguiente
                <ArrowRight className='h-5 w-5' />
              </Button>
            </div>
          </DialogHeader>

          {balanceSummaryQuery.isLoading && (
            <p className='text-center text-lg text-slate-400 animate-pulse mt-10'>
              ⏳ Generando reporte financiero...
            </p>
          )}

          {/*  Cards de Balance  */}
          {balanceSummaryQuery.data && !balanceSummaryQuery.isLoading && (
            <div className='w-full max-w-full flex flex-col gap-12 px-10 mt-6'>
              {page === 1 && (
                <>
                  <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-8'>
                    {balanceSummaryQuery.data.map((m: any) => (
                      <Card
                        key={m.month}
                        className={cn(
                          'rounded-2xl p-6 transition-all duration-300',
                          'bg-white dark:bg-slate-900',
                          'border border-slate-300 dark:border-slate-700',
                          'shadow-lg dark:shadow-xl',
                          'hover:scale-[1.015] hover:shadow-2xl'
                        )}
                      >
                        <CardHeader className='pb-4 pt-0'>
                          <CardTitle
                            className={cn(
                              'text-center text-4xl font-extrabold tracking-wide',
                              'text-blue-700 dark:text-blue-500'
                            )}
                          >
                            {m.month}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className='space-y-5 text-xl font-medium'>
                          {/* SALDO ANTERIOR */}
                          <div className='flex justify-between'>
                            <span className='text-slate-700 dark:text-slate-400'>
                              Saldo anterior
                            </span>
                            <span className='font-semibold text-amber-600 dark:text-amber-400'>
                              S/. {m.netResultPrevious.toLocaleString('es-PE')}
                            </span>
                          </div>

                          {/* INGRESOS */}
                          <div className='flex justify-between'>
                            <span className='text-slate-700 dark:text-slate-400'>Ingresos</span>
                            <span className='text-green-600 dark:text-emerald-500 font-bold'>
                              S/ {m.totalIncome.toLocaleString('es-PE')}
                            </span>
                          </div>

                          {/* EGRESOS */}
                          <div className='flex justify-between'>
                            <span className='text-slate-700 dark:text-slate-400'>Egresos</span>
                            <span className='text-red-600 dark:text-red-500 font-bold'>
                              S/ {m.totalExpenses.toLocaleString('es-PE')}
                            </span>
                          </div>

                          {/* SALDO ACTUAL */}
                          <div className='flex justify-between border-t border-slate-300 dark:border-slate-700 pt-4'>
                            <span className='text-slate-900 dark:text-slate-200 font-bold'>
                              Saldo actual
                            </span>
                            <span className='text-amber-600 dark:text-amber-500 font-extrabold'>
                              S/ {m.netResult.toLocaleString('es-PE')}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Charts */}
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    <ChartPieDonut
                      title='Ingresos por Mes'
                      data={incomeData ?? []}
                      valueLabel='Ingresos'
                      strokeColor='#166534'
                    />

                    <ChartPieDonut
                      title='Gastos por Mes'
                      data={expenseData ?? []}
                      valueLabel='Egresos'
                      strokeColor='#991B1B'
                    />

                    <ChartPieDonut
                      title='Saldo por Mes'
                      data={balanceData ?? []}
                      valueLabel='Saldo'
                      strokeColor='#854D0E'
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

{
  /* ✅ Página 2 — Ingresos por tipo */
}
{
  /* {page === 2 && (
    <div className='flex flex-col gap-12'>
      <Card className='bg-slate-900 border border-slate-800 shadow-md'>
        <CardHeader>
          <CardTitle className='text-center text-amber-400'>
            Ingresos por Tipo de Ofrenda ({selectedMonths.join(' - ')})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className='w-full border-collapse text-sm'>
            <thead>
              <tr className='border-b border-slate-800 text-slate-400'>
                <th className='p-2 text-left'>Tipo de Ofrenda</th>
                {selectedMonths.map((month: any) => (
                  <th key={month} className='p-2 text-right'>
                    {month}
                  </th>
                ))}
                <th className='p-2 text-right text-amber-400'>Total Acumulado</th>
              </tr>
            </thead>
            <tbody>
              {summary.incomeByType.map((t: any) => (
                <tr
                  key={t.type}
                  className='border-b border-slate-800 hover:bg-slate-800/40'
                >
                  <td className='p-2'>{t.type}</td>
                  {t.monthly.map((m: any) => (
                    <td key={m.month} className='p-2 text-right text-green-400'>
                      S/. {m.value.toLocaleString('es-PE')}
                    </td>
                  ))}
                  <td className='p-2 text-right font-semibold text-amber-400'>
                    S/. {t.total.toLocaleString('es-PE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )} */
}

{
  /* ✅ Página 3 — Egresos por tipo */
}
{
  /* {page === 3 && (
    <div className='flex flex-col gap-12'>
      <Card className='bg-slate-900 border border-slate-800 shadow-md'>
        <CardHeader>
          <CardTitle className='text-center text-red-400'>
            Egresos por Tipo de Gasto ({selectedMonths.join(' - ')})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className='w-full border-collapse text-sm'>
            <thead>
              <tr className='border-b border-slate-800 text-slate-400'>
                <th className='p-2 text-left'>Tipo de Gasto</th>
                {selectedMonths.map((month: any) => (
                  <th key={month} className='p-2 text-right'>
                    {month}
                  </th>
                ))}
                <th className='p-2 text-right text-red-400'>Total Acumulado</th>
              </tr>
            </thead>
            <tbody>
              {summary.expenseByType?.map((t: any) => (
                <tr
                  key={t.type}
                  className='border-b border-slate-800 hover:bg-slate-800/40'
                >
                  <td className='p-2'>{t.type}</td>
                  {t.monthly.map((m: any) => (
                    <td key={m.month} className='p-2 text-right text-red-400'>
                      S/. {m.value.toLocaleString('es-PE')}
                    </td>
                  ))}
                  <td className='p-2 text-right font-semibold text-red-400'>
                    S/. {t.total.toLocaleString('es-PE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )} */
}
