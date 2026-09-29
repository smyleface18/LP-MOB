const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** El texto ya nombra al personaje (palabra completa, sin distinguir mayúsculas). */
export const mentionsName = (text: string, name: string): boolean =>
  new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(name.trim())}($|[^\\p{L}\\p{N}])`, 'iu').test(text);

/**
 * Inserta el nombre de un personaje en el texto de la viñeta, en la posición
 * del cursor (o al final), con los espacios que hagan falta. Si el texto ya lo
 * nombra o no entra en `maxChars`, lo devuelve igual.
 */
export function insertName(
  text: string,
  name: string,
  cursor: number | null,
  maxChars: number,
): string {
  const trimmedName = name.trim();
  if (!trimmedName || mentionsName(text, trimmedName)) return text;

  const at = cursor === null ? text.length : Math.min(Math.max(cursor, 0), text.length);
  const before = text.slice(0, at);
  const after = text.slice(at);
  const spaceBefore = before && !/\s$/.test(before) ? ' ' : '';
  const spaceAfter = after && !/^[\s.,!?;:]/.test(after) ? ' ' : '';
  const result = `${before}${spaceBefore}${trimmedName}${spaceAfter}${after}`;
  return result.length > maxChars ? text : result;
}
