import { useCallback, useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { type FilesProps } from '@/modules/offering/shared/interfaces/files-props.interface';
import { type RejectionProps } from '@/modules/offering/shared/interfaces/rejected-props.interface';

import { type CalendarEventFormData } from '@/modules/calendar-event/types/calendar-event-form-data.interface';

interface Options {
  files: FilesProps[];
  setFiles: React.Dispatch<React.SetStateAction<FilesProps[]>>;
  setRejected: React.Dispatch<React.SetStateAction<RejectionProps[]>>;
  eventForm: UseFormReturn<CalendarEventFormData, any, CalendarEventFormData | undefined>;
}

export const useCalendarEventFileDropZone = ({
  eventForm,
  files,
  setFiles,
  setRejected,
}: Options) => {
  const onDrop = useCallback(
    (acceptedFiles: any[], rejectedFiles: any[]) => {
      if (acceptedFiles?.length) {
        const mappedFiles = acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        );

        mappedFiles.forEach((newFile) => {
          const existingFileIndex = files.findIndex(
            (existingFile) => existingFile.name === newFile.name
          );

          if (existingFileIndex === -1) {
            setFiles((previousFiles) => [...previousFiles, newFile]);
          }
        });

        const allFileNames = [
          ...files.filter((item) => item instanceof File).map((file) => file.name),
          ...mappedFiles.map((file) => file.name),
        ];

        eventForm.setValue('fileNames', allFileNames);
      }

      if (rejectedFiles?.length) {
        setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
      }
    },
    [eventForm, files, setFiles, setRejected]
  );

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, [files]);

  useEffect(() => {
    const allFileNames = [...files.filter((item) => item instanceof File).map((file) => file.name)];
    eventForm.setValue('fileNames', allFileNames as any);
  }, [files]);

  const removeFile = (name: any): void => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  const removeCloudFile = (name: any): void => {
    setFiles((files) => files.filter((file) => file !== name));
  };

  const removeAll = (): void => {
    setFiles([]);
    setRejected([]);
  };

  const removeRejected = (name: any): void => {
    setRejected((files) => files.filter(({ file }) => file.name !== name));
  };

  return { onDrop, removeAll, removeFile, removeCloudFile, removeRejected };
};
