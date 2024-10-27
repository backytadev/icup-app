/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useMemo, useState } from 'react';

import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/shared/lib/utils';
import { useOfferingIncomeStore } from '@/stores';

import {
  ExchangeCurrencyType,
  ExchangeCurrencyTypeNames,
  OfferingIncomeReasonEliminationType,
} from '@/modules/offering/income/enums';
import { offeringDeleteFormSchema } from '@/modules/offering/shared/validations';

import { useOfferingIncomeCurrencyExchangeMutation } from '@/modules/offering/income/hooks';

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
import { CurrencyType } from '@/modules/offering/shared/enums';
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
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const dataSearchByTermResponse = useOfferingIncomeStore(
    (state) => state.dataSearchByTermResponse
  );

  //* Form
  const form = useForm<z.infer<typeof offeringDeleteFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(offeringDeleteFormSchema),
    defaultValues: {
      reasonEliminationType: OfferingIncomeReasonEliminationType.CurrencyExchange,
      exchangeRate: '',
      exchangeCurrencyType: '',
    },
  });

  //* Functions
  const currentOfferingIncome = useMemo(
    () => dataSearchByTermResponse?.find((data) => data?.id === id),
    [dataSearchByTermResponse, id]
  );

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

  //* Custom hooks
  const offeringIncomeCurrencyExchangeMutation = useOfferingIncomeCurrencyExchangeMutation({
    dialogClose,
    scrollToTop,
    setIsButtonDisabled,
    setIsInputDisabled,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof offeringDeleteFormSchema>): void => {
    setIsInputDisabled(true);
    setIsButtonDisabled(true);

    offeringIncomeCurrencyExchangeMutation.mutate({
      id,
      reasonEliminationType: OfferingIncomeReasonEliminationType.CurrencyExchange,
      exchangeRate: formData.exchangeRate ?? undefined,
      exchangeCurrencyType: formData.exchangeCurrencyType ?? undefined,
    });
  };

  return (
    <Tabs
      defaultValue='general-info'
      className='w-auto sm:w-[420px] md:w-[480px] lg:w-[440px] xl:w-[530px]'
    >
      <h2 className='text-center text-teal-500 pb-1 font-bold text-[20px] sm:text-[22px] md:text-[24px]'>
        Cambio de Divisa
      </h2>

      <TabsContent value='general-info' className='overflow-y-auto'>
        <Card className='w-full'>
          <CardContent className='py-4 px-4'>
            <span className='w-full text-left mb-2 flex flex-col'>
              <span className='text-blue-500 font-bold text-[14.5px] md:text-[16px] mb-1'>
                Procedimiento para el cambio de divisa
              </span>
              <span className='pl-2 text-[12.5px] md:text-[14.5px] mb-1'>
                ✅ <span className='font-medium'>El sistema buscará un registro existente</span> con
                el tipo de divisa de destino, la fecha y datos similares.
              </span>
              <span className='pl-2 text-[12.5px] md:text-[14.5px] mb-1'>
                ✅ <span className='font-medium'>El registro de destino será actualizado</span>,
                incrementando su monto con el valor calculado en el tipo de cambio.
              </span>
              <span className='pl-2 text-[12.5px] md:text-[14.5px] mb-1'>
                ✅ <span className='font-medium'>Si no se encuentra un registro</span>, el sistema
                creará uno nuevo para este cambio de divisa.
              </span>
              <span className='pl-2 text-[12.5px] md:text-[14.5px]'>
                ❌ <span className='font-medium'>El registro original</span>, cuyo monto fue
                transformado, será eliminado.
              </span>
            </span>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className='md:flex md:gap-10'>
                  <FormField
                    control={form.control}
                    name='exchangeCurrencyType'
                    render={({ field }) => {
                      return (
                        <FormItem className='mt-3 mb-3 md:mb-6 w-full'>
                          <FormDescription className='text-orange-500 text-[12.5px] md:text-[14px] pl-1 font-medium'>
                            Tipo de cambio (moneda)
                          </FormDescription>
                          <Select
                            value={field.value}
                            disabled={isInputDisabled}
                            onValueChange={field.onChange}
                          >
                            <FormControl className='text-[12px] md:text-[14px]'>
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
                                ? Object.entries(ExchangeCurrencyTypeNames).map(
                                    ([key, value]) =>
                                      key !== ExchangeCurrencyType.EURtoPEN &&
                                      key !== ExchangeCurrencyType.USDtoPEN && (
                                        <SelectItem
                                          className={`text-[12px] md:text-[14px]`}
                                          key={key}
                                          value={key}
                                        >
                                          {value}
                                        </SelectItem>
                                      )
                                  )
                                : currentOfferingIncome?.currency === CurrencyType.USD
                                  ? Object.entries(ExchangeCurrencyTypeNames).map(
                                      ([key, value]) =>
                                        key !== ExchangeCurrencyType.EURtoPEN &&
                                        key !== ExchangeCurrencyType.PENtoUSD &&
                                        key !== ExchangeCurrencyType.PENtoEUR && (
                                          <SelectItem
                                            className={`text-[12px] md:text-[14px]`}
                                            key={key}
                                            value={key}
                                          >
                                            {value}
                                          </SelectItem>
                                        )
                                    )
                                  : Object.entries(ExchangeCurrencyTypeNames).map(
                                      ([key, value]) =>
                                        key !== ExchangeCurrencyType.USDtoPEN &&
                                        key !== ExchangeCurrencyType.PENtoUSD &&
                                        key !== ExchangeCurrencyType.PENtoEUR && (
                                          <SelectItem
                                            className={`text-[12px] md:text-[14px]`}
                                            key={key}
                                            value={key}
                                          >
                                            {value}
                                          </SelectItem>
                                        )
                                    )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
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
                          <FormDescription className='text-green-500 text-[12.5px] md:text-[14px] pl-1 font-medium'>
                            Tipo de cambio (precio)
                          </FormDescription>
                          <FormControl>
                            <Input
                              className='text-[12px] md:text-[14px]'
                              disabled={isInputDisabled}
                              placeholder='Precio tipo de cambio...'
                              type='text'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                <div className='flex justify-end gap-x-4'>
                  {/* <Button
                    type='button'
                    disabled={isButtonDisabled}
                    className='bg-red-500 text-red-950 hover:bg-red-500 hover:text-white text-[14px]'
                    onClick={() => {
                      setIsCardOpen(false);
                    }}
                  >
                    No, cancelar
                  </Button>
                  <Button
                    disabled={isButtonDisabled}
                    type='submit'
                    className='bg-green-500 text-green-950 hover:bg-green-500 hover:text-white text-[14px]'
                  >
                    Sí, eliminar
                  </Button> */}
                  <Button
                    disabled={isButtonDisabled}
                    type='submit'
                    className={cn(
                      'w-full text-[14px]',
                      offeringIncomeCurrencyExchangeMutation?.isPending &&
                        'bg-emerald-500 disabled:opacity-100 disabled:md:text-[16px] text-white'
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
