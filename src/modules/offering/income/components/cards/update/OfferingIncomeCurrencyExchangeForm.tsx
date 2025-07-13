/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useMemo, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/shared/lib/utils';
import { useOfferingIncomeStore } from '@/stores/offering-income/offering-income.store';

import {
  ExchangeCurrencyTypes,
  ExchangeCurrencyTypesNames,
} from '@/modules/offering/income/enums/exchange-currency-types.enum';
import { OfferingIncomeInactivationReason } from '@/modules/offering/income/enums/offering-income-inactivation-reason.enum';

import { offeringInactivateFormSchema } from '@/modules/offering/shared/validations/offering-inactivate-form-schema';

import { useOfferingIncomeCurrencyExchangeMutation } from '@/modules/offering/income/hooks/useOfferingIncomeCurrencyExchangeMutation';

import { CurrencyType } from '@/modules/offering/shared/enums/currency-type.enum';

import {
  Form,
  FormItem,
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
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import { Card, CardContent } from '@/shared/components/ui/card';

interface UserPasswordUpdateFormProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
}

export const OfferingIncomeCurrencyExchangeForm = ({
  id,
  dialogClose,
  scrollToTop,
}: UserPasswordUpdateFormProps): JSX.Element => {
  //* States
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const dataSearchByTermResponse = useOfferingIncomeStore(
    (state) => state.dataSearchByTermResponse
  );

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

  //* Functions
  const currentOfferingIncome = useMemo(
    () => dataSearchByTermResponse?.find((data) => data?.id === id),
    [dataSearchByTermResponse, id]
  );

  //* Watchers
  const exchangeRate = form.watch('exchangeRate');
  const exchangeCurrencyTypes = form.watch('exchangeCurrencyTypes');

  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/offerings/income/update/${id}/currency-exchange`;

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
    <Tabs
      defaultValue='general-info'
      className='w-auto -mt-8 sm:w-[420px] md:w-[480px] lg:w-[440px] xl:w-[530px]'
    >
      <h2 className='text-center text-teal-500 font-bold text-[24px] sm:text-[24px] md:text-[28px]'>
        Cambio de Divisa
      </h2>

      <TabsContent value='general-info' className='overflow-y-auto'>
        <Card className='w-full'>
          <CardContent className='py-4 px-4'>
            <span className='w-full text-left mb-2 flex flex-col'>
              <span className='text-blue-500 font-bold text-[15px] md:text-[16px] mb-2'>
                Procedimiento para el cambio de divisa
              </span>
              <span className='pl-2 text-[14px] md:text-[14.5px] mb-2'>
                ✅ <span className='font-medium'>El sistema buscará un registro existente</span> con
                el tipo de divisa de destino, la fecha y datos similares.
              </span>
              <span className='pl-2 text-[14px] md:text-[14.5px] mb-2'>
                ✅ <span className='font-medium'>El registro de destino será actualizado</span>,
                incrementando su monto con el valor calculado en el tipo de cambio.
              </span>
              <span className='pl-2 text-[14px] md:text-[14.5px] mb-2'>
                ✅ <span className='font-medium'>Si no se encuentra un registro</span>, el sistema
                creará uno nuevo para este cambio de divisa.
              </span>
              <span className='pl-2 text-[14px] md:text-[14.5px]'>
                ❌ <span className='font-medium'>El registro original</span>, cuyo monto fue
                transformado, será inactivado.
              </span>
            </span>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className='md:flex md:gap-10'>
                  <FormField
                    control={form.control}
                    name='exchangeCurrencyTypes'
                    render={({ field }) => {
                      return (
                        <FormItem className='mt-3 mb-3 md:mb-6 w-full'>
                          <FormDescription className='text-orange-500 text-[14px] md:text-[14px] pl-1 font-medium'>
                            Tipo de cambio (moneda)
                          </FormDescription>
                          <Select
                            value={field.value}
                            disabled={isInputDisabled}
                            onValueChange={field.onChange}
                          >
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <SelectTrigger>
                                {field.value ? (
                                  <SelectValue placeholder='Selecciona las monedas' />
                                ) : (
                                  'Selecciona las monedas'
                                )}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {currentOfferingIncome?.currency === CurrencyType.PEN
                                ? Object.entries(ExchangeCurrencyTypesNames).map(
                                    ([key, value]) =>
                                      key !== ExchangeCurrencyTypes.EURtoPEN &&
                                      key !== ExchangeCurrencyTypes.USDtoPEN && (
                                        <SelectItem
                                          className={`text-[14px] md:text-[14px]`}
                                          key={key}
                                          value={key}
                                        >
                                          {value}
                                        </SelectItem>
                                      )
                                  )
                                : currentOfferingIncome?.currency === CurrencyType.USD
                                  ? Object.entries(ExchangeCurrencyTypesNames).map(
                                      ([key, value]) =>
                                        key !== ExchangeCurrencyTypes.EURtoPEN &&
                                        key !== ExchangeCurrencyTypes.PENtoUSD &&
                                        key !== ExchangeCurrencyTypes.PENtoEUR && (
                                          <SelectItem
                                            className={`text-[14px] md:text-[14px]`}
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
                                            className={`text-[14px] md:text-[14px]`}
                                            key={key}
                                            value={key}
                                          >
                                            {value}
                                          </SelectItem>
                                        )
                                    )}
                            </SelectContent>
                          </Select>
                          <FormMessage className='text-[13px]' />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name='exchangeRate'
                    render={({ field }) => {
                      return (
                        <FormItem className='mt-3 mb-6 w-full'>
                          <FormDescription className='text-green-500 text-[14px] md:text-[14px] pl-1 font-medium'>
                            Tipo de cambio (precio)
                          </FormDescription>
                          <FormControl className='text-[14px] md:text-[14px]'>
                            <Input
                              className='text-[14px] md:text-[14px]'
                              disabled={isInputDisabled}
                              placeholder='Precio tipo de cambio...'
                              type='text'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className='text-[13px]' />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                <div className='flex justify-end gap-x-4'>
                  <Button
                    disabled={isButtonDisabled}
                    type='submit'
                    className={cn(
                      'w-full text-[14px]',
                      offeringIncomeCurrencyExchangeMutation?.isPending &&
                        'bg-emerald-500 disabled:opacity-100 disabled:md:text-[15px] text-white'
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
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
