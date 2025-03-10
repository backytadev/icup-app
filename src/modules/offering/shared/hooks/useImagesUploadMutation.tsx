/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { type UploadImageResponse } from '@/modules/offering/shared/interfaces/upload-images-response';
import {
  uploadImages,
  type UploadImagesOptions,
} from '@/modules/offering/shared/services/images-files.service';

export const useImagesUploadMutation = (): UseMutationResult<
  UploadImageResponse,
  Error,
  UploadImagesOptions,
  unknown
> => {
  //* Mutation
  const mutation = useMutation({
    mutationFn: uploadImages,
  });

  return mutation;
};
