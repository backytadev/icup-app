/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { isAxiosError } from 'axios';
import { icupApi } from '@/core/api/icupApi';

import { type FileFolder } from '@/shared/enums/offering-file-type.enum';
import { type UploadImageResponse } from '@/modules/offering/shared/interfaces/upload-images-response';

//? UPLOAD IMAGES
export interface UploadImagesOptions {
  files: File[];
  fileFolder: FileFolder;
  offeringType?: string | null;
  offeringSubType?: string | undefined | null;
}

export const uploadImages = async ({
  files,
  fileFolder,
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
        fileFolder,
        offeringType: !offeringType ? null : offeringType,
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
  fileFolder: FileFolder;
}

export const deleteImage = async ({
  publicId,
  path,
  secureUrl,
  fileFolder,
}: DeleteImageOptions): Promise<void> => {
  try {
    const { data } = await icupApi.delete(`/files/remove/${publicId}`, {
      params: {
        path,
        secureUrl,
        fileFolder,
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
