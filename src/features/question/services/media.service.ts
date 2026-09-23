import { ApiResponse } from '@/shared/api/types';
import { apiService } from '@/shared/api/api.service';
import { API_ENDPOINTS } from '@/shared/api/apiConfig';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { ContentType } from '@/shared/types/common';
import { MediaAsset } from '@/shared/types/common/cores.type';

export interface PresignMediaDto {
  contentType: ContentType;
  mimeType: string;
  fileName?: string;
}

export interface PresignedUpload {
  mediaId: string;
  uploadUrl: string;
  key: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  /** 0-100, entero. */
  percent: number;
}

export type UploadStage = 'preparing' | 'uploading' | 'confirming';

export interface UploadState extends UploadProgress {
  stage: UploadStage;
}

const toPercent = (loaded: number, total: number) =>
  total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0;

export const mediaService = {
  presign: async (data: PresignMediaDto): Promise<ApiResponse<PresignedUpload>> => {
    return apiService.post<PresignedUpload>(API_ENDPOINTS.MEDIA.PRESIGN, data);
  },

  confirm: async (mediaId: string): Promise<ApiResponse<MediaAsset>> => {
    return apiService.post<MediaAsset>(API_ENDPOINTS.MEDIA.CONFIRM(mediaId), {});
  },

  /**
   * Sube un archivo directo a S3 con la URL firmada — NO pasa por nuestra API
   * (ni base URL, ni auth header, ni el envelope {ok, data, message}), es un
   * PUT plano al bucket. Usa XMLHttpRequest en vez de fetch porque fetch no
   * expone el progreso de subida (xhr.upload.onprogress sí).
   */
  uploadToS3: (
    uploadUrl: string,
    file: File,
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);

      xhr.upload.onprogress = (event) => {
        if (!onProgress) return;
        const total = event.lengthComputable ? event.total : file.size;
        onProgress({ loaded: event.loaded, total, percent: toPercent(event.loaded, total) });
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress?.({ loaded: file.size, total: file.size, percent: 100 });
          resolve();
        } else {
          reject(new Error(`Upload to S3 failed: ${xhr.status} ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => reject(new Error('Error de red al subir el archivo'));
      xhr.onabort = () => reject(new Error('Subida cancelada'));

      xhr.send(file);
    });
  },

  /**
   * Orquesta presign -> subida directa a S3 -> confirm. Devuelve el MediaAsset
   * confirmado. `onProgress` informa la etapa y el % de bytes subidos.
   */
  uploadFile: async (
    file: File,
    contentType: ContentType,
    onProgress?: (state: UploadState) => void,
  ): Promise<MediaAsset> => {
    onProgress?.({ stage: 'preparing', loaded: 0, total: file.size, percent: 0 });

    const presignResponse = await mediaService.presign({
      contentType,
      mimeType: file.type,
      fileName: file.name,
    });

    if (!presignResponse.ok || !presignResponse.data) {
      throw new Error(getErrorMessage(presignResponse.message, 'No se pudo iniciar la subida'));
    }

    const { mediaId, uploadUrl } = presignResponse.data;

    await mediaService.uploadToS3(uploadUrl, file, (progress) =>
      onProgress?.({ stage: 'uploading', ...progress }),
    );

    onProgress?.({ stage: 'confirming', loaded: file.size, total: file.size, percent: 100 });

    const confirmResponse = await mediaService.confirm(mediaId);

    if (!confirmResponse.ok || !confirmResponse.data) {
      throw new Error(getErrorMessage(confirmResponse.message, 'No se pudo confirmar la subida'));
    }

    return confirmResponse.data;
  },
};
