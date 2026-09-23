import { ContentType } from '@/shared/types/common';
import { QuestionFormValues, QuestionOptionFormValue } from '../components/QuestionForm';

/**
 * En BD, `text` y `media_id` de una QuestionOption son excluyentes (CHECK
 * constraint), y el `media_id` de una Question solo existe si no es TEXT. El
 * formulario conserva el texto/media anterior al cambiar de tipo, así que el
 * payload se arma según el contentType y manda `null` explícito para limpiar
 * lo que ya no aplica (con `undefined` el backend no toca la columna).
 */

export const isOptionFilled = (option: QuestionOptionFormValue): boolean =>
  option.contentType === ContentType.TEXT ? option.text.trim() !== '' : !!option.mediaId;

export const toOptionContentPayload = (option: QuestionOptionFormValue) =>
  option.contentType === ContentType.TEXT
    ? { contentType: option.contentType, text: option.text.trim(), mediaId: null }
    : { contentType: option.contentType, text: null, mediaId: option.mediaId ?? null };

export const toQuestionMediaId = (values: QuestionFormValues): string | null =>
  values.contentType === ContentType.TEXT ? null : (values.mediaId ?? null);
