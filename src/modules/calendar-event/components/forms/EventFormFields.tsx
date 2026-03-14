import { memo, useState } from 'react';
import { useWatch } from 'react-hook-form';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Clock, Globe, ImageIcon, Lock, MapPin, Upload, Users } from 'lucide-react';
import { TiDeleteOutline } from 'react-icons/ti';

import { type UseCalendarEventFormReturn } from '@/modules/calendar-event/hooks/forms/useCalendarEventForm';
import { TimeSegmentInput } from '@/modules/calendar-event/components/TimeSegmentInput';
import { CalendarEventCategoryNames } from '@/modules/calendar-event/enums/calendar-event-category.enum';
import { CalendarEventStatusNames } from '@/modules/calendar-event/enums/calendar-event-status.enum';
import { CalendarEventTargetGroupNames } from '@/modules/calendar-event/enums/calendar-event-target-group.enum';

import { cn } from '@/shared/lib/utils';
import { MapLocationPicker } from '@/shared/components/map';

import {
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
import { Switch } from '@/shared/components/ui/switch';
import { Calendar } from '@/shared/components/ui/calendar';
import { Textarea } from '@/shared/components/ui/textarea';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { DestroyImageButton } from '@/modules/offering/shared/components/DestroyImageButton';
import { FileFolder } from '@/shared/enums/offering-file-type.enum';

//* Sub-components

const SectionHeader = memo(({ title }: { title: string }) => (
  <div className='flex items-center gap-2 mb-3'>
    <h3 className='text-[14.5px] md:text-[15px] font-bold text-slate-700 dark:text-slate-200'>
      {title}
    </h3>
    <div className='flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-600' />
  </div>
));
SectionHeader.displayName = 'SectionHeader';

//* DateTimePickerField

interface DateTimePickerFieldProps {
  field: { value: Date | undefined; onChange: (val: Date | undefined) => void };
  disabled: boolean;
  label: string;
  description: string;
  placeholder: string;
  defaultHour24?: number;
  defaultMinute?: number;
}

const DateTimePickerField = ({
  field,
  disabled,
  label,
  description,
  placeholder,
  defaultHour24 = 0,
  defaultMinute = 0,
}: DateTimePickerFieldProps): JSX.Element => {
  const [open, setOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined): void => {
    if (!date) return; // same date clicked again (Calendar deselects) — keep existing value
    const existing = field.value;
    date.setHours(
      existing ? existing.getHours() : defaultHour24,
      existing ? existing.getMinutes() : defaultMinute,
      0, 0,
    );
    field.onChange(date);
  };

  const formatDisplay = (date: Date): string => {
    const datePart = format(date, "dd 'de' MMMM yyyy", { locale: es });
    const h = date.getHours();
    const m = date.getMinutes();
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const period = h >= 12 ? 'PM' : 'AM';
    return `${datePart} · ${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
  };

  return (
    <FormItem>
      <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>{label}</FormLabel>
      <FormDescription className='text-[13.5px] md:text-[14px]'>{description}</FormDescription>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              disabled={disabled}
              variant='outline'
              className={cn('h-11 w-full pl-3 text-left text-sm font-normal', !field.value && 'text-muted-foreground')}
            >
              {field.value ? formatDisplay(field.value) : <span>{placeholder}</span>}
              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar mode='single' selected={field.value} onSelect={handleDateSelect} initialFocus />
          <div className='border-t border-slate-200 dark:border-slate-700 px-3 py-2.5 flex items-center gap-2.5'>
            <Clock className='w-3.5 h-3.5 text-teal-500 dark:text-teal-400 shrink-0' />
            <span className='text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest shrink-0'>
              Hora
            </span>
            <TimeSegmentInput
              value={field.value}
              onChange={(date) => { field.onChange(date); }}
              disabled={disabled}
              defaultHour24={defaultHour24}
              defaultMinute={defaultMinute}
            />
            <button
              type='button'
              onClick={() => { setOpen(false); }}
              className={cn(
                'ml-auto px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all shrink-0',
                'bg-teal-600 text-white hover:bg-teal-700 active:scale-95',
              )}
            >
              OK
            </button>
          </div>
        </PopoverContent>
      </Popover>
      <FormMessage className='text-[13px]' />
    </FormItem>
  );
};

//* EventFormFields

export const EventFormFields = memo(({
  mode,
  form,
  isInputDisabled,
  isDropZoneDisabled,
  isDeleteFileButtonDisabled,
  files,
  rejected,
  getRootProps,
  getInputProps,
  isDragActive,
  removeFile,
  removeCloudFile,
  removeRejected,
  removeAll,
  setFiles,
}: UseCalendarEventFormReturn): JSX.Element => {
  //* useWatch subscribes reactively to form state changes inside memo
  const latitude = useWatch({ control: form.control, name: 'latitude' });
  const longitude = useWatch({ control: form.control, name: 'longitude' });
  return (
    <>
      {/* ══════════ LEFT COLUMN ══════════ */}
      <div className='md:col-start-1 md:col-end-2'>

        {/* Información del Evento */}
        <div className='space-y-4'>
          <SectionHeader title='Información del Evento' />
          <div className='pl-4 border-l-2 border-teal-200 dark:border-teal-900 space-y-4'>

            {/* Title */}
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Título</FormLabel>
                  <FormDescription className='text-[13.5px] md:text-[14px]'>
                    Nombre o título del evento.
                  </FormDescription>
                  <FormControl>
                    <Input
                      disabled={isInputDisabled}
                      placeholder='Ej: Retiro Anual de Jóvenes 2025'
                      className='h-11 text-sm'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Descripción</FormLabel>
                  <FormDescription className='text-[13.5px] md:text-[14px]'>
                    Describe brevemente el propósito del evento.
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      disabled={isInputDisabled}
                      placeholder='Descripción del evento, actividades, lugar de reunión...'
                      className='text-sm resize-none min-h-[90px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Categoría</FormLabel>
                  <FormDescription className='text-[13.5px] md:text-[14px]'>
                    Selecciona la categoría del evento.
                  </FormDescription>
                  <Select disabled={isInputDisabled} value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className='h-11 text-sm'>
                        {field.value
                          ? <SelectValue placeholder='Selecciona una categoría' />
                          : <span className='text-muted-foreground'>Selecciona una categoría</span>}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(CalendarEventCategoryNames).map(([key, value]) => (
                        <SelectItem className='text-sm' key={key} value={key}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Estado</FormLabel>
                  <FormDescription className='text-[13.5px] md:text-[14px]'>
                    Estado actual del evento.
                  </FormDescription>
                  <Select disabled={isInputDisabled} value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className='h-11 text-sm'>
                        {field.value
                          ? <SelectValue placeholder='Selecciona un estado' />
                          : <span className='text-muted-foreground'>Selecciona un estado</span>}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(CalendarEventStatusNames).map(([key, value]) => (
                        <SelectItem className='text-sm' key={key} value={key}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            {/* Is Public */}
            <FormField
              control={form.control}
              name='isPublic'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Visibilidad</FormLabel>
                  <FormDescription className='text-[13.5px] md:text-[14px]'>
                    Indica si el evento es público o privado.
                  </FormDescription>
                  <div className='flex items-center gap-3 mt-1 h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'>
                    <FormControl>
                      <Switch
                        disabled={isInputDisabled}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className='data-[state=checked]:bg-teal-600'
                      />
                    </FormControl>
                    <div className='flex items-center gap-1.5'>
                      {field.value ? (
                        <><Globe className='w-4 h-4 text-teal-600 dark:text-teal-400' /><span className='text-[13px] font-medium text-teal-700 dark:text-teal-300'>Público</span></>
                      ) : (
                        <><Lock className='w-4 h-4 text-slate-400' /><span className='text-[13px] font-medium text-slate-500 dark:text-slate-400'>Privado</span></>
                      )}
                    </div>
                  </div>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Fecha y Hora */}
        <div className='space-y-4 mt-6'>
          <SectionHeader title='Fecha y Hora' />
          <div className='pl-4 border-l-2 border-teal-200 dark:border-teal-900 space-y-4'>
            <FormField
              control={form.control}
              name='startDate'
              render={({ field }) => (
                <DateTimePickerField
                  field={field as any}
                  disabled={isInputDisabled}
                  label='Fecha y Hora de Inicio'
                  description='Selecciona la fecha y hora en que comenzará el evento.'
                  placeholder='Selecciona la fecha y hora de inicio'
                  defaultHour24={0}
                  defaultMinute={0}
                />
              )}
            />
            <FormField
              control={form.control}
              name='endDate'
              render={({ field }) => (
                <DateTimePickerField
                  field={field as any}
                  disabled={isInputDisabled}
                  label='Fecha y Hora de Fin (Opcional)'
                  description='Selecciona cuándo finalizará el evento.'
                  placeholder='Selecciona la fecha y hora de fin'
                  defaultHour24={23}
                  defaultMinute={59}
                />
              )}
            />
          </div>
        </div>

        {/* Grupos Objetivo */}
        <div className='space-y-4 mt-6'>
          <SectionHeader title='Grupos Objetivo' />
          <div className='pl-4 border-l-2 border-teal-200 dark:border-teal-900 space-y-3'>
            <FormField
              control={form.control}
              name='targetGroups'
              render={() => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>
                    Grupos de notificación
                  </FormLabel>
                  <FormDescription className='text-[13.5px] md:text-[14px]'>
                    Selecciona los grupos a los que se difundirá este evento.
                  </FormDescription>
                  <div className='grid grid-cols-2 gap-2 pt-1'>
                    {Object.entries(CalendarEventTargetGroupNames).map(([key, label]) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name='targetGroups'
                        render={({ field }) => (
                          <FormItem className='flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-colors'>
                            <FormControl>
                              <Checkbox
                                disabled={isInputDisabled}
                                checked={field.value?.includes(key)}
                                onCheckedChange={(checked) => {
                                  const current = field.value ?? [];
                                  field.onChange(
                                    checked ? [...current, key] : current.filter((v) => v !== key)
                                  );
                                }}
                                className='data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600'
                              />
                            </FormControl>
                            <FormLabel className='text-[12.5px] font-medium cursor-pointer text-slate-600 dark:text-slate-400 !mt-0 flex items-center gap-1.5'>
                              <Users className='w-3 h-3 text-teal-600 dark:text-teal-400' />
                              {label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* ══════════ RIGHT COLUMN ══════════ */}
      <div className='md:col-start-2 md:col-end-3 md:border-l border-slate-200 dark:border-slate-700/50 md:pl-6 space-y-6'>

        {/* Ubicación */}
        <div className='space-y-4'>
          <SectionHeader title='Ubicación (Opcional)' />
          <div className='pl-4 border-l-2 border-teal-200 dark:border-teal-900 space-y-4'>
            <FormField
              control={form.control}
              name='locationName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Nombre del Lugar</FormLabel>
                  <FormDescription className='text-[13.5px] md:text-[14px]'>Ej: Templo Central, Parque Kennedy</FormDescription>
                  <FormControl>
                    <Input
                      disabled={isInputDisabled}
                      placeholder='Nombre del lugar del evento'
                      className='h-11 text-sm'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='locationReference'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold'>Referencia</FormLabel>
                  <FormDescription className='text-[13.5px] md:text-[14px]'>Indicaciones para llegar al lugar.</FormDescription>
                  <FormControl>
                    <Textarea
                      disabled={isInputDisabled}
                      placeholder='Ej: Frente al mercado central, 2do piso...'
                      className='text-sm resize-none min-h-[70px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-[13px]' />
                </FormItem>
              )}
            />

            {/* Map Picker */}
            <FormItem>
              <FormLabel className='text-[14px] md:text-[14.5px] font-bold flex items-center gap-1.5'>
                <MapPin className='w-3.5 h-3.5 text-teal-600 dark:text-teal-400' />
                Coordenadas
              </FormLabel>
              <FormDescription className='text-[13.5px] md:text-[14px]'>
                Pinea la ubicación exacta del evento en el mapa.
              </FormDescription>
              <MapLocationPicker
                disabled={isInputDisabled}
                latitude={latitude ?? ''}
                longitude={longitude ?? ''}
                onLocationChange={(lat, lng) => {
                  form.setValue('latitude', lat, { shouldValidate: true, shouldDirty: true });
                  form.setValue('longitude', lng, { shouldValidate: true, shouldDirty: true });
                }}
              />
              <FormMessage className='text-[13px]' />
            </FormItem>
          </div>
        </div>

        {/* Imagen del Evento */}
        <div className='space-y-4'>
          <SectionHeader title='Imagen del Evento' />
          <div className='pl-4 border-l-2 border-teal-200 dark:border-teal-900 space-y-3'>
            <FormField
              control={form.control}
              name='fileNames'
              render={() => (
                <FormItem>
                  <FormLabel className='text-[14px] md:text-[14.5px] font-bold flex items-center gap-2'>
                    Subir imagen
                    <span className='inline-block bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-semibold uppercase px-2 py-[2px] rounded-full dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'>
                      Opcional
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div
                      {...getRootProps({
                        className: cn(
                          'relative flex flex-col items-center justify-center',
                          'min-h-[140px] rounded-xl border-2 border-dashed',
                          'transition-all duration-200 cursor-pointer',
                          isDropZoneDisabled
                            ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 cursor-not-allowed opacity-60'
                            : isDragActive
                              ? 'border-teal-400 bg-teal-50 dark:bg-teal-950/20'
                              : 'border-slate-300 dark:border-slate-600 hover:border-teal-300 dark:hover:border-teal-700 hover:bg-teal-50/50 dark:hover:bg-teal-950/10',
                        ),
                      })}
                    >
                      <input {...getInputProps()} />
                      <div className='flex flex-col items-center gap-2 p-5 text-center'>
                        <Upload className={cn('w-7 h-7', isDragActive ? 'text-teal-500' : 'text-slate-400')} />
                        {isDragActive ? (
                          <p className='text-sm font-medium text-teal-600 dark:text-teal-400'>Suelta el archivo aquí...</p>
                        ) : (
                          <>
                            <p className='text-sm font-medium text-slate-600 dark:text-slate-300'>Arrastra y suelta tu imagen aquí</p>
                            <p className='text-xs text-slate-400 dark:text-slate-500'>o haz clic para seleccionar</p>
                          </>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className='text-[13px]' />
                  {files.length >= 3 ? (
                    <p className='text-amber-500 font-semibold text-[12.5px]'>
                      ⚠️ Límite alcanzado, se permiten máximo 3 imágenes por evento.
                    </p>
                  ) : (
                    <div className='space-y-0.5 text-[12.5px] text-slate-500 dark:text-slate-400'>
                      <p>✅ Máximo 3 imágenes.</p>
                      <p>✅ Tamaño máximo por imagen: 5 MB.</p>
                    </div>
                  )}
                </FormItem>
              )}
            />

            {/* Preview */}
            {(files.length > 0 || rejected.length > 0) && (
              <div className='mt-2'>
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center gap-2'>
                    <ImageIcon className='w-4 h-4 text-slate-400' />
                    <span className='text-[14px] font-semibold text-slate-700 dark:text-slate-200'>
                      Pre-visualización
                    </span>
                  </div>
                  {
                    mode !== "update" && (
                      <button
                        type='button'
                        disabled={isDeleteFileButtonDisabled}
                        onClick={() => { removeAll(); setFiles([]); }}
                        className='text-[11px] px-3 py-1.5 font-bold uppercase tracking-wide text-red-500 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-500 hover:text-white transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none'
                      >
                        Remover
                      </button>
                    )
                  }
                </div>

                {files.length > 0 && (
                  <>
                    <p className='text-[13px] font-semibold text-slate-600 dark:text-slate-300 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700'>
                      Archivos Aceptados
                    </p>
                    <ul className={cn(
                      'mb-4',
                      files.length > 1
                        ? 'grid grid-cols-2 gap-4'
                        : 'space-y-4',
                    )}>
                      {files.map((file) => {
                        const isCloudUrl = typeof file === 'string';

                        const filePublicId = isCloudUrl
                          ? (file as any)
                            .split('/')
                            .pop()
                            ?.replace(/\.[^/.]+$/, '')
                            .toLowerCase()
                          : null;

                        const imgSrc = isCloudUrl ? (file as any) : (file as any).preview;
                        const imgAlt = isCloudUrl ? 'Imagen del evento' : (file as any).name;
                        const itemKey = isCloudUrl ? (file as any) : (file as any).name;

                        return (
                          <li
                            key={itemKey}
                            className="relative flex flex-col items-center rounded-lg shadow-md p-2 bg-slate-50 dark:bg-slate-800"
                          >
                            <img
                              src={imgSrc}
                              alt={imgAlt}
                              width={100}
                              height={100}
                              onLoad={() => {
                                if (!isCloudUrl) URL.revokeObjectURL((file as any).preview);
                              }}
                              className="w-full h-32 object-contain rounded-lg"
                            />

                            <p className="mt-2 text-center text-slate-500 text-[11px] md:text-[12px] font-medium break-all px-2">
                              {isCloudUrl ? (
                                <a href={file as any} target="_blank" rel="noreferrer">
                                  {(file as any)
                                    .split("/")
                                    .slice(0, 3)
                                    .join("/")
                                    .replace("res.cloudinary.com", `cloudinary-${filePublicId}.com`)}
                                </a>
                              ) : (
                                <span>{(file as any).name}</span>
                              )}
                            </p>

                            {mode === "update" && isCloudUrl ? (
                              <DestroyImageButton
                                fileFolder={FileFolder.CalendarEvent}
                                isDeleteFileButtonDisabled={isDeleteFileButtonDisabled}
                                secureUrl={file as any}
                                removeCloudFile={removeCloudFile}
                                withDescription={false}
                                disabledButtonDelete={false}
                              />
                            ) : (
                              <Button
                                type="button"
                                disabled={isDeleteFileButtonDisabled}
                                className="absolute -top-3 -right-3 border-none p-0 bg-secondary-400 rounded-full flex justify-center items-center dark:hover:bg-slate-950 hover:bg-white"
                                onClick={() => {
                                  removeFile((file as any).name);
                                }}
                              >
                                <TiDeleteOutline className="w-8 h-8 p-0 rounded-full fill-red-500 dark:hover:bg-white hover:bg-slate-200" />
                              </Button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}

                {rejected.length > 0 && (
                  <>
                    <p className='text-[13px] font-semibold text-slate-600 dark:text-slate-300 mb-2 pb-2 border-b border-slate-200 dark:border-slate-700'>
                      Archivos Rechazados
                    </p>
                    <ul className='space-y-2'>
                      {rejected.map(({ file, errors }) => (
                        <li key={file.name} className='flex items-start justify-between gap-2'>
                          <div>
                            <p className='text-[12.5px] text-slate-500 dark:text-slate-400 font-medium'>{file.name}</p>
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
                            onClick={() => { removeRejected(file.name); }}
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
            )}
          </div>
        </div>
      </div>
    </>
  );
});

EventFormFields.displayName = 'EventFormFields';
