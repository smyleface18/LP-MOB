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
