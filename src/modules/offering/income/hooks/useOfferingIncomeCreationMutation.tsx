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
  updateOfferingIncome,
} from '@/modules/offering/income/services/offering-income.service';

import {
  extractPath,
  extractPublicId,
} from '@/modules/offering/shared/helpers/extract-data-secure-url.helper';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';

import { MemberType } from '@/modules/offering/income/enums/member-type.enum';
import { OfferingFileType } from '@/modules/offering/shared/enums/offering-file-type.enum';
import { type FilesProps } from '@/modules/offering/shared/interfaces/files-props.interface';
import { convertPdfBlobToImage } from '@/modules/offering/income/helpers/convert-pdf-to-image';
import { deleteImage, uploadImages } from '@/modules/offering/shared/services/images-files.service';

interface Options {
  imageUrls: string[];
  generateReceipt?: string;
  setFiles: React.Dispatch<React.SetStateAction<FilesProps[]>>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsInputMemberDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteFileButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  offeringIncomeCreationForm: UseFormReturn<OfferingIncomeFormData, any, OfferingIncomeFormData>;
}

export const useOfferingIncomeCreationMutation = ({
  setFiles,
  setIsInputDisabled,
  setIsInputMemberDisabled,
  offeringIncomeCreationForm,
  setIsSubmitButtonDisabled,
  setIsDeleteFileButtonDisabled,
  imageUrls,
  generateReceipt,
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

  //* Hooks
  const mutation = useMutation({
    mutationFn: createOfferingIncome,
    onError: (error: ErrorResponse) => {
      if (error.message !== 'Unauthorized') {
        toast.error(error.message, {
          position: 'top-center',
          className: 'justify-center',
        });

        //! Execute destroy if form fails (upload and destroy images if throw error)
        imageUrls?.forEach(async (imageUrl) => {
          await deleteImage({
            publicId: extractPublicId(imageUrl),
            path: extractPath(imageUrl),
            secureUrl: imageUrl,
            fileType: OfferingFileType.Income,
          });
        });

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
      if (generateReceipt) {
        const generateReceiptPromise = await generateReceiptByOfferingIncomeId({
          id: data.id,
          generateReceipt: 'no',
        });

        const receiptPdfUrl = URL.createObjectURL(generateReceiptPromise.data);

        const receiptImage = await convertPdfBlobToImage(receiptPdfUrl);

        const { imageUrls: receiptImageUrls } = await uploadImages({
          files: [receiptImage] as any,
          fileType: OfferingFileType.Income,
          offeringType: data.type,
          offeringSubType: data.subType ?? null,
        });

        toast.success('Registro creado exitosamente.', {
          position: 'top-center',
          className: 'justify-center',
        });

        await Promise.all([
          updateOfferingIncome({
            id: data.id,
            formData: {
              type: data.type,
              subType: data.subType,
              category: data.category,
              shift: data.shift,
              amount: data.amount,
              currency: data.currency,
              date: data.date,
              comments: data.comments,
              memberType: data.memberType,
              zoneId: data.zone?.id ?? undefined,
              familyGroupId: data.familyGroup?.id ?? undefined,
              memberId:
                data.memberType === MemberType.Pastor
                  ? data?.pastor?.id
                  : data.memberType === MemberType.Copastor
                    ? data.copastor?.id
                    : data.memberType === MemberType.Supervisor
                      ? data.supervisor?.id
                      : data.memberType === MemberType.Preacher
                        ? data.preacher?.id
                        : data.disciple?.id,
              churchId: data?.church?.id!,
              externalDonorId: data?.externalDonor?.id,
              recordStatus: data.recordStatus,
              imageUrls: receiptImageUrls,
            },
          }),
        ]);

        await generateReceiptByOfferingIncomeId({
          id: data.id,
          generateReceipt,
        });

        queryClient.invalidateQueries({ queryKey: ['general-offering-income'] });
      }

      navigate('/offerings/income');

      setFiles([]);
      offeringIncomeCreationForm.reset();
    },
  });

  return mutation;
};
