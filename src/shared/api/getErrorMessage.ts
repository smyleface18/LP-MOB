/** Normaliza el `message` de un ApiResponse (string | string[] | undefined) a un solo string. */
export const getErrorMessage = (
  message: string | string[] | undefined,
  fallback: string,
): string => (Array.isArray(message) ? message.join('\n') : (message ?? fallback));
