/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useCallback, useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { type FilesProps } from '@/modules/offering/shared/interfaces/files-props.interface';
import { type RejectionProps } from '@/modules/offering/shared/interfaces/rejected-props.interface';

import { type OfferingExpenseFormData } from '@/modules/offering/expense/interfaces/offering-expense-form-data.interface';

interface Options {
  files: FilesProps[];
  setFiles: React.Dispatch<React.SetStateAction<FilesProps[]>>;
  setRejected: React.Dispatch<React.SetStateAction<RejectionProps[]>>;
  offeringExpenseForm: UseFormReturn<OfferingExpenseFormData, any, OfferingExpenseFormData>;
}

export const useOfferingExpenseFileDropZone = ({
  offeringExpenseForm,
  files,
  setRejected,
  setFiles,
}: Options) => {
  //* DropZone functions
  const onDrop = useCallback(
    (acceptedFiles: any[], rejectedFiles: any[]) => {
      if (acceptedFiles?.length) {
        const mappedFiles = acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        );

        // Check if a file with the same name already exists
        mappedFiles.forEach((newFile) => {
          const existingFileIndex = files.findIndex(
            (existingFile) => existingFile.name === newFile.name
          );

          if (existingFileIndex !== -1) {
            setFiles((previousFiles) => [...previousFiles]);
          } else {
            setFiles((previousFiles) => [...previousFiles, newFile]);
          }
        });

        const allFileNames = [
          ...files.filter((item) => item instanceof File).map((file) => file.name),
          ...mappedFiles.map((file) => file.name),
        ];

        offeringExpenseForm.setValue('fileNames', allFileNames); // Update the form field with file URLs
      }

      if (rejectedFiles?.length) {
        setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
      }
    },
    [offeringExpenseForm, files, setFiles]
  );

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => {
      files.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, [files]);

  useEffect(() => {
    const allFileNames = [...files.filter((item) => item instanceof File).map((file) => file.name)];
    offeringExpenseForm.setValue('fileNames', allFileNames as any);
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
