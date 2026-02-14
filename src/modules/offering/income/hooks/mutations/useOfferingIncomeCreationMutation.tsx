/* eslint-disable @typescript-eslint/no-misused-promises */

import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { type UseFormReturn } from 'react-hook-form';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { type OfferingIncomeResponse } from '@/modules/offering/income/interfaces/offering-income-response.interface';
import { type OfferingIncomeFormData } from '@/modules/offering/income/interfaces/offering-income-form-data.interface';

import {
  createOfferingIncome,
  generateReceiptByOfferingIncomeId,
} from '@/modules/offering/income/services/offering-income.service';

import {
  extractPath,
  extractPublicId,
} from '@/modules/offering/shared/helpers/extract-data-secure-url.helper';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';

import { OfferingFileType } from '@/modules/offering/shared/enums/offering-file-type.enum';
import { type FilesProps } from '@/modules/offering/shared/interfaces/files-props.interface';
import { deleteImage } from '@/modules/offering/shared/services/images-files.service';

interface Options {
  imageUrls: string[];
  shouldOpenReceiptInBrowser?: string;
  setFiles: React.Dispatch<React.SetStateAction<FilesProps[]>>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsInputMemberDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteFileButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  offeringIncomeCreationForm: UseFormReturn<
    OfferingIncomeFormData,
    any,
    OfferingIncomeFormData | undefined
  >;
  onReceiptGenerated?: (blob: Blob, offeringId: string) => void;
}

export const useOfferingIncomeCreationMutation = ({
  setIsInputDisabled,
  setIsInputMemberDisabled,
  setIsSubmitButtonDisabled,
  setIsDeleteFileButtonDisabled,
  imageUrls,
  shouldOpenReceiptInBrowser,
  onReceiptGenerated,
}: Options): UseMutationResult<
  OfferingIncomeResponse,
  ErrorResponse,
  OfferingIncomeFormData,
  unknown
> => {
  //* Hooks (external libraries)
  const navigate = useNavigate();

  //* QueryClient
  const queryClient = useQueryClient();

  //* Mutation
  const mutation = useMutation({
    mutationFn: createOfferingIncome,
    onError: (error: ErrorResponse) => {
      if (error.message !== 'Unauthorized') {
        toast.error(error.message, {
          position: 'top-center',
          className: 'justify-center',
        });

        //* Execute destroy if form fails (upload and destroy images if throw error)
        if (imageUrls?.length > 0) {
          imageUrls.forEach(async (imageUrl) => {
            await deleteImage({
              publicId: extractPublicId(imageUrl),
              path: extractPath(imageUrl),
              secureUrl: imageUrl,
              fileType: OfferingFileType.Income,
            });
          });
        }

        setTimeout(() => {
          setIsInputDisabled(false);
          setIsInputMemberDisabled(false);
          setIsSubmitButtonDisabled(false);
          setIsDeleteFileButtonDisabled(false);
        }, 1500);
      }

      if (error.message === 'Unauthorized') {
        toast.error('Operación rechazada, el token expiro ingresa nuevamente.', {
          position: 'top-center',
          className: 'justify-center',
        });

        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    },
    onSuccess: async (data) => {
      if (shouldOpenReceiptInBrowser) {
        toast.success('Registro creado exitosamente.', {
          position: 'top-center',
          className: 'justify-center',
        });

        const response = await generateReceiptByOfferingIncomeId({
          id: data.id,
          shouldOpenReceiptInBrowser: 'no', // Don't open in new tab
          generationType: 'with-qr',
        });

        // Call the callback with the PDF blob
        if (onReceiptGenerated && response?.data) {
          onReceiptGenerated(response.data, data.id);
        }

        queryClient.invalidateQueries({ queryKey: ['general-offering-income'] });

        // Don't navigate immediately if showing modal
        if (!onReceiptGenerated) {
          navigate('/offerings/income');
        }
      }
    },
  });

  return mutation;
};
