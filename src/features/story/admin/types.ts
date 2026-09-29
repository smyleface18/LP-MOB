import { Level } from '@/shared/types/common';
import { ReviewManifest } from '../types';

/** Visibilidad de una historieta (moderación). */
export enum StoryVisibility {
  PUBLISHED = 'PUBLISHED',
  REMOVED = 'REMOVED',
}

/** Acción del historial de moderación. */
export enum StoryModerationAction {
  REMOVED = 'REMOVED',
  RESTORED = 'RESTORED',
}

/** Por qué un admin quitó una historieta (mismos valores que la API). */
export enum StoryRemovalReason {
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  OFFENSIVE_LANGUAGE = 'OFFENSIVE_LANGUAGE',
  PERSONAL_DATA = 'PERSONAL_DATA',
  SPAM = 'SPAM',
  OTHER = 'OTHER',
}

export const REMOVAL_REASON_LABELS: Record<StoryRemovalReason, string> = {
  [StoryRemovalReason.INAPPROPRIATE_CONTENT]: 'Contenido no apto',
  [StoryRemovalReason.OFFENSIVE_LANGUAGE]: 'Lenguaje ofensivo',
  [StoryRemovalReason.PERSONAL_DATA]: 'Datos personales',
  [StoryRemovalReason.SPAM]: 'Spam o abuso del sistema',
  [StoryRemovalReason.OTHER]: 'Otro motivo',
};

/** Largo máximo de la nota (igual que la API). */
export const REMOVAL_NOTE_MAX_CHARS = 500;

export interface AdminStoryParticipant {
  userId: string;
  /** Nombre cuando jugó. */
  username: string;
  /** Nombre y email actuales; null si la cuenta ya no existe. */
  currentUsername: string | null;
  email: string | null;
  avatarUrl: string | null;
  position: number;
  panelsWritten: number;
  totalScore: number;
  left: boolean;
}

export interface AdminStoryRemoval {
  /** ISO 8601. */
  removedAt: string;
  removedBy: { userId: string; username: string } | null;
  reason: StoryRemovalReason;
  note: string | null;
}

/** `GET /admin/stories`. */
export interface AdminStoryItem {
  storyId: string;
  gameId: string;
  title: string | null;
  /** ISO 8601. */
  finishedAt: string;
  level: Level;
  panelsCount: number;
  excerpt: string;
  coverImageUrl: string | null;
  visibility: StoryVisibility;
  participants: AdminStoryParticipant[];
  removal: AdminStoryRemoval | null;
}

/** Una acción del historial de moderación. */
export interface AdminStoryModerationEntry {
  action: StoryModerationAction;
  /** ISO 8601. */
  at: string;
  admin: { userId: string; username: string } | null;
  /** Solo al quitar. */
  reason: StoryRemovalReason | null;
  note: string | null;
}

/** `GET /admin/stories/:storyId`. */
export interface AdminStoryDetail extends AdminStoryItem {
  manifest: ReviewManifest;
  /** De la acción más reciente a la más vieja. */
  moderationHistory: AdminStoryModerationEntry[];
}

export interface AdminStoryPage {
  items: AdminStoryItem[];
  page: number;
  limit: number;
  total: number;
}

export interface AdminStoriesQuery {
  page: number;
  limit: number;
  visibility?: StoryVisibility;
  search?: string;
}

/** Respuesta de `POST /admin/stories/:id/regenerate-images`. */
export interface RegenerateImagesResult {
  /** Cuántas imágenes se pidieron (0 si no faltaba ninguna). */
  queued: number;
  /** Viñetas (desde 0) que se van a volver a dibujar. */
  orders: number[];
}

/** Viñetas con texto que no tienen imagen (el proveedor falló o venció el plazo). */
export const missingImageOrders = (story: AdminStoryDetail): number[] =>
  story.manifest.panels
    .filter((panel) => panel.mediaStatus !== 'none' && !panel.imageUrl)
    .map((panel) => panel.order);

export interface RemoveStoryInput {
  reason: StoryRemovalReason;
  note?: string;
}
