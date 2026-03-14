import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { type OfferingExpenseResponse } from '@/modules/offering/expense/interfaces/offering-expense-response.interface';
import {
  updateOfferingExpense,
  type UpdateOfferingExpenseOptions,
} from '@/modules/offering/expense/services/offering-expense.service';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';

import {
  extractPath,
  extractPublicId,
} from '@/modules/offering/shared/helpers/extract-data-secure-url.helper';
import { deleteImage } from '@/modules/offering/shared/services/images-files.service';
import { FileFolder } from '@/shared/enums/offering-file-type.enum';

interface Options {
  dialogClose: () => void;
  scrollToTop: () => void;
  imageUrls: string[];
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteFileButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useOfferingExpenseUpdateMutation = ({
  dialogClose,
  scrollToTop,
  imageUrls,
  setIsInputDisabled,
  setIsSubmitButtonDisabled,
  setIsDeleteFileButtonDisabled,
}: Options): UseMutationResult<
  OfferingExpenseResponse,
  ErrorResponse,
  UpdateOfferingExpenseOptions,
  unknown
> => {
  //* Library Hooks
  const navigate = useNavigate();

  //* QueryClient
  const queryClient = useQueryClient();

  //* Mutation
  const mutation = useMutation({
    mutationFn: updateOfferingExpense,
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
            fileFolder: FileFolder.Expense,
          });
        });

        setTimeout(() => {
          setIsInputDisabled(false);
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
        }, 3500);
      }
    },
    onSuccess: () => {
      toast.success('Cambios guardados correctamente.', {
        position: 'top-center',
        className: 'justify-center',
      });

      setTimeout(() => {
        scrollToTop();
      }, 150);

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['offering-expenses-by-term'] });
      }, 700);

      setTimeout(() => {
        dialogClose();
        setIsInputDisabled(false);
      }, 1500);
    },
  });

  return mutation;
};
