import { type UseMutationResult } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useUpdateMutation } from '@/shared/hooks';

import { type OfferingIncomeResponse } from '@/modules/offering/income/interfaces/offering-income-response.interface';
import {
  updateOfferingIncome,
  type UpdateOfferingIncomeOptions,
} from '@/modules/offering/income/services/offering-income.service';

import {
  extractPath,
  extractPublicId,
} from '@/modules/offering/shared/helpers/extract-data-secure-url.helper';
import { OfferingFileType } from '@/modules/offering/shared/enums/offering-file-type.enum';
import { deleteImage } from '@/modules/offering/shared/services/images-files.service';

interface Options {
  dialogClose: () => void;
  scrollToTop: () => void;
  imageUrls: string[];
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteFileButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdateSuccess?: (offeringId: string) => void;
  offeringId?: string;
}

export const useOfferingIncomeUpdateMutation = ({
  dialogClose,
  scrollToTop,
  imageUrls,
  setIsInputDisabled,
  setIsSubmitButtonDisabled,
  setIsDeleteFileButtonDisabled,
  onUpdateSuccess,
  offeringId,
}: Options): UseMutationResult<
  OfferingIncomeResponse,
  ErrorResponse,
  UpdateOfferingIncomeOptions,
  unknown
> => {
  return useUpdateMutation({
    mutationFn: updateOfferingIncome,
    invalidateQueries: [['offering-income-by-term']],
    onSuccess: () => {
      setTimeout(() => {
        scrollToTop();
      }, 150);

      setTimeout(() => {
        dialogClose();
        setIsInputDisabled(false);

        // Call onUpdateSuccess callback after closing dialog
        if (onUpdateSuccess && offeringId) {
          onUpdateSuccess(offeringId);
        }
      }, 1500);
    },
    onError: async () => {
      //* Execute destroy if the form fails
      if (imageUrls?.length > 0) {
        await Promise.all(
          imageUrls.map(async (imageUrl) => {
            await deleteImage({
              publicId: extractPublicId(imageUrl),
              path: extractPath(imageUrl),
              secureUrl: imageUrl,
              fileType: OfferingFileType.Income,
            });
          })
        );
      }

      setTimeout(() => {
        setIsInputDisabled(false);
        setIsSubmitButtonDisabled(false);
        setIsDeleteFileButtonDisabled(false);
      }, 1500);
    },
  });
};
