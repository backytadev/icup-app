/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { type OfferingExpenseResponse } from '@/modules/offering/expense/interfaces/offering-expense-response.interface';
import { type OfferingExpenseFormData } from '@/modules/offering/expense/interfaces/offering-expense-form-data.interface';

import { type FilesProps } from '@/modules/offering/shared/interfaces/files-props.interface';

interface Options {
  id: string;
  data: OfferingExpenseResponse | undefined;
  setFiles: React.Dispatch<React.SetStateAction<FilesProps[]>>;
  setIsLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
  offeringExpenseUpdateForm: UseFormReturn<OfferingExpenseFormData, any, OfferingExpenseFormData>;
}

export const useOfferingExpenseSetData = ({
  id,
  data,
  setFiles,
  setIsLoadingData,
  offeringExpenseUpdateForm,
}: Options): void => {
  //* Set data
  useEffect(() => {
    offeringExpenseUpdateForm.setValue('type', data?.type ?? '');
    offeringExpenseUpdateForm.setValue('subType', data?.subType ?? '');
    offeringExpenseUpdateForm.setValue('amount', data?.amount ?? '');
    offeringExpenseUpdateForm.setValue('currency', data?.currency ?? '');
    offeringExpenseUpdateForm.setValue('date', new Date(String(data?.date).replace(/-/g, '/')));
    offeringExpenseUpdateForm.setValue('comments', data?.comments ?? '');
    offeringExpenseUpdateForm.setValue('churchId', data?.church?.id!);
    offeringExpenseUpdateForm.setValue('recordStatus', data?.recordStatus);
    setFiles(data?.imageUrls as any);

    const timeoutId = setTimeout(() => {
      setIsLoadingData(false);
    }, 1200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  //* Generate dynamic url
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/offerings/expenses/update/${id}/edit`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);
};
