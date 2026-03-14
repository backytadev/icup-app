/* eslint-disable @typescript-eslint/no-floating-promises */

import { useEffect, useState } from 'react';

import type * as z from 'zod';
import { toast } from 'sonner';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { zodResolver } from '@hookform/resolvers/zod';

import { calendarEventFormSchema } from '@/modules/calendar-event/schemas/calendar-event-form-schema';
import { type CalendarEventFormData } from '@/modules/calendar-event/types/calendar-event-form-data.interface';
import { type CalendarEventResponse } from '@/modules/calendar-event/types/calendar-event-response.interface';
import { useCalendarEventFileDropZone } from '@/modules/calendar-event/hooks/forms/useCalendarEventFileDropZone';
import { useCalendarEventCreationMutation } from '@/modules/calendar-event/hooks/mutations/useCalendarEventCreationMutation';
import { useCalendarEventUpdateMutation } from '@/modules/calendar-event/hooks/mutations/useCalendarEventUpdateMutation';

import { getContextParams } from '@/shared/helpers/get-context-params';
import { FileFolder } from '@/shared/enums/offering-file-type.enum';
import { type FilesProps } from '@/modules/offering/shared/interfaces/files-props.interface';
import { type RejectionProps } from '@/modules/offering/shared/interfaces/rejected-props.interface';
import { useImagesUploadMutation } from '@/modules/offering/shared/hooks/useImagesUploadMutation';

//* Types

type FormMode = 'create' | 'update';

interface CreateModeOptions {
  mode: 'create';
}

interface UpdateModeOptions {
  mode: 'update';
  id: string;
  data: CalendarEventResponse | undefined;
  dialogClose: () => void;
  scrollToTop: () => void;
}

const NOOP = (): void => {};

type UseCalendarEventFormOptions = CreateModeOptions | UpdateModeOptions;

export interface UseCalendarEventFormReturn {
  //* Mode
  mode: FormMode;

  //* Form
  form: UseFormReturn<CalendarEventFormData>;

  //* UI states
  isInputDisabled: boolean;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitButtonDisabled: boolean;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isDropZoneDisabled: boolean;
  isDeleteFileButtonDisabled: boolean;
  isMessageErrorDisabled: boolean;
  isPending: boolean;

  //* Files
  files: FilesProps[];
  setFiles: React.Dispatch<React.SetStateAction<FilesProps[]>>;
  rejected: RejectionProps[];
  setRejected: React.Dispatch<React.SetStateAction<RejectionProps[]>>;

  //* Dropzone
  getRootProps: ReturnType<typeof useDropzone>['getRootProps'];
  getInputProps: ReturnType<typeof useDropzone>['getInputProps'];
  isDragActive: boolean;
  removeFile: (name: any) => void;
  removeCloudFile: (name: any) => void;
  removeRejected: (name: any) => void;
  removeAll: () => void;

  //* Submit
  handleSubmit: (formData: z.infer<typeof calendarEventFormSchema>) => Promise<void>;
}

export const useCalendarEventForm = (
  options: UseCalendarEventFormOptions
): UseCalendarEventFormReturn => {
  const { mode } = options;

  const updateId = mode === 'update' ? (options as UpdateModeOptions).id : '';
  const updateData = mode === 'update' ? (options as UpdateModeOptions).data : undefined;

  //* States
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);
  const [isDropZoneDisabled, setIsDropZoneDisabled] = useState(false);
  const [isDeleteFileButtonDisabled] = useState(false);
  //* Pre-populate image list from updateData on first render (update mode)
  const [files, setFiles] = useState<FilesProps[]>(() =>
    mode === 'update' && updateData?.imageUrls?.length ? (updateData.imageUrls as any[]) : []
  );
  const [rejected, setRejected] = useState<RejectionProps[]>([]);

  //* Create mode default dates
  const todayStart = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();
  const todayEnd = (() => {
    const d = new Date();
    d.setHours(23, 59, 0, 0);
    return d;
  })();

  //* Form — update mode initializes directly from updateData so Selects and
  //* watched fields render with the correct value on the very first paint,
  //* avoiding the '' → real-value jump that confuses Radix UI Select.
  const form = useForm<z.infer<typeof calendarEventFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(calendarEventFormSchema),
    defaultValues:
      mode === 'create'
        ? {
            churchId: '',
            title: '',
            description: '',
            category: '',
            status: '',
            startDate: todayStart,
            endDate: todayEnd,
            locationName: '',
            locationReference: '',
            latitude: '',
            longitude: '',
            targetGroups: [],
            isPublic: false,
            fileNames: [],
          }
        : {
            churchId: updateData?.church?.id ?? '',
            title: updateData?.title ?? '',
            description: updateData?.description ?? '',
            category: updateData?.category ?? '',
            status: updateData?.status ?? '',
            startDate: updateData?.startDate ? new Date(updateData.startDate) : undefined,
            endDate: updateData?.endDate ? new Date(updateData.endDate) : undefined,
            locationName: updateData?.locationName ?? '',
            locationReference: updateData?.locationReference ?? '',
            latitude: updateData?.latitude ?? '',
            longitude: updateData?.longitude ?? '',
            targetGroups: updateData?.targetGroups ?? [],
            isPublic: updateData?.isPublic ?? false,
            fileNames: [],
            imageUrls: updateData?.imageUrls ?? [],
            recordStatus: updateData?.recordStatus ?? '',
          },
  });

  //* Dynamic URL for update mode
  useEffect(() => {
    if (mode !== 'update' || !updateId) return;

    const originalUrl = window.location.href;
    const url = new URL(window.location.href);
    url.pathname = `/calendar-events/update/${updateId}/edit`;
    window.history.replaceState({}, '', url);

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [mode, updateId]);

  //* Load data into form (update only) — handles subsequent updateData changes
  //* (e.g. background refetch or opening a different event)
  useEffect(() => {
    if (mode !== 'update' || !updateData) return;

    form.reset({
      churchId: updateData.church?.id ?? '',
      title: updateData.title ?? '',
      description: updateData.description ?? '',
      category: updateData.category ?? '',
      status: updateData.status ?? '',
      startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
      endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
      locationName: updateData.locationName ?? '',
      locationReference: updateData.locationReference ?? '',
      latitude: updateData.latitude ?? '',
      longitude: updateData.longitude ?? '',
      targetGroups: updateData.targetGroups ?? [],
      isPublic: updateData.isPublic ?? false,
      fileNames: [],
      imageUrls: updateData.imageUrls ?? [],
    });

    if (updateData.imageUrls?.length) {
      setFiles(updateData.imageUrls as any[]);
    }
  }, [updateData, mode]);

  //* Auto-disable dropzone when image limit is reached (max 3)
  useEffect(() => {
    setIsDropZoneDisabled(files.length >= 3);
  }, [files]);

  //* Dropzone
  const { onDrop, removeFile, removeCloudFile, removeRejected, removeAll } =
    useCalendarEventFileDropZone({
      eventForm: form as any,
      files: files.filter((f) => f instanceof File) as FilesProps[],
      setFiles,
      setRejected,
    });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxSize: 1024 * 1024 * 5,
    onDrop,
    disabled: isDropZoneDisabled,
  });

  //* Mutations
  const eventCreationMutation = useCalendarEventCreationMutation({
    eventCreationForm: form as any,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  const eventUpdateMutation = useCalendarEventUpdateMutation({
    dialogClose: mode === 'update' ? (options as UpdateModeOptions).dialogClose : NOOP,
    scrollToTop: mode === 'update' ? (options as UpdateModeOptions).scrollToTop : NOOP,
    eventUpdateForm: form as any,
    setIsInputDisabled,
    setIsSubmitButtonDisabled,
  });

  const uploadImagesMutation = useImagesUploadMutation();

  const isPending =
    (mode === 'create' ? eventCreationMutation.isPending : eventUpdateMutation.isPending) ||
    uploadImagesMutation.isPending;

  //* Derived: message/submit gate
  //* Update mode only checks validity — isDirty would block the button on first
  //* open since defaultValues are seeded from updateData (nothing changed yet).
  const isMessageErrorDisabled = !form.formState.isValid;

  //* Submit handler
  const handleSubmit = async (formData: z.infer<typeof calendarEventFormSchema>): Promise<void> => {
    if (mode === 'create') {
      setIsInputDisabled(true);
      setIsSubmitButtonDisabled(true);

      const { churchId: contextChurchId } = getContextParams();
      const filesOnly = files.filter((item) => item instanceof File);
      let imageUrls: string[] = [];

      try {
        if (filesOnly.length >= 1) {
          const uploadResult = await uploadImagesMutation.mutateAsync({
            files: filesOnly as any,
            fileFolder: FileFolder.CalendarEvent,
            offeringType: null,
            offeringSubType: null,
          });
          imageUrls = uploadResult.imageUrls ?? [];
        }

        await eventCreationMutation.mutateAsync({
          churchId: contextChurchId ?? '',
          title: formData.title,
          description: formData.description,
          category: formData.category,
          status: formData.status,
          startDate: formData.startDate,
          endDate: formData.endDate || undefined,
          locationName: formData.locationName || undefined,
          locationReference: formData.locationReference || undefined,
          latitude: formData.latitude || undefined,
          longitude: formData.longitude || undefined,
          targetGroups: formData.targetGroups,
          isPublic: formData.isPublic,
          imageUrls,
        } as any);
      } catch {
        if (uploadImagesMutation.isError) {
          toast.warning(
            '¡Oops! Fallo en la subida de imagen, por favor actualiza el navegador y vuelve a intentarlo.',
            { position: 'top-center', className: 'justify-center' }
          );
        }
        setTimeout(() => {
          setIsInputDisabled(false);
          setIsSubmitButtonDisabled(false);
        }, 1500);
      }
    } else {
      setIsInputDisabled(true);
      setIsSubmitButtonDisabled(true);

      const filesOnly = files.filter((item) => item instanceof File);
      const existingCloudUrls = files.filter((item) => typeof item === 'string') as any[];
      let imageUrls: string[] = [...existingCloudUrls];

      try {
        if (filesOnly.length >= 1) {
          const uploadResult = await uploadImagesMutation.mutateAsync({
            files: filesOnly as any,
            fileFolder: FileFolder.CalendarEvent,
            offeringType: null,
            offeringSubType: null,
          });
          imageUrls = [...existingCloudUrls, ...(uploadResult.imageUrls ?? [])];
        }

        await eventUpdateMutation.mutateAsync({
          id: updateId,
          formData: {
            churchId: formData.churchId ?? '',
            title: formData.title,
            description: formData.description,
            category: formData.category,
            status: formData.status,
            startDate: formData.startDate,
            endDate: formData.endDate ?? undefined,
            locationName: formData.locationName ?? undefined,
            locationReference: formData.locationReference ?? undefined,
            latitude: formData.latitude ?? undefined,
            longitude: formData.longitude ?? undefined,
            targetGroups: formData.targetGroups,
            isPublic: formData.isPublic,
            imageUrls,
            recordStatus: formData.recordStatus,
          },
        });
      } catch {
        if (uploadImagesMutation.isError) {
          toast.warning(
            '¡Oops! Fallo en la subida de imagen, por favor actualiza el navegador y vuelve a intentarlo.',
            { position: 'top-center', className: 'justify-center' }
          );
        }
        setTimeout(() => {
          setIsInputDisabled(false);
          setIsSubmitButtonDisabled(false);
        }, 1500);
      }
    }
  };

  return {
    mode,
    form,
    isInputDisabled,
    setIsInputDisabled,
    isSubmitButtonDisabled,
    setIsSubmitButtonDisabled,
    isDropZoneDisabled,
    isDeleteFileButtonDisabled,
    isMessageErrorDisabled,
    isPending,
    files,
    setFiles,
    rejected,
    setRejected,
    getRootProps,
    getInputProps,
    isDragActive,
    removeFile,
    removeCloudFile,
    removeRejected,
    removeAll,
    handleSubmit,
  };
};
