import { useEffect, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { ArrowLeftRight } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/shared/lib/utils';

import { type OfferingIncomeResponse } from '@/modules/offering/income/interfaces/offering-income-response.interface';

import {
  ExchangeCurrencyTypes,
  ExchangeCurrencyTypesNames,
} from '@/modules/offering/income/enums/exchange-currency-types.enum';
import { OfferingIncomeInactivationReason } from '@/modules/offering/income/enums/offering-income-inactivation-reason.enum';

import { offeringInactivateFormSchema } from '@/modules/offering/shared/validations/offering-inactivate-form-schema';

import { useOfferingIncomeCurrencyExchangeMutation } from '@/modules/offering/income/hooks';

import { CurrencyType } from '@/modules/offering/shared/enums/currency-type.enum';

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
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

interface OfferingIncomeCurrencyExchangeFormProps {
  id: string;
  data: OfferingIncomeResponse | undefined;
  dialogClose: () => void;
  scrollToTop: () => void;
}

export const OfferingIncomeCurrencyExchangeForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: OfferingIncomeCurrencyExchangeFormProps): JSX.Element => {
  //* States
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  //* Form
  const form = useForm<z.infer<typeof offeringInactivateFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(offeringInactivateFormSchema),
    defaultValues: {
      offeringInactivationReason: OfferingIncomeInactivationReason.CurrencyExchange,
      offeringInactivationDescription: '',
      exchangeRate: '',
      exchangeCurrencyTypes: '',
    },
  });

  //* Watchers
  const exchangeRate = form.watch('exchangeRate');
  const exchangeCurrencyTypes = form.watch('exchangeCurrencyTypes');

  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/offerings/income/search/${id}/currency-exchange`;

      window.history.replaceState({}, '', url);

      return () => {
        window.history.replaceState({}, '', originalUrl);
      };
    }
  }, [id]);

  //* Effects
  useEffect(() => {
    if (exchangeCurrencyTypes && exchangeRate) {
      setIsButtonDisabled(false);
    }
  }, [exchangeCurrencyTypes, exchangeRate]);

  //* Custom hooks
  const offeringIncomeCurrencyExchangeMutation = useOfferingIncomeCurrencyExchangeMutation({
    dialogClose,
    scrollToTop,
    setIsButtonDisabled,
    setIsInputDisabled,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof offeringInactivateFormSchema>): void => {
    setIsInputDisabled(true);
    setIsButtonDisabled(true);

    offeringIncomeCurrencyExchangeMutation.mutate({
      id,
      offeringInactivationReason: OfferingIncomeInactivationReason.CurrencyExchange,
      exchangeRate: formData.exchangeRate ?? undefined,
      exchangeCurrencyTypes: formData.exchangeCurrencyTypes ?? undefined,
    });
  };

  return (
    <div className='w-auto sm:w-[500px] md:w-[485px] lg:w-[485px] -mt-2'>
      {/* Header */}
      <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 dark:from-teal-800 dark:via-teal-900 dark:to-cyan-900 px-4 py-4 md:px-6 mb-5'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -top-1/2 -right-1/4 w-48 h-48 rounded-full bg-white/10' />
          <div className='absolute -bottom-1/4 -left-1/4 w-32 h-32 rounded-full bg-white/5' />
        </div>
        <div className='relative z-10'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-2 bg-white/10 rounded-lg'>
              <ArrowLeftRight className='w-5 h-5 text-white/90' />
            </div>
            <h2 className='text-lg md:text-xl font-bold text-white font-outfit'>
              Cambio de Divisa
            </h2>
          </div>
          <p className='text-teal-100/80 text-[12px] md:text-[13px] font-inter'>
            Conversión de moneda y actualización de registro
          </p>
        </div>
      </div>

      {/* Content */}
      <div className='space-y-5 px-1'>
        {/* Info Box */}
        <div className='p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30'>
          <p className='text-sm font-semibold text-blue-700 dark:text-blue-400 font-inter mb-2'>
            Procedimiento para el cambio de divisa:
          </p>
          <ul className='space-y-2 text-[13px] text-blue-600 dark:text-blue-300/90 font-inter'>
            <li className='flex items-start gap-2'>
              <span className='text-emerald-500'>✓</span>
              <span>
                El sistema <span className='font-semibold'>buscará un registro existente</span> con el tipo de divisa de destino, fecha y datos similares
              </span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-emerald-500'>✓</span>
              <span>
                El <span className='font-semibold'>registro de destino será actualizado</span>, incrementando su monto con el valor calculado
              </span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-emerald-500'>✓</span>
              <span>
                Si <span className='font-semibold'>no existe un registro</span>, se creará uno nuevo automáticamente
              </span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-red-500'>✗</span>
              <span>
                El <span className='font-semibold'>registro original será inactivado</span> permanentemente
              </span>
            </li>
          </ul>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='exchangeCurrencyTypes'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                        Tipo de cambio (moneda)
                      </FormLabel>
                      <FormDescription className='text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
                        Selecciona el par de monedas para el cambio
                      </FormDescription>
                      <Select
                        value={field.value}
                        disabled={isInputDisabled}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona las monedas' />
                            ) : (
                              'Selecciona las monedas'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {data?.currency === CurrencyType.PEN
                            ? Object.entries(ExchangeCurrencyTypesNames).map(
                              ([key, value]) =>
                                key !== ExchangeCurrencyTypes.EURtoPEN &&
                                key !== ExchangeCurrencyTypes.USDtoPEN && (
                                  <SelectItem
                                    className='text-[13px] md:text-[14px] font-inter'
                                    key={key}
                                    value={key}
                                  >
                                    {value}
                                  </SelectItem>
                                )
                            )
                            : data?.currency === CurrencyType.USD
                              ? Object.entries(ExchangeCurrencyTypesNames).map(
                                ([key, value]) =>
                                  key !== ExchangeCurrencyTypes.EURtoPEN &&
                                  key !== ExchangeCurrencyTypes.PENtoUSD &&
                                  key !== ExchangeCurrencyTypes.PENtoEUR && (
                                    <SelectItem
                                      className='text-[13px] md:text-[14px] font-inter'
                                      key={key}
                                      value={key}
                                    >
                                      {value}
                                    </SelectItem>
                                  )
                              )
                              : Object.entries(ExchangeCurrencyTypesNames).map(
                                ([key, value]) =>
                                  key !== ExchangeCurrencyTypes.USDtoPEN &&
                                  key !== ExchangeCurrencyTypes.PENtoUSD &&
                                  key !== ExchangeCurrencyTypes.PENtoEUR && (
                                    <SelectItem
                                      className='text-[13px] md:text-[14px] font-inter'
                                      key={key}
                                      value={key}
                                    >
                                      {value}
                                    </SelectItem>
                                  )
                              )}
                        </SelectContent>
                      </Select>
                      <FormMessage className='text-[12px] font-inter' />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='exchangeRate'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                        Tipo de cambio (tasa)
                      </FormLabel>
                      <FormDescription className='text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
                        Ingresa la tasa de cambio actual
                      </FormDescription>
                      <FormControl>
                        <Input
                          className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                          disabled={isInputDisabled}
                          placeholder='Ej: 3.75'
                          type='text'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-[12px] font-inter' />
                    </FormItem>
                  );
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className='flex gap-3 pt-2'>
              <Button
                disabled={isButtonDisabled}
                className={cn(
                  'flex-1 h-10 text-[13px] md:text-[14px] font-semibold font-inter',
                  'bg-slate-100 hover:bg-slate-200 text-slate-700',
                  'dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300',
                  'border border-slate-200 dark:border-slate-700',
                  'transition-all duration-200'
                )}
                type='button'
                onClick={() => {
                  dialogClose();
                }}
              >
                Cancelar
              </Button>
              <Button
                disabled={isButtonDisabled}
                type='submit'
                className={cn(
                  'flex-1 h-10 text-[13px] md:text-[14px] font-semibold font-inter',
                  'bg-gradient-to-r from-teal-500 to-cyan-500 text-white',
                  'hover:from-teal-600 hover:to-cyan-600',
                  'shadow-sm hover:shadow-md hover:shadow-teal-500/20',
                  'transition-all duration-200',
                  isButtonDisabled && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => {
                  setTimeout(() => {
                    if (Object.keys(form.formState.errors).length === 0) {
                      setIsButtonDisabled(true);
                      setIsInputDisabled(true);
                    }
                  }, 100);
                }}
              >
                {offeringIncomeCurrencyExchangeMutation?.isPending
                  ? 'Procesando...'
                  : 'Cambiar Divisa'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
