/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { isAxiosError } from 'axios';
import { icupApi } from '@/core/api/icupApi';

import { type OfferingFileType } from '@/modules/offering/shared/enums/offering-file-type.enum';
import { type UploadImageResponse } from '@/modules/offering/shared/interfaces/upload-images-response';

//? UPLOAD IMAGES
export interface UploadImagesOptions {
  files: File[];
  fileType: OfferingFileType;
  offeringType: string;
  offeringSubType?: string | undefined | null;
}

export const uploadImages = async ({
  files,
  fileType,
  offeringType,
  offeringSubType,
}: UploadImagesOptions): Promise<UploadImageResponse> => {
  try {
    const newFormData = new FormData();

    files.forEach((file) => {
      newFormData.append('files', file);
    });

    const { data } = await icupApi.post<UploadImageResponse>('/files/upload', newFormData, {
      params: {
        fileType,
        offeringType,
        offeringSubType: !offeringSubType ? null : offeringSubType,
      },
    });

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

//! DELETE IMAGE
export interface DeleteImageOptions {
  publicId: string;
  path: string;
  secureUrl: string;
  fileType: OfferingFileType;
}

export const deleteImage = async ({
  publicId,
  path,
  secureUrl,
  fileType,
}: DeleteImageOptions): Promise<void> => {
  try {
    const { data } = await icupApi.delete(`/files/${publicId}`, {
      params: {
        path,
        secureUrl,
        fileType,
      },
    });

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};
