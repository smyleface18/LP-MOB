import { ContentType } from './enum.type';

export interface CoreEntity {
  id: string;
  active: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface S3Object {
  key: string;

  type: string;

  displayName?: string;

  url?: string;

  bucketName?: string;
}

export class ContentObject {
  type!: ContentType;
  value!: string; // Para TEXTO, será el texto. Para otros, será la URL o la clave del S3Object.
  meta?: S3Object; // Opcional, para almacenar metadatos del archivo (key, bucket, etc.)
}
