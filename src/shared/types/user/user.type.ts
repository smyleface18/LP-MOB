import { Level } from '../common';
import { CoreEntity, S3Object } from '../common/cores.type';

export enum UserRole {
  PLAYER = 'PLAYER',
  ADMIN = 'ADMIN',
}

export interface User extends CoreEntity {
  id: string;
  username: string;
  email: string;
  score: number;
  userRole: UserRole;
  level: Level;
  avatar?: S3Object;
}
