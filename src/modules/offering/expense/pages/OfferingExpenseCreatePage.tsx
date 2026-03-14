import { useEffect, useState } from 'react';

import type * as z from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast, Toaster } from 'sonner';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { TiDeleteOutline } from 'react-icons/ti';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Upload, ImageIcon } from 'lucide-react';

import { GiReceiveMoney } from 'react-icons/gi';

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

import { offeringExpenseFormSchema } from '@/modules/offering/expense/schemas/offering-expense-form-schema';

import { CurrencyTypeNames } from '@/modules/offering/shared/enums/currency-type.enum';
import { FileFolder } from '@/shared/enums/offering-file-type.enum';

import { cn } from '@/shared/lib/utils';
import { getContextParams } from '@/shared/helpers/get-context-params';

import { useImagesUploadMutation } from '@/modules/offering/shared/hooks/useImagesUploadMutation';

import { type FilesProps } from '@/modules/offering/shared/interfaces/files-props.interface';
import { type RejectionProps } from '@/modules/offering/shared/interfaces/rejected-props.interface';

import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';

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
import { Calendar } from '@/shared/components/ui/calendar';
import { Textarea } from '@/shared/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

const SectionHeader = ({ title }: { title: string }): JSX.Element => (
  <div className='flex items-center gap-2 mb-3'>
    <h3 className='text-[14.5px] md:text-[15px] font-bold text-slate-700 dark:text-slate-200'>
      {title}
    </h3>
    <div className='flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-600' />
  </div>
);

export const OfferingExpenseCreatePage = (): JSX.Element => {
  //* States
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
    },
  });

  //* Watchers
  const type = form.watch('type');

  //* Custom hooks
  useOfferingExpenseCreationSubmitButtonLogic({
    isDropZoneDisabled,
    isDeleteFileButtonDisabled,
    isInputDisabled,
    offeringExpenseCreationForm: form as any,
    setIsDropZoneDisabled,
    setIsMessageErrorDisabled,
    setIsSubmitButtonDisabled,
  });

  const { onDrop, removeAll, removeFile, removeRejected } = useOfferingExpenseFileDropZone({
    offeringExpenseForm: form as any,
    files,
    setFiles,
    setRejected,
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxSize: 1024 * 1024 * 5,
    onDrop,
    disabled: isDropZoneDisabled,
  });

  const offeringExpenseCreationMutation = useOfferingExpenseCreationMutation({
    setFiles,
    imageUrls,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
    offeringExpenseCreationForm: form as any,
  });

  const uploadImagesMutation = useImagesUploadMutation();

  //* Effects
  useEffect(() => {
    document.title = 'Modulo Ofrenda - IcupApp';
  }, []);

  //* Sub-type options based on selected type
  const getSubTypeOptions = (): Record<string, string> => {
    switch (type) {
      case OfferingExpenseSearchType.OperationalExpenses:
        return SubTypeNamesOfferingExpenseSearchByOperativeExpenses;
      case OfferingExpenseSearchType.PlaningEventsExpenses:
        return SubTypeNamesOfferingExpenseSearchByPlaningEventsExpenses;
      case OfferingExpenseSearchType.DecorationExpenses:
        return SubTypeNamesOfferingExpenseSearchByDecorationExpenses;
      case OfferingExpenseSearchType.EquipmentAndTechnologyExpenses:
        return SubTypeNamesOfferingExpenseSearchByEquipmentAndTechnologyExpenses;
      case OfferingExpenseSearchType.MaintenanceAndRepairExpenses:
        return SubTypeNamesOfferingExpenseSearchByMaintenanceAndRepairExpenses;
      case OfferingExpenseSearchType.SuppliesExpenses:
        return SubTypeNamesOfferingExpenseSearchBySuppliesExpenses;
      default:
        return SubTypeNamesOfferingExpenseSearchByOtherExpenses;
    }
  };

  //* Form handler
  const handleSubmit = async (
    formData: z.infer<typeof offeringExpenseFormSchema>
  ): Promise<void> => {
    const { churchId: contextChurchId } = getContextParams();

    let imageUrls;

    try {
      if (files.length >= 1) {
        const uploadResult = await uploadImagesMutation.mutateAsync({
          files: files as any,
          fileFolder: FileFolder.Expense,
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
        churchId: contextChurchId ?? '',
        recordStatus: formData.recordStatus,
        imageUrls: (imageUrls as any) ?? [],
      });
    } catch (error) {
      if (uploadImagesMutation.isError) {
        toast.warning(
          '¡Oops! Fallo en la subida de imágenes, por favor actualize el navegador y vuelva a intentarlo.',
          { position: 'top-center', className: 'justify-center' }
        );
      }

      setTimeout(() => {
        setIsInputDisabled(false);
        setIsSubmitButtonDisabled(false);
      }, 1500);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Toaster position='top-center' richColors />
      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
        <ModuleHeader
          title='Registrar Nueva Salida'
          description='Completa el formulario para crear un nuevo registro de salida de ofrenda en el sistema.'
          titleColor='red'
          badge='Ofrenda'
          badgeColor='amber'
          icon={GiReceiveMoney}
          accentColor='amber'
        />

        <div className='w-full max-w-[1220px] mx-auto'>
          <div className='bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/50 rounded-xl'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='w-full flex flex-col md:grid grid-cols-2 gap-x-8 gap-y-4 p-5 md:p-6'
              >
                {/* LEFT COLUMN */}
                <div className='md:col-start-1 md:col-end-2'>

                  {/* Classification */}
                  <div className='space-y-4'>
                    <SectionHeader title='Clasificación de Gasto' />
                    <div className='pl-4 border-l-2 border-red-200 dark:border-red-900 space-y-4'>

                      {/* Type */}
                      <FormField
                        control={form.control}
                        name='type'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Tipo
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Selecciona un tipo de gasto para el registro.
                            </FormDescription>
                            <Select
                              onOpenChange={() => {
                                form.resetField('subType', { keepError: true });
                              }}
                              disabled={isInputDisabled}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className='h-11 text-sm'>
                                  {field.value ? (
                                    <SelectValue placeholder='Selecciona un tipo de egreso o gasto' />
                                  ) : (
                                    <span className='text-muted-foreground'>
                                      Selecciona un tipo de egreso o gasto
                                    </span>
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(OfferingExpenseSearchTypeNames).map(
                                  ([key, value]) =>
                                    key !== OfferingExpenseSearchType.RecordStatus && (
                                      <SelectItem className='text-sm' key={key} value={key}>
                                        {value}
                                      </SelectItem>
                                    )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        )}
                      />

                      {/* Sub-Type */}
                      {type && type !== OfferingExpenseSearchType.ExpensesAdjustment && (
                        <FormField
                          control={form.control}
                          name='subType'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                                Sub-Tipo
                              </FormLabel>
                              <FormDescription className='text-[13.5px] md:text-[14px]'>
                                Asigna un sub-tipo de gasto al registro.
                              </FormDescription>
                              <Select
                                disabled={isInputDisabled}
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger className='h-11 text-sm'>
                                    {field.value ? (
                                      <SelectValue placeholder='Selecciona un sub-tipo de gasto' />
                                    ) : (
                                      <span className='text-muted-foreground'>
                                        Selecciona un sub-tipo de gasto
                                      </span>
                                    )}
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(getSubTypeOptions()).map(([key, value]) => (
                                    <SelectItem className='text-sm' key={key} value={key}>
                                      {value}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className='text-[13px]' />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div className='space-y-4 mt-6'>
                    <SectionHeader title='Detalles Financieros' />
                    <div className='pl-4 border-l-2 border-red-200 dark:border-red-900 space-y-4'>

                      {/* Amount */}
                      <FormField
                        control={form.control}
                        name='amount'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Monto
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Digita la cantidad del gasto realizado.
                            </FormDescription>
                            <FormControl>
                              <Input
                                disabled={isInputDisabled}
                                placeholder='Monto total del gasto realizado'
                                type='text'
                                className='h-11 text-sm'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        )}
                      />

                      {/* Currency */}
                      <FormField
                        control={form.control}
                        name='currency'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Divisa / Moneda
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Asigna un tipo de divisa o moneda al registro.
                            </FormDescription>
                            <Select
                              disabled={isInputDisabled}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className='h-11 text-sm'>
                                  {field.value ? (
                                    <SelectValue placeholder='Selecciona un tipo de divisa o moneda' />
                                  ) : (
                                    <span className='text-muted-foreground'>
                                      Selecciona un tipo de divisa o moneda
                                    </span>
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(CurrencyTypeNames).map(([key, value]) => (
                                  <SelectItem className='text-sm' key={key} value={key}>
                                    {value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        )}
                      />

                      {/* Date */}
                      <FormField
                        control={form.control}
                        name='date'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                              Fecha
                            </FormLabel>
                            <FormDescription className='text-[13.5px] md:text-[14px]'>
                              Selecciona la fecha de gasto o compra realizada.
                            </FormDescription>
                            <Popover open={isInputDateOpen} onOpenChange={setIsInputDateOpen}>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    disabled={isInputDisabled}
                                    variant='outline'
                                    className={cn(
                                      'h-11 w-full pl-3 text-left text-sm font-normal',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, 'LLL dd, y', { locale: es })
                                    ) : (
                                      <span>Selecciona la fecha del gasto o compra</span>
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
                    </div>
                  </div>

                  {/* Observations */}
                  <div className='space-y-4 mt-6'>
                    <SectionHeader title='Observaciones' />
                    <div className='pl-4 border-l-2 border-red-200 dark:border-red-900 space-y-4'>

                      {/* Comments */}
                      <FormField
                        control={form.control}
                        name='comments'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-[14px] md:text-[14.5px] font-bold flex items-center gap-2'>
                              Detalles / Observaciones
                              <span className='inline-block bg-orange-100 text-orange-600 border border-orange-200 text-[10px] font-bold uppercase px-2 py-[2px] rounded-full'>
                                Requerido
                              </span>
                            </FormLabel>
                            {type === OfferingExpenseSearchType.ExpensesAdjustment && (
                              <FormDescription className='text-[13.5px] md:text-[14px]'>
                                Escribe una breve descripción sobre el ajuste.
                              </FormDescription>
                            )}
                            <FormControl>
                              <Textarea
                                disabled={isInputDisabled}
                                placeholder={
                                  type === OfferingExpenseSearchType.ExpensesAdjustment
                                    ? 'Detalles y/u observaciones sobre el ajuste de salida...'
                                    : 'Detalles y/u observaciones sobre el registro de salida...'
                                }
                                className='text-sm resize-none min-h-[100px]'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className='text-[13px]' />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className='md:col-start-2 md:col-end-3 md:border-l border-slate-200 dark:border-slate-700/50 md:pl-6'>

                  {/* Images */}
                  <div className='space-y-4'>
                    <SectionHeader title='Evidencias / Imágenes' />

                    <FormField
                      control={form.control}
                      name='fileNames'
                      render={() => (
                        <FormItem>
                          <FormLabel className='text-[14px] md:text-[14.5px] font-bold flex items-center gap-2'>
                            Subir imagen
                            <span className='inline-block bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-semibold uppercase px-2 py-[2px] rounded-full'>
                              Opcional
                            </span>
                          </FormLabel>
                          <FormControl>
                            <div
                              {...getRootProps({
                                className: cn(
                                  'relative flex flex-col items-center justify-center',
                                  'min-h-[160px] rounded-xl border-2 border-dashed',
                                  'transition-all duration-200 cursor-pointer',
                                  isDropZoneDisabled
                                    ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 cursor-not-allowed opacity-60'
                                    : isDragActive
                                      ? 'border-red-400 bg-red-50 dark:bg-red-950/20'
                                      : 'border-slate-300 dark:border-slate-600 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50/50 dark:hover:bg-red-950/10'
                                ),
                              })}
                            >
                              <input {...getInputProps()} />
                              <div className='flex flex-col items-center gap-2 p-6 text-center'>
                                <Upload
                                  className={cn(
                                    'w-8 h-8',
                                    isDragActive ? 'text-red-500' : 'text-slate-400'
                                  )}
                                />
                                {isDragActive ? (
                                  <p className='text-sm font-medium text-red-600 dark:text-red-400'>
                                    Suelte sus archivos aquí...
                                  </p>
                                ) : (
                                  <>
                                    <p className='text-sm font-medium text-slate-600 dark:text-slate-300'>
                                      Arrastra y suelta tus archivos aquí
                                    </p>
                                    <p className='text-xs text-slate-400 dark:text-slate-500'>
                                      o haz clic para seleccionar
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className='text-[13px]' />
                          {files && files.length > 3 ? (
                            <p className='text-red-500 font-semibold text-[12.5px] text-center'>
                              ❌ Sobrepasa el límite, elige como máximo solo 3 imágenes.
                            </p>
                          ) : (
                            <div className='space-y-0.5 text-[12.5px] text-slate-500 dark:text-slate-400'>
                              <p>✅ Máximo 3 archivos.</p>
                              <p>✅ El campo se bloqueará al llegar o pasar los 3 archivos.</p>
                            </div>
                          )}
                        </FormItem>
                      )}
                    />

                    {/* Preview */}
                    <div className='mt-4'>
                      <div className='flex items-center justify-between mb-3'>
                        <div className='flex items-center gap-2'>
                          <ImageIcon className='w-4 h-4 text-slate-400' />
                          <span className='text-[14px] font-semibold text-slate-700 dark:text-slate-200'>
                            Pre-visualización
                          </span>
                        </div>
                        <button
                          type='button'
                          disabled={isDeleteFileButtonDisabled}
                          onClick={removeAll}
                          className='text-[11px] px-3 py-1.5 font-bold uppercase tracking-wide text-red-500 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-500 hover:text-white transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none'
                        >
                          Remover todos
                        </button>
                      </div>

                      {/* Accepted files */}
                      {files.length > 0 && (
                        <>
                          <p className='text-[13px] font-semibold text-slate-600 dark:text-slate-300 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700'>
                            Archivos Aceptados
                          </p>
                          <ul className='grid grid-cols-2 gap-4 mb-6'>
                            {files.map((file) => (
                              <li key={file.name} className='relative h-32 rounded-lg shadow-md overflow-visible'>
                                <img
                                  src={file.preview}
                                  alt={file.name}
                                  width={100}
                                  height={100}
                                  onLoad={() => URL.revokeObjectURL(file.preview)}
                                  className='h-full w-full object-contain rounded-lg'
                                />
                                <Button
                                  type='button'
                                  disabled={isDeleteFileButtonDisabled}
                                  onClick={() => removeFile(file.name)}
                                  variant='ghost'
                                  className={cn(
                                    'w-7 h-7 absolute -top-2 -right-2 p-0 rounded-full',
                                    'bg-white dark:bg-slate-900 text-red-500 border border-slate-200 dark:border-slate-700',
                                    'hover:bg-red-50 hover:text-red-600 transition-colors',
                                    'disabled:opacity-50 disabled:pointer-events-none'
                                  )}
                                >
                                  <TiDeleteOutline className='w-5 h-5' />
                                </Button>
                                <p className='mt-2 text-slate-500 dark:text-slate-400 text-[11px] font-medium truncate max-w-full text-center'>
                                  {file.name}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}

                      {/* Rejected files */}
                      {rejected.length > 0 && (
                        <>
                          <p className='text-[13px] font-semibold text-slate-600 dark:text-slate-300 mb-2 pb-2 border-b border-slate-200 dark:border-slate-700'>
                            Archivos Rechazados
                          </p>
                          <ul className='space-y-2'>
                            {rejected.map(({ file, errors }) => (
                              <li key={file.name} className='flex items-start justify-between gap-2'>
                                <div>
                                  <p className='text-[12.5px] text-slate-500 dark:text-slate-400 font-medium'>
                                    {file.name}
                                  </p>
                                  <ul className='text-[12px] text-red-400 font-medium'>
                                    {errors.map((error) => (
                                      <li key={error.code}>
                                        {error.message === 'File type must be image/*'
                                          ? 'Tipo de archivo debe ser una imagen.'
                                          : 'Debe ser un archivo menor a 5MB.'}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <button
                                  type='button'
                                  disabled={isDeleteFileButtonDisabled}
                                  onClick={() => removeRejected(file.name)}
                                  className='text-[11px] px-2 py-1 font-bold uppercase tracking-wide text-red-500 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-500 hover:text-white transition-colors duration-200 disabled:opacity-40'
                                >
                                  Remover
                                </button>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status messages */}
                {isMessageErrorDisabled ? (
                  <p className='md:col-span-2 text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                    ❌ Datos incompletos, completa todos los campos para crear el registro.
                  </p>
                ) : (
                  <p className='md:col-span-2 text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                    ¡Campos completados correctamente!
                  </p>
                )}

                {/* Submit */}
                <div className='md:col-span-2 flex justify-center'>
                  <Button
                    disabled={isSubmitButtonDisabled}
                    type='submit'
                    className={cn(
                      'w-full md:w-[20rem] text-sm h-11 font-semibold transition-all duration-300',
                      'bg-gradient-to-r from-emerald-500 to-green-600',
                      'hover:from-emerald-600 hover:to-green-700',
                      'hover:shadow-lg hover:shadow-emerald-500/25',
                      (uploadImagesMutation?.isPending ||
                        offeringExpenseCreationMutation?.isPending) &&
                      'from-emerald-500 to-emerald-500 hover:from-emerald-500 hover:to-emerald-500 disabled:opacity-100 text-white'
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

        <footer className='pt-4 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Modulo de Salida - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default OfferingExpenseCreatePage;
