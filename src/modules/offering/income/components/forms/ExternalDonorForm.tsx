import { useState } from 'react';

import { type z } from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { CalendarIcon, User } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { ExternalDonorFormSkeleton } from '@/modules/offering/income/components';

import {
  useExternalDonorSetData,
  useExternalDonorUpdateSubmitButtonLogic,
} from '@/modules/offering/income/hooks';
import { useExternalDonorUpdateMutation } from '@/modules/offering/income/hooks';

import { type ExternalDonorResponse } from '@/modules/offering/income/interfaces/external-donor-response.interface';
import { ExternalDonorUpdateFormSchema } from '@/modules/offering/income/schemas/external-donor-update-form-schema';

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
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

interface ExternalDonorFormProps {
  id?: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data?: ExternalDonorResponse;
  isCreate?: boolean;
}

export const ExternalDonorForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
  isCreate = false,
}: ExternalDonorFormProps): JSX.Element => {
  //* States
  const [isInputBirthDateOpen, setIsInputBirthDateOpen] = useState<boolean>(false);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(false);
  const [_isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);

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
  useExternalDonorSetData({
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
    <div className='w-auto sm:w-[500px] md:w-[650px] lg:w-[700px] -mt-2'>
      {/* Header */}
      <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-violet-600 via-violet-700 to-purple-700 dark:from-violet-800 dark:via-violet-900 dark:to-purple-900 px-4 py-4 md:px-6 mb-5'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -top-1/2 -right-1/4 w-48 h-48 rounded-full bg-white/10' />
          <div className='absolute -bottom-1/4 -left-1/4 w-32 h-32 rounded-full bg-white/5' />
        </div>
        <div className='relative z-10'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-2 bg-white/10 rounded-lg'>
              <User className='w-5 h-5 text-white/90' />
            </div>
            <div className='flex-1'>
              <h2 className='text-lg md:text-xl font-bold text-white font-outfit'>
                {isCreate ? 'Registrar Donante Externo' : 'Modificar Donante Externo'}
              </h2>
              {!isLoadingData && data && !isCreate && (
                <p className='text-violet-100/80 text-[12px] md:text-[13px] font-inter'>
                  {data?.firstNames} {data?.lastNames}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoadingData && <ExternalDonorFormSkeleton />}

      {!isLoadingData && (
        <div className='px-1'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-5'>
              {/* Información Personal */}
              <div className='space-y-4'>
                <div className='flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700'>
                  <h3 className='text-[13px] md:text-[14px] font-semibold text-violet-600 dark:text-violet-400 font-inter'>
                    Información Personal
                  </h3>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='externalDonorFirstNames'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                          Nombres
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isInputDisabled}
                            className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                            placeholder='Ej: Roberto Martin'
                            type='text'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-[12px] font-inter' />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='externalDonorLastNames'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                          Apellidos
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isInputDisabled}
                            className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                            placeholder='Ej: Mendoza Prado'
                            type='text'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-[12px] font-inter' />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='externalDonorGender'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                          Género
                        </FormLabel>
                        <Select
                          disabled={isInputDisabled}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'>
                              {field.value ? (
                                <SelectValue placeholder='Selecciona el género' />
                              ) : (
                                'Selecciona el género'
                              )}
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(GenderNames).map(([key, value]) => (
                              <SelectItem
                                className='text-[13px] md:text-[14px] font-inter'
                                key={key}
                                value={key}
                              >
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className='text-[12px] font-inter' />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='externalDonorBirthDate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                          Fecha de Nacimiento
                        </FormLabel>
                        <Popover open={isInputBirthDateOpen} onOpenChange={setIsInputBirthDateOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                disabled={isInputDisabled}
                                variant='outline'
                                className={cn(
                                  'text-[13px] md:text-[14px] w-full pl-3 text-left font-normal font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'dd/MM/yyyy', { locale: es })
                                ) : (
                                  <span>Selecciona una fecha</span>
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
                        <FormMessage className='text-[12px] font-inter' />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Información de Origen */}
              <div className='space-y-4'>
                <div className='flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700'>
                  <h3 className='text-[13px] md:text-[14px] font-semibold text-violet-600 dark:text-violet-400 font-inter'>
                    Información de Origen
                  </h3>
                </div>

                <FormField
                  control={form.control}
                  name='externalDonorOriginCountry'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                        País de Origen
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isInputDisabled}
                          className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                          placeholder='Ej: Perú, Colombia, México'
                          type='text'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-[12px] font-inter' />
                    </FormItem>
                  )}
                />
              </div>

              {/* Información de Contacto y Residencia */}
              <div className='space-y-4'>
                <div className='flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700'>
                  <h3 className='text-[13px] md:text-[14px] font-semibold text-violet-600 dark:text-violet-400 font-inter'>
                    Contacto y Residencia
                  </h3>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='externalDonorEmail'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                          E-mail
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isInputDisabled}
                            className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                            placeholder='Ej: ejemplo@correo.com'
                            type='email'
                            autoComplete='username'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-[12px] font-inter' />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='externalDonorPhoneNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                          Teléfono
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isInputDisabled}
                            className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                            placeholder='Ej: +51 999 999 999'
                            type='text'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-[12px] font-inter' />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='externalDonorResidenceCountry'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                          País de Residencia
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isInputDisabled}
                            className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                            placeholder='Ej: Perú, Colombia, México'
                            type='text'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-[12px] font-inter' />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='externalDonorResidenceCity'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                          Ciudad de Residencia
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isInputDisabled}
                            className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                            placeholder='Ej: Madrid, Roma, Miami'
                            type='text'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-[12px] font-inter' />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='externalDonorPostalCode'
                    render={({ field }) => (
                      <FormItem className='md:col-span-2'>
                        <FormLabel className='text-[13px] md:text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-inter'>
                          Código Postal
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isInputDisabled}
                            className='text-[13px] md:text-[14px] font-inter bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                            placeholder='Ej: 000453'
                            type='text'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-[12px] font-inter' />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3 pt-2'>
                <Button
                  disabled={isSubmitButtonDisabled}
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
                  disabled={isSubmitButtonDisabled}
                  type='submit'
                  className={cn(
                    'flex-1 h-10 text-[13px] md:text-[14px] font-semibold font-inter',
                    'bg-gradient-to-r from-violet-500 to-purple-500 text-white',
                    'hover:from-violet-600 hover:to-purple-600',
                    'shadow-sm hover:shadow-md hover:shadow-violet-500/20',
                    'transition-all duration-200',
                    isSubmitButtonDisabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {externalDonorUpdateMutation.isPending ? 'Procesando...' : 'Guardar cambios'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};
