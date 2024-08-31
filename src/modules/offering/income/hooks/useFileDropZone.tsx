/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useCallback, useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { type OfferingIncomeFormData } from '@/modules/offering/income/interfaces';
import { type RejectedProps, type FilesProps } from '@/modules/offering/shared/interfaces';

interface Options {
  offeringIncomeForm: UseFormReturn<OfferingIncomeFormData, any, OfferingIncomeFormData>;
  files: FilesProps[];
  setFiles: React.Dispatch<React.SetStateAction<FilesProps[]>>;
  setRejected: React.Dispatch<React.SetStateAction<RejectedProps[]>>;
}

export const useFileDropZone = ({ offeringIncomeForm, files, setRejected, setFiles }: Options) => {
  //* DropZone functions
  const onDrop = useCallback(
    (acceptedFiles: any[], rejectedFiles: any[]) => {
      if (acceptedFiles?.length) {
        const mappedFiles = acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        );

        console.log(mappedFiles);
        // Verifica si ya existe un archivo con el mismo nombre
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

        offeringIncomeForm.setValue('fileNames', allFileNames); // Actualiza el campo de formulario con las URLs de los archivos
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
      files.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, [files]);

  useEffect(() => {
    const allFileNames = [...files.filter((item) => item instanceof File).map((file) => file.name)];
    offeringIncomeForm.setValue('fileNames', allFileNames as any);
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
