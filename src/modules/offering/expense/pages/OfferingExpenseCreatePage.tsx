/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import type * as z from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast, Toaster } from 'sonner';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { useQuery } from '@tanstack/react-query';
import { TiDeleteOutline } from 'react-icons/ti';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { getSimpleChurches } from '@/modules/church/services/church.service';

import {
  OfferingExpenseSearchType,
  OfferingExpenseSearchTypeNames,
} from '@/modules/offering/expense/enums/offering-expense-search-type.enum';
import {
  SubTypeNamesOfferingExpenseSearchByOtherExpenses,
  SubTypeNamesOfferingExpenseSearchBySuppliesExpenses,
  SubTypeNamesOfferingExpenseSearchByOperativeExpenses,
  SubTypeNamesOfferingExpenseSearchByDecorationExpenses,
  SubTypeNamesOfferingExpenseSearchByPlaningEventsExpenses,
  SubTypeNamesOfferingExpenseSearchByMaintenanceAndRepairExpenses,
  SubTypeNamesOfferingExpenseSearchByEquipmentAndTechnologyExpenses,
} from '@/modules/offering/expense/enums/offering-expense-search-sub-type.enum';

import { useOfferingExpenseFileDropZone } from '@/modules/offering/expense/hooks/useOfferingExpenseFileDropZone';
import { useOfferingExpenseCreationMutation } from '@/modules/offering/expense/hooks/useOfferingExpenseCreationMutation';
import { useOfferingExpenseCreationSubmitButtonLogic } from '@/modules/offering/expense/hooks/useOfferingExpenseCreationSubmitButtonLogic';

import { offeringExpenseFormSchema } from '@/modules/offering/expense/validations/offering-expense-form-schema';

import { CurrencyTypeNames } from '@/modules/offering/shared/enums/currency-type.enum';
import { OfferingFileType } from '@/modules/offering/shared/enums/offering-file-type.enum';

import { cn } from '@/shared/lib/utils';

import { useImagesUploadMutation } from '@/modules/offering/shared/hooks/useImagesUploadMutation';

import { type FilesProps } from '@/modules/offering/shared/interfaces/files-props.interface';
import { type RejectionProps } from '@/modules/offering/shared/interfaces/rejected-props.interface';

import { PageTitle } from '@/shared/components/page/PageTitle';

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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/shared/components/ui/command';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { Textarea } from '@/shared/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

export const OfferingExpenseCreatePage = (): JSX.Element => {
  //* States
  const [isInputChurchOpen, setIsInputChurchOpen] = useState<boolean>(false);
  const [isInputDateOpen, setIsInputDateOpen] = useState<boolean>(false);

  const [files, setFiles] = useState<FilesProps[]>([]);
  const [rejected, setRejected] = useState<RejectionProps[]>([]);

  const [isDropZoneDisabled, setIsDropZoneDisabled] = useState<boolean>(false);

  const [isDeleteFileButtonDisabled, setIsDeleteFileButtonDisabled] = useState<boolean>(false);

  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(true);
  const [isMessageErrorDisabled, setIsMessageErrorDisabled] = useState<boolean>(true);

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  //* Form
  const form = useForm<z.infer<typeof offeringExpenseFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(offeringExpenseFormSchema),
    defaultValues: {
      type: '',
      subType: '',
      amount: '',
      date: undefined,
      currency: '',
      comments: '',
      fileNames: [],
      churchId: '',
    },
  });

  //* Watchers
  const type = form.watch('type');

  //* Custom hooks
  useOfferingExpenseCreationSubmitButtonLogic({
    isDropZoneDisabled,
    isDeleteFileButtonDisabled,
    isInputDisabled,
    offeringExpenseCreationForm: form,
    setIsDropZoneDisabled,
    setIsMessageErrorDisabled,
    setIsSubmitButtonDisabled,
  });

  //* Queries
  const churchesQuery = useQuery({
    queryKey: ['churches'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

  const { onDrop, removeAll, removeFile, removeRejected } = useOfferingExpenseFileDropZone({
    offeringExpenseForm: form,
    files,
    setFiles,
    setRejected,
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
    },
    maxSize: 1024 * 1024 * 5, // 1KB
    onDrop,
    disabled: isDropZoneDisabled,
  });

  const offeringExpenseCreationMutation = useOfferingExpenseCreationMutation({
    setFiles,
    imageUrls,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
    offeringExpenseCreationForm: form,
  });

  const uploadImagesMutation = useImagesUploadMutation();

  //* Effects
  useEffect(() => {
    document.title = 'Modulo Ofrenda - IcupApp';
  }, []);

  //* Form handler
  const handleSubmit = async (
    formData: z.infer<typeof offeringExpenseFormSchema>
  ): Promise<void> => {
    let imageUrls;

    try {
      if (files.length >= 1) {
        const uploadResult = await uploadImagesMutation.mutateAsync({
          files: files as any,
          fileType: OfferingFileType.Expense,
          offeringType: formData.type,
          offeringSubType: formData.subType ?? null,
        });

        imageUrls = uploadResult.imageUrls;
        setImageUrls(imageUrls ?? []);
      }

      await offeringExpenseCreationMutation.mutateAsync({
        type: formData.type,
        subType: !formData.subType ? undefined : formData.subType,
        amount: formData.amount,
        currency: formData.currency,
        date: formData.date,
        comments: formData.comments,
        churchId: formData.churchId,
        recordStatus: formData.recordStatus,
        imageUrls: (imageUrls as any) ?? [],
      });
    } catch (error) {
      if (uploadImagesMutation.isError) {
        toast.warning(
          '¡Oops! Fallo en la subida de imágenes, por favor actualize el navegador y vuelva a intentarlo.',
          {
            position: 'top-center',
            className: 'justify-center',
          }
        );
      }

      setTimeout(() => {
        setIsInputDisabled(false);
        setIsSubmitButtonDisabled(false);
      }, 1500);
    }
  };

  return (
    <div className='animate-fadeInPage'>
      <PageTitle className='text-red-600'>Modulo de Salida</PageTitle>

      <h1 className='text-left leading-8 pb-[2px] pt-2 px-4 sm:px-5 2xl:px-10 font-sans font-bold text-green-500 text-[1.6rem] sm:text-[1.75rem] md:text-[1.85rem] lg:text-[1.9rem] xl:text-[2.1rem] 2xl:text-4xl'>
        Crear nueva salida de ofrenda
      </h1>
      <p className='dark:text-slate-300 text-left font-sans font-bold pl-5 pr-6 sm:pl-7 2xl:px-14 text-[13.5px] md:text-[15px] xl:text-base'>
        Por favor llena los siguientes datos para crear un nuevo registro de salida.
      </p>

      <div className='flex flex-col items-center pb-8 gap-y-8 md:gap-y-12 px-6 py-4 sm:px-12 sm:py-8 2xl:px-[5rem]  2xl:py-8'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='w-full flex flex-col md:grid md:grid-cols-2 gap-x-8 gap-y-4'
          >
            <div className='md:col-start-1 md:col-end-2'>
              <FormField
                control={form.control}
                name='churchId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                      Iglesia
                    </FormLabel>
                    <FormDescription className='text-[13.5px] md:text-[14px]'>
                      Selecciona una iglesia para asignarla al registro.
                    </FormDescription>
                    <Popover open={isInputChurchOpen} onOpenChange={setIsInputChurchOpen}>
                      <PopoverTrigger asChild>
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <Button
                            disabled={isInputDisabled}
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'w-full justify-between',
                              !field.value && 'text-slate-500 font-normal'
                            )}
                          >
                            {field.value
                              ? churchesQuery?.data?.find((zone) => zone.id === field.value)
                                  ?.abbreviatedChurchName
                              : 'Busque y seleccione una iglesia'}
                            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-5' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align='center' className='w-auto px-4 py-2'>
                        <Command>
                          {churchesQuery?.data?.length && churchesQuery?.data?.length > 0 ? (
                            <>
                              <CommandInput
                                placeholder='Busque una iglesia'
                                className='h-9 text-[14px]'
                              />
                              <CommandEmpty>Iglesia no encontrada.</CommandEmpty>
                              <CommandGroup className='max-h-[200px] h-auto'>
                                {churchesQuery?.data?.map((church) => (
                                  <CommandItem
                                    className='text-[14px]'
                                    value={church.abbreviatedChurchName}
                                    key={church.id}
                                    onSelect={() => {
                                      form.setValue('churchId', church.id);
                                      setIsInputChurchOpen(false);
                                    }}
                                  >
                                    {church.abbreviatedChurchName}
                                    <CheckIcon
                                      className={cn(
                                        'ml-auto h-4 w-4',
                                        church.id === field.value ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </>
                          ) : (
                            churchesQuery?.data?.length === 0 && (
                              <p className='text-[13.5px] md:text-[14.5px] font-medium text-red-500 text-center'>
                                ❌No hay iglesias disponibles.
                              </p>
                            )
                          )}
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage className='text-[13px]' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='type'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Tipo</FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Selecciona un tipo de gasto para el registro.
                      </FormDescription>
                      <Select
                        onOpenChange={() => {
                          form.resetField('subType', {
                            keepError: true,
                          });
                        }}
                        disabled={isInputDisabled}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona una tipo de egreso o gasto' />
                            ) : (
                              'Selecciona una tipo de egreso o gasto'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(OfferingExpenseSearchTypeNames).map(
                            ([key, value]) =>
                              key !== OfferingExpenseSearchType.RecordStatus && (
                                <SelectItem key={key} value={key}>
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

              {type !== OfferingExpenseSearchType.ExpensesAdjustment && (
                <FormField
                  control={form.control}
                  name='subType'
                  render={({ field }) => {
                    return (
                      <FormItem className='mt-3'>
                        <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                          Sub-Tipo
                        </FormLabel>
                        <FormDescription className='text-[13.5px] md:text-[14px]'>
                          Asignar un sub-tipo de gasto al registro.
                        </FormDescription>
                        <Select
                          disabled={isInputDisabled}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl className='text-[14px] md:text-[14px]'>
                            <SelectTrigger>
                              {field.value ? (
                                <SelectValue placeholder='Selecciona una sub-tipo de gasto' />
                              ) : (
                                'Selecciona una sub-tipo de gasto'
                              )}
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(
                              type === OfferingExpenseSearchType.OperationalExpenses
                                ? SubTypeNamesOfferingExpenseSearchByOperativeExpenses
                                : type === OfferingExpenseSearchType.PlaningEventsExpenses
                                  ? SubTypeNamesOfferingExpenseSearchByPlaningEventsExpenses
                                  : type === OfferingExpenseSearchType.DecorationExpenses
                                    ? SubTypeNamesOfferingExpenseSearchByDecorationExpenses
                                    : type ===
                                        OfferingExpenseSearchType.EquipmentAndTechnologyExpenses
                                      ? SubTypeNamesOfferingExpenseSearchByEquipmentAndTechnologyExpenses
                                      : type ===
                                          OfferingExpenseSearchType.MaintenanceAndRepairExpenses
                                        ? SubTypeNamesOfferingExpenseSearchByMaintenanceAndRepairExpenses
                                        : type === OfferingExpenseSearchType.SuppliesExpenses
                                          ? SubTypeNamesOfferingExpenseSearchBySuppliesExpenses
                                          : SubTypeNamesOfferingExpenseSearchByOtherExpenses
                            ).map(([key, value]) => (
                              <SelectItem key={key} value={key}>
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
              )}

              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Monto
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Digita la cantidad del gasto realizado.
                      </FormDescription>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Input
                          disabled={isInputDisabled}
                          placeholder='Monto total del gasto realizado'
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
                name='currency'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                        Divisa / Moneda
                      </FormLabel>
                      <FormDescription className='text-[13.5px] md:text-[14px]'>
                        Asignar un tipo de divisa o moneda al registro.
                      </FormDescription>
                      <Select
                        disabled={isInputDisabled}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl className='text-[14px] md:text-[14px]'>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='Selecciona una tipo de divisa o moneda' />
                            ) : (
                              'Selecciona una tipo de divisa o moneda'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(CurrencyTypeNames).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
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
                name='date'
                render={({ field }) => (
                  <FormItem className='mt-3'>
                    <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Fecha</FormLabel>
                    <FormDescription className='text-[13.5px] md:text-[14px]'>
                      Selecciona la fecha de gasto o compra realizada.
                    </FormDescription>
                    <Popover open={isInputDateOpen} onOpenChange={setIsInputDateOpen}>
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
                              format(field.value, 'LLL dd, y', { locale: es })
                            ) : (
                              <span className='text-[14px]'>
                                Seleccione la fecha del gasto o compra
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
                            setIsInputDateOpen(false);
                          }}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
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
                name='comments'
                render={({ field }) => {
                  return (
                    <FormItem className='mt-3'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold flex items-center'>
                        Detalles / Observaciones
                        <span className='ml-3 inline-block bg-orange-200 text-orange-600 border text-[10px] font-bold uppercase px-2 py-[2px] rounded-full mr-1'>
                          Requerido
                        </span>
                      </FormLabel>
                      {type === OfferingExpenseSearchType.ExpensesAdjustment && (
                        <FormDescription>
                          Escribe una breve descripción sobre el ajuste
                        </FormDescription>
                      )}
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <Textarea
                          disabled={isInputDisabled}
                          placeholder={`${
                            type === OfferingExpenseSearchType.ExpensesAdjustment
                              ? `Detalles y/u observaciones sobre el ajuste de salida...`
                              : 'Detalles y/u observaciones sobre el registro de salida...'
                          }`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-[13px]' />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className='md:col-start-2 md:col-end-3 md:border-l-2 border-slate-200 dark:border-slate-800 md:pl-6'>
              <FormField
                control={form.control}
                name='fileNames'
                render={() => {
                  return (
                    <FormItem className='mt-3 md:mt-0'>
                      <FormLabel className='text-[14px] md:text-[14.5px] font-bold flex items-center'>
                        Subir imagen
                        <span className='ml-3 inline-block bg-gray-200 text-slate-600 border text-[10px] font-semibold uppercase px-2 py-[2px] rounded-full mr-1'>
                          Opcional
                        </span>
                      </FormLabel>
                      <FormControl className='text-[14px] md:text-[14px]'>
                        <div
                          {...getRootProps({
                            className:
                              'h-[10rem] font-medium text-sm sm:text-[15px] p-10 sm:p-12 md:p-16 max-w-[25rem] md:max-w-[25rem] m-auto border border-dashed border-black dark:border-white hover:bg-green-200 dark:hover:text-black ease-in duration-200 text-center',
                          })}
                        >
                          <input {...getInputProps()} className='m-auto w-[20rem]' />

                          {isDragActive ? (
                            <p>Suelte sus archivos aquí ...</p>
                          ) : (
                            <p className='pt-5 md:pt-0'>
                              Arrastre y suelte sus archivos aquí, o haga clic para seleccionar.
                            </p>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className='text-[13px]' />
                      {files && files.length > 3 ? (
                        <span className='text-red-500 font-bold text-[12.5px] md:text-[13px] text-center mx-auto justify-center flex'>
                          ❌ Sobrepasa el limite, elige como máximo solo 3 imágenes.
                        </span>
                      ) : (
                        <span className='font-medium text-[12.5px] md:text-[13px] pl-3 md:pl-6 mt-1 flex flex-col'>
                          <span>✅ Máximo 3 archivos.</span>
                          <span>✅ El campo se bloqueara al llegar o pasar los 3 archivos.</span>
                        </span>
                      )}
                    </FormItem>
                  );
                }}
              />
              <section className='mt-10'>
                <div className='flex gap-4 items-center justify-between'>
                  <h2 className='text-[16px] md:text-[18px] font-bold'>Pre-visualización</h2>
                  <button
                    type='button'
                    disabled={isDeleteFileButtonDisabled}
                    onClick={removeAll}
                    className='mt-1 text-[11px] md:text-[11px] w-[8rem] md:w-[10rem] p-2 uppercase tracking-wider font-bold text-red-500 border border-red-400 rounded-md  hover:bg-secondary-400 hover:text-white ease-in duration-200 hover:bg-red-500 transition-colors'
                  >
                    Remover todos los archivos
                  </button>
                </div>

                {/* Accepted files */}
                <h3 className='text-[14.5px] lg:text-[16px] font-semibold mt-5 border-b pb-3'>
                  Archivos Aceptados
                </h3>
                <ul className='mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 gap-x-5 gap-y-20'>
                  {files.map((file) => (
                    <li key={file.name} className='relative h-32 rounded-md shadow-lg'>
                      <img
                        src={file.preview}
                        alt={file.name}
                        width={100}
                        height={100}
                        onLoad={() => {
                          URL.revokeObjectURL(file.preview);
                        }}
                        className='h-full w-full object-contain rounded-md'
                      />
                      <button
                        type='button'
                        disabled={isDeleteFileButtonDisabled}
                        className='w-7 h-7 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-white transition-colors'
                        onClick={() => {
                          removeFile(file.name);
                        }}
                      >
                        <TiDeleteOutline className='w-12 h-12 fill-red-500 hover:fill-secondary-400 transition-colors' />
                      </button>
                      <p className='mt-2 text-neutral-500 text-[12px] font-medium'>{file.name}</p>
                    </li>
                  ))}
                </ul>

                {/* Rejected Files */}
                <h3 className='text-[14.5px] lg:text-[16px] font-semibold mt-20 border-b pb-3'>
                  Archivos rechazados
                </h3>
                <ul className='mt-2 flex flex-col'>
                  {rejected.map(({ file, errors }) => (
                    <li key={file.name} className='flex items-start justify-between'>
                      <div>
                        <p className='mt-2 text-neutral-500 text-sm font-medium'>{file.name}</p>
                        <ul className='text-[14px] text-red-400 flex gap-3 font-medium'>
                          {errors.map((error) => (
                            <li
                              key={error.code}
                            >{`${error.message === 'File type must be image/*' ? 'Tipo de archivo debe ser una imagen.' : 'Debe ser un archivo menor a 1000KB.'}`}</li>
                          ))}
                        </ul>
                      </div>
                      <button
                        type='button'
                        disabled={isDeleteFileButtonDisabled}
                        className='mt-1 py-1 text-[11px] md:text-[11.5px] uppercase tracking-wider font-bold text-red-500 border border-red-400 rounded-md px-3 hover:bg-red-500 hover:text-white ease-in duration-200 transition-colors'
                        onClick={() => {
                          removeRejected(file.name);
                        }}
                      >
                        remover
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {isMessageErrorDisabled ? (
              <p className='-mb-5 mt-2 md:-mb-2 md:row-start-2 md:row-end-3 md:col-start-1 md:col-end-3 mx-auto md:w-[100%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                ❌ Datos incompletos, completa todos los campos para crear el registro.
              </p>
            ) : (
              <p className='-mt-2 order-last md:-mt-3 md:row-start-4 md:row-end-5 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                ¡Campos completados correctamente! <br />
              </p>
            )}

            <div className='mt-2 col-start-1 col-end-3 row-start-3 row-end-4 w-full md:w-[20rem] md:m-auto'>
              <Toaster position='top-center' richColors />
              <Button
                disabled={isSubmitButtonDisabled}
                type='submit'
                className={cn(
                  'w-full text-[14px]',
                  (uploadImagesMutation?.isPending || offeringExpenseCreationMutation?.isPending) &&
                    'bg-emerald-500 hover:bg-emerald-500 disabled:opacity-100 disabled:md:text-[15px] text-white'
                )}
                onClick={() => {
                  setTimeout(() => {
                    setIsInputDisabled(true);
                    setIsDropZoneDisabled(true);
                    setIsDeleteFileButtonDisabled(true);
                    setIsSubmitButtonDisabled(true);
                  }, 100);
                }}
              >
                {uploadImagesMutation?.isPending || offeringExpenseCreationMutation?.isPending
                  ? 'Procesando...'
                  : 'Registrar'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default OfferingExpenseCreatePage;
