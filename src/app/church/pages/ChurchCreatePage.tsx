/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { useEffect, useState } from 'react';

import type * as z from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Toaster, toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import { CalendarIcon } from 'lucide-react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { churchFormSchema } from '@/app/church/validations';
import { type ErrorResponse } from '@/shared/interfaces';
import { createChurch, getMainChurch } from '@/app/church/services';
import { WorshipTimes, WorshipTimesKeys } from '@/app/church/enums';
import { useChurchCreateSubmitButtonLogic } from '@/app/church/hooks';

import { LoadingSpinner } from '@/layouts/components';

import { cn } from '@/shared/lib/utils';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Calendar } from '@/shared/components/ui/calendar';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/shared/components/ui/command';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

import {
  CountryNames,
  DepartmentNames,
  DistrictNames,
  ProvinceNames,
  UrbanSectorNames,
} from '@/shared/enums';
import {
  validateDistrictsAllowedByModule,
  validateUrbanSectorsAllowedByDistrict,
} from '@/shared/helpers';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

export const ChurchCreatePage = (): JSX.Element => {
  //* States
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isInputMainChurchOpen, setIsInputMainChurchOpen] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);
  const [isInputFoundingDateOpen, setIsInputFoundingDateOpen] = useState<boolean>(false);

  //* Hooks (external libraries)
  const { pathname } = useLocation();
  const navigate = useNavigate();

  //* Form
  const form = useForm<z.infer<typeof churchFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(churchFormSchema),
    defaultValues: {
      churchName: '',
      isAnexe: false,
      country: '',
      email: '',
      phoneNumber: '',
      department: '',
      province: '',
      district: '',
      urbanSector: '',
      address: '',
      worshipTimes: [],
      referenceAddress: '',
      theirMainChurch: '',
    },
  });

  //* Watchers
  const district = form.watch('district');
  const isAnexe = form.watch('isAnexe');
  const theirMainChurch = form.watch('theirMainChurch');

  //* Custom hooks
  useChurchCreateSubmitButtonLogic({
    formChurchCreate: form,
    isInputDisabled,
    setIsSubmitButtonDisabled,
    setIsMessageErrorDisabled,
  });

  //* Effects
  useEffect(() => {
    form.resetField('urbanSector', {
      keepError: true,
    });
  }, [district]);

  useEffect(() => {
    form.resetField('theirMainChurch', {
      keepError: true,
    });
  }, [isAnexe]);

  useEffect(() => {
    if (isAnexe && !theirMainChurch) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }
  }, [isAnexe]);

  //* Helpers
  const disabledDistricts = validateDistrictsAllowedByModule(pathname);
  const disabledUrbanSectors = validateUrbanSectorsAllowedByDistrict(district);

  //* Mutation
  const mutation = useMutation({
    mutationFn: createChurch,
    onError: (error: ErrorResponse) => {
      if (error.message !== 'Unauthorized') {
        toast.error(error.message, {
          position: 'top-center',
          className: 'justify-center',
        });

        setTimeout(() => {
          setIsInputDisabled(false);
          setIsSubmitButtonDisabled(false);
        }, 1500);
      }

      if (error.message === 'Unauthorized') {
        toast.error('Operación rechazada, el token expiro ingresa nuevamente.', {
          position: 'top-center',
          className: 'justify-center',
        });

        setTimeout(() => {
          navigate('/');
        }, 3500);
      }
    },
    onSuccess: () => {
      toast.success('Registro creado exitosamente.', {
        position: 'top-center',
        className: 'justify-center',
      });

      setTimeout(() => {
        setIsInputDisabled(false);
        setIsSubmitButtonDisabled(false);
      }, 1500);

      setTimeout(() => {
        form.reset();
      }, 1600);

      setTimeout(() => {
        navigate('/churches');
      }, 2600);
    },
  });

  //* Querys
  const { data, isLoading } = useQuery({
    queryKey: ['mainChurch'],
    queryFn: getMainChurch,
  });

  if (isLoading) return <LoadingSpinner />;

  //* Form handler
  const handleSubmit = (formData: z.infer<typeof churchFormSchema>): void => {
    mutation.mutate(formData);
  };

  return (
    <div className='animate-fadeInPage'>
      <h1 className='text-center pt-1 md:pt-0 pb-1 font-sans font-bold text-slate-500 dark:text-slate-400 text-[2.1rem] md:text-[2.5rem] lg:text-[2.8rem] xl:text-[3rem]'>
        Modulo Iglesia
      </h1>

      <hr className='md:p-[0.02rem] bg-slate-500' />

      <h1 className='text-left px-4 sm:px-5 pt-2 2xl:px-24 font-sans font-bold text-green-500 text-[1.5rem] sm:text-[1.75rem] md:text-[1.85rem] lg:text-[1.9rem] xl:text-[2.1rem] 2xl:text-4xl'>
        Crear una nueva iglesia
      </h1>

      <p className='dark:text-slate-300 text-left font-sans font-bold pl-5 sm:pl-7 2xl:px-28 text-[12px] md:text-[15px] xl:text-base'>
        Por favor llena los siguientes datos para crear una nueva iglesia.
      </p>

      <div className='flex flex-col items-center pb-8 gap-y-8 md:gap-y-8 px-5 py-4 sm:px-12 sm:py-8 2xl:px-36 2xl:py-8'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='w-full flex flex-col md:grid grid-cols-2 gap-x-10 gap-y-4'
          >
            <div className='col-start-1 col-end-2'>
              <FormField
                control={form.control}
                name='churchName'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Nombre
                      </FormLabel>
                      <FormDescription className='text-[14px]'>
                        Asignar una nombre a la iglesia.
                      </FormDescription>
                      <FormControl>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Eje: Iglesia Roca Fuerte...'
                          type='text'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='foundingDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col mt-4'>
                    <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                      Fecha de fundación
                    </FormLabel>
                    <Popover
                      open={isInputFoundingDateOpen}
                      onOpenChange={setIsInputFoundingDateOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={isInputDisabled}
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'LLL dd, y', { locale: es })
                            ) : (
                              <span className='text-sm md:text-[14px] lg:text-sm'>
                                Selecciona la fecha de fundación
                              </span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setIsInputFoundingDateOpen(false);
                          }}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className='pl-2 text-blue-600 text-[11.5px] xl:text-[12.5px] font-bold italic'>
                      * Fecha en la que se fundo o se creo la iglesia.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='worshipTimes'
                render={() => (
                  <FormItem>
                    <div className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Horarios
                      </FormLabel>
                      <FormDescription className='text-[14px]'>
                        Seleccione los horarios que tendrá la iglesia.
                      </FormDescription>
                    </div>
                    <div className='flex flex-wrap space-x-5 space-y-1'>
                      {Object.values(WorshipTimes).map((worshipTime) => (
                        <FormField
                          key={worshipTime}
                          control={form.control}
                          name='worshipTimes'
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={worshipTime}
                                className='flex items-center space-x-2 space-y-0'
                              >
                                <FormControl className='grid'>
                                  <Checkbox
                                    disabled={isInputDisabled}
                                    checked={field.value?.includes(worshipTime)}
                                    onCheckedChange={(checked) => {
                                      let updatedWorshipTimes: WorshipTimes[] = [];
                                      checked
                                        ? (updatedWorshipTimes = field.value
                                            ? [...field.value, worshipTime]
                                            : [worshipTime])
                                        : (updatedWorshipTimes =
                                            field.value?.filter((value) => value !== worshipTime) ??
                                            []);

                                      field.onChange(updatedWorshipTimes);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className='text-[14px] font-medium'>
                                  {WorshipTimesKeys[worshipTime]}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        E-mail
                      </FormLabel>
                      <FormDescription className='text-[14px]'>
                        Asigne un e-mail que tendrá la iglesia.
                      </FormDescription>
                      <FormControl>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Eje: iglesia.central@example.com'
                          type='email'
                          autoComplete='username'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Numero de teléfono
                      </FormLabel>
                      <FormDescription className='text-[14px]'>
                        Asigne un numero telefónico que tendrá la iglesia.
                      </FormDescription>
                      <FormControl>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Eje: +51 999-999-999'
                          type='text'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='country'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>País</FormLabel>
                      <FormDescription className='text-[14px]'>
                        Asignar el país al que pertenece la iglesia.
                      </FormDescription>
                      <Select
                        disabled={isInputDisabled}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona el país' />
                            ) : (
                              'Selecciona el país'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(CountryNames).map(([key, value]) => (
                            <SelectItem className={`text-[14px]`} key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='department'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Departamento
                      </FormLabel>
                      <FormDescription className='text-[14px]'>
                        Asignar el departamento al que pertenece la casa familiar.
                      </FormDescription>
                      <Select
                        disabled={isInputDisabled}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona el departamento' />
                            ) : (
                              'Selecciona el departamento'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(DepartmentNames).map(([key, value]) => (
                            <SelectItem className={`text-[14px]`} key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className='col-start-2 col-end-3'>
              <FormField
                control={form.control}
                name='province'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Provincia
                      </FormLabel>
                      <FormDescription className='text-[14px]'>
                        Asignar la provincia a la que pertenece la iglesia.
                      </FormDescription>
                      <Select
                        disabled={isInputDisabled}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona la provincia' />
                            ) : (
                              'Selecciona la provincia'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(ProvinceNames).map(([key, value]) => (
                            <SelectItem className={`text-[14px]`} key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='district'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Distrito
                      </FormLabel>
                      <FormDescription className='text-[14px]'>
                        Asignar el distrito al que pertenece la iglesia.
                      </FormDescription>
                      <Select
                        disabled={isInputDisabled}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona el distrito' />
                            ) : (
                              'Selecciona el distrito'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(DistrictNames).map(([key, value]) => (
                            <SelectItem
                              className={`text-[14px] ${disabledDistricts?.disabledDistricts?.includes(value) ? 'hidden' : ''}`}
                              key={key}
                              value={key}
                            >
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='urbanSector'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3 md:mt-5'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Sector Urbano
                      </FormLabel>
                      <FormDescription className='text-[14px]'>
                        Asignar el sector urbano al que pertenece la iglesia.
                      </FormDescription>
                      <Select
                        disabled={isInputDisabled}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona el sector urbano' />
                            ) : (
                              'Selecciona el sector urbano'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(UrbanSectorNames).map(([key, value]) => (
                            <SelectItem
                              className={`text-[14px] ${disabledUrbanSectors?.disabledUrbanSectors?.includes(value) ?? !district ? 'hidden' : ''}`}
                              key={key}
                              value={key}
                            >
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3 md:mt-5'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Dirección
                      </FormLabel>
                      <FormDescription className='text-[14px]'>
                        Asignar la dirección de la iglesia.
                      </FormDescription>
                      <FormControl>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Ej: Av. Central 123 - Mz.A Lt.3'
                          type='text'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='referenceAddress'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3 md:mt-5'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Referencia de dirección
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isInputDisabled}
                          placeholder='Comentarios sobre la dirección referencia de la iglesia...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='isAnexe'
                render={({ field }) => (
                  <FormItem className='flex flex-row gap-2 items-end mt-3 px-1 py-3 h-[2.5rem]'>
                    <FormControl>
                      <Checkbox
                        disabled={isInputDisabled}
                        checked={field?.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                        }}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel className='text-[13px] md:text-[14px]'>
                        ¿Esta iglesia sera un anexo?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {isAnexe && (
                <FormField
                  control={form.control}
                  name='theirMainChurch'
                  render={({ field }) => {
                    return (
                      <FormItem className='mt-3'>
                        <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                          Iglesia Principal
                        </FormLabel>
                        <FormDescription className='text-[14px]'>
                          Seleccione una iglesia principal para este anexo.
                        </FormDescription>
                        <Popover
                          open={isInputMainChurchOpen}
                          onOpenChange={setIsInputMainChurchOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                disabled={isInputDisabled}
                                variant='outline'
                                role='combobox'
                                className={cn('w-full justify-between ')}
                              >
                                {field.value
                                  ? data?.find((church) => church.id === field.value)?.churchName
                                  : 'Busque y seleccione una iglesia'}
                                <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align='center' className='w-auto px-4 py-2'>
                            <Command>
                              <CommandInput
                                placeholder='Busque una iglesia...'
                                className='h-9 text-[14px]'
                              />
                              <CommandEmpty>Iglesia no encontrada.</CommandEmpty>
                              <CommandGroup className='max-h-[200px] h-auto'>
                                {data?.map((church) => (
                                  <CommandItem
                                    className='text-[14px]'
                                    value={church?.id}
                                    key={church?.id}
                                    onSelect={() => {
                                      form.setValue('theirMainChurch', church?.id);
                                      setIsInputMainChurchOpen(false);
                                    }}
                                  >
                                    {church?.churchName}
                                    <CheckIcon
                                      className={cn(
                                        'ml-auto h-4 w-4',
                                        church.id === field.value ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                  </CommandItem>
                                ))}

                                {data?.length === 0 && (
                                  <CommandItem>{'No hay iglesias disponibles'}</CommandItem>
                                )}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )}
            </div>

            {isMessageErrorDisabled ? (
              <p className='-mb-5 mt-2 md:-mb-2 md:row-start-2 md:row-end-3 md:col-start-1 md:col-end-3 mx-auto md:w-[100%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                ❌ Datos incompletos, completa todos los campos para crear el registro.
              </p>
            ) : (
              <p className='-mt-2 order-last md:-mt-2 md:row-start-4 md:row-end-5 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                ¡Campos completados correctamente! <br />
              </p>
            )}

            <div className='mt-2 md:mt-1 md:col-start-1 md:col-end-3 md:row-start-3 md:row-end-4 w-full md:w-[20rem] md:m-auto'>
              <Toaster position='top-center' richColors />
              <Button
                disabled={isSubmitButtonDisabled}
                type='submit'
                className='w-full text-[14px]'
                onClick={() => {
                  setTimeout(() => {
                    if (Object.keys(form.formState.errors).length === 0) {
                      setIsSubmitButtonDisabled(true);
                      setIsInputDisabled(true);
                    }
                  }, 100);
                }}
              >
                Registrar Iglesia
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
