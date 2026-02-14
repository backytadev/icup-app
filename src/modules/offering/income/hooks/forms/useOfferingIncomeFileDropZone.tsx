import { useCallback, useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { type OfferingIncomeFormData } from '@/modules/offering/income/interfaces/offering-income-form-data.interface';

import { type FilesProps } from '@/modules/offering/shared/interfaces/files-props.interface';
import { type RejectionProps } from '@/modules/offering/shared/interfaces/rejected-props.interface';

interface Options {
  files: FilesProps[];
  setFiles: React.Dispatch<React.SetStateAction<FilesProps[]>>;
  setRejected: React.Dispatch<React.SetStateAction<RejectionProps[]>>;
  offeringIncomeForm: UseFormReturn<
    OfferingIncomeFormData,
    any,
    OfferingIncomeFormData | undefined
  >;
}

export const useOfferingIncomeFileDropZone = ({
  offeringIncomeForm,
  files,
  setRejected,
  setFiles,
}: Options) => {
  //* DropZone functions
  const onDrop = useCallback(
    (acceptedFiles: any[], rejectedFiles: any[]) => {
      if (acceptedFiles?.length) {
        const mappedFiles = acceptedFiles?.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        );

        // Check if a file with the same name already exists
        mappedFiles?.forEach((newFile) => {
          const existingFileIndex = files.findIndex(
            (existingFile) => existingFile.name === newFile.name
          );

          if (existingFileIndex !== -1) {
            setFiles((previousFiles) => [...previousFiles]);
          } else {
            setFiles((previousFiles) => [...previousFiles, newFile]);
          }
        });

        // fileNames field removed from form schema - files managed via state only
      }

      if (rejectedFiles?.length) {
        setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
      }
    },
    [offeringIncomeForm, files, setFiles]
  );

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => {
      files?.forEach((file) => {
        URL.revokeObjectURL(file?.preview);
      });
    };
  }, [files]);

  useEffect(() => {
    // fileNames field removed from form schema - files managed via state only
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
