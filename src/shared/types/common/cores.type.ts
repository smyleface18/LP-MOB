import { ContentType, MediaStatus } from './enum.type';

export interface CoreEntity {
  id: string;
  active: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Refleja la entidad `MediaAsset` del backend
 * (apps/LP-API/src/db/entities/media-asset.entity.ts).
 */
export interface MediaAsset extends CoreEntity {
  key: string;
  bucketName: string;
  contentType: ContentType;
  mimeType?: string;
  displayName?: string;
  size?: number;
  url?: string;
  status: MediaStatus;
  uploadedByUserId?: string;
}
