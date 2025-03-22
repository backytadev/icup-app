/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useState } from 'react';

import { type z } from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { ExternalDonorFormSkeleton } from '@/modules/offering/income//components/cards/update/ExternalDonorFormSkeleton';

import { useExternalDonorEffects } from '@/modules/offering/income/hooks/useExternalDonorUpdateEffects';
import { useExternalDonorUpdateMutation } from '@/modules/offering/income/hooks/useExternalDonorUpdateMutation';
import { useExternalDonorUpdateSubmitButtonLogic } from '@/modules/offering/income/hooks/useExternalDonorUpdateSubmitButtonLogic';

import { type ExternalDonorResponse } from '@/modules/offering/income/interfaces/external-donor-response.interface';
import { ExternalDonorUpdateFormSchema } from '@/modules/offering/income/validations/external-donor-update-form-schema';

import { cn } from '@/shared/lib/utils';

import { GenderNames } from '@/shared/enums/gender.enum';

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from '@/shared/components/ui/form';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

interface DonorFormUpdateProps {
  id: string | undefined;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: ExternalDonorResponse | undefined;
}

export const DonorUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: DonorFormUpdateProps): JSX.Element => {
  //* States
  const [isInputBirthDateOpen, setIsInputBirthDateOpen] = useState<boolean>(false);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(false);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);

  const [isLoadingData, setIsLoadingData] = useState(true);

  //* Form
  const form = useForm<z.infer<typeof ExternalDonorUpdateFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(ExternalDonorUpdateFormSchema),
    defaultValues: {
      externalDonorFirstNames: '',
      externalDonorLastNames: '',
      externalDonorBirthDate: undefined,
      externalDonorGender: '',
      externalDonorEmail: '',
      externalDonorPhoneNumber: '',
      externalDonorOriginCountry: '',
      externalDonorResidenceCountry: '',
      externalDonorResidenceCity: '',
      externalDonorPostalCode: '',
    },
  });

  //* Custom Hooks
  useExternalDonorEffects({
    data,
    setIsLoadingData,
    externalDonorUpdateForm: form,
  });

  useExternalDonorUpdateSubmitButtonLogic({
    externalDonorUpdateForm: form,
    setIsMessageErrorDisabled,
    setIsSubmitButtonDisabled,
    isInputDisabled,
  });

  const externalDonorUpdateMutation = useExternalDonorUpdateMutation({
    dialogClose,
    scrollToTop,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof ExternalDonorUpdateFormSchema>): void => {
    setIsInputDisabled(true);
    setIsSubmitButtonDisabled(true);
    externalDonorUpdateMutation.mutate({ id, formData });
  };

  return (
    <Tabs
      defaultValue='general-info'
      className='-mt-8 w-[350px] sm:w-[450px] md:w-[630px] lg:w-[700px] xl:w-[700px]'
    >
      <h2 className='text-center leading-7 text-orange-500 pb-2 font-bold text-[24px] sm:text-[26px] md:text-[28px]'>
        Modificar datos
      </h2>

      <TabsContent value='general-info'>
        <Card className='w-full'>
          {isLoadingData && <ExternalDonorFormSkeleton />}

          {!isLoadingData && (
            <CardContent className='py-3 px-4'>
              <div className='dark:text-slate-300 text-slate-500 font-bold text-[17px] md:text-[18px] mb-0 ml-0 md:pl-2'>
                Donante Externo: {data?.firstNames} {data?.lastNames}
              </div>
              <Form {...form}>
                <form className='w-full flex flex-col md:grid md:grid-cols-2 gap-x-10 gap-y-5 px-2 sm:px-4'>
                  <div className='col-start-1 col-end-2'>
                    <FormField
                      control={form.control}
                      name='externalDonorFirstNames'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>Nombres</FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                disabled={isInputDisabled}
                                className='text-[14px]'
                                placeholder='Ejem: Roberto Martin...'
                                type='text'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name='externalDonorLastNames'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>Apellidos</FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                disabled={isInputDisabled}
                                className='text-[14px]'
                                placeholder='Ejem: Mendoza Prado...'
                                type='text'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name='externalDonorGender'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>Género</FormLabel>
                            <Select
                              disabled={isInputDisabled}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl className='text-[14px]'>
                                <SelectTrigger>
                                  {field.value ? (
                                    <SelectValue placeholder='Selecciona el tipo de Género' />
                                  ) : (
                                    'Selecciona el tipo de Género'
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(GenderNames).map(([key, value]) => (
                                  <SelectItem className={`text-[14px]`} key={key} value={key}>
                                    {value}
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
                      name='externalDonorBirthDate'
                      render={({ field }) => (
                        <FormItem className='mt-2'>
                          <FormLabel className='text-[14px]'>Fecha de Nacimiento</FormLabel>
                          <Popover
                            open={isInputBirthDateOpen}
                            onOpenChange={setIsInputBirthDateOpen}
                          >
                            <PopoverTrigger asChild>
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <Button
                                  disabled={isInputDisabled}
                                  variant={'outline'}
                                  className={cn(
                                    'text-[14px] w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'LLL dd, y', {
                                      locale: es,
                                    })
                                  ) : (
                                    <span className='text-[14px]'>Fecha de nacimiento</span>
                                  )}
                                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0' align='start'>
                              <Calendar
                                mode='single'
                                selected={field.value!}
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setIsInputBirthDateOpen(false);
                                }}
                                disabled={(date) =>
                                  date > new Date() || date < new Date('1900-01-01')
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>

                          <FormMessage className='text-[13px]' />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='externalDonorOriginCountry'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>País de Origen</FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                disabled={isInputDisabled}
                                className='text-[14px]'
                                placeholder='Ejem: Perú, Colombia, Mexico...'
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

                  <div className='col-start-2 col-end-3'>
                    <FormField
                      control={form.control}
                      name='externalDonorResidenceCountry'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>País de Residencia</FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                disabled={isInputDisabled}
                                className='text-[14px]'
                                placeholder='Ejem: Perú, Colombia, Mexico...'
                                type='text'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name='externalDonorResidenceCity'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>Ciudad de Residencia</FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                disabled={isInputDisabled}
                                className='text-[14px]'
                                placeholder='Ejem: Madrid, Roma, Miami...'
                                type='text'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name='externalDonorEmail'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>E-mail</FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                disabled={isInputDisabled}
                                className='text-[14px]'
                                placeholder='Ejem: example@google.com'
                                type='email'
                                autoComplete='username'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name='externalDonorPhoneNumber'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>Número de Teléfono</FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                disabled={isInputDisabled}
                                className='text-[14px]'
                                placeholder='Ejem: +51 999 999 999'
                                type='text'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name='externalDonorPostalCode'
                      render={({ field }) => {
                        return (
                          <FormItem className='mt-2'>
                            <FormLabel className='text-[14px]'>Código Postal</FormLabel>
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Input
                                disabled={isInputDisabled}
                                className='text-[14px]'
                                placeholder='Ejem: 000453'
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

                  {isMessageErrorDisabled ? (
                    <p className='-mb-4 md:-mb-3 md:row-start-2 md:row-end-3 md:col-start-1 md:col-end-3 mx-auto md:w-full text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                      ❌ Datos incompletos, completa todos los campos para guardar el registro.
                    </p>
                  ) : (
                    <p className='-mt-3 order-last md:-mt-3 md:row-start-3 md:row-end-4 md:col-start-1 md:col-end-3 mx-auto md:w-full text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                      ¡Campos completados correctamente! <br /> Para finalizar por favor guarde los
                      cambios.
                    </p>
                  )}

                  <div className='sm:col-start-1 sm:col-end-3 w-full'>
                    <Button
                      disabled={isSubmitButtonDisabled}
                      type='button'
                      onClick={form.handleSubmit(handleSubmit)}
                      className={cn('w-full text-[14px]')}
                    >
                      Guardar cambios
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  );
};
