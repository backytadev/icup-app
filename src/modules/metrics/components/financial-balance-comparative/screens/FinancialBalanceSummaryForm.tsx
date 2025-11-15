import { cn } from '@/shared/lib/utils';
import { FaBalanceScale } from 'react-icons/fa';
import { months } from '@/shared/data/months-data';
import { UseQueryResult } from '@tanstack/react-query';
import { CurrencyType } from '@/modules/offering/shared/enums/currency-type.enum';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { generateYearOptions } from '@/shared/helpers/generate-year-options.helper';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';

import { ComparativeFinancialBalanceSummaryResponse } from '@/modules/metrics/interfaces/screens-metrics/financial-balance-summary-response.interface';

interface FinancialBalanceSummaryFormProps {
  form: any;
  handleSubmit: () => Promise<void>;
  isInputDisabled: boolean;
  isMessageErrorDisabled: boolean;
  isSubmitButtonDisabled: boolean;
  financialSummaryBalanceQuery: UseQueryResult<ComparativeFinancialBalanceSummaryResponse, Error>;
}
export const FinancialBalanceSummaryForm = ({
  form,
  handleSubmit,
  isInputDisabled,
  isMessageErrorDisabled,
  isSubmitButtonDisabled,
  financialSummaryBalanceQuery,
}: FinancialBalanceSummaryFormProps) => {
  const years = generateYearOptions(2025);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='w-full pt-2 flex flex-col gap-x-10 gap-y-4 md:gap-y-4 px-2 md:px-4'
      >
        <div className='flex flex-col md:flex-row gap-2 w-full px-6'>
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
                    <SelectContent className={cn(months.length >= 3 ? 'h-[15rem]' : 'h-auto')}>
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
                    <SelectContent className={cn(months.length >= 3 ? 'h-[15rem]' : 'h-auto')}>
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

          <div className='flex w-full gap-4'>
            <FormField
              control={form.control}
              name='year'
              render={({ field }) => {
                return (
                  <FormItem className='w-full'>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isInputDisabled}
                    >
                      <FormControl className='text-[14px] md:text-[14px] w-full md:w-[6rem] font-medium'>
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

            <FormField
              control={form.control}
              name='currency'
              render={({ field }) => {
                return (
                  <FormItem className='w-full'>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isInputDisabled}
                    >
                      <FormControl className='text-[14px] md:text-[14px] w-full md:w-[6rem] font-medium'>
                        <SelectTrigger>
                          {field.value ? <SelectValue placeholder='Divisa' /> : 'Divisa'}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className={cn(years.length >= 3 ? 'h-[8rem]' : 'h-auto')}>
                        {Object.values(CurrencyType).map((currency) => (
                          <SelectItem className={`text-[14px]`} key={currency} value={currency}>
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
            'w-[85%] md:w-[90%] mx-auto px-10 py-3 text-[14px] font-semibold rounded-lg shadow-lg transition-transform transform focus:outline-none focus:ring-red-300',
            !financialSummaryBalanceQuery.isFetching &&
              'text-white hover:text-white dark:text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800',
            financialSummaryBalanceQuery.isFetching &&
              'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200 cursor-not-allowed animate-pulse'
          )}
        >
          <FaBalanceScale
            className={cn(
              'mr-2 text-[1.2rem] md:text-[1.5rem] text-white',
              financialSummaryBalanceQuery.isFetching && 'text-gray-600 dark:text-gray-200'
            )}
          />
          {financialSummaryBalanceQuery.isFetching ? 'GENERANDO BALANCE...' : 'GENERAR BALANCE'}
        </Button>
      </form>
    </Form>
  );
};
