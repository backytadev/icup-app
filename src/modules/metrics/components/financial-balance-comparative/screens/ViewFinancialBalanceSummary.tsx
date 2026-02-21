import { useEffect, useState } from 'react';

import { z } from 'zod';
import { cn } from '@/shared/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { months } from '@/shared/data/months-data';
import { CurrencyType } from '@/modules/offering/shared/enums/currency-type.enum';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

import { IncomeSummaryCard } from '@/modules/metrics/components/financial-balance-comparative/screens/IncomeSummaryCard';
import { ExpenseSummaryCard } from '@/modules/metrics/components/financial-balance-comparative/screens/ExpenseSummaryCard';

import { buildScaledData } from '@/modules/metrics/helpers/color-scale';
import { metricsFormSchema } from '@/modules/metrics/schemas/metrics-form-schema';
import { getFinancialBalanceSummary } from '@/modules/metrics/services/offering-comparative-metrics.service';
import { FinancialBalanceSummaryForm } from '@/modules/metrics/components/financial-balance-comparative/screens/FinancialBalanceSummaryForm';
import { ChartBarFinancialBalanceSummary } from '@/modules/metrics/components/financial-balance-comparative/screens/ChartBarFinancialBalanceSummary';
import { ChartDonutFinancialBalanceSummary } from '@/modules/metrics/components/financial-balance-comparative/screens/ChartDonutFinancialBalanceSummary';
import { useChurchMinistryContextStore } from '@/stores/context/church-ministry-context.store';

const INCOME_BASE = '#22C55E';
const EXPENSE_BASE = '#EF4444';
const BALANCE_BASE = '#FACC15';


export const ViewFinancialBalanceSummary = () => {
  //* Context
  const activeChurchId = useChurchMinistryContextStore((s) => s.activeChurchId);

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

  //* Queries
  const financialSummaryBalanceQuery = useQuery({
    queryKey: ['summary-financial-balance-screen', startMonth, endMonth, currency, activeChurchId],
    queryFn: () =>
      getFinancialBalanceSummary({
        churchId: activeChurchId ?? '',
        year: year ?? '',
        startMonth: startMonth ?? '',
        endMonth: endMonth ?? '',
        currency: currency ?? '',
      }),
    retry: false,
    enabled: Boolean(startMonth && endMonth && currency && activeChurchId),
  });

  //* Effects
  useEffect(() => {
    form.reset();
    queryClient.removeQueries({
      queryKey: ['view-balance-report', startMonth, endMonth, currency, activeChurchId],
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
  }, [activeChurchId, startMonth, endMonth, year, form.formState.errors]);

  //* Mappers
  const dataBalanceSummary = financialSummaryBalanceQuery.data?.calculateBalanceSummary ?? [];
  const incomeData = buildScaledData(dataBalanceSummary ?? [], 'totalIncome', INCOME_BASE);
  const expenseData = buildScaledData(dataBalanceSummary ?? [], 'totalExpenses', EXPENSE_BASE);
  const balanceData = buildScaledData(dataBalanceSummary ?? [], 'netResult', BALANCE_BASE);

  //* Income
  const dataBalanceIncome = financialSummaryBalanceQuery.data?.calculateSummaryIncome ?? [];
  const incomeCards = dataBalanceIncome
    .map((i) => ({
      label: i.subType ?? 'Sin sub-tipo',
      amount: i.totalAmount,
      pen: i.accumulatedOfferingPEN,
      usd: i.accumulatedOfferingUSD,
      eur: i.accumulatedOfferingEUR,
    }))
    .sort((a, b) => b.amount - a.amount);

  //* Expenses
  const dataBalanceExpenses = financialSummaryBalanceQuery.data?.calculateSummaryExpenses ?? [];
  const expenseCards = dataBalanceExpenses
    .map((i) => ({
      label: i.type ?? 'Sin tipo',
      amount: i.totalAmount,
      pen: i.accumulatedOfferingPEN,
      usd: i.accumulatedOfferingUSD,
      eur: i.accumulatedOfferingEUR,
    }))
    .sort((a, b) => b.amount - a.amount);

  //* Handlers
  const handleSubmit = async (): Promise<void> => {
    setIsSubmitButtonDisabled(true);
    await financialSummaryBalanceQuery.refetch();
  };

  return (
    <div className='flex justify-center'>
      <Button
        onClick={() => setOpen(true)}
        className='text-white bg-amber-600 hover:bg-amber-700 w-full md:mt-6'
      >
        Ver Balance Financiero
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            'max-w-[100vw] h-[100vh] p-0 overflow-y-auto py-10 px-6',
            'dark:bg-slate-950 bg-slate-50 flex flex-col justify-evenly items-center'
          )}
        >
          <DialogHeader className='space-y-4 text-center'>
            <DialogTitle className='text-[2rem] md:text-5xl font-bold text-amber-500'>
              Balance Financiero General
            </DialogTitle>

            {/* Form */}
            <FinancialBalanceSummaryForm
              form={form as any}
              handleSubmit={handleSubmit}
              isInputDisabled={isInputDisabled}
              isMessageErrorDisabled={isMessageErrorDisabled}
              isSubmitButtonDisabled={isSubmitButtonDisabled}
              financialSummaryBalanceQuery={financialSummaryBalanceQuery}
            />

            {/* Botones */}
            <div className='w-full max-w-4xl px-7 sm:px-6 mt-6'>
              <div className='flex flex-row items-center justify-center gap-4 sm:flex-row sm:justify-between sm:items-center'>
                <Button
                  variant='ghost'
                  disabled={
                    page === 1 ||
                    !financialSummaryBalanceQuery.data?.calculateBalanceSummary?.length
                  }
                  onClick={() => setPage((p) => (p > 1 ? p - 1 : p))}
                  className={cn(
                    'flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-lg sm:rounded-xl font-medium text-white',
                    'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:text-white',
                    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-blue-600'
                  )}
                >
                  <ArrowLeft className='h-4 w-4 sm:h-4 sm:w-5' />
                  <span className='hidden sm:inline'>Anterior</span>
                </Button>

                <p className='text-center text-slate-600 dark:text-slate-300 font-bold text-[22px] md:text-3xl 2xl:text-[40px] tracking-wide'>
                  {page === 1 && 'Resumen General'}
                  {page === 2 && 'Ingresos'}
                  {page === 3 && 'Salidas'}
                </p>

                <Button
                  variant='ghost'
                  disabled={
                    page === 3 ||
                    !financialSummaryBalanceQuery.data?.calculateBalanceSummary?.length
                  }
                  onClick={() => setPage((p) => (p < 3 ? p + 1 : p))}
                  className={cn(
                    'flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-lg sm:rounded-xl font-medium text-white',
                    'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:text-white',
                    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-blue-600'
                  )}
                >
                  <span className='hidden sm:inline'>Siguiente</span>
                  <ArrowRight className='h-4 w-4 sm:h-4 sm:w-5' />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {financialSummaryBalanceQuery.isLoading && (
            <p className='text-center text-lg text-slate-400 animate-pulse mt-10'>
              ⏳ Generando reporte financiero...
            </p>
          )}

          {/*  GENERAL BALANCE  */}
          {financialSummaryBalanceQuery.data && !financialSummaryBalanceQuery.isLoading && (
            <div className='w-full max-w-full flex flex-col gap-12 px-2 md:px-8 mt-5'>
              {page === 1 && (
                <>
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-7 md:gap-8'>
                    {financialSummaryBalanceQuery.data?.calculateBalanceSummary?.map((m: any) => (
                      <Card
                        key={m.month}
                        className={cn(
                          'rounded-2xl p-4 sm:p-5 md:p-6 transition-all duration-300',
                          'bg-white dark:bg-slate-900',
                          'border border-slate-300 dark:border-slate-700',
                          'shadow-lg dark:shadow-xl',
                          'hover:scale-[1.015] hover:shadow-2xl'
                        )}
                      >
                        <CardHeader className='pb-3 sm:pb-4 pt-0'>
                          <CardTitle
                            className={cn(
                              'text-center font-extrabold tracking-wide',
                              'text-3xl sm:text-4xl md:text-[2rem] xl:text-[2.5rem]',
                              'text-blue-700 dark:text-blue-500'
                            )}
                          >
                            {m.month}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className='space-y-4 sm:space-y-5 text-base sm:text-lg md:text-xl 2xl:text-[25px] font-medium'>
                          <div className='flex justify-between'>
                            <span className='text-slate-700 dark:text-slate-400'>
                              Saldo anterior
                            </span>
                            <span className='font-semibold text-amber-600 dark:text-amber-400 text-right'>
                              S/. {m.netResultPrevious.toLocaleString('es-PE')}
                            </span>
                          </div>

                          <div className='flex justify-between'>
                            <span className='text-slate-700 dark:text-slate-400'>Ingresos</span>
                            <span className='font-bold text-green-600 dark:text-emerald-500 text-right'>
                              S/ {m.totalIncome.toLocaleString('es-PE')}
                            </span>
                          </div>

                          <div className='flex justify-between'>
                            <span className='text-slate-700 dark:text-slate-400'>Egresos</span>
                            <span className='font-bold text-red-600 dark:text-red-500 text-right'>
                              S/ {m.totalExpenses.toLocaleString('es-PE')}
                            </span>
                          </div>

                          <div className='flex justify-between border-t border-slate-300 dark:border-slate-700 pt-4'>
                            <span className='text-slate-900 dark:text-slate-200 font-bold'>
                              Saldo actual
                            </span>
                            <span className='font-extrabold text-amber-600 dark:text-amber-500 text-right'>
                              S/ {m.netResult.toLocaleString('es-PE')}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Charts */}
                  <div className='grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 gap-8'>
                    <ChartDonutFinancialBalanceSummary
                      title='Ingresos por Mes'
                      data={incomeData ?? []}
                      valueLabel='Ingresos'
                      strokeColor='#166534'
                    />

                    <ChartDonutFinancialBalanceSummary
                      title='Gastos por Mes'
                      data={expenseData ?? []}
                      valueLabel='Egresos'
                      strokeColor='#991B1B'
                    />

                    <ChartDonutFinancialBalanceSummary
                      title='Saldo Final'
                      data={balanceData ?? []}
                      valueLabel='Saldo'
                      strokeColor='#854D0E'
                    />
                  </div>
                </>
              )}

              {/* INCOME */}
              {page === 2 && (
                <div className='flex flex-col w-full gap-10'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4 sm:px-8 md:px-4 gap-6'>
                    {incomeCards.map((card) => (
                      <IncomeSummaryCard
                        key={card.label}
                        data={card}
                        startMonth={startMonth}
                        endMonth={endMonth}

                        year={year}
                      />
                    ))}
                  </div>

                  <ChartBarFinancialBalanceSummary data={incomeCards} type={'income'} />
                </div>
              )}

              {/* EXPENSES */}
              {page === 3 && (
                <div className='flex flex-col w-full gap-10'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4 sm:px-8 md:px-4 gap-6'>
                    {expenseCards.map((card) => (
                      <ExpenseSummaryCard
                        key={card.label}
                        data={card}
                        startMonth={startMonth}
                        endMonth={endMonth}

                        year={year}
                      />
                    ))}
                  </div>

                  <ChartBarFinancialBalanceSummary data={expenseCards} type={'expense'} />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
