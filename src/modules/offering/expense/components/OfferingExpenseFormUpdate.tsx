/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect, useState } from 'react';

import type * as z from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useDropzone } from 'react-dropzone';
import { TiDeleteOutline } from 'react-icons/ti';

import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import {
  OfferingExpenseSearchType,
  OfferingExpenseSearchTypeNames,
} from '@/modules/offering/expense/enums/offering-expense-search-type.enum';
import {
  type OfferingExpenseSearchSubType,
  OfferingExpenseSearchSubTypeNames,
} from '@/modules/offering/expense/enums/offering-expense-search-sub-type.enum';

import { useOfferingExpenseSetData } from '@/modules/offering/expense/hooks/useOfferingExpenseSetData';
import { useOfferingExpenseFileDropZone } from '@/modules/offering/expense/hooks/useOfferingExpenseFileDropZone';
import { useOfferingExpenseUpdateMutation } from '@/modules/offering/expense/hooks/useOfferingExpenseUpdateMutation';
import { useOfferingExpenseUpdateSubmitButtonLogic } from '@/modules/offering/expense/hooks/useOfferingExpenseUpdateSubmitButtonLogic';

import { DestroyImageButton } from '@/modules/offering/shared/components/DestroyImageButton';
import { type FilesProps } from '@/modules/offering/shared/interfaces/files-props.interface';
import { type RejectionProps } from '@/modules/offering/shared/interfaces/rejected-props.interface';

import {
  CurrencyType,
  CurrencyTypeNames,
} from '@/modules/offering/shared/enums/currency-type.enum';
import { OfferingFileType } from '@/modules/offering/shared/enums/offering-file-type.enum';
import { useImagesUploadMutation } from '@/modules/offering/shared/hooks/useImagesUploadMutation';

import { offeringExpenseFormSchema } from '@/modules/offering/expense/validations/offering-expense-form-schema';
import { type OfferingExpenseResponse } from '@/modules/offering/expense/interfaces/offering-expense-response.interface';
import { OfferingExpenseFormSkeleton } from '@/modules/offering/expense/components';

import { cn } from '@/shared/lib/utils';
import { RecordStatus } from '@/shared/enums/record-status.enum';

import {
  Form,
  FormItem,
  FormLabel,
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/shared/components/ui/command';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { Textarea } from '@/shared/components/ui/textarea';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { getSimpleChurches } from '@/modules/church/services/church.service';
import { useQuery } from '@tanstack/react-query';

interface OfferingExpenseFormUpdateProps {
  id: string;
  dialogClose: () => void;
  scrollToTop: () => void;
  data: OfferingExpenseResponse | undefined;
}

export const OfferingExpenseFormUpdate = ({
  id,
  dialogClose,
  scrollToTop,
  data,
}: OfferingExpenseFormUpdateProps): JSX.Element => {
  //* States
  const [isInputRelationOpen, setIsInputRelationOpen] = useState<boolean>(false);
  const [isInputDateOpen, setIsInputDateOpen] = useState<boolean>(false);

  const [files, setFiles] = useState<FilesProps[]>([]);
  const [rejected, setRejected] = useState<RejectionProps[]>([]);

  const [isDropZoneDisabled, setIsDropZoneDisabled] = useState<boolean>(false);

  const [isDeleteFileButtonDisabled, setIsDeleteFileButtonDisabled] = useState<boolean>(false);

  const [isLoadingData, setIsLoadingData] = useState(true);

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
  const comments = form.watch('comments');

  //* Custom hooks
  useOfferingExpenseSetData({
    id,
    data,
    setFiles,
    setIsLoadingData,
    offeringExpenseUpdateForm: form,
  });

  useOfferingExpenseUpdateSubmitButtonLogic({
    isDropZoneDisabled,
    isDeleteFileButtonDisabled,
    isInputDisabled,
    offeringExpenseUpdateForm: form,
    setIsDropZoneDisabled,
    setIsMessageErrorDisabled,
    setIsSubmitButtonDisabled,
    countExistImageUrl: data?.imageUrls.length ?? 0,
  });

  //* Queries
  const churchesQuery = useQuery({
    queryKey: ['churches'],
    queryFn: () => getSimpleChurches({ isSimpleQuery: true }),
    retry: false,
  });

  const { onDrop, removeFile, removeCloudFile, removeRejected } = useOfferingExpenseFileDropZone({
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

  const offeringExpenseUpdateMutation = useOfferingExpenseUpdateMutation({
    dialogClose,
    scrollToTop,
    imageUrls,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
    setIsDeleteFileButtonDisabled,
  });

  const uploadImagesMutation = useImagesUploadMutation();

  //* Effects
  useEffect(() => {
    if (data?.recordStatus === RecordStatus.Inactive) {
      setIsInputDisabled(true);
      setIsDropZoneDisabled(true);
      setIsDeleteFileButtonDisabled(true);
    }
  }, []);

  //* Form handler
  const handleSubmit = async (
    formData: z.infer<typeof offeringExpenseFormSchema>
  ): Promise<void> => {
    const filesOnly = files.filter((item) => item instanceof File);

    let imageUrls;

    try {
      if (filesOnly.length >= 1) {
        const uploadResult = await uploadImagesMutation.mutateAsync({
          files: filesOnly as any,
          fileType: OfferingFileType.Expense,
          offeringType: formData.type,
          offeringSubType: formData.subType ?? null,
        });

        imageUrls = uploadResult.imageUrls;
        setImageUrls(imageUrls ?? []);
      }

      await offeringExpenseUpdateMutation.mutateAsync({
        id,
        formData: {
          type: formData.type,
          subType: !formData.subType ? undefined : formData.subType,
          amount: formData.amount,
          currency: formData.currency,
          date: formData.date,
          comments: formData.comments,
          churchId: formData.churchId,
          recordStatus: formData.recordStatus,
          imageUrls: imageUrls ?? [],
        },
      });
    } catch (error) {
      toast.warning(
        '¡Oops! Fallo en la subida de imágenes, por favor actualize el navegador y vuelva a intentarlo.',
        {
          position: 'top-center',
          className: 'justify-center',
        }
      );

      setTimeout(() => {
        setIsInputDisabled(false);
        setIsSubmitButtonDisabled(false);
      }, 1500);
    }
  };

  return (
    <Tabs
      defaultValue='general-info'
      className='w-auto -mt-8 sm:w-[520px] md:w-[680px] lg:w-[990px] xl:w-[1100px]'
    >
      <div className='text-center'>
        <h2 className='text-orange-500  font-bold text-[20px] sm:text-[22px] md:text-[24px]'>
          Modificar datos del registro
        </h2>
      </div>

      <TabsContent value='general-info'>
        <Card className='w-full'>
          {isLoadingData && <OfferingExpenseFormSkeleton />}

          {!isLoadingData && (
            <CardContent className='py-3 px-4'>
              <div className='flex flex-col mb-4 md:pl-4'>
                <span className='italic dark:text-yellow-500 font-bold text-[16.5px] md:text-[18px] text-amber-500'>
                  Tipo de registro:{' '}
                  {`${OfferingExpenseSearchTypeNames[data?.type as OfferingExpenseSearchType]} ${data?.subType ? '-' : ''} ${OfferingExpenseSearchSubTypeNames[data?.subType as OfferingExpenseSearchSubType] ?? ''}`}
                </span>
                <span className='italic dark:text-slate-300 text-slate-500 font-bold text-[16px] md:text-[17px] md:ml-1'>
                  Pertenencia: {`${data?.church?.abbreviatedChurchName}`}
                </span>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className='w-full flex flex-col md:grid sm:grid-cols-2 gap-x-8 gap-y-6 px-2 sm:px-8'
                >
                  <div className='lg:col-start-1 lg:col-end-2'>
                    <FormField
                      control={form.control}
                      name='churchId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                            Iglesia
                          </FormLabel>
                          <FormDescription className='text-[13.5px] md:text-[14px]'>
                            Seleccione una iglesia para asignarla al registro.
                          </FormDescription>
                          <Popover open={isInputRelationOpen} onOpenChange={setIsInputRelationOpen}>
                            <PopoverTrigger asChild>
                              <FormControl className='text-[14px] md:text-[14px]'>
                                <Button
                                  disabled
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
                                            setIsInputRelationOpen(false);
                                          }}
                                        >
                                          {church.abbreviatedChurchName}
                                          <CheckIcon
                                            className={cn(
                                              'ml-auto h-4 w-4',
                                              church.id === field.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
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
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Tipo
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Selecciona un tipo de gasto para el registro.
                            </FormDescription>
                            <Select disabled value={field.value} onValueChange={field.onChange}>
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
                                  ([key, value]) => (
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
                              <Select disabled value={field.value} onValueChange={field.onChange}>
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
                                  {Object.entries(OfferingExpenseSearchSubTypeNames).map(
                                    ([key, value]) => (
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
                    )}

                    <div
                      className={cn(
                        'md:flex md:gap-5',
                        type === OfferingExpenseSearchType.ExpensesAdjustment &&
                          'md:flex-col md:gap-0'
                      )}
                    >
                      <FormField
                        control={form.control}
                        name='amount'
                        render={({ field }) => {
                          return (
                            <FormItem className='mt-3 w-full'>
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
                            <FormItem className='mt-3 w-full'>
                              <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                                Divisa / Moneda
                              </FormLabel>
                              <FormDescription className='text-[13.5px] md:text-[14px]'>
                                Asignar un tipo de divisa al registro.
                              </FormDescription>
                              <Select
                                disabled={isInputDisabled}
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <FormControl className='text-[14px] md:text-[14px]'>
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={
                                        field.value === CurrencyType.USD
                                          ? CurrencyTypeNames.USD
                                          : field.value === CurrencyType.PEN
                                            ? CurrencyTypeNames.PEN
                                            : CurrencyTypeNames.EUR
                                      }
                                    />
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
                    </div>

                    <FormField
                      control={form.control}
                      name='date'
                      render={({ field }) => (
                        <FormItem className='mt-3'>
                          <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                            Fecha
                          </FormLabel>
                          <FormDescription className='text-[13.5px] md:text-[14px]'>
                            Selecciona la fecha del gasto o compra realizada.
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
                            <FormControl className='text-[14px] md:text-[14px]'>
                              <Textarea
                                className={cn(comments && 'h-full')}
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

                  <div className='lg:col-start-2 lg:col-end-3 md:border-l-2 border-slate-200 dark:border-slate-800 md:pl-8'>
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
                                    Arrastre y suelte sus archivos aquí, o haga clic para
                                    seleccionar.
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
                              <span className='font-medium text-[12.5px] md:text-[13px] pl-1 md:pl-5 mt-1 flex flex-col'>
                                <span>✅ Máximo 3 archivos.</span>
                                <span>
                                  ✅ El campo se bloqueara al llegar o pasar los 3 archivos.
                                </span>
                              </span>
                            )}
                          </FormItem>
                        );
                      }}
                    />
                    <section className='mt-10'>
                      <div className='flex gap-4 items-center justify-between'>
                        <h2 className='text-[16px] md:text-[18px] font-bold'>Pre-visualización</h2>
                      </div>

                      {/* Accepted files */}
                      <h3 className='text-[14.5px] lg:text-[16px] font-semibold mt-5 border-b pb-3'>
                        Archivos Aceptados
                      </h3>
                      <ul className='mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 gap-x-5 gap-y-20'>
                        {files.map((file) => {
                          const isString = typeof file === 'string';

                          const filePublicId =
                            isString &&
                            (file as any)
                              .split('/')
                              .pop()
                              ?.replace(/\.[^/.]+$/, '')
                              .toLowerCase();

                          return (
                            <li
                              key={file.name ?? file}
                              className='relative h-32 rounded-md shadow-lg'
                            >
                              <img
                                src={file.preview ?? file}
                                alt={file.name ?? file}
                                width={100}
                                height={100}
                                onLoad={() => {
                                  URL.revokeObjectURL(file.preview);
                                }}
                                className='h-full w-full object-contain rounded-md'
                              />
                              {file?.name ? (
                                <Button
                                  type='button'
                                  disabled={isDeleteFileButtonDisabled}
                                  className='border-none p-0 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 dark:hover:bg-slate-950 hover:bg-white'
                                  onClick={() => {
                                    removeFile(file.name);
                                  }}
                                >
                                  <TiDeleteOutline className='w-8 h-8 p-0  rounded-full fill-red-500 dark:hover:bg-white hover:bg-slate-200' />
                                </Button>
                              ) : (
                                <DestroyImageButton
                                  fileType={OfferingFileType.Expense}
                                  isDeleteFileButtonDisabled={isDeleteFileButtonDisabled}
                                  secureUrl={file as any}
                                  removeCloudFile={removeCloudFile}
                                />
                              )}

                              <p className='mt-4 text-center text-slate-500 text-[11px] md:text-[12px] font-medium'>
                                <a href={file as any} target='_blank' rel='noreferrer'>
                                  {file.name ??
                                    (file as any)
                                      .split('/')
                                      .slice(0, 3)
                                      .join('/')
                                      .replace(
                                        'res.cloudinary.com',
                                        `cloudinary-${filePublicId}.com`
                                      )}
                                </a>
                              </p>
                            </li>
                          );
                        })}
                      </ul>

                      {/* Rejected Files */}
                      <h3 className='text-[14.5px] lg:text-[16px] font-semibold mt-20 border-b pb-3'>
                        Archivos rechazados
                      </h3>
                      <ul className='mt-2 flex flex-col'>
                        {rejected.map(({ file, errors }) => (
                          <li key={file.name} className='flex items-start justify-between'>
                            <div>
                              <p className='mt-2 text-neutral-500 text-sm font-medium'>
                                {file.name}
                              </p>
                              <ul className='text-[14px] text-red-400 flex gap-3 font-medium'>
                                {errors.map((error) => (
                                  <li
                                    key={error.code}
                                  >{`${error.message === 'File type must be image/*' ? 'Tipo de archivo debe ser una imagen.' : 'Debe ser un archivo menor a 1000KB.'}`}</li>
                                ))}
                              </ul>
                            </div>
                            <button
                              disabled={isDeleteFileButtonDisabled}
                              type='button'
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
                    <p className='-mb-6 mt-4 md:-mb-6 md:mt-0 md:row-start-2 md:row-end-3 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                      ❌ Datos incompletos, completa todos los campos para guardar el registro.
                    </p>
                  ) : (
                    <p className='-mt-3 order-last md:-mt-3 md:row-start-3 md:row-end-4 md:col-start-1 md:col-end-3 mx-auto md:w-[80%] lg:w-[80%] text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                      ¡Campos completados correctamente! <br /> Para finalizar por favor guarde los
                      cambios
                    </p>
                  )}

                  <div className='w-full md:w-[20rem] md:mx-auto col-start-1 col-end-3 text-sm md:text-md xl:text-base mt-2 md:mt-2'>
                    <Button
                      disabled={isSubmitButtonDisabled}
                      type='submit'
                      className={cn(
                        'w-full text-[14px]',
                        uploadImagesMutation?.isPending &&
                          'bg-emerald-500 hover:bg-emerald-500 disabled:opacity-100 disabled:md:text-[15px] text-white'
                      )}
                      onClick={() => {
                        setTimeout(() => {
                          if (Object.keys(form.formState.errors).length === 0) {
                            setIsInputDisabled(true);
                            setIsDropZoneDisabled(true);
                            setIsDeleteFileButtonDisabled(true);
                            setIsSubmitButtonDisabled(true);
                          }
                        }, 100);
                      }}
                    >
                      {uploadImagesMutation?.isPending ? 'Procesando...' : 'Guardar Cambios'}
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
