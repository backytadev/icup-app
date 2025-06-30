/* eslint-disable @typescript-eslint/no-misused-promises */

import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { type UseFormReturn } from 'react-hook-form';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { createOfferingExpense } from '@/modules/offering/expense/services/offering-expense.service';

import { type OfferingExpenseResponse } from '@/modules/offering/expense/interfaces/offering-expense-response.interface';
import { type OfferingExpenseFormData } from '@/modules/offering/expense/interfaces/offering-expense-form-data.interface';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';

import {
  extractPath,
  extractPublicId,
} from '@/modules/offering/shared/helpers/extract-data-secure-url.helper';
import { deleteImage } from '@/modules/offering/shared/services/images-files.service';
import { OfferingFileType } from '@/modules/offering/shared/enums/offering-file-type.enum';
import { type FilesProps } from '@/modules/offering/shared/interfaces/files-props.interface';

interface Options {
  imageUrls: string[];
  setFiles: React.Dispatch<React.SetStateAction<FilesProps[]>>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  offeringExpenseCreationForm: UseFormReturn<
    OfferingExpenseFormData,
    any,
    OfferingExpenseFormData | undefined
  >;
}

export const useOfferingExpenseCreationMutation = ({
  setFiles,
  imageUrls,
  setIsInputDisabled,
  offeringExpenseCreationForm,
  setIsSubmitButtonDisabled,
}: Options): UseMutationResult<
  OfferingExpenseResponse,
  ErrorResponse,
  OfferingExpenseFormData,
  unknown
> => {
  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* Mutation
  const mutation = useMutation({
    mutationFn: createOfferingExpense,
    onError: (error: ErrorResponse) => {
      if (error.message !== 'Unauthorized') {
        toast.error(error.message, {
          position: 'top-center',
          className: 'justify-center',
        });

        //! Execute destroy if the form fails
        imageUrls?.forEach(async (imageUrl) => {
          await deleteImage({
            publicId: extractPublicId(imageUrl),
            path: extractPath(imageUrl),
            secureUrl: imageUrl,
            fileType: OfferingFileType.Expense,
          });
        });

        setTimeout(() => {
          setIsInputDisabled(false);
          setIsSubmitButtonDisabled(false);
        }, 1500);
      }

      if (error.message === 'Unauthorized') {
        toast.error('Operación rechazada, el token expiro ingresa nuevamente.', {
          position: 'top-center',
          className: 'justify-center',
        });

        setTimeout(() => {
          navigate('/');
        }, 3500);
      }
    },
    onSuccess: () => {
      toast.success('Registro creado exitosamente.', {
        position: 'top-center',
        className: 'justify-center',
      });

      setTimeout(() => {
        navigate('/offerings/expenses');
      }, 1600);

      setTimeout(() => {
        setFiles([]);
        offeringExpenseCreationForm.reset();
      }, 1700);
    },
  });

  return mutation;
};
